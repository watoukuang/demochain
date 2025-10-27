use std::net::SocketAddr;
use crate::app::AppState;
use dotenvy::{dotenv, from_filename};
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::SqlitePool;
use tracing::info;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

pub async fn initialize() -> anyhow::Result<(AppState, SocketAddr)> {
    // 加载环境变量：优先 .env，其次 env.development / env.production（如果存在）
    // 不存在则静默忽略，使用默认值
    if dotenv().is_err() {
        // 尝试开发/生产环境文件
        let _ = from_filename("env.development");
        let _ = from_filename("env.production");
    }

    // 初始化日志与追踪（tracing）
    tracing_subscriber::registry()
        .with(EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()))
        .with(tracing_subscriber::fmt::layer())
        .init();

    // 默认使用本地 data 目录下的 SQLite 文件
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "sqlite://./data/demochain.db".to_string());
    let port: u16 = std::env::var("PORT")
        .ok()
        .and_then(|s| s.parse().ok())
        .unwrap_or(8181);
    // 对本地 SQLite 路径，确保父目录存在（如 ./data）
    if let Some(stripped) = database_url.strip_prefix("sqlite://") {
        use std::path::Path;
        if let Some(parent) = Path::new(stripped.split('?').next().unwrap_or(stripped)).parent() {
            let _ = std::fs::create_dir_all(parent);
        }
    }

    // 建立数据库连接池
    let pool: SqlitePool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;

    // 运行数据库迁移
    run_migrations(&pool).await?;

    let state = AppState { db: pool };
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    info!("initialized with addr=http://{} database_url={}", addr, database_url);
    Ok((state, addr))
}

async fn run_migrations(pool: &SqlitePool) -> anyhow::Result<()> {
    info!("Running database migrations...");
    
    // 创建用户表
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

    // 创建索引
    sqlx::query("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)")
        .execute(pool)
        .await?;

    sqlx::query("CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at)")
        .execute(pool)
        .await?;

    info!("Database migrations completed successfully");
    Ok(())
}