use sqlx::SqlitePool;
use crate::models::{PageVO, term::Term};
use sqlx::Row;

pub async fn page(
    db: &SqlitePool,
    page: i64,
    size: i64,
    category: Option<String>,
    search: Option<String>,
) -> Result<PageVO<Term>, sqlx::Error> {
    let offset = (page - 1) * size;

    // 构建查询条件
    let mut where_clause = String::new();
    let mut params: Vec<String> = Vec::new();

    // 直接按编码过滤
    if let Some(cat) = &category {
        if !cat.is_empty() {
            where_clause.push_str(" WHERE category = ?");
            params.push(cat.clone());
        }
    }

    if let Some(search_term) = &search {
        if !search_term.is_empty() {
            if where_clause.is_empty() {
                where_clause.push_str(" WHERE ");
            } else {
                where_clause.push_str(" AND ");
            }
            where_clause.push_str("(term LIKE ? OR definition LIKE ?)");
            let search_pattern = format!("%{}%", search_term);
            params.push(search_pattern.clone());
            params.push(search_pattern);
        }
    }

    // 查询总数
    let count_sql = format!("SELECT COUNT(*) as count FROM t_term{}", where_clause);
    let mut count_query = sqlx::query(&count_sql);
    for param in &params {
        count_query = count_query.bind(param);
    }
    let count_row = count_query.fetch_one(db).await?;
    let total: i64 = count_row.get("count");

    // 查询数据
    let data_sql = format!(
        "SELECT id, term, definition, category, related_terms, popularity, created, updated FROM t_term{} ORDER BY popularity DESC, id DESC LIMIT ? OFFSET ?",
        where_clause
    );
    let mut data_query = sqlx::query(&data_sql);
    for param in &params {
        data_query = data_query.bind(param);
    }
    data_query = data_query.bind(size).bind(offset);

    let rows = data_query.fetch_all(db).await?;

    let items: Vec<Term> = rows
        .into_iter()
        .map(|row| {
            let related_terms_str: String = row.get("related_terms");
            let related_terms: Vec<String> = if related_terms_str.is_empty() {
                Vec::new()
            } else {
                related_terms_str.split(',').map(|s| s.trim().to_string()).collect()
            };

            Term {
                id: row.get("id"),
                term: row.get("term"),
                definition: row.get("definition"),
                category: row.get("category"),
                related_terms,
                popularity: row.get("popularity"),
                created: row.get("created"),
                updated: row.get("updated"),
            }
        })
        .collect();

    Ok(PageVO {
        items,
        total,
        page,
        size,
    })
}