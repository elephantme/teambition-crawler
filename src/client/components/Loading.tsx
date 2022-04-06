import * as React from 'react';
import { Spin } from 'antd';
import { SpinProps } from 'antd/lib/spin';
import style from 'styled-components';

export default function Loading(props: SpinProps) {
  return <CenteredSpin size={'large'} {...props} />;
}

const CenteredSpin = style(Spin)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translated3d(-50%, -50%, 0);
`;
