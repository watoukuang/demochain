use crate::app::AppState;
use crate::models::order::{CreateOrderDTO, Order};
use crate::models::r::Response;
use crate::service::order_service;
use axum::extract::{State, Extension};
use axum::Json;

pub async fn create(
    State(state): State<AppState>,
    Extension(user_id): Extension<String>,
    Json(payload): Json<CreateOrderDTO>,
) -> Json<Response<Order>> {
    match order_service::create(&state.db, payload, &user_id).await {
        Ok(response) => Json(Response {
            success: true,
            data: Some(response),
            message: Some("订单创建成功".to_string()),
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
