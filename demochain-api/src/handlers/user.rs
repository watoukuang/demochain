use axum::extract::State;
use axum::Json;
use crate::app::AppState;
use crate::models::user::{RegisterDTO, LoginDTO, AuthVO};
use crate::models::R;
use crate::service::user_service;

pub async fn register(
    State(state): State<AppState>,
    Json(payload): Json<RegisterDTO>,
) -> Json<R<()>> {
    match user_service::register(&state.db, payload).await {
        Ok(()) => Json(R {
            success: true,
            data: None,
            message: Some("注册成功".to_string()),
            code: Some(200),
        }),
        Err(e) => {
            let msg = e.to_string();
            Json(R {
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
) -> Json<R<AuthVO>> {
    match user_service::login(&state.db, payload).await {
        Ok(auth_response) => Json(R {
            success: true,
            data: Some(auth_response),
            message: Some("登录成功".to_string()),
            code: Some(200),
        }),
        Err(e) => Json(R {
            success: false,
            data: None,
            message: Some(e.to_string()),
            code: Some(200),
        }),
    }
}

