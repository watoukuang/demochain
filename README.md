## WSTools - WebSocket工具平台

### 生产部署

- 构建前端镜像
```shell
docker build -t demochain-ui:latest .
```

- 启动服务
```shell
docker run --name demochain-ui --restart=always -p 3002:3000 demochain-ui:latest
```


**常用命令**
```shell
docker run --name nginx --restart=always -p 443:443 -p 80:80 -d -v /usr/local/nginx/nginx.conf:/etc/nginx/nginx.conf -v /usr/local/web:/usr/local/web -v /usr/local/upload:/usr/local/upload nginx
```

154.204.34.183
root
qDTAc7L04sgM

### 手动启动

#### 后端服务

```shell
cd wstool-api
cargo run
```

#### 前端服务

```shell
cd wstool-ui
npm install
npm run dev
```

## 访问地址

- 前端界面: http://localhost:3000
- WebSocket工具: http://localhost:3000/websocket
- 后端API: http://localhost:8181

## Docker部署

```shell
# 构建后端镜像
cd wstool-api
docker build -t wstool-api:latest .

# 构建前端镜像
cd wstool-ui
docker build -t wstool-ui:latest .

# 运行后端
docker run -d \
  -p 8181:8181 \
  -v ./data:/app/data \
  -e DATABASE_URL=sqlite:///app/data/wstool.db?mode=rw \
  --name wstool-api \
  wstool-api:latest

# 运行前端
docker run -d \
  -p 3000:3000 \
  --name wstool-ui \
  wstool-ui:latest
```