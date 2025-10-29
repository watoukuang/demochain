use axum::extract::{Query, State};
use axum::Json;
use crate::app::AppState;
use crate::models::term::{Term, PageTermDTO};
use crate::models::{PageVO, R};
use crate::service::term_service;

pub async fn page(
    State(state): State<AppState>,
    Query(p): Query<PageTermDTO>,
) -> Json<R<PageVO<Term>>> {
    let page = p.page.unwrap_or(1);
    let size = p.size.unwrap_or(12);
    
    match term_service::page(&state.db, page, size, p.category, p.search).await {
        Ok(paged) => Json(R { 
            success: true, 
            data: Some(paged), 
            message: None, 
            code: Some(200) 
        }),
        Err(e) => Json(R { 
            success: false, 
            data: None, 
            message: Some(e.to_string()), 
            code: Some(500) 
        }),
    }
}