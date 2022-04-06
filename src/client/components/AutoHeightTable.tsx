import React, { FC, memo, NamedExoticComponent } from 'react';
import { Table, TableProps } from 'antd';
import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { useWindowHeight } from '@react-hook/window-size';

export default function AutoHeightTable<RecordType extends object = any>(
  props: TableProps<RecordType>,
) {
  const tableWrapperEl = useRef<HTMLDivElement | null>(null);

  const [tableBodyHeight, setTableBodyHeight] = useState(0);
  const height = useWindowHeight();

  useEffect(() => {
    if (tableWrapperEl.current) {
      const tableEl = tableWrapperEl.current;
      // const { top, bottom } = tableEl?.getBoundingClientRect();
      // const tableHeight = height - top;
      const tableHeight = tableEl?.offsetHeight;
      console.log(`tableHeight is ${tableHeight}`);

      const headerHeight = props.size == 'small' ? 42 : 55;
      const paginationHeight = props.pagination === false ? 0 : 64;
      const padding = 2;
      const bodyHeight =
        tableHeight - headerHeight - paginationHeight - padding;
      setTableBodyHeight(bodyHeight);
    }
  }, [height, setTableBodyHeight]);

  return (
    <TableWrapper ref={tableWrapperEl}>
      <Table<RecordType> bordered scroll={{ y: tableBodyHeight }} {...props} />
    </TableWrapper>
  );
}

const TableWrapper = styled.div`
  height: 100%;
`;
