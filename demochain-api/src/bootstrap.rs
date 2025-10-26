use std::net::SocketAddr;
use crate::app::AppState;
use dotenvy::dotenv;
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::SqlitePool;
use tracing::info;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

pub async fn initialize() -> anyhow::Result<(AppState, SocketAddr)> {
    // 加载环境变量（.env.development）
    dotenv().ok();

    // 初始化日志与追踪（tracing）
    tracing_subscriber::registry()
        .with(EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "sqlite://develpo.db?mode=rw".to_string());
    let port: u16 = std::env::var("PORT")
        .ok()
        .and_then(|s| s.parse().ok())
        .unwrap_or(8181);
    // // 建立数据库连接池
    let pool: SqlitePool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;

    let state = AppState { db: pool };
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    info!("initialized with addr=http://{}", addr);
    Ok((state, addr))
}