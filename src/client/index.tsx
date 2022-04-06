import 'react-hot-loader';
import * as React from 'react';
import { render } from 'react-dom';
import 'antd/dist/antd.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd';

const rootEl = document.getElementById('root');

window.addEventListener('unhandledrejection', function (error) {
  console.error(error);
});

render(
  <BrowserRouter basename={'dc-doc'}>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </BrowserRouter>,
  rootEl,
);
