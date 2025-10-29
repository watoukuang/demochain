import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { Article, getArticleByIdAPI } from '@/src/shared/api/article';

export default function ArticleDetailPage() {
    const router = useRouter();
    const { slug } = router.query;
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug || typeof slug !== 'string') return;

        const loadArticle = async () => {
            try {
                setLoading(true);
                setError(null);

                const articleData = await getArticleByIdAPI(slug);
                setArticle(articleData);

            } catch (err) {
                console.error('Failed to load article:', err);
                setError(err instanceof Error ? err.message : '加载文章失败');
            } finally {
                setLoading(false);
            }
        };

        loadArticle();
    }, [slug]);

    // 格式化日期
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // 简单的Markdown渲染器
    const renderMarkdown = (content: string) => {
        return content
            .split('\n')
            .map((line, index) => {
                // 标题
                if (line.startsWith('# ')) {
                    return <h1 key={index} className="text-3xl font-bold mb-4 mt-8">{line.substring(2)}</h1>;
                }
                if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-2xl font-bold mb-3 mt-6">{line.substring(3)}</h2>;
                }
                if (line.startsWith('### ')) {
                    return <h3 key={index} className="text-xl font-bold mb-2 mt-4">{line.substring(4)}</h3>;
                }
                
                // 空行
                if (line.trim() === '') {
                    return <br key={index} />;
                }
                
                // 普通段落
                return <p key={index} className="mb-4 leading-relaxed">{line}</p>;
            });
    };

    // 加载中状态
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
                        <div className="space-y-4">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 错误状态
    if (error || !article) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-400 dark:text-gray-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {error || '文章不存在'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        抱歉，您访问的文章可能已被删除或不存在
                    </p>
                    <Link
                        href="/article"
                        className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                        </svg>
                        返回文章列表
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>{article.title} - DemoChain</title>
                <meta name="description" content={article.excerpt}/>
                <meta name="keywords" content={article.tags.join(', ')}/>
            </Head>

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        {/* 文章头部 */}
                        <header className="px-8 pt-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                            {/* 标题 */}
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                                {article.title}
                            </h1>

                            {/* 文章信息 */}
                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                    {formatDate(article.created)}
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                    </svg>
                                    {article.views} 次浏览
                                </div>
                            </div>

                            {/* 标签 */}
                            {article.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-6">
                                    {article.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-sm rounded-full"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </header>

                        {/* 文章内容 */}
                        <div className="px-8 py-8">
                            <div className="prose prose-lg max-w-none dark:prose-invert text-gray-900 dark:text-gray-100">
                                {renderMarkdown(article.content)}
                            </div>
                        </div>

                        {/* 文章底部 */}
                        <footer className="px-8 pb-8">
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <div className="flex items-center justify-center">
                                    <Link
                                        href="/article"
                                        className="inline-flex items-center text-orange-600 dark:text-orange-400 hover:underline"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                                        </svg>
                                        返回文章列表
                                    </Link>
                                </div>
                            </div>
                        </footer>
                    </article>
                </div>
            </div>
        </>
    );
}
