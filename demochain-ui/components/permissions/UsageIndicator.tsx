import React from 'react';
import Link from 'next/link';
import { usePermissions } from '@/src/shared/hooks/usePermissions';
import { SUBSCRIPTION_PLANS } from '@/src/shared/config/subscriptions';

interface UsageIndicatorProps {
  type: 'articles' | 'exports';
  className?: string;
}

export default function UsageIndicator({ type, className = '' }: UsageIndicatorProps) {
  const { subscription, usageStats } = usePermissions();

  if (!subscription || !usageStats) {
    return null;
  }

  const planConfig = SUBSCRIPTION_PLANS[subscription.plan];
  const limitations = planConfig.limitations;

  if (!limitations) {
    return null;
  }

  let current = 0;
  let max = 0;
  let label = '';

  if (type === 'articles' && limitations.maxArticleViews !== undefined) {
    current = usageStats.articleViews;
    max = limitations.maxArticleViews;
    label = '文章阅读';
  } else if (type === 'exports' && limitations.maxExports !== undefined) {
    current = usageStats.dataExports;
    max = limitations.maxExports;
    label = '数据导出';
  } else {
    return null; // 无限制
  }

  const percentage = max > 0 ? (current / max) * 100 : 0;
  const isNearLimit = percentage >= 80;
  const isAtLimit = current >= max;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
          {label}使用情况
        </h4>
        <span className={`text-xs px-2 py-1 rounded-full ${
          isAtLimit 
            ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            : isNearLimit 
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
              : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
        }`}>
          {current}/{max}
        </span>
      </div>

      {/* 进度条 */}
      <div className="mb-3">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isAtLimit 
                ? 'bg-red-500'
                : isNearLimit 
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* 状态信息 */}
      <div className="text-xs text-gray-600 dark:text-gray-400">
        {isAtLimit ? (
          <div className="space-y-2">
            <p className="text-red-600 dark:text-red-400 font-medium">
              已达到本月使用上限
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
            >
              升级获得更多配额
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ) : isNearLimit ? (
          <p className="text-yellow-600 dark:text-yellow-400">
            即将达到使用上限，建议升级计划
          </p>
        ) : (
          <p>
            本月还可使用 {max - current} 次
          </p>
        )}
      </div>
    </div>
  );
}
