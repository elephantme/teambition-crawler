export interface Workspace {
  id: number;
  name: string;
  workspaceId: string;
  isCategoryReady: boolean;
  isWordReady: boolean;
  isHtmlReady: boolean;
  downloadTaskCount: number;
}
