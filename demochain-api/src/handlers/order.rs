use crate::app::AppState;
use crate::models::order::{CreateOrderDTO, Order};
use crate::models::r::Response;
use crate::service::order_service;
use axum::extract::{State, Extension, Path, Query};
use axum::Json;
use axum::extract::ws::{WebSocketUpgrade, WebSocket, Message};
use axum::response::IntoResponse;
use futures::{StreamExt, SinkExt};
use serde::Deserialize;

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

// WebSocket: /api/payments/orders/:id/ws
pub async fn ws(Path(id): Path<String>, ws: WebSocketUpgrade) -> impl IntoResponse {
    ws.on_upgrade(move |socket| order_ws(socket, id))
}

async fn order_ws(mut socket: WebSocket, order_id: String) {
    // 订阅订单事件
    let mut rx = order_service::subscribe(&order_id);

    // 可选：读取客户端消息以保持连接活跃
    let (mut sender, mut receiver) = socket.split();
    // 后台任务：丢弃客户端来的消息
    tokio::spawn(async move {
        while let Some(_msg) = receiver.next().await {
            // 忽略客户端消息
        }
    });

    // 推送广播到客户端
    loop {
        match rx.recv().await {
            Ok(val) => {
                let text = val.to_string();
                if sender.send(Message::Text(text)).await.is_err() {
                    break;
                }
            }
            Err(_e) => break,
        }
    }
}

#[derive(Deserialize)]
pub struct PageParams {
    pub page: Option<i64>,
    pub size: Option<i64>,
}

// GET /api/orders/mine?page=&size=
pub async fn list_my(
    State(state): State<AppState>,
    Extension(user_id): Extension<String>,
    Query(p): Query<PageParams>,
) -> Json<Response<Vec<Order>>> {
    let page = p.page.unwrap_or(1);
    let size = p.size.unwrap_or(10);
    match order_service::list_my_orders(&state.db, &user_id, page, size).await {
        Ok(list) => Json(Response { success: true, data: Some(list), message: None, code: Some(200) }),
        Err(e) => Json(Response { success: false, data: None, message: Some(e.to_string()), code: Some(500) }),
    }
}
    }
}
