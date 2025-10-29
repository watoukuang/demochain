import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {Article, pageArticleAPI} from '@/src/shared/api/article';
import Pagination from '@/src/views/order/components/pagination';
import Index from '@/components/Title';
import ArticleCard from '@/src/views/article/components/article-card';
import Skeleton from '@/src/views/article/components/skeleton';
import EmptyState from '@/src/views/article/components/empty-state';

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

    const categoryMap = categories.reduce<Record<string, string>>((acc, c) => {
        acc[c.id] = c.name;
        return acc;
    }, {});

    return (
        <>
            <Head>
                <title>文章中心 - DemoChain</title>
                <meta name="description"
                      content="探索区块链技术的深度文章，涵盖基础知识、共识机制、智能合约、DeFi 等热门话题"/>
            </Head>

            <div className="min-h-screen">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Index/>
                    <div>
                        {loading ? (
                            // 加载状态
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, i) => (<Skeleton key={i}/>))}
                            </div>
                        ) : (
                            <>
                                {/* 文章列表 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                                    {articles.map((article) => (
                                        <ArticleCard key={article.id} article={article} categoryMap={categoryMap}/>
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
                                    <EmptyState/>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
