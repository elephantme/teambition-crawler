import useAxios, {
  configure,
  Options,
  RefetchOptions,
  ResponseValues,
} from 'axios-hooks';
import Axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import { notification } from 'antd';
import { useCallback } from 'react';

export const axios = Axios.create({
  baseURL: '/dc-doc',
});

axios.interceptors.response.use(
  (response) => {
    const { code, data, message } = response.data;
    if (code === 200) {
      response.data = data;
    } else {
      notification.error({
        message: '错误',
        description: message,
      });
      return Promise.reject(response.data);
    }
    return response;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  },
);

configure({ axios });

interface MyAxiosConfig<TBody = any> extends AxiosRequestConfig {
  pathParams?: object;
}

export type MyUseAxiosResult<TResponse = any, TBody = any, TError = any> = [
  ResponseValues<TResponse, TBody, TError>,
  (
    config?: MyAxiosConfig<TBody>,
    options?: RefetchOptions,
  ) => AxiosPromise<TResponse>,
  () => void,
];

function replaceUrl(url: string | undefined, pathParams: any): string {
  if (!url) return '';
  return url.replace(/:([^\/]+)/g, (rs, s) => pathParams[s]);
}

export const useCustomAxios = (
  config: AxiosRequestConfig | string,
  options?: Options,
): MyUseAxiosResult => {
  const [rs, execute, manualCancel] = useAxios(config, options);
  const executeWrapper = useCallback(
    (params?: MyAxiosConfig): AxiosPromise => {
      if (params?.pathParams) {
        const url = typeof config === 'string' ? config : config.url;
        const replaced = replaceUrl(url, params.pathParams);
        return execute({
          ...params,
          url: replaced,
        });
      } else {
        return execute(params);
      }
    },
    [execute],
  );
  return [rs, executeWrapper, manualCancel];
};

export default axios;
