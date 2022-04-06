import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import theme from 'configs/theme';
import { Helmet } from 'react-helmet';
import { useQueryWorkspaces } from '../../apis';
import TableList from './TableList';

export default function NotificationList() {
  // 查询推送列表
  const [{ data, loading }, queryWorkspaces] = useQueryWorkspaces();

  useEffect(() => {
    queryWorkspaces();
  }, []);

  return (
    <Wrapper>
      <Helmet title={'空间管理'} />
      <TableList
        loading={loading}
        data={data}
        queryWorkspaces={queryWorkspaces}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: ${theme.pagePadding};
  padding-bottom: 20px;
`;
