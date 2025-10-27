use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Deserialize)]
pub struct CreateOrderDTO {
    pub plan: String,              // "monthly" | "yearly" | "lifetime"
    pub network: String,    // "usdt_trc20" | "usdt_erc20" | "usdt_bep20"
}

// #[derive(Debug, Serialize)]
// pub struct CreatePaymentResponse {
//     pub order: PaymentOrder,
//     pub qr_code: String,
//     pub deep_link: String,
// }

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct OrderVO {
    pub id: String,
    pub user_id: String,
    pub plan: String,
    pub amount: f64,
    pub currency: String, // USDT
    pub payment_method: String,
    pub state: String, // created | paid | confirmed | expired | cancelled
    pub payment_address: String,
    pub payment_amount: f64,
    pub created: DateTime<Utc>,
    pub expires: DateTime<Utc>,
    pub tx_hash: Option<String>,
    pub paid_at: Option<DateTime<Utc>>,
    pub confirmations: Option<u32>,
    pub confirmed: Option<DateTime<Utc>>,
}
