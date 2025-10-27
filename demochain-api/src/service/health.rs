use axum::Json;
use crate::models::r::Response;

pub async fn health() -> Json<Response<&'static str>> {
    Json(Response { success: true, data: Some("ok"), message: None })
}
