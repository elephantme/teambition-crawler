import { notification } from 'antd';

export function notify(message: string) {
  notification.success({
    message: '提示',
    description: message,
  });
}
