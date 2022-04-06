import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors/TransformInterceptor';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { Queue } from 'bull';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TransformInterceptor());
  // 静态文件
  const serverAdapter = new ExpressAdapter();
  createBullBoard({
    queues: [new BullAdapter(app.get<Queue>('BullQueue_dc_doc'))],
    serverAdapter,
  });
  serverAdapter.setBasePath('/dc-doc/admin/queues');
  app.use('/dc-doc/admin/queues', serverAdapter.getRouter());
  await app.listen(3000);
}

bootstrap();
