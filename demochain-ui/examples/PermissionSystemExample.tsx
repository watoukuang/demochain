import React from 'react';
import PermissionGate from '@/components/permissions/PermissionGate';
import UsageIndicator from '@/components/permissions/UsageIndicator';
import { usePerms } from '@/src/shared/hooks/usePerms';

// 使用权限系统的示例页面
export default function PermissionSystemExample() {
  const { 
    subscription, 
    checkPermission, 
    checkModuleAccess, 
    recordUsage,
    isFreePlan,
    canAccessPremiumFeatures 
  } = usePerms();

  const handlePOSAccess = async () => {
    const result = checkPermission('pos_access');
    if (result.hasPermission) {
      await recordUsage('consensus_access', { type: 'pos' });
      // 跳转到 POS 演示页面
      console.log('Accessing POS consensus demo...');
    }
  };

  const handleArticleRead = async () => {
    const result = checkPermission('article_read');
    if (result.hasPermission) {
      await recordUsage('article_view', { articleId: 'example-article' });
      // 跳转到文章页面
      console.log('Reading article...');
    }
  };

  const handleDataExport = async () => {
    const result = checkPermission('export_data');
    if (result.hasPermission) {
      await recordUsage('data_export', { format: 'json' });
      // 执行数据导出
      console.log('Exporting data...');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          权限系统使用示例
        </h1>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
          <p className="text-blue-800 dark:text-blue-200">
            当前订阅：<strong>{subscription?.plan || '未登录'}</strong>
            {isFreePlan && ' (免费计划)'}
            {canAccessPremiumFeatures && ' (付费计划)'}
          </p>
        </div>
      </header>

      {/* 使用量指示器 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">使用量统计</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UsageIndicator type="articles" />
          <UsageIndicator type="exports" />
        </div>
      </section>

      {/* 功能访问示例 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">功能访问控制</h2>
        <div className="space-y-6">
          
          {/* POW 共识 - 免费用户可访问 */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">POW 工作量证明 (免费功能)</h3>
            <PermissionGate permission="pow_access">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-green-800 dark:text-green-200 mb-2">
                  ✅ 您可以访问 POW 共识机制演示
                </p>
                <button 
                  onClick={() => recordUsage('consensus_access', { type: 'pow' })}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  进入 POW 演示
                </button>
              </div>
            </PermissionGate>
          </div>

          {/* POS 共识 - 付费功能 */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">POS 权益证明 (付费功能)</h3>
            <PermissionGate permission="pos_access">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-green-800 dark:text-green-200 mb-2">
                  ✅ 您可以访问 POS 共识机制演示
                </p>
                <button 
                  onClick={handlePOSAccess}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  进入 POS 演示
                </button>
              </div>
            </PermissionGate>
          </div>

          {/* 文章阅读 - 有使用限制 */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">文章阅读 (有使用限制)</h3>
            <PermissionGate permission="article_read">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-green-800 dark:text-green-200 mb-2">
                  ✅ 您可以阅读技术文章
                </p>
                <button 
                  onClick={handleArticleRead}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  阅读文章
                </button>
              </div>
            </PermissionGate>
          </div>

          {/* 数据导出 - 高级功能 */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">数据导出 (高级功能)</h3>
            <PermissionGate permission="export_data">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-green-800 dark:text-green-200 mb-2">
                  ✅ 您可以导出演示数据
                </p>
                <button 
                  onClick={handleDataExport}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  导出数据
                </button>
              </div>
            </PermissionGate>
          </div>

          {/* 高级分析 - 年度/终身功能 */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">高级分析 (年度/终身功能)</h3>
            <PermissionGate permission="advanced_analytics">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-green-800 dark:text-green-200 mb-2">
                  ✅ 您可以使用高级数据分析功能
                </p>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  查看分析报告
                </button>
              </div>
            </PermissionGate>
          </div>
        </div>
      </section>

      {/* 权限检查示例 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">编程式权限检查</h2>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <pre className="text-sm overflow-x-auto">
{`// 检查单个权限
const posResult = checkPermission('pos_access');
console.log(posResult);
// { hasPermission: false, reason: "当前 免费版 不支持此功能", upgradeRequired: ["monthly", "yearly", "lifetime"] }

// 检查模块访问权限
const moduleResult = checkModuleAccess('pos_consensus');
console.log(moduleResult);

// 记录使用统计
await recordUsage('consensus_access', { type: 'pow', duration: 120 });`}
          </pre>
        </div>
      </section>
    </div>
  );
}
