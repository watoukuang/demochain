use axum::{routing::{get, post}, Router};
use crate::app::AppState;
use crate::service::{health, idea};
use crate::handlers;
use tower_http::cors::{Any, CorsLayer};

// 配置 Axum 中间件（对任意状态类型的 Router 生效）
pub fn configure_router<S>(router: Router<S>) -> Router<S>
where
    S: Clone + Send + Sync + 'static,
{
    router.layer(CorsLayer::new().allow_origin(Any).allow_methods(Any).allow_headers(Any))
}

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

// fn auth_router() -> Router<AppState> {
//     Router::new().route("/api/auth/register", post(handlers::register))

// .route("/api/auth/login", post(handlers::login))
// .route("/api/auth/logout", post(handlers::logout))
// .route("/api/auth/me", get(handlers::me))
// .route("/api/auth/refresh", post(handlers::refresh_token))
// .route("/api/auth/change-password", post(handlers::change_password))
// }

