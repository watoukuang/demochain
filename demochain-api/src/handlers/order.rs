use crate::app::AppState;
use crate::models::order::{OrderDTO, OrderVO, PageOrderDTO};
use crate::models::{PageVO, R};
use crate::service::order_service;
use axum::extract::{Query, State};
use axum::Json;

pub async fn add(
    State(state): State<AppState>,
    Json(payload): Json<OrderDTO>,
) -> Json<R<String>> {
    match order_service::add(&state.db, payload).await {
        Ok(address) => Json(R {
            success: true,
            data: Some(address),
            message: Some("订单创建成功".to_string()),
            code: Some(200),
        }),
        Err(e) => Json(R {
            success: false,
            data: None,
            message: Some(format!("订单创建失败: {}", e)),
            code: Some(500),
        }),
    }
}
pub async fn page(
    State(state): State<AppState>,
    Query(p): Query<PageOrderDTO>,
) -> Json<R<PageVO<OrderVO>>> {
    let page = p.page.unwrap_or(1);
    let size = p.size.unwrap_or(10);
    match order_service::page(&state.db, page, size).await {
        Ok(paged) => Json(R { success: true, data: Some(paged), message: None, code: Some(200) }),
        Err(e) => Json(R { success: false, data: None, message: Some(e.to_string()), code: Some(500) }),
    }
}