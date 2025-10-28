-- 创建用户表
CREATE TABLE IF NOT EXISTS t_user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,             -- 自增主键
    email TEXT UNIQUE NOT NULL,                       -- 邮箱唯一
    username TEXT,                                    -- 可选用户名
    password TEXT NOT NULL,                           -- 密码哈希
    created DATETIME NOT NULL DEFAULT (datetime('now')),  -- 创建时间
    updated DATETIME NOT NULL DEFAULT (datetime('now'))   -- 更新时间
);


CREATE TABLE t_order (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    plan TEXT NOT NULL,t_ss
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
