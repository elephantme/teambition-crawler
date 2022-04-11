const config: any = {
  dev: {
    db: {
      host: 'localhost',
      port: '3306',
      username: 'root',
      password: 'hetao',
      database: 'dc_doc',
      charset: 'utf8mb4',
    },
    redis: {
      host: 'localhost',
      port: 6379,
    },
    host: 'http://localhost:3000',
  },
};

export const tbCookie = '';
export const xAppId = '';
export const xTenantId = '';

export const env = process.env.NODE_ENV || 'dev';
export default config[env];
