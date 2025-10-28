use axum::{extract::State, Json};
use crate::app::AppState;
use crate::models::user::{RegisterRequest, LoginRequest, AuthVO};
use crate::models::r::Response;
use crate::service::user_service;

pub async fn register(
    State(state): State<AppState>,
    Json(payload): Json<RegisterRequest>,
) -> Json<Response<AuthVO>> {
    match user_service::register_user(&state.db, payload).await {
        Ok(auth_response) => Json(Response {
            success: true,
            data: Some(auth_response),
            message: Some("注册成功".to_string()),
            code: Some(200),
        }),
        Err(e) => {
            let msg = e.to_string();
            let code = if msg.contains("邮箱已被注册!") { 409 } else { 500 };
            Json(Response {
                success: false,
                data: None,
                message: Some(msg),
                code: Some(code),
            })
        }
    }
}

pub async fn login(
    State(state): State<AppState>,
    Json(payload): Json<LoginRequest>,
) -> Json<Response<AuthVO>> {
    match user_service::login_user(&state.db, payload).await {
        Ok(auth_response) => Json(Response {
            success: true,
            data: Some(auth_response),
            message: Some("登录成功".to_string()),
            code: Some(200),
        }),
        Err(e) => Json(Response {
            success: false,
            data: None,
            message: Some(e.to_string()),
            code: Some(200),
        }),
    }
}

