import React from 'react';
import { Result } from 'antd';
import { Link } from 'react-router-dom';

export default function NotFountPage() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="抱歉，访问的页面不存在"
      extra={<Link to={'/'}>返回首页</Link>}
    />
  );
}
