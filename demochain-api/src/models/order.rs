use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Deserialize)]
pub struct OrderDTO {
    pub plan_type: String,              // "monthly" | "yearly" | "lifetime"
    pub network: String,    // "usdt_trc20" | "usdt_erc20" | "usdt_bep20"
}

#[derive(Deserialize)]
pub struct PageOrderDTO {
    pub page: Option<i64>,
    pub size: Option<i64>,
}


#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct OrderVO {
    pub id: String,
    pub user_id: String,
    pub plan_type: String,
    pub amount: f64,
    pub currency: String, // USDT
    pub network: String,
    pub state: String, // created | paid | confirmed | expired | cancelled
    pub address: String,
    pub sender_address: Option<String>,
    pub tx: Option<String>,
    pub created: DateTime<Utc>,
    pub updated: DateTime<Utc>,
}