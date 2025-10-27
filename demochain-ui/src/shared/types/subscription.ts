// 订阅计划类型
export type SubscriptionPlan = 'free' | 'monthly' | 'yearly' | 'lifetime';

// 权限类型
export type Permission =
    | 'pow_access'           // POW 共识机制访问
    | 'pos_access'           // POS 共识机制访问
    | 'dpos_access'          // DPoS 共识机制访问
    | 'bft_access'           // BFT 共识机制访问
    | 'poh_access'           // POH 共识机制访问
    | 'article_read'         // 文章阅读
    | 'article_comment'      // 文章评论
    | 'glossary_access'      // 名词解释访问
    | 'export_data'          // 数据导出
    | 'advanced_analytics'   // 高级分析
    | 'priority_support';    // 优先支持

// 功能模块
export interface FeatureModule {
    id: string;
    name: string;
    description: string;
    requiredPermissions: Permission[];
    category: 'consensus' | 'content' | 'tools' | 'support';
}

// 订阅计划配置
export interface SubscriptionConfig {
    plan: SubscriptionPlan;
    name: string;
    price: number;
    period: 'forever' | 'month' | 'year' | 'lifetime';
    permissions: Permission[];
    features: string[];
    limitations?: {
        maxArticleViews?: number;
        maxExports?: number;
        supportLevel?: 'none' | 'basic' | 'priority';
    };
}

// 用户订阅状态
export interface UserSubscription {
    id: string;
    userId: string;
    plan: SubscriptionPlan;
    status: 'active' | 'expired' | 'cancelled' | 'pending';
    startDate: string;
    endDate?: string; // lifetime 计划为 null
    autoRenew: boolean;
    paymentMethod?: string;
    createdAt: string;
    updatedAt: string;
}

// 权限检查结果
export interface PermissionCheckResult {
    hasPermission: boolean;
    reason?: string;
    upgradeRequired?: SubscriptionPlan[];
    trialAvailable?: boolean;
}

// 使用统计
export interface UsageStats {
    userId: string;
    period: string; // YYYY-MM
    articleViews: number;
    dataExports: number;
    consensusAccess: Record<string, number>;
    lastUpdated: string;
}
