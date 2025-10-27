use std::net::SocketAddr;
use crate::app::AppState;
use sqlx::{SqlitePool, sqlite::SqlitePoolOptions};
use tracing::info;
use dotenvy::{dotenv, from_filename};
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
        let port = std::env::var("PORT").ok().and_then(|s| s.parse().ok()).unwrap_or(8181);
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

async fn run_migrations(pool: &SqlitePool) -> anyhow::Result<()> {
    info!("Running database script...");
    // users 表
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY NOT NULL,
            email TEXT UNIQUE NOT NULL,
            username TEXT,
            password_hash TEXT NOT NULL,
            avatar TEXT,
            is_verified BOOLEAN NOT NULL DEFAULT FALSE,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        "#,
    )
        .execute(pool)
        .await?;

    sqlx::query("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)")
        .execute(pool)
        .await?;

    sqlx::query("CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at)")
        .execute(pool)
        .await?;

    info!("Database script completed successfully");
    Ok(())
}

pub async fn initialize() -> anyhow::Result<(AppState, SocketAddr)> {
    // 1) 配置与日志
    let cfg = AppConfig::load();
    init_tracing();

    // 2) 数据目录与连接
    ensure_sqlite_dir(&cfg.database_url);
    let pool = connect_pool(&cfg.database_url).await?;

    // 3) 迁移
    run_migrations(&pool).await?;

    // 4) 装配返回
    let state = AppState { db: pool };
    let addr = SocketAddr::from(([0, 0, 0, 0], cfg.port));
    info!("initialized with addr=http://{} database_url={}", addr, cfg.database_url);
    Ok((state, addr))
}

struct AppState {
    db: SqlitePool,
}