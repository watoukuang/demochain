use crate::app::AppState;
use crate::handlers;
use crate::service::{health, idea};
use axum::{routing::{get, post}, Router};
use axum::http::{HeaderValue, Method};
use tower_http::cors::{AllowOrigin, AllowMethods, CorsLayer};

// 配置 Axum 中间件（对任意状态类型的 Router 生效）
pub fn configure_router<S>(router: Router<S>) -> Router<S>
where
    S: Clone + Send + Sync + 'static,
{
    // When using credentials on the client, Access-Control-Allow-Origin cannot be '*'.
    // Allow specific dev origins and enable credentials.
    let origins = [
        HeaderValue::from_static("http://localhost:3000"),
        HeaderValue::from_static("http://127.0.0.1:3000"),
    ];

    router.layer(
        CorsLayer::new()
            .allow_origin(AllowOrigin::list(origins))
            .allow_methods(AllowMethods::list(vec![
                Method::GET,
                Method::POST,
                Method::PUT,
                Method::DELETE,
                Method::OPTIONS,
                Method::PATCH,
                Method::HEAD,
            ]))
            .allow_headers(vec![
                axum::http::header::AUTHORIZATION,
                axum::http::header::ACCEPT,
                axum::http::header::CONTENT_TYPE,
                axum::http::header::HeaderName::from_static("x-api-key"),
            ])
            .allow_credentials(true),
    )
}

pub fn build_router() -> Router<AppState> {
    Router::new()
        .merge(health_router())
        .merge(ideas_router())
        .merge(auth_router())
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

fn auth_router() -> Router<AppState> {
    Router::new()
        .route("/api/auth/register", post(handlers::user::register))
        .route("/api/auth/login", post(handlers::user::login))
}