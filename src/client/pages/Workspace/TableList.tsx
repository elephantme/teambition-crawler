import React from 'react';
import { Button, Popconfirm, TableProps, Typography } from 'antd';
import styled from 'styled-components';
import AutoHeightTable from '../../components/AutoHeightTable';
import { ColumnType } from 'antd/lib/table/interface';
import { Workspace } from '../../types/CommonType';
import { useDownloadCategory, useExecuteDownload } from '../../apis';
import { notify } from '../../utils';

interface TableListProps extends TableProps<Workspace> {
  data: Workspace[] | undefined;
  queryWorkspaces: () => void;
}

const booleanRender = (value) =>
  value ? (
    <Typography.Text type={'success'}>是</Typography.Text>
  ) : (
    <Typography.Text type={'danger'}>否</Typography.Text>
  );

export default React.memo(function TableList({
  data,
  queryWorkspaces,
  ...props
}: TableListProps) {
  const [{}, downloadCategory] = useDownloadCategory();
  const [{}, executeDownload] = useExecuteDownload();

  const columns: ColumnType<Workspace>[] = [
    { title: '空间名称', dataIndex: 'name', width: 120 },
    { title: '空间Id', dataIndex: 'workspaceId', width: 120 },
    { title: '任务数量', dataIndex: 'downloadTaskCount', width: 80 },
    {
      title: '目录是否已下载',
      dataIndex: 'isCategoryReady',
      ellipsis: true,
      width: 80,
      align: 'center',
      render: booleanRender,
    },
    {
      title: 'Word是否已下载',
      dataIndex: 'isWordReady',
      ellipsis: true,
      width: 80,
      align: 'center',
      render: booleanRender,
    },
    {
      title: 'Html是否已下载',
      dataIndex: 'isHtmlReady',
      ellipsis: true,
      width: 80,
      align: 'center',
      render: booleanRender,
    },
    {
      title: '操作',
      width: 200,
      render: (value, item) => (
        <div className={'operate-btns'}>
          <Popconfirm
            title="你确定要执行该任务吗？"
            onConfirm={() => {
              downloadCategory({
                params: { workspaceId: item.workspaceId },
              }).then(() => {
                notify('下载目录成功');
                queryWorkspaces();
              });
            }}
          >
            <Button type="link" disabled={item.isCategoryReady}>
              下载目录
            </Button>
          </Popconfirm>
          <Popconfirm
            title="你确定要执行该任务吗？"
            onConfirm={() => {
              executeDownload({
                data: { workspaceId: item.workspaceId, downloadType: 'docx' },
              }).then(() => {
                notify('异步下载任务创建成功');
                queryWorkspaces();
              });
            }}
          >
            <Button type="link" disabled={item.isWordReady}>
              下载Word
            </Button>
          </Popconfirm>
          <Popconfirm
            title="你确定要执行该任务吗？"
            onConfirm={() => {
              executeDownload({
                data: { workspaceId: item.workspaceId, downloadType: 'html' },
              }).then(() => {
                notify('异步下载任务创建成功');
                queryWorkspaces();
              });
            }}
          >
            <Button type="link" disabled={item.isHtmlReady}>
              下载Html
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  return (
    <Wrapper>
      <AutoHeightTable
        rowKey={(row) => row.id}
        columns={columns}
        pagination={false}
        dataSource={data}
        {...props}
      ></AutoHeightTable>
    </Wrapper>
  );
});

const Wrapper = styled.div`
  flex: 1;
  overflow: hidden;

  .operate-btns {
    .ant-btn {
      padding: 0px;
      margin-right: 8px;
    }
  }
`;
