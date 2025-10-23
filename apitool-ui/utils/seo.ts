export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
}

// 全局默认 SEO 配置
export const defaultSEO: SEOConfig = {
  title: 'ApiTool - API Mock 平台',
  description: 'ApiTool - 一站式 API Mock 与调试平台，支持请求方式/路径/参数与响应内容/状态码的灵活配置，助力前后端并行开发与自动化测试',
  keywords: 'API Mock,接口模拟,接口测试,调试平台,前后端联调,自动化测试,API 工具',
  ogImage: '/og-image.jpg',
};

// 页面级 SEO 配置
export const pageSEO: Record<string, Partial<SEOConfig>> = {
  '/': {
    title: '接口模拟 - ApiTool',
    description: '可视化配置请求方式/路径/参数与响应内容/状态码，快速生成接口响应，支持延迟与错误注入',
  },
  '/sender': {
    title: '接口测试 - ApiTool', 
    description: '构造请求并验证响应，适配多状态码与Headers，助力联调与自动化测试',
  },
  '/question': {
    title: '问题反馈 - ApiTool',
    description: '向我们反馈问题与建议，帮助我们持续改进 ApiTool 体验',
  },
};

// 获取页面 SEO 配置
export function getPageSEO(pathname: string): SEOConfig {
  const pageSEOConfig = pageSEO[pathname] || {};
  return {
    ...defaultSEO,
    ...pageSEOConfig,
    canonical: `https://apitool.example.com${pathname}`,
  };
}
