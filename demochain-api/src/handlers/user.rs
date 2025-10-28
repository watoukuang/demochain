use axum::{extract::State, Json};
use crate::app::AppState;
use crate::models::user::{RegisterDTO, LoginDTO, AuthVO};
use crate::models::r::Response;
use crate::service::user_service;

pub async fn register(
    State(state): State<AppState>,
    Json(payload): Json<RegisterDTO>,
) -> Json<Response<()>> {
    match user_service::register(&state.db, payload).await {
        Ok(()) => Json(Response {
            success: true,
            data: None,
            message: Some("注册成功".to_string()),
            code: Some(200),
        }),
        Err(e) => {
            let msg = e.to_string();
            Json(Response {
                success: false,
                data: None,
                message: Some(msg),
                code: Some(500),
            })
        }
    }
}

pub async fn login(
    State(state): State<AppState>,
    Json(payload): Json<LoginDTO>,
) -> Json<Response<AuthVO>> {
    match user_service::login(&state.db, payload).await {
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

