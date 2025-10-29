use sqlx::PgPool;
use crate::models::article::Article;
use crate::models::order::PageResult;
use chrono::{DateTime, Utc};

pub async fn page(db: &PgPool, page: i64, size: i64) -> Result<PageResult<Article>, sqlx::Error> {
    let offset = (page - 1) * size;
    
    // 模拟数据 - 实际项目中应该从数据库查询
    let mock_articles = vec![
        Article {
            id: "1".to_string(),
            title: "区块链技术入门指南：从比特币到以太坊".to_string(),
            excerpt: "区块链技术是近年来最热门的技术之一。本文将从比特币的诞生讲起，逐步介绍区块链的基本概念、工作原理以及以太坊等主流区块链平台的特性。".to_string(),
            content: "详细的区块链技术介绍内容...".to_string(),
            tags: vec!["tech".to_string(), "tutorial".to_string()],
            slug: "blockchain-basics-guide".to_string(),
            views: 1234,
            created: Utc::now(),
        },
        Article {
            id: "2".to_string(),
            title: "智能合约开发实战：使用Solidity构建DApp".to_string(),
            excerpt: "智能合约是以太坊生态的核心功能之一。本教程将手把手教你使用Solidity语言编写智能合约，并部署到测试网络上。".to_string(),
            content: "智能合约开发详细教程...".to_string(),
            tags: vec!["tutorial".to_string()],
            slug: "solidity-smart-contract-tutorial".to_string(),
            views: 856,
            created: Utc::now(),
        },
        Article {
            id: "3".to_string(),
            title: "DeFi协议深度解析：流动性挖矿机制详解".to_string(),
            excerpt: "去中心化金融（DeFi）正在改变传统金融的运作方式。本文深入剖析流动性挖矿、收益农场等DeFi核心机制的工作原理。".to_string(),
            content: "DeFi协议详细分析...".to_string(),
            tags: vec!["tech".to_string()],
            slug: "defi-liquidity-mining-analysis".to_string(),
            views: 2156,
            created: Utc::now(),
        },
        Article {
            id: "4".to_string(),
            title: "区块链安全指南：保护你的数字资产".to_string(),
            excerpt: "随着区块链技术的普及，安全问题变得越来越重要。本文汇总了常见的区块链安全威胁和防护措施，帮助用户更好地保护数字资产。".to_string(),
            content: "区块链安全防护指南...".to_string(),
            tags: vec!["tech".to_string(), "news".to_string()],
            slug: "blockchain-security-guide".to_string(),
            views: 3421,
            created: Utc::now(),
        },
        Article {
            id: "5".to_string(),
            title: "Layer 2 扩容方案对比：Optimism vs Arbitrum".to_string(),
            excerpt: "以太坊网络拥堵和高额gas费用一直是用户痛点。Layer 2解决方案应运而生，本文对比分析Optimism和Arbitrum两种主流扩容方案。".to_string(),
            content: "Layer 2扩容方案对比分析...".to_string(),
            tags: vec!["tech".to_string()],
            slug: "layer2-optimism-arbitrum-comparison".to_string(),
            views: 1897,
            created: Utc::now(),
        },
        Article {
            id: "6".to_string(),
            title: "NFT市场趋势分析：2024年值得关注的领域".to_string(),
            excerpt: "NFT市场在经历过2021年的狂热后逐渐趋于理性。本文分析当前NFT市场的趋势，探讨GameFi、社交NFT等新兴领域的发展潜力。".to_string(),
            content: "NFT市场趋势详细分析...".to_string(),
            tags: vec!["news".to_string()],
            slug: "nft-market-trends-2024".to_string(),
            views: 2734,
            created: Utc::now(),
        },
    ];

    let total = mock_articles.len() as i64;
    let start = offset as usize;
    let end = std::cmp::min(start + size as usize, mock_articles.len());
    
    let items = if start < mock_articles.len() {
        mock_articles[start..end].to_vec()
    } else {
        vec![]
    };

    Ok(PageResult {
        items,
        total,
        page,
        size,
    })
}