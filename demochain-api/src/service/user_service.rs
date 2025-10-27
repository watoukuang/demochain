use sqlx::SqlitePool;
use chrono::{Utc, DateTime};
use anyhow::{Context, Result, bail};
use crate::models::user::{User, LoginRequest, RegisterRequest, AuthResponse, UserDetails};
use crate::utils::{jwt::JwtService, password::PasswordService};

fn gen_id() -> String {
    format!("user_{}", Utc::now().timestamp_millis())
}

pub async fn register_user(
    pool: &SqlitePool,
    req: RegisterRequest,
) -> Result<AuthResponse> {
    // 检查邮箱是否已存在
    let existing = sqlx::query!("SELECT id FROM users WHERE email = ?1",req.email)
        .fetch_optional(pool)
        .await
        .with_context(|| "failed to check existing email")?;

    if existing.is_some() {
        bail!("邮箱已被注册");
    }

    let id = gen_id();
    // 强度校验 + 哈希
    PasswordService::validate_password_strength(&req.password)?;
    let password_hash = PasswordService::hash_password(&req.password)?;

    // 插入新用户
    sqlx::query!(
        r#"
        INSERT INTO users (id, email, username, password_hash, avatar, is_verified)
        VALUES (?1, ?2, NULL, ?3, NULL, FALSE)
        "#,
        id,
        req.email,
        password_hash
    ).execute(pool)
        .await
        .with_context(|| "failed to insert user")?;

    // 获取创建的用户
    let user = get_user_by_id(pool, &id)
        .await?
        .ok_or_else(|| anyhow::anyhow!("failed to fetch created user"))?;

    let token = JwtService::generate_token(user.id.clone(), user.email.clone())?;

    Ok(AuthResponse {
        token,
        user: UserDetails {
            id: user.id.clone(),
            email: user.email.clone(),
            username: user.username.clone(),
            avatar: user.avatar.clone(),
            created: user.created,
            updated: user.updated,
        },
        expires_in: Some(24 * 60 * 60), // 24小时
    })
}

pub async fn login_user(
    pool: &SqlitePool,
    req: LoginRequest,
) -> Result<AuthResponse> {
    // 查找用户
    let user = sqlx::query_as!(
        User,
        r#"
        SELECT
            id,
            email,
            username,
            password_hash as password,
            avatar,
            created_at as "created: DateTime<Utc>",
            updated_at as "updated: DateTime<Utc>"
        FROM users WHERE email = ?1
        "#,
        req.email
    )
        .fetch_optional(pool)
        .await
        .with_context(|| "failed to query user")?;

    let user = user.ok_or_else(|| anyhow::anyhow!("邮箱或密码错误"))?;

    // 验证密码
    if !PasswordService::verify_password(&req.password, &user.password)? {
        bail!("邮箱或密码错误");
    }

    let token = JwtService::generate_token(user.id.clone(), user.email.clone())?;

    Ok(AuthResponse {
        token,
        user: UserDetails {
            id: user.id.clone(),
            email: user.email.clone(),
            username: user.username.clone(),
            avatar: user.avatar.clone(),
            created: user.created,
            updated: user.updated,
        },
        expires_in: Some(24 * 60 * 60),
    })
}

pub async fn get_user_by_id(pool: &SqlitePool, user_id: &str) -> Result<Option<User>> {
    let user = sqlx::query_as!(
        User,
        r#"
        SELECT
            id,
            email,
            username,
            password_hash as password,
            avatar,
            created_at as "created: DateTime<Utc>",
            updated_at as "updated: DateTime<Utc>"
        FROM users WHERE id = ?1
        "#,
        user_id
    )
        .fetch_optional(pool)
        .await
        .with_context(|| "failed to fetch user")?;

    Ok(user)
}

