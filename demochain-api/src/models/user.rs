use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct LoginDTO {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct RegisterDTO {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct AuthVO {
    pub token: String,
    pub user_detail: UserDetail,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub expires_in: Option<i64>,
}
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct User {
    pub id: String,
    pub email: String,
    pub username: Option<String>,
    pub password: Option<String>,
    pub created: DateTime<Utc>,
    pub updated: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserDetail {
    pub id: String,
    pub email: String,
    pub vip: String,
    pub username: Option<String>,
    pub created: DateTime<Utc>,
    pub updated: DateTime<Utc>,
}

#[allow(dead_code)]
#[derive(Debug, Deserialize)]
pub struct ChangePasswordRequest {
    pub old_password: String,
    pub new_password: String,
}

#[allow(dead_code)]
#[derive(Debug, Deserialize)]
pub struct ResetPasswordRequest {
    pub email: String,
}

#[allow(dead_code)]
#[derive(Debug, Deserialize)]
pub struct VerifyEmailRequest {
    pub token: String,
}

// JWT Claims
#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, // user id
    pub email: String,
    pub exp: i64,    // expiration time
    pub iat: i64,    // issued at
}

impl Claims {
    pub fn new(user_id: String, email: String, expires_in_seconds: i64) -> Self {
        let now = chrono::Utc::now().timestamp();
        Self {
            sub: user_id,
            email,
            exp: now + expires_in_seconds,
            iat: now,
        }
    }
}
