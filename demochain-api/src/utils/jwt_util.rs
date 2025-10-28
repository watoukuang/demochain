use crate::models::user::Claims;
use anyhow::{anyhow, Result};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};

const JWT_SECRET: &str = "your-secret-key-change-in-production";
const TOKEN_EXPIRY_SECONDS: i64 = 24 * 60 * 60; // 24 hours

pub struct JwtService;

impl JwtService {
    pub fn generate_token(user_id: String, email: String) -> Result<String> {
        let claims = Claims::new(user_id, email, TOKEN_EXPIRY_SECONDS);

        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(JWT_SECRET.as_ref()),
        )
            .map_err(|e| anyhow!("Failed to generate token: {}", e))
    }

    pub fn verify_token(token: &str) -> Result<Claims> {
        decode::<Claims>(
            token,
            &DecodingKey::from_secret(JWT_SECRET.as_ref()),
            &Validation::default(),
        )
            .map(|data| data.claims)
            .map_err(|e| anyhow!("Invalid token: {}", e))
    }

    #[allow(dead_code)]
    pub fn extract_bearer_token(auth_header: &str) -> Result<&str> {
        if auth_header.starts_with("Bearer ") {
            Ok(&auth_header[7..])
        } else {
            Err(anyhow!("Invalid authorization header format"))
        }
    }
}

// JWT 中间件提取器（只支持 Authorization: Bearer <token>）
use axum::{
    extract::FromRequestParts,
    http::{request::Parts, StatusCode},
    RequestPartsExt,
};
use axum_extra::{
    headers::{authorization::Bearer, Authorization},
    TypedHeader,
};

#[allow(dead_code)]
pub struct AuthUser(pub Claims);

#[axum::async_trait]
impl<S> FromRequestParts<S> for AuthUser
where
    S: Send + Sync,
{
    type Rejection = StatusCode;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        // 尝试从 Authorization header 获取 token
        let TypedHeader(Authorization(bearer)) = parts
            .extract::<TypedHeader<Authorization<Bearer>>>()
            .await
            .map_err(|_| StatusCode::UNAUTHORIZED)?;

        // 验证 token
        let claims = JwtService::verify_token(bearer.token())
            .map_err(|_| StatusCode::UNAUTHORIZED)?;

        Ok(AuthUser(claims))
    }
}

// 新增：既支持 Cookie 中的 token，也支持 Authorization: Bearer
use axum_extra::headers;

#[allow(dead_code)]
pub struct AuthUserAny(pub Claims);

#[axum::async_trait]
impl<S> FromRequestParts<S> for AuthUserAny
where
    S: Send + Sync,
{
    type Rejection = StatusCode;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        // 1) 优先从 Cookie: token 获取
        if let Ok(TypedHeader(cookie)) = parts.extract::<TypedHeader<headers::Cookie>>().await {
            if let Some(tok) = cookie.get("token") {
                if let Ok(claims) = JwtService::verify_token(tok) {
                    return Ok(AuthUserAny(claims));
                }
            }
        }

        // 2) 回退到 Authorization: Bearer
        if let Ok(TypedHeader(Authorization(bearer))) = parts
            .extract::<TypedHeader<Authorization<Bearer>>>()
            .await
        {
            if let Ok(claims) = JwtService::verify_token(bearer.token()) {
                return Ok(AuthUserAny(claims));
            }
        }

        Err(StatusCode::UNAUTHORIZED)
    }
}

// 全局辅助：从请求中提取 user_id（Cookie 或 Authorization），失败返回 401
#[allow(dead_code)]
pub async fn get_user_id_from_request(parts: &mut Parts) -> Result<String, StatusCode> {
    // Cookie
    if let Ok(TypedHeader(cookie)) = parts.extract::<TypedHeader<headers::Cookie>>().await {
        if let Some(tok) = cookie.get("token") {
            if let Ok(claims) = JwtService::verify_token(tok) {
                return Ok(claims.sub);
            }
        }
    }

    // Authorization
    if let Ok(TypedHeader(Authorization(bearer))) = parts
        .extract::<TypedHeader<Authorization<Bearer>>>()
        .await
    {
        if let Ok(claims) = JwtService::verify_token(bearer.token()) {
            return Ok(claims.sub);
        }
    }

    Err(StatusCode::UNAUTHORIZED)
}

// ========= Task-local user id helpers =========
tokio::task_local! {
    static TL_USER_ID: String;
}

// Run a future within a scope that sets the current user id
pub async fn with_user_id_scope<F, T>(uid: String, fut: F) -> T
where
    F: std::future::Future<Output=T>,
{
    TL_USER_ID.scope(uid, fut).await
}

// Get current user id from task-local storage
pub fn get_user_id() -> Option<String> {
    TL_USER_ID.try_with(|s| s.clone()).ok()
}
