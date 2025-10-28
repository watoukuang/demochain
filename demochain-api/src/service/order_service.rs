use crate::models::order::{Order, OrderDTO, PageResult};
use crate::utils::jwt_util;
use anyhow::Context;
use chrono::{NaiveDateTime, Utc};
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
) -> anyhow::Result<PageResult<Order>> {
    let limit = if size <= 0 { 10 } else { size };
    let page = if page <= 0 { 1 } else { page };
    let offset = (page - 1) * limit;
    let user_id = match jwt_util::get_user_id() {
        Some(uid) => uid,
        None => return Ok(PageResult { items: vec![], total: 0, page, size: limit }),
    };
    // 查询总数
    let total_row = sqlx::query!(
        r#"
        SELECT COUNT(1) as "count!: i64" FROM t_order WHERE user_id = ?1
        "#,
        user_id
    )
        .fetch_one(pool)
        .await
        .with_context(|| "查询订单总数失败")?;

    let rows = sqlx::query!(
        r#"
        SELECT 
            id as "id!: i64",
            user_id,
            plan_type,
            amount,
            currency,
            network,
            state,
            address,
            sender_address,
            tx,
            created as "created: NaiveDateTime",
            updated as "updated: NaiveDateTime"
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
        let order = Order {
            id: r.id.to_string(),
            user_id: r.user_id,
            plan_type: r.plan_type,
            amount: r.amount,
            currency: r.currency,
            network: r.network,
            state: r.state,
            address: r.address,
            sender_address: r.sender_address,
            tx: r.tx,
            created: r.created.and_utc(),
            updated: r.updated.and_utc(),
        };
        out.push(order);
    }

    Ok(PageResult { items: out, total: total_row.count, page, size: limit })
}

pub async fn add(
    pool: &SqlitePool,
    payload: OrderDTO,
) -> anyhow::Result<String> {
    // 1. 计算订单金额
    let amount = price_for_plan(&payload.plan_type).context("不支持的套餐")?;
    // 2. 固定收款地址（你可以改成动态分配逻辑）
    let address = "0x909b17701d00c156b630C92497fdc1f1ae39fED4";
    // 3. 获取当前登录用户
    let user_id = jwt_util::get_user_id().ok_or_else(|| anyhow::anyhow!("用户未登录"))?;
    // 4. 生成时间（使用 NaiveDateTime，便于与 SQLite datetime 字段匹配）
    let now = Utc::now().naive_utc();

    // 5. 插入订单记录
    sqlx::query!(
        r#"
        INSERT INTO t_order (
            user_id,
            plan_type,
            amount,
            currency,
            network,
            state,
            address,
            sender_address,
            tx,
            created,
            updated
        )
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, NULL, NULL, ?8, ?9)
        "#,
        user_id,
        payload.plan_type,
        amount,
        "USDT",
        payload.network,
        "created",
        address,
        now,
        now
    ).execute(pool).await.context("插入订单失败")?;
    // 6. 返回收款地址（与 handler 的 Response<String> 对齐）
    Ok(address.to_string())
}