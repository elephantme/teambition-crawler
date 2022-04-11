import axios from 'axios';
import { tbCookie, xAppId, xTenantId } from '../config';

const fs = require('fs');
const write = require('write');

export const tbAxios = axios.create({
  headers: {
    // header中的查找下面这两个值
    'x-app-id': xAppId,
    'x-tenant-id': xTenantId,
    cookie: tbCookie,
  },
});

/**
 * 轮询获取下载文件的地址
 * @param nodeId 资源唯一标识
 * @param workspaceId 空间标识
 * @param type 资源类型，file标识文件，document表示文档
 * @param downloadType 要下载的类型，html、docx
 */
export async function getDownloadWordUrl(
  nodeId,
  workspaceId,
  type,
  downloadType = 'docx',
) {
  if (type == 'file') {
    const url = `https://thoughts.teambition.com/api/workspaces/${workspaceId}/nodes/${nodeId}?pageSize=1000&_=${new Date().getTime()}`;
    const { data } = await tbAxios.get(url);
    return {
      downloadUrl: data.info.downloadUrl,
      fileType: data.info.fileType,
    };
  }

  const downloadUrl = `https://thoughts.teambition.com/convert/api/nodes/${nodeId}/export:${downloadType}?pageSize=1000&_=${new Date().getTime()}`;
  /**
   * 下载文件，创建异步下载任务
   * @type {AxiosResponse<any>}
   */
  const { data } = await tbAxios({
    method: 'get',
    url: downloadUrl,
  });
  const taskId = data.id;
  /**
   * 轮询获取下载地址
   * @param taskId
   * @returns {Promise<AxiosResponse<any>>}
   */
  const getDownloadUrl = async (taskId) => {
    console.log(`getDownloadUrl, taskId: ${taskId}`);
    const url = `https://thoughts.teambition.com/convert/api/exportDocx:polling?pageSize=1000&id=${taskId}&_=${new Date().getTime()}`;
    const { data } = await tbAxios({
      method: 'get',
      url,
    });
    if (data.convertProcess == -1) {
      console.log(
        `[download_failed]getDownloadUrl failed, nodeId is ${nodeId}`,
      );
      return Promise.reject(
        new Error(
          `[download_failed]getDownloadUrl failed, nodeId is ${nodeId}`,
        ),
      );
    }
    if (data.convertProcess != 1) {
      return await getDownloadUrl(taskId);
    } else {
      return data.message.downloadUrl;
    }
  };
  return {
    fileType: downloadType == 'html' ? 'zip' : 'docx',
    taskId,
    downloadUrl: await getDownloadUrl(taskId),
  };
}

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const buffers = [];
    stream.on('error', reject);
    stream.on('data', (data) => buffers.push(data));
    stream.on('end', () => {
      resolve(Buffer.concat(buffers));
    });
  });
}

/**
 * 写文件
 * @param filepath
 */
export async function writeFile(filepath, stream) {
  const buffer = await streamToBuffer(stream);
  return write(filepath, buffer);
}

export function isEmptyDir(dirname) {
  try {
    fs.rmdirSync(dirname);
  } catch (err) {
    return false;
  }
  fs.mkdirSync(dirname);
  return true;
}
