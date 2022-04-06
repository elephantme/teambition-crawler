import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ServeStaticModule } from '@nestjs/serve-static';
import config from './config';
import { join } from 'path';
import { WorkspaceController } from './controllers/WorkspaceController';
import { WorkspaceService } from './services/WorkspaceService';
import { ResourceService } from './services/ResourceService';
import { BatchService } from './services/BatchService';
import { DownloadLogService } from './services/DownloadLogService';
import { DownloadTaskExecutor } from './services/DownloadTaskExecutor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: config.redis,
    }),
    BullModule.registerQueue({
      name: 'dc_doc',
      limiter: {
        max: 15,
        duration: 1000,
      },
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'dist'),
    }),
  ],
  controllers: [WorkspaceController],
  providers: [
    WorkspaceService,
    ResourceService,
    BatchService,
    DownloadLogService,
    DownloadTaskExecutor,
  ],
})
export class AppModule {}
