use std::time::{SystemTime, UNIX_EPOCH};

#[allow(dead_code)]
pub fn now_secs() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64
}
