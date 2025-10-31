## DemoChain - DemoChain区块链演示平台

### 生产部署

- 构建前端镜像

```shell
docker build -t demochain-ui:latest .
```

- 启动服务

```shell
docker run --name demochain-ui --restart=always -p 3005:3000 demochain-ui:latest
```

**常用命令**

```shell
docker run --name nginx --restart=always -p 443:443 -p 80:80 -d -v /usr/local/nginx/nginx.conf:/etc/nginx/nginx.conf -v /usr/local/web:/usr/local/web -v /usr/local/upload:/usr/local/upload nginx
```


