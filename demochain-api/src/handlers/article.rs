use axum::extract::{Query, State};
use axum::Json;
use crate::app::AppState;
use crate::models::article::{Article, PageArticleDTO};
use crate::models::order::PageResult;
use crate::models::r::Response;
use crate::service::article_service;

pub async fn page(
    State(state): State<AppState>,
    Query(p): Query<PageArticleDTO>,
) -> Json<Response<PageResult<Article>>> {
    let page = p.page.unwrap_or(1);
    let size = p.size.unwrap_or(10);
    match article_service::page(&state.db, page, size).await {
        Ok(paged) => Json(Response { success: true, data: Some(paged), message: None, code: Some(200) }),
        Err(e) => Json(Response { success: false, data: None, message: Some(e.to_string()), code: Some(500) }),
    }
}