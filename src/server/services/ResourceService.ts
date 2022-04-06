import { Injectable } from '@nestjs/common';
import DBUtil from '../utils/db.utils';
import { tbAxios } from '../utils/tb.utils';
import { ResourceEntity } from '../entities/ResourceEntity';
import { WorkspaceService } from './WorkspaceService';
import { BaseException } from '../exceptions/BaseException';
import { BatchService } from './BatchService';
import { InjectQueue, Processor } from '@nestjs/bull';
import { Queue } from 'bull';

const pLimit = require('p-limit');

@Processor('dc_doc')
@Injectable()
export class ResourceService {
  constructor(
    @InjectQueue('dc_doc') private readonly docQueue: Queue,
    private workspaceService: WorkspaceService,
    private batchService: BatchService,
  ) {}

  async findAll(workspaceId: string) {
    const conn = await DBUtil.getConnection();
    return conn
      .getRepository(ResourceEntity)
      .createQueryBuilder('resource')
      .where('resource.workspaceId = :workspaceId', {
        workspaceId,
      })
      .getMany();
  }

  /**
   * 获取空间下载任务数量
   * @param workspaceId
   */
  async getResourceCountOfWorkspace(workspaceId) {
    const conn = await DBUtil.getConnection();
    return conn
      .getRepository(ResourceEntity)
      .createQueryBuilder('resource')
      .where(
        'resource.workspaceId = :workspaceId and resource.type != "folder"',
        {
          workspaceId,
        },
      )
      .getCount();
  }

  async findResourceByThirdId(resourceId: string) {
    const conn = await DBUtil.getConnection();
    return conn
      .getRepository(ResourceEntity)
      .findOne({ where: { resourceId } });
  }

  async saveOrUpdate(entity) {
    const conn = await DBUtil.getConnection();
    return conn.getRepository(ResourceEntity).save(entity);
  }

  /**
   * 将目录结构先保存到数据库中
   * @param workspaceId
   */
  async saveNodeCategoryTreeData(workspaceId: string) {
    try {
      const sleep = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };

      const workspace = await this.workspaceService.findWorkspaceByThirdId(
        workspaceId,
      );

      const execute = async (item) => {
        // 保存到库中
        await this.saveOrUpdate({
          resourceId: item._id,
          parentId: item._parentId,
          workspaceId: workspaceId,
          name: item.title.replace('/', '-'),
          type: item.type,
        });
        console.log(`handle ${item.title}, ${item.type} success`);

        await sleep(10000);
        // 递归查询
        await getResourceList(item._id);
      };

      let count = 0;
      // 请求节点的子列表
      const getResourceList = async (parentId?: number) => {
        let url = `https://thoughts.teambition.com/api/workspaces/${workspaceId}/nodes?pageSize=1000&_=${new Date().getTime()}`;
        if (parentId) {
          url += `&_parentId=${parentId}`;
        }
        let data;
        try {
          const res = await tbAxios.get(url);
          data = res.data;
        } catch (error) {
          data = { result: [] };
          // 有时候会报404，资源找不到错误
          console.log(error);
        }
        // 每次并发10个请求
        const limit = pLimit(5);
        const promises = [];
        if (data.result.length != 0) {
          count += data.result.length;
          for (let item of data.result) {
            promises.push(limit(() => execute(item)));
          }
          await Promise.all(promises);
        }
      };

      await getResourceList();
      console.log(`count is ${count}`);
      // 更新目录下载完成状态
      await this.workspaceService.saveOrUpdate({
        ...workspace,
        isCategoryReady: true,
      });
    } catch (error) {
      console.log(error);
      return new BaseException(500, '目录导入有错');
    }
    return true;
  }

  /**
   * 将要下载的任务的放到队列中
   */
  async putDownloadTask2Q(workspaceId: string, downloadType) {
    // 生成批次
    const batch = await this.batchService.createBatch();
    const list = await this.findAll(workspaceId);
    // 所有节点map结构
    const map = list.reduce((rs, item) => {
      rs[item.resourceId] = item;
      return rs;
    }, {});
    // 查找父节点
    const getParents = (item) => {
      const parents = [];
      while (item.parentId && map[item.parentId]) {
        const parent = map[item.parentId];
        parents.unshift(parent.name);
        item = parent;
      }
      return parents;
    };

    const result = [];
    list.forEach((item) => {
      if (item.type != 'folder') {
        const rs = {
          ...item,
          batchId: batch.id,
          parentNames: getParents(item),
          downloadType,
        };
        result.push(rs);
      }
    });

    for (const item of result) {
      await this.docQueue.add('docTask', item);
    }
    console.log('download task put into queue success');
    return batch.id;
  }
}
