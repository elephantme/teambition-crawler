import { Controller, Get, Query } from '@nestjs/common';

@Controller('dc-doc/api/download')
export class DownloadController {
  @Get('/status')
  async queryDownloadStatus(@Query() batchId) {}
}
