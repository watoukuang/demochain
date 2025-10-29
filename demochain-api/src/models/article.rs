use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct PageArticleDTO {
    pub page: Option<i64>,
    pub size: Option<i64>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Article {
    pub id: String,
    pub title: String,
    pub excerpt: String,
    pub content: String,
    pub tags: Vec<String>,
    pub views: i32,
    pub created: DateTime<Utc>,
}