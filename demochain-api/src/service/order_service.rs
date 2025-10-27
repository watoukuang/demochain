use crate::models::order::{CreateOrderDTO, CreatePaymentResponse, OrderVO, PaymentOrder};
use crate::models::r::Response;
use axum::Json;
use chrono::{Duration, Utc};
use sqlx::SqlitePool;
use uuid::Uuid;

fn price_for_plan(plan: &str) -> Option<f64> {
    match plan {
        "monthly" => Some(3.0),
        "yearly" => Some(10.0),
        "lifetime" => Some(15.0),
        _ => None,
    }
}

fn address_for_method(method: &str) -> Option<&'static str> {
    match method {
        "usdt_trc20" => Some("TL1a2b3c4d5e6f7g8h9i0j"),
        "usdt_erc20" => Some("0x1111111111111111111111111111111111111111"),
        "usdt_bep20" => Some("0x2222222222222222222222222222222222222222"),
        _ => None,
    }
}
pub async fn create(
    pool: &SqlitePool,
    payload: CreateOrderDTO,
) -> anyhow::Result<Response<OrderVO>> {
    let amount = match price_for_plan(&payload.plan) {
        Some(p) => p,
        None => return Json(Response { success: false, data: None, message: Some("不支持的套餐".into()), code: Some(400) }),
    };
    let addr = match address_for_method(&payload.network) {
        Some(a) => a,
        None => return Json(Response { success: false, data: None, message: Some("不支持的支付方式".into()), code: Some(400) }),
    };

    let id = Uuid::new_v4().to_string();
    let now = Utc::now();
    let order = OrderVO {
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

    let qr_code = crate::handlers::order::generate_qr(addr, amount, &req.payment_method);
    let deep_link = crate::handlers::order::generate_deeplink(addr, amount, &req.payment_method);

    {
        let mut map = crate::handlers::order::ORDERS.write().unwrap();
        map.insert(id.clone(), order.clone());
    }

    Json(Response {
        success: true,
        data: Some(CreatePaymentResponse { order, qr_code, deep_link }),
        message: Some("订单创建成功".into()),
        code: Some(200),
    })
}
