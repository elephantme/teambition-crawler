> 将tb文档爬到本地，支持下载word文档和html格式的文档。

## 准备

1. cookie.config中配置cookie，直接将浏览器请求中request header中cookie的值复制过来即可。
2. 配置mysql数据库，用来存放空间及目录信息。在本地创建dc-doc数据库，然后将utils/db.utils中的`synchronize`设置为true，就会自动创建表。
3. 配置Redis，用来充当下载任务队列的角色，具体可以参见bull库。
4. MySQL和Redis的连接配置在config.ts中。
5. 以上准备好之后，`npm install`，然后运行`npm run start:dev`来启动客户端页面和服务器端接口服务。

## 下载文档步骤

1. 先下载空间，会将所有空间村让到`t_workspace`表中，此时客户端空间列表就会列出所有空间。
2. 在页面上进行操作，下载空间的目录，之后就可以下载该空间的word和html文档了。

## 备注

1. `http://localhost:8082/dc-doc/` 访问界面。
2. `http://localhost:3000/dc-doc/admin/queues/queue/dc_doc?status=active` 访问下载任务处理的队列

