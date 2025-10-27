import { Article, ArticleListResponse, ArticleCategory } from '../types/article';
import { mockArticles, mockCategories } from '../data/articles';

// 模拟 API 延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 获取文章列表
export async function getArticles(params: {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
} = {}): Promise<ArticleListResponse> {
  await delay(300); // 模拟网络延迟

  const {
    page = 1,
    pageSize = 10,
    category,
    tag,
    search,
    featured
  } = params;

  let filteredArticles = [...mockArticles];

  // 按分类筛选
  if (category) {
    filteredArticles = filteredArticles.filter(article => article.category === category);
  }

  // 按标签筛选
  if (tag) {
    filteredArticles = filteredArticles.filter(article => 
      article.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );
  }

  // 按关键词搜索
  if (search) {
    const searchLower = search.toLowerCase();
    filteredArticles = filteredArticles.filter(article =>
      article.title.toLowerCase().includes(searchLower) ||
      article.excerpt.toLowerCase().includes(searchLower) ||
      article.tags.some(t => t.toLowerCase().includes(searchLower))
    );
  }

  // 按推荐筛选
  if (featured !== undefined) {
    filteredArticles = filteredArticles.filter(article => article.featured === featured);
  }

  // 按发布时间倒序排列
  filteredArticles.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const total = filteredArticles.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const articles = filteredArticles.slice(startIndex, endIndex);

  return {
    articles,
    total,
    page,
    pageSize,
    hasMore: endIndex < total
  };
}

// 根据 ID 获取文章详情
export async function getArticleById(id: string): Promise<Article | null> {
  await delay(200);
  
  const article = mockArticles.find(article => article.id === id);
  if (article) {
    // 模拟增加浏览量
    article.views += 1;
  }
  return article || null;
}

// 根据 slug 获取文章详情
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  await delay(200);
  
  const article = mockArticles.find(article => article.slug === slug);
  if (article) {
    // 模拟增加浏览量
    article.views += 1;
  }
  return article || null;
}

// 获取推荐文章
export async function getFeaturedArticles(limit: number = 3): Promise<Article[]> {
  await delay(150);
  
  return mockArticles
    .filter(article => article.featured)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

// 获取相关文章
export async function getRelatedArticles(articleId: string, limit: number = 3): Promise<Article[]> {
  await delay(150);
  
  const currentArticle = mockArticles.find(article => article.id === articleId);
  if (!currentArticle) return [];

  // 根据标签和分类找相关文章
  const relatedArticles = mockArticles
    .filter(article => 
      article.id !== articleId && (
        article.category === currentArticle.category ||
        article.tags.some(tag => currentArticle.tags.includes(tag))
      )
    )
    .sort((a, b) => {
      // 计算相关度分数
      let scoreA = 0;
      let scoreB = 0;
      
      if (a.category === currentArticle.category) scoreA += 2;
      if (b.category === currentArticle.category) scoreB += 2;
      
      scoreA += a.tags.filter(tag => currentArticle.tags.includes(tag)).length;
      scoreB += b.tags.filter(tag => currentArticle.tags.includes(tag)).length;
      
      return scoreB - scoreA;
    })
    .slice(0, limit);

  return relatedArticles;
}

// 获取文章分类
export async function getCategories(): Promise<ArticleCategory[]> {
  await delay(100);
  return mockCategories;
}

// 获取热门标签
export async function getPopularTags(limit: number = 10): Promise<string[]> {
  await delay(100);
  
  const tagCounts: Record<string, number> = {};
  
  mockArticles.forEach(article => {
    article.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([tag]) => tag);
}
