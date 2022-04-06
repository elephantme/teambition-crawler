import React from 'react';
import { hot } from 'react-hot-loader';
import './assets/less/App.less';
import { routes } from './routes';

function App() {
  return routes();
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
