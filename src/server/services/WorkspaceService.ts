import { Injectable } from '@nestjs/common';
import DBUtil from '../utils/db.utils';
import { WorkspaceEntity } from '../entities/WorkspaceEntity';
import { tbAxios } from '../utils/tb.utils';
import { BaseException } from '../exceptions/BaseException';

@Injectable()
export class WorkspaceService {
  constructor() {}

  async findAll() {
    const conn = await DBUtil.getConnection();
    return conn.getRepository(WorkspaceEntity).find();
  }

  async findWorkspaceByThirdId(workspaceId: string) {
    const conn = await DBUtil.getConnection();
    return conn
      .getRepository(WorkspaceEntity)
      .findOne({ where: { workspaceId } });
  }

  async saveOrUpdate(workspace) {
    const conn = await DBUtil.getConnection();
    return conn.getRepository(WorkspaceEntity).save(workspace);
  }

  /**
   * 爬单个空间
   */
  async handleWorkspace(workspaceId: string) {
    console.log(`handleWorkspace, workspaceId: ${workspaceId}`);
    const w = await this.findWorkspaceByThirdId(workspaceId);
    if (w) {
      return new BaseException(
        500,
        `workspace ${w.name}:${workspaceId} has existed`,
      );
    }
    try {
      const { data } = await tbAxios.get(
        `https://thoughts.teambition.com/api/workspaces/${workspaceId}?pageSize=1000`,
      );
      console.log(data);
      return await this.saveOrUpdate({
        workspaceId,
        name: data.name,
        data,
      });
    } catch (error) {
      console.log(error);
      return new BaseException(500, 'query from teambition has errors');
    }
  }

  /**
   * 爬所有空间
   */
  async handleAllWorkspace() {
    const { data } = await tbAxios.get(
      'https://thoughts.teambition.com/api/organizations/5e93ff9abe2173e165561be4/workspaces:list?pageSize=1000&all=1&isRecycled=false',
    );

    if (data.result.length == 0) return Promise.resolve();

    data.result.map(async (item) => {
      await this.saveOrUpdate({
        thirdId: item._id,
        name: item.name,
        data: item,
      });
    });
  }
}
