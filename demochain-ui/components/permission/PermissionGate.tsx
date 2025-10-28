import React from 'react';
import Link from 'next/link';
import {Permission} from '@/src/shared/types/perms';
import {usePerms} from '@/src/shared/hooks/usePerms';

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
    const {checkPermission} = usePerms();
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
    const {reason} = permissionResult;

    return (
        <div className="pt-4 mt-8 sm:mt-12 lg:mt-16 text-center">
            <div className="mb-4">
                <div
                    className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-200/40 dark:shadow-transparent">
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

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg shadow-amber-200/50 hover:shadow-amber-300/60"
                >
                    查看所有计划
                </Link>
            </div>
        </div>
    );
}
