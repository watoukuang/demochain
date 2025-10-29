use axum::extract::{Query, State, Path};
use axum::Json;
use crate::app::AppState;
use crate::models::article::{Article, PageArticleDTO};
use crate::models::{PageVO, R};
use crate::service::article_service;

pub async fn page(
    State(state): State<AppState>,
    Query(p): Query<PageArticleDTO>,
) -> Json<R<PageVO<Article>>> {
    let page = p.page.unwrap_or(1);
    let size = p.size.unwrap_or(10);
    match article_service::page(&state.db, page, size).await {
        Ok(paged) => Json(R { success: true, data: Some(paged), message: None, code: Some(200) }),
        Err(e) => Json(R { success: false, data: None, message: Some(e.to_string()), code: Some(500) }),
    }
}

pub async fn get_article(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Json<R<Article>> {
    match article_service::get_by_id(&state.db, &id).await {
        Ok(Some(article)) => Json(R { success: true, data: Some(article), message: None, code: Some(200) }),
        Ok(None) => Json(R { success: false, data: None, message: Some("文章不存在".to_string()), code: Some(404) }),
        Err(e) => Json(R { success: false, data: None, message: Some(e.to_string()), code: Some(500) }),
    }
}