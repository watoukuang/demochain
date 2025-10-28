import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import Link from 'next/link';

// 模拟文章数据类型
interface Article {
    id: string;
    title: string;
    excerpt: string;
    category: string | string[];
    slug: string;
    readTime: number;
    views: number;
    publishedAt: string;
}

// 模拟分类数据
const categories = [
    { id: 'tech', name: '技术' },
    { id: 'tutorial', name: '教程' },
    { id: 'news', name: '资讯' },
];

export default function ArticleIndex() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // 模拟数据加载
    useEffect(() => {
        const loadArticles = async () => {
            setLoading(true);
            // 这里可以添加实际的数据加载逻辑
            await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟延迟

            // 模拟文章数据
            const mockArticles: Article[] = [
                {
                    id: '1',
                    title: '区块链技术入门指南：从比特币到以太坊',
                    excerpt: '区块链技术是近年来最热门的技术之一。本文将从比特币的诞生讲起，逐步介绍区块链的基本概念、工作原理以及以太坊等主流区块链平台的特性。',
                    category: ['tech', 'tutorial'],
                    slug: 'blockchain-basics-guide',
                    readTime: 15,
                    views: 1234,
                    publishedAt: '2024-01-15T10:00:00Z'
                },
                {
                    id: '2',
                    title: '智能合约开发实战：使用Solidity构建DApp',
                    excerpt: '智能合约是以太坊生态的核心功能之一。本教程将手把手教你使用Solidity语言编写智能合约，并部署到测试网络上。',
                    category: 'tutorial',
                    slug: 'solidity-smart-contract-tutorial',
                    readTime: 25,
                    views: 856,
                    publishedAt: '2024-01-20T14:30:00Z'
                },
                {
                    id: '3',
                    title: 'DeFi协议深度解析：流动性挖矿机制详解',
                    excerpt: '去中心化金融（DeFi）正在改变传统金融的运作方式。本文深入剖析流动性挖矿、收益农场等DeFi核心机制的工作原理。',
                    category: 'tech',
                    slug: 'defi-liquidity-mining-analysis',
                    readTime: 20,
                    views: 2156,
                    publishedAt: '2024-01-25T09:15:00Z'
                },
                {
                    id: '4',
                    title: '区块链安全指南：保护你的数字资产',
                    excerpt: '随着区块链技术的普及，安全问题变得越来越重要。本文汇总了常见的区块链安全威胁和防护措施，帮助用户更好地保护数字资产。',
                    category: ['tech', 'news'],
                    slug: 'blockchain-security-guide',
                    readTime: 18,
                    views: 3421,
                    publishedAt: '2024-02-01T16:45:00Z'
                },
                {
                    id: '5',
                    title: 'Layer 2 扩容方案对比：Optimism vs Arbitrum',
                    excerpt: '以太坊网络拥堵和高额gas费用一直是用户痛点。Layer 2解决方案应运而生，本文对比分析Optimism和Arbitrum两种主流扩容方案。',
                    category: 'tech',
                    slug: 'layer2-optimism-arbitrum-comparison',
                    readTime: 22,
                    views: 1897,
                    publishedAt: '2024-02-05T11:20:00Z'
                },
                {
                    id: '6',
                    title: 'NFT市场趋势分析：2024年值得关注的领域',
                    excerpt: 'NFT市场在经历过2021年的狂热后逐渐趋于理性。本文分析当前NFT市场的趋势，探讨GameFi、社交NFT等新兴领域的发展潜力。',
                    category: 'news',
                    slug: 'nft-market-trends-2024',
                    readTime: 16,
                    views: 2734,
                    publishedAt: '2024-02-10T13:00:00Z'
                }
            ];

            setArticles(mockArticles);
            setLoading(false);
        };
        loadArticles();
    }, []);

    // 获取分类标签
    const getCategoryTags = (articleCategory: string | string[]) => {
        const categoryIds = Array.isArray(articleCategory) ? articleCategory : [articleCategory];
        return categoryIds.slice(0, 3).map(id =>
            categories.find(cat => cat.id === id)?.name || '技术'
        );
    };

    // 统计信息组件
    const StatItem = ({ icon: Icon, text, className = "" }) => (
        <div className={`flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 ${className}`}>
            <Icon className="w-4 h-4" />
            <span>{text}</span>
        </div>
    );

    // 时钟图标
    const ClockIcon = ({className}) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    // 眼睛图标
    const EyeIcon = ({className}) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );

    const loadArticles = () => {
        // 加载更多文章的逻辑
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('zh-CN');
    };

    return (
        <>
            <Head>
                <title>文章中心 - DemoChain</title>
                <meta name="description" content="探索区块链技术的深度文章，涵盖基础知识、共识机制、智能合约、DeFi 等热门话题"/>
            </Head>

            <div className="min-h-screen">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div>
                        {loading && articles.length === 0 ? (
                            // 加载状态
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm animate-pulse border border-gray-100 dark:border-gray-700">
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16 mb-4"></div>
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-6"></div>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                                <div>
                                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-1"></div>
                                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 mb-1"></div>
                                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                {/* 文章列表 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                                    {articles.map((article) => (
                                        <article key={article.id} className="bg-white dark:bg-[#1a1d24] rounded-xl border border-gray-200 dark:border-[#2a2c31] p-5 hover:shadow-lg dark:hover:shadow-2xl hover:border-orange-300 dark:hover:border-orange-400 hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
                                            <div className="">
                                                {/* 文章标题 */}
                                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                                    <Link href={`/article/${article.slug}`}>
                                                        {article.title}
                                                    </Link>
                                                </h2>

                                                {/* 文章摘要 */}
                                                <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                                                    {article.excerpt}
                                                </p>

                                                {/* 分类标签行 */}
                                                <div className="mb-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {getCategoryTags(article.category).map((tag, index) => (
                                                            <span key={index} className="inline-block px-2 py-1 text-xs bg-orange-50 text-orange-700 rounded dark:bg-orange-500/20 dark:text-orange-300">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* 时间和浏览行 */}
                                                <div className="flex items-center justify-between">
                                                    <StatItem icon={ClockIcon} text={`${article.readTime}分钟`} />
                                                    <StatItem icon={EyeIcon} text={`${article.views}浏览`} />
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>

                                {/* 加载更多按钮 */}
                                {hasMore && (
                                    <div className="text-center">
                                        <button
                                            onClick={loadArticles}
                                            disabled={loading}
                                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-2xl hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                        >
                                            {loading ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    加载中...
                                                </>
                                            ) : (
                                                <>
                                                    加载更多文章
                                                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                                                    </svg>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}

                                {/* 无更多内容提示 */}
                                {!hasMore && articles.length > 0 && (
                                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                                        已显示全部文章
                                    </div>
                                )}

                                {/* 无文章提示 */}
                                {!loading && articles.length === 0 && (
                                    <div className="text-center py-12">
                                        <div className="text-gray-400 dark:text-gray-500 mb-4">
                                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                            暂无相关文章
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            试试调整搜索条件或浏览其他分类
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
