use std::net::SocketAddr;

use axum::Router;
use sqlx::SqlitePool;
use tracing::{error, info};

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
    crate::router::configure_router(router)
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
