import React from 'react';
import Link from 'next/link';
import {Permission} from '@/src/shared/types/subscription';
import {usePermissions} from '@/src/shared/hooks/usePermissions';
import {SUBSCRIPTION_PLANS} from '@/src/shared/config/subscriptions';

interface PermissionGateProps {
    permission: Permission;
    children: React.ReactNode;
    fallback?: React.ReactNode;
    showUpgradePrompt?: boolean;
}

export default function PermissionGate({
                                           permission,
                                           children,
                                           fallback,
                                           showUpgradePrompt = true
                                       }: PermissionGateProps) {
    const {checkPermission} = usePermissions();
    const permissionResult = checkPermission(permission);

    if (permissionResult.hasPermission) {
        return <>{children}</>;
    }

    // 自定义 fallback
    if (fallback) {
        return <>{fallback}</>;
    }

    // 默认升级提示
    if (showUpgradePrompt) {
        return <UpgradePrompt permissionResult={permissionResult}/>;
    }

    return null;
}

interface UpgradePromptProps {
    permissionResult: any;
}

function UpgradePrompt({permissionResult}: UpgradePromptProps) {
    const {upgradeRequired, reason} = permissionResult;

    // 获取推荐的升级计划
    const recommendedPlan = upgradeRequired?.[0];
    const planConfig = recommendedPlan ? SUBSCRIPTION_PLANS[recommendedPlan] : null;

    return (
        <div
            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 text-center border border-blue-200 dark:border-blue-800">
            <div className="mb-4">
                <div
                    className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    需要升级访问权限
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {reason || '此功能需要付费订阅才能使用'}
                </p>
            </div>

            {planConfig && (
                <div
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-center mb-4">
                        <div className="text-center">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                推荐升级到 {planConfig.name}
                            </h4>
                            <div className="mt-2">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${planConfig.price}
                </span>
                                <span className="text-gray-500 dark:text-gray-400 ml-2">
                  {planConfig.period === 'month' ? '每月' :
                      planConfig.period === 'year' ? '每年' :
                          planConfig.period === 'lifetime' ? '一次性' : '永久'}
                </span>
                            </div>
                        </div>
                    </div>

                    <div className="text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            升级后您将获得：
                        </p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            {planConfig.features.slice(0, 4).map((feature, index) => (
                                <li key={index} className="flex items-center">
                                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M5 13l4 4L19 7"/>
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                    查看所有计划
                </Link>

                <button
                    className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    了解更多
                </button>
            </div>
        </div>
    );
}
