use axum::{extract::Path, Json};
use crate::models::r::Response;
use crate::models::payment::{CreatePaymentRequest, CreatePaymentResponse, PaymentOrder};
use chrono::{Duration, Utc};
use once_cell::sync::Lazy;
use std::collections::HashMap;
use std::sync::RwLock;
use uuid::Uuid;

static ORDERS: Lazy<RwLock<HashMap<String, PaymentOrder>>> = Lazy::new(|| RwLock::new(HashMap::new()));

// 简单价格表，与前端保持一致
fn price_for_plan(plan: &str) -> Option<f64> {
    match plan {
        "monthly" => Some(3.0),
        "yearly" => Some(10.0),
        "lifetime" => Some(15.0),
        _ => None,
    }
}

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

pub async fn create_order(Json(req): Json<CreatePaymentRequest>) -> Json<Response<CreatePaymentResponse>> {
    if req.plan == "free" {
        return Json(Response { success: false, data: None, message: Some("免费计划无需支付".into()), code: Some(400) });
    }
    let amount = match price_for_plan(&req.plan) {
        Some(p) => p,
        None => return Json(Response { success: false, data: None, message: Some("不支持的套餐".into()), code: Some(400) }),
    };
    let addr = match address_for_method(&req.payment_method) {
        Some(a) => a,
        None => return Json(Response { success: false, data: None, message: Some("不支持的支付方式".into()), code: Some(400) }),
    };

    let id = Uuid::new_v4().to_string();
    let now = Utc::now();
    let order = PaymentOrder {
        id: id.clone(),
        user_id: "current_user".into(),
        plan: req.plan.clone(),
        amount,
        currency: "USDT".into(),
        payment_method: req.payment_method.clone(),
        status: "created".into(),
        payment_address: addr.into(),
        payment_amount: amount,
        created_at: now,
        expires_at: now + Duration::minutes(30),
        tx_hash: None,
        paid_at: None,
        confirmations: None,
        confirmed_at: None,
    };

    let qr_code = generate_qr(addr, amount, &req.payment_method);
    let deep_link = generate_deeplink(addr, amount, &req.payment_method);

    {
        let mut map = ORDERS.write().unwrap();
        map.insert(id.clone(), order.clone());
    }

    Json(Response {
        success: true,
        data: Some(CreatePaymentResponse { order, qr_code, deep_link }),
        message: Some("订单创建成功".into()),
        code: Some(200),
    })
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
