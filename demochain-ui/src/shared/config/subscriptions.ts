import { SubscriptionConfig, FeatureModule, Permission } from '../types/perms';

// 订阅计划配置
export const SUBSCRIPTION_PLANS: Record<string, SubscriptionConfig> = {
  free: {
    plan: 'free',
    name: '免费版',
    price: 0,
    period: 'forever',
    permissions: [
      'pow_access',
      'article_read',
      'glossary_access'
    ],
    features: [
      'POW 共识演示',
      '哈希算法演示', 
      '区块结构展示',
      '分布式挖矿',
      '代币转账演示',
      '币基奖励机制',
      '文章阅读（限制）',
      '名词解释访问'
    ],
    limitations: {
      maxArticleViews: 10, // 每月最多阅读 10 篇文章
      maxExports: 0,       // 不支持数据导出
      supportLevel: 'none' // 无技术支持
    }
  },
  
  monthly: {
    plan: 'monthly',
    name: '月度会员',
    price: 3,
    period: 'month',
    permissions: [
      'pow_access',
      'pos_access',
      'dpos_access',
      'bft_access',
      'poh_access',
      'article_read',
      'article_comment',
      'glossary_access',
      'export_data'
    ],
    features: [
      '所有共识机制演示',
      'POW 工作量证明',
      'POS 权益证明',
      'DPoS 委托权益证明',
      'BFT 拜占庭容错',
      'POH 历史证明',
      '无限制文章阅读',
      '文章评论功能',
      '数据导出功能'
    ],
    limitations: {
      maxExports: 50,      // 每月最多 50 次导出
      supportLevel: 'basic' // 基础支持
    }
  },
  
  yearly: {
    plan: 'yearly',
    name: '年度会员',
    price: 10,
    period: 'year',
    permissions: [
      'pow_access',
      'pos_access', 
      'dpos_access',
      'bft_access',
      'poh_access',
      'article_read',
      'article_comment',
      'glossary_access',
      'export_data',
      'advanced_analytics'
    ],
    features: [
      '所有共识机制演示',
      'POW 工作量证明',
      'POS 权益证明', 
      'DPoS 委托权益证明',
      'BFT 拜占庭容错',
      'POH 历史证明',
      '无限制文章阅读',
      '文章评论功能',
      '无限数据导出',
      '高级数据分析'
    ],
    limitations: {
      supportLevel: 'basic'
    }
  },
  
  lifetime: {
    plan: 'lifetime',
    name: '终身会员',
    price: 15,
    period: 'lifetime',
    permissions: [
      'pow_access',
      'pos_access',
      'dpos_access', 
      'bft_access',
      'poh_access',
      'article_read',
      'article_comment',
      'glossary_access',
      'export_data',
      'advanced_analytics',
      'priority_support'
    ],
    features: [
      '所有共识机制演示',
      'POW 工作量证明',
      'POS 权益证明',
      'DPoS 委托权益证明', 
      'BFT 拜占庭容错',
      'POH 历史证明',
      '永久无限制访问',
      '文章评论功能',
      '无限数据导出',
      '高级数据分析',
      '优先技术支持'
    ],
    limitations: {
      supportLevel: 'priority'
    }
  }
};

// 功能模块配置
export const FEATURE_MODULES: FeatureModule[] = [
  // 共识机制模块
  {
    id: 'pow_consensus',
    name: 'POW 工作量证明',
    description: '比特币使用的工作量证明共识机制演示',
    requiredPermissions: ['pow_access'],
    category: 'consensus'
  },
  {
    id: 'pos_consensus', 
    name: 'POS 权益证明',
    description: '以太坊 2.0 使用的权益证明共识机制演示',
    requiredPermissions: ['pos_access'],
    category: 'consensus'
  },
  {
    id: 'dpos_consensus',
    name: 'DPoS 委托权益证明', 
    description: 'EOS 等使用的委托权益证明共识机制演示',
    requiredPermissions: ['dpos_access'],
    category: 'consensus'
  },
  {
    id: 'bft_consensus',
    name: 'BFT 拜占庭容错',
    description: '拜占庭容错算法的共识机制演示',
    requiredPermissions: ['bft_access'],
    category: 'consensus'
  },
  {
    id: 'poh_consensus',
    name: 'POH 历史证明',
    description: 'Solana 使用的历史证明共识机制演示', 
    requiredPermissions: ['poh_access'],
    category: 'consensus'
  },
  
  // 内容模块
  {
    id: 'articles',
    name: '技术文章',
    description: '深度技术文章阅读和学习',
    requiredPermissions: ['article_read'],
    category: 'content'
  },
  {
    id: 'glossary',
    name: '名词解释',
    description: '区块链技术名词解释和概念学习',
    requiredPermissions: ['glossary_access'],
    category: 'content'
  },
  
  // 工具模块
  {
    id: 'data_export',
    name: '数据导出',
    description: '演示数据和学习记录导出功能',
    requiredPermissions: ['export_data'],
    category: 'tools'
  },
  {
    id: 'analytics',
    name: '高级分析',
    description: '学习进度和数据分析功能',
    requiredPermissions: ['advanced_analytics'],
    category: 'tools'
  }
];

// 权限层级配置（用于升级建议）
export const PERMISSION_HIERARCHY: Record<Permission, SubscriptionConfig[]> = {
  'pow_access': [SUBSCRIPTION_PLANS.free, SUBSCRIPTION_PLANS.monthly, SUBSCRIPTION_PLANS.yearly, SUBSCRIPTION_PLANS.lifetime],
  'pos_access': [SUBSCRIPTION_PLANS.monthly, SUBSCRIPTION_PLANS.yearly, SUBSCRIPTION_PLANS.lifetime],
  'dpos_access': [SUBSCRIPTION_PLANS.monthly, SUBSCRIPTION_PLANS.yearly, SUBSCRIPTION_PLANS.lifetime],
  'bft_access': [SUBSCRIPTION_PLANS.monthly, SUBSCRIPTION_PLANS.yearly, SUBSCRIPTION_PLANS.lifetime],
  'poh_access': [SUBSCRIPTION_PLANS.monthly, SUBSCRIPTION_PLANS.yearly, SUBSCRIPTION_PLANS.lifetime],
  'article_read': [SUBSCRIPTION_PLANS.free, SUBSCRIPTION_PLANS.monthly, SUBSCRIPTION_PLANS.yearly, SUBSCRIPTION_PLANS.lifetime],
  'article_comment': [SUBSCRIPTION_PLANS.monthly, SUBSCRIPTION_PLANS.yearly, SUBSCRIPTION_PLANS.lifetime],
  'glossary_access': [SUBSCRIPTION_PLANS.free, SUBSCRIPTION_PLANS.monthly, SUBSCRIPTION_PLANS.yearly, SUBSCRIPTION_PLANS.lifetime],
  'export_data': [SUBSCRIPTION_PLANS.monthly, SUBSCRIPTION_PLANS.yearly, SUBSCRIPTION_PLANS.lifetime],
  'advanced_analytics': [SUBSCRIPTION_PLANS.yearly, SUBSCRIPTION_PLANS.lifetime],
  'priority_support': [SUBSCRIPTION_PLANS.lifetime]
};
