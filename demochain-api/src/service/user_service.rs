use sqlx::SqlitePool;
use chrono::{DateTime, Utc};
use anyhow::{bail, Context, Result};
use crate::models::user::{AuthVO, LoginDTO, RegisterDTO, User, UserDetail};
use crate::utils::{jwt_util::JwtService, password::PasswordService};

pub async fn register(
    pool: &SqlitePool,
    payload: RegisterDTO,
) -> Result<()> {
    let existing = sqlx::query!("SELECT id FROM t_user WHERE email = ?1",payload.email)
        .fetch_optional(pool)
        .await
        .with_context(|| "failed to check existing email")?;

    if existing.is_some() {
        bail!("邮箱已被注册");
    }
    PasswordService::validate_password_strength(&payload.password)?;
    let password = PasswordService::hash_password(&payload.password)?;
    let username = payload.email.split('@').next().unwrap_or("").to_string();

    sqlx::query!(r#"
        INSERT INTO t_user (email,username, password)
        VALUES (?1, ?2, ?3)
        "#,
        payload.email,
        username,
        password
    ).execute(pool).await.with_context(|| "failed to insert user")?;

    Ok(())
}

pub async fn login(
    pool: &SqlitePool,
    payload: LoginDTO,
) -> Result<AuthVO> {
    let user = sqlx::query_as!(
        User,
        r#"
        SELECT
            CAST(id AS TEXT) as "id!: String",
            email,
            username,
            password as "password?: String",
            created as "created: DateTime<Utc>",
            updated as "updated: DateTime<Utc>"
        FROM t_user WHERE email = ?1
        "#,
        payload.email
    ).fetch_optional(pool).await.with_context(|| "failed to query user")?;

    let user = user.ok_or_else(|| anyhow::anyhow!("邮箱或密码错误"))?;

    // 验证密码（User.password 为 Option<String>）
    match &user.password {
        Some(hashed) => {
            if !PasswordService::verify_password(&payload.password, hashed)? {
                bail!("邮箱或密码错误");
            }
        }
        None => bail!("邮箱或密码错误"),
    }

    let token = JwtService::generate_token(user.id.clone(), user.email.clone())?;

    Ok(AuthVO {
        token,
        user_detail: UserDetail {
            id: user.id.clone(),
            email: user.email.clone(),
            username: user.username.clone(),
            created: user.created,
            updated: user.updated,
        },
        expires_in: Some(24 * 60 * 60),
    })
}

pub async fn get_user_by_id(pool: &SqlitePool, user_id: i64) -> Result<Option<User>> {
    let user = sqlx::query_as!(
        User,
        r#"
        SELECT
            CAST(id AS TEXT) as "id!: String",
            email,
            username,
            password as "password?: String",
            created as "created: DateTime<Utc>",
            updated as "updated: DateTime<Utc>"
        FROM t_user WHERE id = ?1
        "#,
        user_id
    )
        .fetch_optional(pool)
        .await
        .with_context(|| "failed to fetch user")?;

    Ok(user)
}

