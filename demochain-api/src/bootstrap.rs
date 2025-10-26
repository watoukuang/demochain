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
    // 建立数据库连接池
    let pool: SqlitePool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;

    // 运行数据库迁移
    run_migrations(&pool).await?;

    let state = AppState { db: pool };
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    info!("initialized with addr=http://{}", addr);
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