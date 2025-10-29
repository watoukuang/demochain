interface Article {
    id: string;
    title: string;
    excerpt: string;
    tags: string[];
    slug: string;
    views: number;
    published: string;
}

export interface ArticleListResponse {
    articles: Article[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

export interface ArticleCategory {
    id: string;
    name: string;
    slug: string;
    description: string;
    count: number;
}
