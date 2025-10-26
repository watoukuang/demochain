use std::net::SocketAddr;
use crate::app::AppState;
use dotenvy::dotenv;
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::SqlitePool;
use tracing::info;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

// 加载环境变量
fn load_env() {
    dotenv().ok();
}

// 初始化日志与追踪（tracing）
fn init_tracing() {
    tracing_subscriber::registry()
        .with(EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()))
        .with(tracing_subscriber::fmt::layer())
        .init();
}

// 读取应用配置（数据库地址与端口）
fn read_config() -> (String, u16) {
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "sqlite://develpo.db?mode=rw".to_string());
    let port: u16 = std::env::var("PORT").ok().and_then(|s| s.parse().ok()).unwrap_or(8181);
    (database_url, port)
}

// 建立数据库连接池
async fn create_pool(database_url: &str) -> anyhow::Result<SqlitePool> {
    let pool: SqlitePool = SqlitePoolOptions::new().max_connections(5).connect(database_url).await?;
    Ok(pool)
}

// 计算监听地址
fn build_addr(port: u16) -> SocketAddr {
    SocketAddr::from(([0, 0, 0, 0], port))
}

pub async fn initialize() -> anyhow::Result<(AppState, SocketAddr)> {
    load_env();
    init_tracing();
    let (database_url, port) = read_config();
    let pool = create_pool(&database_url).await?;

    let state = AppState { db: pool };
    let addr = build_addr(port);
    info!("initialized with addr=http://{}", addr);
    Ok((state, addr))
}