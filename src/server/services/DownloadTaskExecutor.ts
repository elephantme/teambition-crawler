import { WorkspaceEntity } from '../entities/WorkspaceEntity';
import {
  getDownloadWordUrl,
  isEmptyDir,
  tbAxios,
  writeFile,
} from '../utils/tb.utils';
import { WorkspaceService } from './WorkspaceService';
import { BatchService } from './BatchService';
import { DownloadLogService } from './DownloadLogService';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';

const compressing = require('compressing');
const { execSync } = require('child_process');

@Processor('dc_doc')
@Injectable()
export class DownloadTaskExecutor {
  constructor(
    private workspaceService: WorkspaceService,
    private batchService: BatchService,
    private downloadLogService: DownloadLogService,
  ) {}

  /**
   * 开始从队列中取出来处理
   */
  @Process({
    name: 'docTask',
    concurrency: 10,
  })
  async process(job: Job, done) {
    const resource = job.data;
    const {
      workspaceId,
      resourceId,
      batchId,
      type: resourceType,
      downloadType,
    } = resource;
    console.log(`[job:${resource.id}]execute job`);
    const downloadLog =
      (await this.downloadLogService.queryDownloadLog(
        batchId,
        workspaceId,
        resourceId,
      )) || {};
    try {
      // 空间对象
      const workspace: WorkspaceEntity =
        await this.workspaceService.findWorkspaceByThirdId(workspaceId);
      // 下载地址
      const {
        downloadUrl,
        fileType,
        taskId: downloadTaskId,
      } = await getDownloadWordUrl(
        resourceId,
        workspaceId,
        resourceType,
        downloadType,
      );
      await job.progress(20);
      console.log(`[job:${resource.id}]get downloadUrl success`);

      // 下载文件得到二进制
      const response = await tbAxios({
        url: downloadUrl,
        method: 'GET',
        responseType: 'stream',
      });
      await job.progress(40);
      console.log(`[job:${resource.id}]download success`);

      // 下载文件
      const filePath = await this.writeFile(
        resource,
        workspace.name,
        fileType,
        downloadType,
        response.data,
      );
      await job.progress(60);
      console.log(`[job:${resource.id}]write file success`);

      // 如果是zip包则解压
      if (response.headers['content-type'] == 'application/zip') {
        await this.handleHtml({
          filePath,
          parentNames: resource.parentNames,
          workspaceName: workspace.name,
          fileName: resource.name,
          taskId: downloadTaskId,
        });
      }

      //  更新数据库
      const result = await this.downloadLogService.saveOrUpdate({
        ...downloadLog,
        batchId,
        workspaceId,
        resourceId,
        task: resource,
        status: 1,
      });
      await job.progress(100);
      done();
      console.log(`[job:${resource.id}]job finish`);
      return result;
    } catch (error) {
      console.log(`[job:${resource.id}]job has error`, error);
      await this.downloadLogService.saveOrUpdate({
        ...downloadLog,
        batchId,
        workspaceId,
        resourceId,
        status: -1,
        task: resource,
        desc: {
          error,
        },
      });
      done(error);
    }
  }

  async writeFile(resource, workspaceName, fileType, downloadType, stream) {
    const names = resource.parentNames.slice();
    names.push(`${resource.name}.${fileType}`);
    const filePath = `docs_${downloadType}/${workspaceName}/${names.join('/')}`;
    await writeFile(filePath, stream);
    return filePath;
  }

  async handleHtml({ filePath, parentNames, fileName, workspaceName, taskId }) {
    console.log(
      `filePath:${filePath}, fileName: ${fileName}, taskId:${taskId}`,
    );
    const destPath = `docs_html/${workspaceName}/${[
      ...parentNames,
      fileName,
    ].join('/')}`;

    await compressing.zip.uncompress(filePath, destPath);
    execSync(`mv "${destPath}/${taskId}"/* "${destPath}"`);
    if (isEmptyDir(`${destPath}/static`)) {
      execSync(`rm -rf "${destPath}/static"`);
    }
    execSync(`rm -rf "${destPath}/${taskId}"`);
    execSync(`rm -rf "${filePath}"`);
  }
}
