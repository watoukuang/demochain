use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Json,
};
use serde::Deserialize;

use crate::app::AppState;
use crate::models::{Idea, LaunchRequest};
use crate::models::r::Response;

#[derive(Deserialize)]
pub struct IdeaQuery {
    pub category: Option<String>,
    pub chain: Option<String>,
    pub idea_type: Option<String>,
    pub page: Option<u32>,
    pub limit: Option<u32>,
}

pub async fn page_ideas(
    State(state): State<AppState>,
    Query(params): Query<IdeaQuery>,
) -> Result<Json<Response<Vec<Idea>>>, StatusCode> {
    let page = params.page.unwrap_or(1);
    let limit = params.limit.unwrap_or(20).min(100); // 最大100条
    let offset = (page - 1) * limit;

    // Build SQL strictly with current schema columns to avoid missing-column errors
    let base_sql = "SELECT \
            id, \
            title, \
            description, \
            icon_hash, \
            COALESCE(icon_uri, '') AS icon_uri, \
            tags, \
            chain, \
            deployer, \
            CAST(created AS TEXT) AS created, \
            cf_mode \
        FROM ideas WHERE 1=1";

    // Dynamic filters
    let mut qb = sqlx::QueryBuilder::new(base_sql);
    if let Some(chain) = &params.chain {
        qb.push(" AND chain = ");
        qb.push_bind(chain);
    }
    if let Some(category) = &params.category {
        // category 即 cf_code，映射到列 cf_mode 做等值匹配
        qb.push(" AND cf_mode = ");
        qb.push_bind(category);
    }
    // Order & pagination
    qb.push(" ORDER BY created DESC LIMIT ");
    qb.push_bind(limit as i64);
    qb.push(" OFFSET ");
    qb.push_bind(offset as i64);

    let query = qb.build_query_as::<Idea>();
    let ideas: Vec<Idea> = match query.fetch_all(&state.db).await {
        Ok(rows) => rows,
        Err(e) => {
            // Dev logging: print detailed sqlx error and filters
            eprintln!(
                "[page_ideas] query failed: chain={:?}, category={:?}, idea_type={:?}, page={:?}, limit={:?}, error={}",
                params.chain, params.category, params.idea_type, params.page, params.limit, e
            );
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    Ok(Json(Response {
        success: true,
        data: Some(ideas),
        message: None,
        code: Some(200),
    }))
}

#[inline]
fn tags_to_json(tags: &Option<Vec<String>>) -> Option<String> {
    tags.as_ref()
        .map(|t| serde_json::to_string(t).unwrap_or_else(|_| "[]".to_string()))
}

// removed unused helper build_icon_uri

pub async fn get_idea_by_id(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<Response<Idea>>, StatusCode> {
    let idea: Idea = sqlx::query_as::<_, Idea>(
        "SELECT \
            id, \
            title, \
            description, \
            icon_hash, \
            COALESCE(icon_uri, '') AS icon_uri, \
            tags, \
            chain, \
            deployer, \
            CAST(created AS TEXT) AS created, \
            cf_mode \
        FROM ideas WHERE id = ?1"
    )
        .bind(id)
        .fetch_one(&state.db)
        .await
        .map_err(|_| StatusCode::NOT_FOUND)?;

    Ok(Json(Response {
        success: true,
        data: Some(idea),
        message: None,
        code: Some(200),
    }))
}


pub async fn launch(
    State(state): State<AppState>,
    Json(req): Json<LaunchRequest>,
) -> Result<Json<Response<()>>, StatusCode> {
    let tags_json = tags_to_json(&req.tags);
    let icon_uri = "https://haveanidea.me/ipfs";
    sqlx::query(r#"
        INSERT INTO ideas (title, description, icon_hash, cf_mode, tags, created, chain, deployer, icon_uri)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)"#,
    )
        .bind(&req.title)
        .bind(&req.description)
        .bind(&req.icon_hash)
        .bind(&req.cf_mode)
        .bind(&tags_json)
        .bind(&req.timestamp)
        .bind(&req.chain)
        .bind(&req.deployer)
        .bind(&icon_uri)
        .execute(&state.db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(Response {
        success: true,
        data: None,
        message: Some("Idea submitted successfully".to_string()),
        code: Some(200),
    }))
}
