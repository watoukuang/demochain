import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import Head from 'next/head';
import {Article, ArticleCategory} from '@/src/shared/types/article';
import {getArticles, getCategories, getPopularTags} from '@/src/shared/api/articles';

export default function ArticleListPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<ArticleCategory[]>([]);
    const [popularTags, setPopularTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // 加载文章列表
    const loadArticles = async (reset = false) => {
        try {
            setLoading(true);
            const currentPage = reset ? 1 : page;
            const response = await getArticles({
                page: currentPage,
                pageSize: 6,
                category: selectedCategory || undefined,
                search: searchQuery || undefined
            });

            if (reset) {
                setArticles(response.articles);
                setPage(2);
            } else {
                setArticles(prev => [...prev, ...response.articles]);
                setPage(prev => prev + 1);
            }

            setHasMore(response.hasMore);
        } catch (error) {
            console.error('Failed to load articles:', error);
        } finally {
            setLoading(false);
        }
    };

    // 初始化数据
    useEffect(() => {
        const initData = async () => {
            try {
                const [categoriesData, tagsData] = await Promise.all([
                    getCategories(),
                    getPopularTags(8)
                ]);
                setCategories(categoriesData);
                setPopularTags(tagsData);
            } catch (error) {
                console.error('Failed to load initial data:', error);
            }
        };

        initData();
    }, []);

    // 加载文章
    useEffect(() => {
        loadArticles(true);
    }, [selectedCategory, searchQuery]);

    // 格式化日期
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            <Head>
                <title>文章中心 - DemoChain</title>
                <meta name="description"
                      content="探索区块链技术的深度文章，涵盖基础知识、共识机制、智能合约、DeFi 等热门话题"/>
            </Head>

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div>
                        {loading && articles.length === 0 ? (
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
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                                    {articles.map((article) => (
                                        <article key={article.id}
                                                 className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
                                            <div className="p-8">
                                                {/* 分类标签 */}
                                                <div className="mb-4">
                                                        <span
                                                            className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium rounded-full">
                                                            {categories.find(cat => cat.id === article.category)?.name || '技术'}
                                                        </span>
                                                </div>

                                                {/* 文章标题 */}
                                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    <Link href={`/article/${article.slug}`}>
                                                        {article.title}
                                                    </Link>
                                                </h2>

                                                {/* 文章摘要 */}
                                                <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                                                    {article.excerpt}
                                                </p>

                                                {/* 作者信息 */}
                                                <div
                                                    className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                                    <div className="flex items-center space-x-3">
                                                        <div
                                                            className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                            {article.author.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {article.author.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                {formatDate(article.publishedAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {article.readTime} 分钟
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {article.views} 次浏览
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>

                                {/* 加载更多按钮 */}
                                {hasMore && (
                                    <div className="text-center">
                                        <button
                                            onClick={() => loadArticles()}
                                            disabled={loading}
                                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-2xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                        >
                                            {loading ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                         xmlns="http://www.w3.org/2000/svg" fill="none"
                                                         viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10"
                                                                stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor"
                                                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    加载中...
                                                </>
                                            ) : (
                                                <>
                                                    加载更多文章
                                                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor"
                                                         viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
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
                                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
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
