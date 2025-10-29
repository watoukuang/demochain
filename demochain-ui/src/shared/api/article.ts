import request from '../utils/request';

export interface Article {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    tags: string[];
    slug: string;
    views: number;
    created: string;
}

export interface PageResult<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
}

export async function pageArticleAPI(page: number = 1, size: number = 10): Promise<PageResult<Article>> {
    const resp = await request.get<any>(`/api/article/page?page=${page}&size=${size}`);
    if (!resp.success) throw new Error(resp.message || '获取文章失败');
    const data = resp.data || {};
    return {
        items: Array.isArray(data.items) ? data.items : [],
        total: typeof data.total === 'number' ? data.total : 0,
        page: typeof data.page === 'number' ? data.page : page,
        size: typeof data.size === 'number' ? data.size : size,
    };
}
