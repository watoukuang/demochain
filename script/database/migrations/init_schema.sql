-- 创建用户表
CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY NOT NULL,
    email TEXT UNIQUE NOT NULL,
    username TEXT,
    password TEXT NOT NULL,
    created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE t_order (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    plan TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL,           -- e.g. "USDT"
    network TEXT NOT NULL,
    state TEXT NOT NULL,              -- created | paid | confirmed | expired | cancelled
    qr_code TEXT NOT NULL,
    deep_link TEXT NOT NULL,
    payment_address TEXT NOT NULL,
    payment_amount REAL NOT NULL,
    created TEXT NOT NULL,            -- stored as ISO8601 datetime string
    expires TEXT NOT NULL,            -- stored as ISO8601 datetime string
    tx_hash TEXT,                     -- optional
    paid TEXT,                        -- optional datetime
    confirmations INTEGER,            -- optional number of confirmations
    confirmed TEXT                    -- optional datetime
);
