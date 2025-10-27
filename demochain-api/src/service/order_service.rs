use crate::models::user::{AuthResponse, RegisterRequest};
use sqlx::SqlitePool;

pub async fn create(
    pool: &SqlitePool,
    req: RegisterRequest,
) -> anyhow::Result<AuthResponse> {

}
