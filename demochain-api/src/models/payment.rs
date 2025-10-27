use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Deserialize)]
pub struct CreatePaymentRequest {
    pub plan: String,              // "monthly" | "yearly" | "lifetime"
    pub payment_method: String,    // "usdt_trc20" | "usdt_erc20" | "usdt_bep20"
}

#[derive(Debug, Serialize)]
pub struct CreatePaymentResponse {
    pub order: PaymentOrder,
    pub qr_code: String,
    pub deep_link: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PaymentOrder {
    pub id: String,
    pub user_id: String,
    pub plan: String,
    pub amount: f64,
    pub currency: String, // USDT
    pub payment_method: String,
    pub status: String, // created | paid | confirmed | expired | cancelled
    pub payment_address: String,
    pub payment_amount: f64,
    pub created_at: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
    pub tx_hash: Option<String>,
    pub paid_at: Option<DateTime<Utc>>,
    pub confirmations: Option<u32>,
    pub confirmed_at: Option<DateTime<Utc>>,
}
