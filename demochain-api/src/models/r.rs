use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct Response<T> {
    pub success: bool,
    pub data: Option<T>,
    pub message: Option<String>,
}
