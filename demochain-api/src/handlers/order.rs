use axum::extract::State;
use axum::Json;
use crate::app::AppState;
use crate::models::r::Response;
use crate::models::user::{AuthResponse, RegisterRequest};
use crate::service::order_service;

pub async fn create(
    State(state): State<AppState>,
    Json(payload): Json<RegisterRequest>,
) -> Json<Response<AuthResponse>> {
    match order_service::create(&state.db, payload).await {
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