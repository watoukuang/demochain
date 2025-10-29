import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {Article, pageArticleAPI} from '@/src/shared/api/article';
import Pagination from '@/src/views/order/components/pagination';
import ClockIcon from "@/components/icons/ClockIcon";
import EyeIcon from "@/components/icons/EyeIcon";

// 模拟分类数据
const categories = [
    {id: 'tech', name: '技术'},
    {id: 'tutorial', name: '教程'},
    {id: 'news', name: '资讯'},
];

export default function ArticleIndex() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(6);
    const [totalCount, setTotalCount] = useState(0);
    useEffect(() => {
        const loadArticles = async () => {
            const start = Date.now();
            setLoading(true);
            try {
                const {items, total} = await pageArticleAPI(currentPage, pageSize);
                setArticles(items);
                setTotalCount(total);
            } catch (error) {
                console.error('Failed to load articles:', error);
            } finally {
                const elapsed = Date.now() - start;
                const delay = Math.max(0, 300 - elapsed);
                setTimeout(() => {
                    setLoading(false);
                }, delay);
            }
        };
        void loadArticles();
    }, [currentPage, pageSize]);

    // 分页逻辑
    const totalPages = Math.ceil(totalCount / pageSize);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // 获取分类标签
    const getCategoryTags = (articleTags: string[]) => {
        return articleTags.slice(0, 3).map(id =>
            categories.find(cat => cat.id === id)?.name || '技术'
        );
    };

    // 统计信息组件
    const StatItem = ({icon: Icon, text, className = ""}) => (
        <div className={`flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 ${className}`}>
            <Icon className="w-4 h-4"/>
            <span>{text}</span>
        </div>
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('zh-CN');
    };

    return (
        <>
            <Head>
                <title>文章中心 - DemoChain</title>
                <meta name="description"
                      content="探索区块链技术的深度文章，涵盖基础知识、共识机制、智能合约、DeFi 等热门话题"/>
            </Head>

            <div className="min-h-screen">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">文章中心</h1>
                        <p className="text-gray-600 dark:text-gray-400">探索区块链技术的深度文章，涵盖基础知识、共识机制、智能合约、DeFi
                            等热门话题</p>
                    </div>

                    <div>
                        {loading ? (
                            // 加载状态
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i}
                                         className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm animate-pulse border border-gray-100 dark:border-gray-700">
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16 mb-4"></div>
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-6"></div>
                                        <div
                                            className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                                <div>
                                                    <div
                                                        className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-1"></div>
                                                    <div
                                                        className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div
                                                    className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 mb-1"></div>
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
                                        <article key={article.id}
                                                 className="bg-white dark:bg-[#1a1d24] rounded-xl border border-gray-200 dark:border-[#2a2c31] p-5 hover:shadow-lg dark:hover:shadow-2xl hover:border-orange-300 dark:hover:border-orange-400 hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
                                            {/* 文章标题 */}
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                                <Link href={`/article/${article.id}`}>
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
                                                    {getCategoryTags(article.tags).map((tag, index) => (
                                                        <span key={index}
                                                              className="inline-block px-2 py-1 text-xs bg-orange-50 text-orange-700 rounded dark:bg-orange-500/20 dark:text-orange-300">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* 时间和浏览行 */}
                                            <div className="flex items-center justify-between">
                                                <StatItem icon={ClockIcon} text={formatDate(article.created)}/>
                                                <StatItem icon={EyeIcon} text={`${article.views}浏览`}/>
                                            </div>
                                        </article>
                                    ))}
                                </div>

                                {/* 分页控件 */}
                                {totalPages > 1 && (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        totalCount={totalCount}
                                        onPageChange={handlePageChange}
                                    />
                                )}

                                {/* 无文章提示 */}
                                {!loading && articles.length === 0 && (
                                    <div className="text-center py-12">
                                        <div className="text-gray-400 dark:text-gray-500 mb-4">
                                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                            暂无文章
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            暂时没有发布任何文章
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
