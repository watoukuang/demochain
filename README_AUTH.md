# DemoChain 认证系统实现

## 功能概述

已完成前后端完整的用户认证系统，包括注册、登录、登出、用户信息管理等功能。

## 前端实现

### 1. 请求工具类
- **文件**: `src/shared/utils/request.ts`
- **功能**: 基于 fetch API 的 HTTP 请求封装
- **特性**: 
  - 自动添加 JWT token
  - 统一错误处理
  - 请求/响应拦截
  - 401 自动登出

### 2. 认证 API
- **文件**: `src/shared/api/auth.ts`
- **功能**: 
  - 用户注册/登录
  - 获取用户信息
  - 修改密码
  - Token 管理
  - 本地存储管理

### 3. 认证 Hook
- **文件**: `src/shared/hooks/useAuth.ts`
- **功能**: React Hook 管理认证状态
- **状态**: user, token, isAuthenticated, isLoading

### 4. 登录组件
- **文件**: `components/login/Header.tsx`
- **功能**: 
  - 登录/注册表单
  - 表单验证
  - 错误处理
  - 加载状态
  - Google OAuth 支持

### 5. Header 集成
- **文件**: `layout/Header.tsx`
- **功能**: 
  - 根据认证状态显示不同 UI
  - 登录/登出按钮
  - 用户信息显示

## 后端实现

### 1. 数据模型
- **文件**: `src/models/user.rs`
- **结构**: User, LoginRequest, RegisterRequest, AuthResponse
- **JWT**: Claims 结构定义

### 2. 工具类
- **JWT**: `src/utils/jwt.rs` - Token 生成/验证
- **密码**: `src/utils/password.rs` - bcrypt 哈希/验证

### 3. 服务层
- **文件**: `src/service/auth_service.rs`
- **功能**: 
  - 用户注册/登录逻辑
  - 密码验证
  - 用户信息管理
  - 数据库操作

### 4. 控制器
- **文件**: `src/handlers/auth.rs`
- **路由**: 
  - `POST /api/auth/register` - 注册
  - `POST /api/auth/login` - 登录
  - `POST /api/auth/logout` - 登出
  - `GET /api/auth/me` - 获取用户信息
  - `POST /api/auth/refresh` - 刷新 token
  - `POST /api/auth/change-password` - 修改密码

### 5. 数据库
- **表**: users 表，包含用户基本信息
- **索引**: email, created_at
- **迁移**: 自动创建表结构

## 配置

### 前端环境变量
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8181
```

### 后端环境变量
```env
DATABASE_URL=sqlite://database.db
PORT=8181
```

## 使用方法

### 启动后端
```bash
cd demochain-api
cargo run
```

### 启动前端
```bash
cd demochain-ui
npm run dev
```

## 安全特性

1. **密码安全**: bcrypt 哈希加密
2. **JWT Token**: 24小时过期
3. **CORS 配置**: 跨域请求支持
4. **输入验证**: 邮箱格式、密码长度验证
5. **错误处理**: 统一错误响应格式

## API 响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "username": null,
      "avatar": null,
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    },
    "expires_in": 86400
  }
}
```

## 下一步

1. 邮箱验证功能
2. 密码重置功能
3. 用户头像上传
4. 社交登录集成
5. 权限管理系统
