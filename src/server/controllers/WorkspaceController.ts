import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WorkspaceService } from '../services/WorkspaceService';
import { ResourceService } from '../services/ResourceService';

@Controller('dc-doc/api/workspace')
export class WorkspaceController {
  constructor(
    private workspaceService: WorkspaceService,
    private resourceService: ResourceService,
  ) {}

  /**
   * 查询所有空间
   */
  @Get()
  async getAllWorkspaces() {
    return await this.workspaceService.findAll();
  }

  /**
   * 爬单个空间
   * @param workspaceId
   */
  @Get('/download')
  async pullWorkspace(@Query('workspaceId') workspaceId) {
    await this.workspaceService.handleWorkspace(workspaceId);
  }

  /**
   * 爬所有的空间
   */
  @Get('/download/all')
  async pullAllWorkspaces() {
    console.log('handleWorkspaces....');
    await this.workspaceService.handleAllWorkspace();
  }

  @Get('/download/category')
  async handleResource(@Query('workspaceId') workspaceId) {
    await this.resourceService.saveNodeCategoryTreeData(workspaceId);
  }

  @Get('/download/count')
  async getDownloadTaskCount() {
    const all = await this.workspaceService.findAll();
    for (let w of all) {
      const count = await this.resourceService.getResourceCountOfWorkspace(
        w.workspaceId,
      );
      await this.workspaceService.saveOrUpdate({
        ...w,
        downloadTaskCount: count,
      });
    }
    return true;
  }

  @Post('/download/start')
  async handleDownload(@Body() params) {
    const { workspaceId, downloadType = 'docx' } = params;
    await this.resourceService.putDownloadTask2Q(workspaceId, downloadType);
    console.log(
      `[download] workspace ${workspaceId} download jobs created success`,
    );
    const workspace = await this.workspaceService.findWorkspaceByThirdId(
      workspaceId,
    );
    // 先将状态改了
    await this.workspaceService.saveOrUpdate({
      ...workspace,
      [downloadType == 'docx' ? 'isWordReady' : 'isHtmlReady']: true,
    });
    return true;
  }
}
