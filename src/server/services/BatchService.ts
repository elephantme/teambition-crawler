import { Injectable } from '@nestjs/common';
import DBUtil from '../utils/db.utils';
import { BatchEntity } from '../entities/BatchEntity';

@Injectable()
export class BatchService {
  async createBatch() {
    const conn = await DBUtil.getConnection();
    return conn.getRepository(BatchEntity).save({});
  }
}
