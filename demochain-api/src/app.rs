use std::net::SocketAddr;

use axum::{Router, http::Request};
use axum::middleware::{self, Next};
use axum::body::Body;
use axum::response::Response;
use sqlx::SqlitePool;
use tracing::{error, info};
use axum::http::StatusCode;

use crate::utils::jwt::JwtService;

#[derive(Clone)]
pub struct AppState {
    pub db: SqlitePool,
}

pub async fn init() -> anyhow::Result<(AppState, SocketAddr)> {
    crate::bootstrap::initialize().await
}

// 构建应用路由（类型为 Router<AppState>，尚未挂载具体 State 实例）
pub fn new() -> Router<AppState> {
    let router = crate::router::build_router();
    let router = crate::router::configure_router(router);
    // 全局鉴权中间件：
    // - 可选：将 user_id 注入到 request.extensions()
    // - 保护特定路由：未登录则返回 401
    router.layer(middleware::from_fn(auth_middleware))
}

// 启动 HTTP 服务（内部挂载全局 State）
pub async fn serve(addr: SocketAddr, state: AppState) -> anyhow::Result<()> {
    let app = new().with_state(state);
    info!("starting server on http://{}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await.map_err(|e| {
        error!(error = %e, "server error");
        e.into()
    })
}

// Spring 风格入口：app::run() 完成初始化并启动服务
pub async fn run() -> anyhow::Result<()> {
    let (state, addr) = init().await?;
    serve(addr, state).await
}

async fn auth_middleware(mut req: Request<Body>, next: Next) -> Result<Response, StatusCode> {
    // 0) 放行预检请求
    if req.method() == axum::http::Method::OPTIONS {
        return Ok(next.run(req).await);
    }

    // 先持有路径的独立副本，避免后续对 req 的可变借用与此处的不可变借用冲突
    let path_owned = req.uri().path().to_string();
    // 1) 解析 Authorization（即使是公开接口也解析，供下游可选使用）
    let token_opt = extract_token(&req);
    let mut user_id: Option<String> = None;
    if let Some(tok) = token_opt {
        if let Ok(claims) = JwtService::verify_token(&tok) {
            user_id = Some(claims.sub);
        }
    }
    if let Some(uid) = &user_id {
        req.extensions_mut().insert(uid.clone());
    }

    // 2) 白名单放行，否则必须已鉴权
    if is_public_path(&path_owned) || user_id.is_some() {
        return Ok(next.run(req).await);
    }

    Err(StatusCode::UNAUTHORIZED)
}

fn is_public_path(path: &str) -> bool {
    matches!(
        path,
        // 健康检查/公共资源
        "/" | "/health" | "/api/health" |
        // 认证相关（登录/注册/刷新）
        "/api/auth/login" | "/api/auth/register" | "/api/auth/refresh" |
        // 文档/探针
        "/docs" | "/swagger" | "/openapi.json"
    ) || path.starts_with("/assets/") || path.starts_with("/public/")
}

fn extract_token<B>(req: &Request<B>) -> Option<String> {
    // Authorization-only: 从 Authorization: Bearer <token> 提取
    if let Some(auth_val) = req.headers().get(axum::http::header::AUTHORIZATION) {
        if let Ok(auth_str) = auth_val.to_str() {
            if let Some(rest) = auth_str.strip_prefix("Bearer ") {
                return Some(rest.to_string());
            }
        }
    }
    None
}
