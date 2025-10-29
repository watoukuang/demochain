use sqlx::SqlitePool;
use crate::models::article::Article;
use crate::models::PageVO;
use chrono::NaiveDateTime;

pub async fn page(db: &SqlitePool, page: i64, size: i64) -> Result<PageVO<Article>, sqlx::Error> {
    let limit = if size <= 0 { 10 } else { size };
    let page = if page <= 0 { 1 } else { page };
    let offset = (page - 1) * limit;

    // 查询总数
    let total_row = sqlx::query!(
        r#"
        SELECT COUNT(1) as "count!: i64" FROM t_article
        "#
    ).fetch_one(db).await?;

    // 查询文章列表
    let rows = sqlx::query!(
        r#"
        SELECT 
            id as "id!: i64",
            title,
            excerpt,
            content,
            tags,
            views,
            created as "created: NaiveDateTime"
        FROM t_article
        ORDER BY created DESC
        LIMIT ?1 OFFSET ?2
        "#,
        limit,
        offset
    ).fetch_all(db).await?;

    let mut articles = Vec::with_capacity(rows.len());
    for row in rows {
        // 解析 JSON 格式的 tags
        let tags: Vec<String> = match row.tags {
            Some(tags_json) => {
                serde_json::from_str(&tags_json).unwrap_or_else(|_| vec![])
            }
            None => vec![]
        };

        let article = Article {
            id: row.id.to_string(),
            title: row.title,
            excerpt: row.excerpt.unwrap_or_default(),
            content: row.content.unwrap_or_default(),
            tags,
            views: row.views.unwrap_or(0) as i32,
            created: row.created.and_utc(),
        };
        articles.push(article);
    }

    Ok(PageVO {
        items: articles,
        total: total_row.count,
        page,
        size: limit,
    })
}

pub async fn get_by_id(db: &SqlitePool, id: &str) -> Result<Option<Article>, sqlx::Error> {
    let id_num: i64 = match id.parse() {
        Ok(num) => num,
        Err(_) => return Ok(None),
    };

    let row = sqlx::query!(
        r#"
        SELECT 
            id as "id!: i64",
            title,
            excerpt,
            content,
            tags,
            views,
            created as "created: NaiveDateTime"
        FROM t_article
        WHERE id = ?1
        "#,
        id_num
    ).fetch_optional(db).await?;

    match row {
        Some(row) => {
            let tags: Vec<String> = match row.tags {
                Some(tags_json) => {
                    serde_json::from_str(&tags_json).unwrap_or_else(|_| vec![])
                }
                None => vec![]
            };

            let article = Article {
                id: row.id.to_string(),
                title: row.title,
                excerpt: row.excerpt.unwrap_or_default(),
                content: row.content.unwrap_or_default(),
                tags,
                views: row.views.unwrap_or(0) as i32,
                created: row.created.and_utc(),
            };
            Ok(Some(article))
        }
        None => Ok(None),
    }
}