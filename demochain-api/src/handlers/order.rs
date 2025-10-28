use crate::app::AppState;
use crate::models::order::{Order, OrderDTO, PageOrderDTO};
use crate::models::r::Response;
use crate::service::order_service;
use axum::extract::{Extension, Query, State};
use axum::Json;

pub async fn add(
    State(state): State<AppState>,
    Json(payload): Json<OrderDTO>,
) -> Json<Response<String>> {
    match order_service::add(&state.db, payload).await {
        Ok(address) => Json(Response {
            success: true,
            data: Some(address),
            message: Some("订单创建成功".to_string()),
            code: Some(200),
        }),
        Err(e) => Json(Response {
            success: false,
            data: None,
            message: Some(format!("订单创建失败: {}", e)),
            code: Some(500),
        }),
    }
}
pub async fn page(
    State(state): State<AppState>,
    Extension(user_id): Extension<String>,
    Query(p): Query<PageOrderDTO>,
) -> Json<Response<Vec<Order>>> {
    let page = p.page.unwrap_or(1);
    let size = p.size.unwrap_or(10);
    match order_service::page(&state.db, page, size).await {
        Ok(list) => Json(Response { success: true, data: Some(list), message: None, code: Some(200) }),
        Err(e) => Json(Response { success: false, data: None, message: Some(e.to_string()), code: Some(500) }),
    }
}