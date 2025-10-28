use std::net::SocketAddr;

use axum::{Router, http::Request};
use axum::middleware::{self, Next};
use axum::body::Body;
use axum::response::Response;
use sqlx::SqlitePool;
use tracing::{error, info};
use axum::http::StatusCode;
use crate::bootstrap::no_auth_path;
use crate::utils::jwt_util::with_user_id_scope;

use crate::utils::jwt_util::JwtService;

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
    router.layer(middleware::from_fn(authorize))
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

pub async fn run() -> anyhow::Result<()> {
    let (state, addr) = init().await?;
    serve(addr, state).await
}

async fn authorize(mut req: Request<Body>, next: Next) -> Result<Response, StatusCode> {
    if req.method() == axum::http::Method::OPTIONS {
        return Ok(next.run(req).await);
    }
    let path_owned = req.uri().path().to_string();
    let token_opt = extract_token(&req);
    let mut user_id: Option<String> = None;
    if let Some(tok) = token_opt {
        if let Ok(claims) = JwtService::verify_token(&tok) {
            user_id = Some(claims.sub);
        }
    }
    if let Some(uid) = &user_id {
        req.extensions_mut().insert(uid.clone());
        // run downstream within task-local user id scope
        let uid_owned = uid.clone();
        return Ok(with_user_id_scope(uid_owned, async move { next.run(req).await }).await);
    }
    if no_auth_path(&path_owned) {
        return Ok(next.run(req).await);
    }
    Err(StatusCode::UNAUTHORIZED)
}

fn extract_token<B>(req: &Request<B>) -> Option<String> {
    if let Some(auth_val) = req.headers().get(axum::http::header::AUTHORIZATION) {
        if let Ok(auth_str) = auth_val.to_str() {
            if let Some(rest) = auth_str.strip_prefix("Bearer ") {
                return Some(rest.to_string());
            }
        }
    }
    None
}
