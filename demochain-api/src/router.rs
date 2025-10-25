use crate::app::AppState;
use crate::service::{health, idea};
use axum::routing::{get, post};
use axum::Router;


pub fn build_router() -> Router<AppState> {
    Router::new()
        .merge(health_router())
        .merge(ideas_router())
}

fn health_router() -> Router<AppState> {
    Router::new().route("/health", get(health::health))
}

fn ideas_router() -> Router<AppState> {
    Router::new()
        .route("/api/idea/page", get(idea::page_ideas))
        .route("/api/idea/:id", get(idea::get_idea_by_id))
        .route("/api/idea/launch", post(idea::launch))
}

