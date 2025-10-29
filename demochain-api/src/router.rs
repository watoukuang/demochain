use crate::app::AppState;
use crate::handlers;
use axum::{routing::{get, post}, Router};
use axum::http::{HeaderValue, Method};
use tower_http::cors::{AllowMethods, AllowOrigin, CorsLayer};
use crate::handlers::health;

// 配置 Axum 中间件（对任意状态类型的 Router 生效）
pub fn configure_router<S>(router: Router<S>) -> Router<S>
where
    S: Clone + Send + Sync + 'static,
{
    // When using credentials on the client, access-Control-Allow-Origin cannot be '*'.
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
        .merge(auth_router())
        .merge(order_router())
        .merge(article_router())
}

fn health_router() -> Router<AppState> {
    Router::new().route("/health", get(health::health))
}
fn auth_router() -> Router<AppState> {
    Router::new()
        .route("/api/auth/register", post(handlers::user::register))
        .route("/api/auth/login", post(handlers::user::login))
}

fn order_router() -> Router<AppState> {
    Router::new()
        .route("/api/order/add", post(handlers::order::add))
        .route("/api/order/page", get(handlers::order::page))
}

fn article_router() -> Router<AppState> {
    Router::new()
        .route("/api/article/page", get(handlers::article::page))
        .route("/api/article/:id", get(handlers::article::get_article))
}