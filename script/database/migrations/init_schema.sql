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
     plan_type TEXT NOT NULL,
     amount REAL NOT NULL,
     currency TEXT NOT NULL,                              -- e.g. "USDT"
     network TEXT NOT NULL,
     state TEXT NOT NULL,                                 -- created | paid | confirmed | expired | cancelled
     address TEXT NOT NULL,
     sender_address TEXT,
     tx TEXT,
     created DATETIME NOT NULL DEFAULT (datetime('now')), -- 创建时间（自动）
     updated DATETIME NOT NULL DEFAULT (datetime('now')), -- 更新时间（自动）
);


CREATE TABLE t_article (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      excerpt TEXT,
      content TEXT,
      tags TEXT,               -- 存 JSON 数组，例如 '["tutorial"]'
      views INTEGER DEFAULT 0,
      created DATETIME NOT NULL DEFAULT (datetime('now')), -- 创建时间（自动）
);

CREATE TABLE t_term (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,  -- 主键，自增
                        term TEXT NOT NULL,                    -- 术语
                        definition TEXT NOT NULL,              -- 定义
                        category TEXT NOT NULL,                -- 分类
                        related_terms TEXT,                    -- 相关术语（JSON字符串存储 Vec<String>）
                        popularity INTEGER DEFAULT 0,          -- 热度或流行度
                        created DATETIME NOT NULL DEFAULT (datetime('now')), -- 创建时间（自动）
                        updated DATETIME NOT NULL DEFAULT (datetime('now')), -- 创建时间（自动）
);

