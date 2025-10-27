use crate::app::AppState;
use crate::models::order::{CreateOrderDTO, CreatePaymentRequest, CreatePaymentResponse, OrderVO, PaymentOrder};
use crate::models::r::Response;
use crate::service::order_service;
use axum::extract::State;
use axum::{extract::Path, Json};
use chrono::Utc;
use once_cell::sync::Lazy;
use std::collections::HashMap;
use std::sync::RwLock;

static ORDERS: Lazy<RwLock<HashMap<String, PaymentOrder>>> = Lazy::new(|| RwLock::new(HashMap::new()));


// 简单地址映射
fn address_for_method(method: &str) -> Option<&'static str> {
    match method {
        "usdt_trc20" => Some("TL1a2b3c4d5e6f7g8h9i0j"),
        "usdt_erc20" => Some("0x1111111111111111111111111111111111111111"),
        "usdt_bep20" => Some("0x2222222222222222222222222222222222222222"),
        _ => None,
    }
}

fn generate_qr(address: &str, amount: f64, method: &str) -> String {
    let data = format!("{}:{}?amount={}", method, address, amount);
    let svg = format!(
        "<svg width='200' height='200' xmlns='http://www.w3.org/2000/svg'>\n<rect width='200' height='200' fill='white'/>\n<text x='100' y='100' text-anchor='middle' font-size='12' fill='black'>{}</text>\n</svg>",
        data
    );
    format!("data:image/svg+xml;base64,{}", base64ct::Base64::encode_string(svg.as_bytes()))
}

fn generate_deeplink(address: &str, amount: f64, method: &str) -> String {
    match method {
        "usdt_trc20" => format!("tronlink://transfer?to={}&amount={}&token=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", address, amount),
        "usdt_erc20" => format!("ethereum:{}@1?value={}&token=0xdAC17F958D2ee523a2206206994597C13D831ec7", address, (amount * 1e6_f64) as u64),
        "usdt_bep20" => format!("bnb:{}?amount={}&token=0x55d398326f99059fF775485246999027B3197955", address, amount),
        _ => String::new(),
    }
}

pub async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateOrderDTO>,
) -> Json<Response<OrderVO>> {
    match order_service::create(&state.db, payload).await {
        Ok(order_vo) => Json(Response {
            success: true,
            data: Some(order_vo),
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

pub async fn get_order(Path(id): Path<String>) -> Json<Response<PaymentOrder>> {
    let mut maybe = {
        let map = ORDERS.read().unwrap();
        map.get(&id).cloned()
    };

    // 简单自动确认逻辑：创建10秒后视为确认
    if let Some(mut ord) = maybe.clone() {
        if ord.status == "created" {
            let since = Utc::now() - ord.created_at;
            if since.num_seconds() >= 10 {
                ord.status = "confirmed".into();
                ord.confirmed_at = Some(Utc::now());
                ord.confirmations = Some(1);
                let mut map = ORDERS.write().unwrap();
                map.insert(id.clone(), ord.clone());
                maybe = Some(ord);
            }
        }
    }

    match maybe {
        Some(order) => Json(Response { success: true, data: Some(order), message: None, code: Some(200) }),
        None => Json(Response { success: false, data: None, message: Some("订单不存在".into()), code: Some(404) }),
    }
}
