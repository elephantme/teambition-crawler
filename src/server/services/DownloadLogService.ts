import { Injectable } from '@nestjs/common';
import DBUtil from '../utils/db.utils';
import { DownloadLogEntity } from '../entities/DownloadLogEntity';

@Injectable()
export class DownloadLogService {
  async saveOrUpdate(entity) {
    const conn = await DBUtil.getConnection();
    return conn.getRepository(DownloadLogEntity).save(entity);
  }

  /**
   * 查询batchId处理完成的下载任务数
   * @param batchId
   */
  async queryDownloadLog(batchId, workspaceId, resourceId) {
    const conn = await DBUtil.getConnection();
    return conn
      .getRepository(DownloadLogEntity)
      .createQueryBuilder('log')
      .where(
        'log.batchId = :batchId and log.workspaceId = :workspaceId and log.resourceId = :resourceId',
        {
          batchId,
          workspaceId,
          resourceId,
        },
      )
      .getOne();
  }
}
