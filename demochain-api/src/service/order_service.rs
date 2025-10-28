use crate::models::order::{CreateOrderDTO, Order};
use crate::utils::jwt_util;
use anyhow::Context;
use chrono::{DateTime, Duration, NaiveDateTime, Utc};
use sqlx::SqlitePool;

fn price_for_plan(plan: &str) -> Option<f64> {
    match plan {
        "monthly" => Some(3.0),
        "yearly" => Some(10.0),
        "lifetime" => Some(15.0),
        _ => None,
    }
}
pub async fn page(
    pool: &SqlitePool,
    page: i64,
    size: i64,
) -> anyhow::Result<Vec<Order>> {
    let limit = if size <= 0 { 10 } else { size };
    let page = if page <= 0 { 1 } else { page };
    let offset = (page - 1) * limit;
    let user_id = match jwt_util::get_user_id() {
        Some(uid) => uid,
        None => return Ok(Vec::new()),
    };
    let rows = sqlx::query!(
        r#"
        SELECT 
            id as "id!: i64",
            user_id,
            plan,
            amount,
            currency,
            network,
            state,
            qr_code,
            deep_link,
            payment_address,
            payment_amount,
            created as "created: NaiveDateTime",
            updated as "updated: NaiveDateTime",
            tx_hash,
            paid as "paid?: NaiveDateTime",
            confirmations,
            confirmed as "confirmed?: NaiveDateTime"
        FROM t_order
        WHERE user_id = ?1
        ORDER BY created DESC
        LIMIT ?2 OFFSET ?3
        "#,
        user_id,
        limit,
        offset
    )
        .fetch_all(pool)
        .await
        .with_context(|| "查询订单失败")?;

    let mut out = Vec::with_capacity(rows.len());
    for r in rows {
        let paid_dt = r.paid.map(|dt| dt.and_utc());
        let confirmed_dt = r.confirmed.map(|dt| dt.and_utc());

        let order = Order {
            id: r.id.to_string(),
            user_id: r.user_id,
            plan: r.plan,
            amount: r.amount,
            currency: r.currency,
            network: r.network,
            state: r.state,
            qr_code: r.qr_code,
            deep_link: r.deep_link,
            payment_address: r.payment_address,
            payment_amount: r.payment_amount,
            created: r.created.and_utc(),
            expires: r.updated.and_utc(),
            tx_hash: r.tx_hash,
            paid: paid_dt,
            confirmations: r.confirmations.map(|v| v as u32),
            confirmed: confirmed_dt,
        };
        out.push(order);
    }

    Ok(out)
}

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
        "<svg width='200' height='200' xmlns='http://www.w3.org/2000/svg'>
            <rect width='200' height='200' fill='white'/>
            <text x='100' y='100' text-anchor='middle' font-size='12' fill='black'>{}</text>
        </svg>",
        data
    );
    format!("data:image/svg+xml;charset=utf-8,{}", svg.replace("#", "%23").replace(" ", "%20"))
}

fn generate_deeplink(address: &str, amount: f64, method: &str) -> String {
    match method {
        "usdt_trc20" => format!(
            "tronlink://transfer?to={}&amount={}&token=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
            address, amount
        ),
        "usdt_erc20" => format!(
            "ethereum:{}@1?value={}&token=0xdAC17F958D2ee523a2206206994597C13D831ec7",
            address,
            (amount * 1e6_f64) as u64
        ),
        "usdt_bep20" => format!(
            "bnb:{}?amount={}&token=0x55d398326f99059fF775485246999027B3197955",
            address, amount
        ),
        _ => String::new(),
    }
}

pub async fn create(
    pool: &SqlitePool,
    payload: CreateOrderDTO,
) -> anyhow::Result<Order> {
    let amount = price_for_plan(&payload.plan).context("不支持的套餐")?;
    let addr = address_for_method(&payload.network).context("不支持的支付方式")?;
    let user_id = jwt_util::get_user_id().ok_or_else(|| anyhow::anyhow!("用户未登录"))?;
    // 生成时间等
    let now = Utc::now();
    let qr_code = generate_qr(addr, amount, &payload.network);
    let deep_link = generate_deeplink(addr, amount, &payload.network);
    let created = now.to_rfc3339();
    let expires = (now + Duration::minutes(30)).to_rfc3339();

    // 插入订单到数据库
    sqlx::query!(
            r#"
            INSERT INTO t_order (
                user_id, plan, amount, currency, network, state,
                qr_code, deep_link, payment_address, payment_amount,
                updated
            )
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)
            "#,
            user_id,
            payload.plan,
            amount,
            "USDT",
            payload.network,
            "created",
            qr_code,
            deep_link,
            addr,
            amount,
            expires
        )
        .execute(pool)
        .await
        .with_context(|| "插入订单失败")?;

    // 获取自增ID
    let row = sqlx::query!("SELECT last_insert_rowid() as \"id: i64\"").fetch_one(pool).await?;
    let new_id: i64 = row.id;
    let id = new_id.to_string();

    // 构造返回对象
    let order = Order {
        id,
        user_id: user_id.to_string(),
        plan: payload.plan,
        amount,
        currency: "USDT".into(),
        network: payload.network,
        state: "created".into(),
        qr_code,
        deep_link,
        payment_address: addr.into(),
        payment_amount: amount,
        created: now,
        expires: now + Duration::minutes(30),
        tx_hash: None,
        paid: None,
        confirmations: None,
        confirmed: None,
    };

    Ok(order)
}