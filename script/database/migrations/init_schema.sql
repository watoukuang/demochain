-- 创建用户表
CREATE TABLE  t_user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,             -- 自增主键
    email TEXT UNIQUE NOT NULL,                       -- 邮箱唯一
    username TEXT,                                    -- 可选用户名
    password TEXT NOT NULL,                           -- 密码哈希
    created DATETIME NOT NULL DEFAULT (datetime('now')),  -- 创建时间
    updated DATETIME NOT NULL DEFAULT (datetime('now'))   -- 更新时间
);


CREATE TABLE t_order (
     id INTEGER PRIMARY KEY AUTOINCREMENT,                -- 自增主键
     user_id TEXT NOT NULL,
     plan TEXT NOT NULL,
     amount REAL NOT NULL,
     currency TEXT NOT NULL,                              -- e.g. "USDT"
     network TEXT NOT NULL,
     state TEXT NOT NULL,                                 -- created | paid | confirmed | expired | cancelled
     qr_code TEXT NOT NULL,
     deep_link TEXT NOT NULL,
     payment_address TEXT NOT NULL,
     payment_amount REAL NOT NULL,
     created DATETIME NOT NULL DEFAULT (datetime('now')), -- 创建时间（自动）
     updated DATETIME NOT NULL DEFAULT (datetime('now')), -- 更新时间（自动）
     tx_hash TEXT,                                        -- 可为空
     paid DATETIME,                                       -- 可为空
     confirmations INTEGER,                               -- 可为空
     confirmed DATETIME                                   -- 可为空
);


