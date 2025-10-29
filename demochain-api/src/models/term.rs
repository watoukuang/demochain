use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Deserialize)]
pub struct PageTermDTO {
    pub page: Option<i64>,
    pub size: Option<i64>,
    pub category: Option<String>,
    pub search: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Term {
    pub id: i64,
    pub term: String,
    pub definition: String,
    pub category: String,
    pub related_terms: Vec<String>,
    pub popularity: i32,
    pub created: DateTime<Utc>,
    pub updated: DateTime<Utc>,
}
