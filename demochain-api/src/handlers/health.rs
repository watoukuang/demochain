use axum::Json;
use crate::models::R;

pub async fn health() -> Json<R<&'static str>> {
    Json(R { success: true, data: Some("ok"), message: None, code: Some(200) })
}
