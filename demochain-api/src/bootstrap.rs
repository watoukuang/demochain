use std::net::SocketAddr;
use crate::app::AppState;
use sqlx::{SqlitePool, sqlite::SqlitePoolOptions};
use tracing::info;
use dotenvy::dotenv;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

#[derive(Clone, Debug)]
struct AppConfig {
    database_url: String,
    port: u16,
}

impl AppConfig {
    fn load() -> Self {
        dotenv().ok();
        let database_url = std::env::var("DATABASE_URL")
            .unwrap_or_else(|_| "sqlite://./data/demochain.db".to_string());
        let port = std::env::var("PORT").ok().and_then(|s| s.parse().ok()).unwrap_or(8085);
        Self { database_url, port }
    }
}

fn init_tracing() {
    tracing_subscriber::registry()
        .with(EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()))
        .with(tracing_subscriber::fmt::layer())
        .init();
}

fn ensure_sqlite_dir(database_url: &str) {
    if let Some(stripped) = database_url.strip_prefix("sqlite://") {
        use std::path::Path;
        if let Some(parent) = Path::new(stripped.split('?').next().unwrap_or(stripped)).parent() {
            let _ = std::fs::create_dir_all(parent);
        }
    }
}

async fn connect_pool(database_url: &str) -> anyhow::Result<SqlitePool> {
    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(database_url)
        .await?;
    Ok(pool)
}

pub async fn initialize() -> anyhow::Result<(AppState, SocketAddr)> {
    // 1) 配置与日志
    let cfg = AppConfig::load();
    init_tracing();

    // 2) 数据目录与连接
    ensure_sqlite_dir(&cfg.database_url);
    let pool = connect_pool(&cfg.database_url).await?;

    // 3) 装配返回
    let state = AppState { db: pool };
    let addr = SocketAddr::from(([0, 0, 0, 0], cfg.port));
    info!("initialized with addr=http://{} database_url={}", addr, cfg.database_url);
    Ok((state, addr))
}

pub fn no_auth_path(path: &str) -> bool {
    matches!(
        path,
        "/" | "/health" | "/api/health" |
        "/api/auth/login" | "/api/auth/register" | "/api/auth/refresh" |
        "/docs" | "/swagger" | "/openapi.json"
    ) || path.starts_with("/assets/") || path.starts_with("/public/")
}
