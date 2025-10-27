use axum::{extract::State, Json};
use axum::http::StatusCode;
use crate::app::AppState;
use crate::models::user::{RegisterRequest, LoginRequest, AuthResponse};
use crate::service::user_service;

pub async fn register(
    State(state): State<AppState>,
    Json(payload): Json<RegisterRequest>,
) -> Result<Json<AuthResponse>, (StatusCode, String)> {
    let response = user_service::register_user(&state.db, payload)
        .await
        .map_err(|e| {
            let status = if e.to_string().contains("邮箱已被注册") {
                StatusCode::CONFLICT
            } else {
                StatusCode::INTERNAL_SERVER_ERROR
            };
            (status, e.to_string())
        })?;

    Ok(Json(response))
}

pub async fn login(
    State(state): State<AppState>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<AuthResponse>, (StatusCode, String)> {
    let response = user_service::login_user(&state.db, payload)
        .await
        .map_err(|e| {
            let status = if e.to_string().contains("邮箱或密码错误") {
                StatusCode::UNAUTHORIZED
            } else {
                StatusCode::INTERNAL_SERVER_ERROR
            };
            (status, e.to_string())
        })?;

    Ok(Json(response))
}

