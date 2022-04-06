import * as TypeORM from 'typeorm';
import { createConnection } from 'typeorm';
import config from '../config';
import { WorkspaceEntity } from '../entities/WorkspaceEntity';
import { ResourceEntity } from '../entities/ResourceEntity';
import { BatchEntity } from '../entities/BatchEntity';
import { DownloadLogEntity } from '../entities/DownloadLogEntity';

let conn: TypeORM.Connection;

export default {
  async getConnection(): Promise<TypeORM.Connection> {
    if (conn) return conn;
    conn = await createConnection({
      type: 'mysql',
      ...config.db,
      entities: [
        WorkspaceEntity,
        ResourceEntity,
        BatchEntity,
        DownloadLogEntity,
      ],
      logging: false,
      synchronize: false,
      keepAlive: true,
    });
    return conn;
  },
};
