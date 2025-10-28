import { useState, useEffect, useCallback } from 'react';
import { Permission, PermissionCheckResult, UserSubscription, UsageStats } from '../types/perms';
import { SUBSCRIPTION_PLANS, PERMISSION_HIERARCHY } from '../config/subscriptions';
import { useAuth } from './useAuth';

// Mock API - 在实际项目中替换为真实 API
const mockUserSubscription: UserSubscription = {
  id: '1',
  userId: '1', 
  plan: 'free',
  status: 'active',
  startDate: '2024-01-01',
  autoRenew: false,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
};

const mockUsageStats: UsageStats = {
  userId: '1',
  period: '2024-01',
  articleViews: 5,
  dataExports: 0,
  consensusAccess: {
    'pow': 15,
    'pos': 0,
    'dpos': 0,
    'bft': 0,
    'poh': 0
  },
  lastUpdated: '2024-01-15'
};

export function usePerms() {
  const { user, isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  // 加载用户订阅信息
  useEffect(() => {
    const loadSubscription = async () => {
      if (!isAuthenticated || !user) {
        setSubscription(null);
        setUsageStats(null);
        setLoading(false);
        return;
      }

      try {
        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 300));
        setSubscription(mockUserSubscription);
        setUsageStats(mockUsageStats);
      } catch (error) {
        console.error('Failed to load subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubscription();
  }, [isAuthenticated, user]);

  // 检查权限
  const checkPermission = useCallback((permission: Permission): PermissionCheckResult => {
    // 未登录用户只能访问免费功能
    if (!isAuthenticated || !subscription) {
      const freePermissions = SUBSCRIPTION_PLANS.free.permissions;
      if (freePermissions.includes(permission)) {
        return { hasPermission: true };
      }
      
      return {
        hasPermission: false,
        reason: '需要登录后才能访问此功能',
        upgradeRequired: PERMISSION_HIERARCHY[permission]?.map(plan => plan.plan) || []
      };
    }

    // 检查订阅状态
    if (subscription.status !== 'active') {
      return {
        hasPermission: false,
        reason: '订阅已过期或未激活',
        upgradeRequired: PERMISSION_HIERARCHY[permission]?.map(plan => plan.plan) || []
      };
    }

    // 检查当前计划是否包含所需权限
    const currentPlan = SUBSCRIPTION_PLANS[subscription.plan];
    if (!currentPlan) {
      return {
        hasPermission: false,
        reason: '无效的订阅计划'
      };
    }

    const hasPermission = currentPlan.permissions.includes(permission);
    if (hasPermission) {
      // 检查使用限制
      const limitationCheck = checkUsageLimitations(permission);
      if (!limitationCheck.hasPermission) {
        return limitationCheck;
      }
      
      return { hasPermission: true };
    }

    // 获取升级建议
    const availablePlans = PERMISSION_HIERARCHY[permission]?.filter(
      plan => plan.plan !== subscription.plan
    ) || [];

    return {
      hasPermission: false,
      reason: `当前 ${currentPlan.name} 不支持此功能`,
      upgradeRequired: availablePlans.map(plan => plan.plan)
    };
  }, [isAuthenticated, subscription]);

  // 检查使用限制
  const checkUsageLimitations = useCallback((permission: Permission): PermissionCheckResult => {
    if (!subscription || !usageStats) {
      return { hasPermission: true };
    }

    const currentPlan = SUBSCRIPTION_PLANS[subscription.plan];
    const limitations = currentPlan.limitations;

    if (!limitations) {
      return { hasPermission: true };
    }

    // 检查文章阅读限制
    if (permission === 'article_read' && limitations.maxArticleViews !== undefined) {
      if (usageStats.articleViews >= limitations.maxArticleViews) {
        return {
          hasPermission: false,
          reason: `本月文章阅读次数已达上限 (${limitations.maxArticleViews} 次)`,
          upgradeRequired: ['monthly', 'yearly', 'lifetime']
        };
      }
    }

    // 检查数据导出限制
    if (permission === 'export_data' && limitations.maxExports !== undefined) {
      if (limitations.maxExports === 0) {
        return {
          hasPermission: false,
          reason: '当前计划不支持数据导出功能',
          upgradeRequired: ['monthly', 'yearly', 'lifetime']
        };
      }
      
      if (usageStats.dataExports >= limitations.maxExports) {
        return {
          hasPermission: false,
          reason: `本月数据导出次数已达上限 (${limitations.maxExports} 次)`,
          upgradeRequired: ['yearly', 'lifetime']
        };
      }
    }

    return { hasPermission: true };
  }, [subscription, usageStats]);

  // 检查功能模块访问权限
  const checkModuleAccess = useCallback((moduleId: string): PermissionCheckResult => {
    // 根据模块 ID 映射到权限
    const modulePermissionMap: Record<string, Permission> = {
      'pow_consensus': 'pow_access',
      'pos_consensus': 'pos_access',
      'dpos_consensus': 'dpos_access',
      'bft_consensus': 'bft_access',
      'poh_consensus': 'poh_access',
      'articles': 'article_read',
      'glossary': 'glossary_access',
      'data_export': 'export_data',
      'analytics': 'advanced_analytics'
    };

    const requiredPermission = modulePermissionMap[moduleId];
    if (!requiredPermission) {
      return { hasPermission: false, reason: '未知的功能模块' };
    }

    return checkPermission(requiredPermission);
  }, [checkPermission]);

  // 获取升级建议
  const getUpgradeRecommendation = useCallback((targetPermission: Permission) => {
    if (!subscription) return null;

    const availablePlans = PERMISSION_HIERARCHY[targetPermission]?.filter(
      plan => plan.plan !== subscription.plan
    ) || [];

    // 推荐最便宜的可用计划
    return availablePlans.sort((a, b) => a.price - b.price)[0] || null;
  }, [subscription]);

  // 记录使用统计
  const recordUsage = useCallback(async (action: string, metadata?: any) => {
    if (!isAuthenticated || !user) return;

    try {
      // 模拟 API 调用记录使用统计
      console.log('Recording usage:', { action, metadata, userId: user.id });
      
      // 更新本地统计（实际应用中从服务器获取最新数据）
      if (action === 'article_view' && usageStats) {
        setUsageStats(prev => prev ? {
          ...prev,
          articleViews: prev.articleViews + 1
        } : null);
      }
    } catch (error) {
      console.error('Failed to record usage:', error);
    }
  }, [isAuthenticated, user, usageStats]);

  return {
    subscription,
    usageStats,
    loading,
    checkPermission,
    checkModuleAccess,
    getUpgradeRecommendation,
    recordUsage,
    
    // 便捷方法
    isFreePlan: subscription?.plan === 'free',
    isPaidPlan: subscription?.plan !== 'free',
    canAccessPremiumFeatures: subscription ? ['monthly', 'yearly', 'lifetime'].includes(subscription.plan) : false
  };
}
