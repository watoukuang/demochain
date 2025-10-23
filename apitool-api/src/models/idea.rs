use serde::{Deserialize, Serialize};
use sqlx::FromRow;

/// Represents an idea
#[derive(Debug, Serialize, Deserialize, Clone, FromRow)]
pub struct Idea {
    pub id: i64,
    pub title: String,
    pub description: String,
    pub icon_hash: String,
    pub icon_uri: String,
    pub tags: Option<String>,
    pub chain: Option<String>,
    pub deployer: Option<String>,
    pub created: Option<String>,
    pub cf_mode: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct LaunchRequest {
    pub title: String,
    pub description: String,
    #[serde(rename = "iconHash")]
    pub icon_hash: String,
    pub tags: Option<Vec<String>>,
    pub timestamp: i64,
    #[serde(rename = "cfMode")]
    pub cf_mode: Option<String>,
    pub chain: Option<String>,
    pub deployer: Option<String>,
}
