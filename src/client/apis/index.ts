import { useCustomAxios } from './base';

export const useQueryWorkspaces = () => {
  return useCustomAxios(
    {
      url: '/api/workspace',
      method: 'GET',
    },
    {
      manual: true,
    },
  );
};

export const useDownloadCategory = () => {
  return useCustomAxios(
    {
      url: '/api/workspace/download/category',
      method: 'GET',
    },
    {
      manual: true,
    },
  );
};

export const useExecuteDownload = () => {
  return useCustomAxios(
    {
      url: '/api/workspace/download/start',
      method: 'POST',
    },
    {
      manual: true,
    },
  );
};
