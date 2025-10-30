# 权限系统设计文档

基于当前定价页面设计的灵活权限系统，支持多层级订阅计划和细粒度权限控制。

## 系统架构

### 1. 订阅计划层级

```
免费版 ($0)
├── POW 共识机制
├── 文章阅读 (10篇/月)
└── 名词解释

月度会员 ($3/月)
├── 所有共识机制
├── 无限文章阅读
├── 文章评论
└── 数据导出 (50次/月)

年度会员 ($10/年)
├── 月度会员所有功能
└── 高级数据分析

终身会员 ($15一次性)
├── 年度会员所有功能
└── 优先技术支持
```

### 2. 权限类型

- **功能权限**: `pow_access`, `pos_access`, `dpos_access`, `bft_access`, `poh_access`
- **内容权限**: `article_read`, `article_comment`, `glossary_access`
- **工具权限**: `export_data`, `advanced_analytics`
- **服务权限**: `priority_support`

### 3. 使用限制

- **文章阅读**: 免费版 10篇/月，付费版无限制
- **数据导出**: 免费版不支持，月度版 50次/月，年度版及以上无限制
- **技术支持**: 免费版无支持，月度/年度版基础支持，终身版优先支持

## 核心组件

### 1. 类型定义 (`src/shared/types/permission.ts`)

```typescript
// 订阅计划
export type SubscriptionPlan = 'free' | 'monthly' | 'yearly' | 'lifetime';

// 权限类型
export type Header = 'pow_access' | 'pos_access' | ...;

// 用户订阅状态
export interface UserSubscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  // ...
}
```

### 2. 配置文件 (`src/shared/config/subscriptions.ts`)

```typescript
// 订阅计划配置
export const SUBSCRIPTION_PLANS: Record<string, SubscriptionConfig> = {
  free: {
    plan: 'free',
    permissions: ['pow_access', 'article_read', 'glossary_access'],
    limitations: { maxArticleViews: 10, maxExports: 0 }
  },
  // ...
};
```

### 3. 权限 Hook (`src/shared/hooks/useAccess.ts`)

```typescript
export function useAccess() {
  return {
    checkPermission,      // 检查单个权限
    checkModuleAccess,    // 检查模块访问权限
    recordUsage,          // 记录使用统计
    subscription,         // 当前订阅信息
    usageStats,          // 使用统计
    // ...
  };
}
```

### 4. 权限门控组件 (`components/permissions/Header.tsx`)

```typescript
<Header permission="pos_access">
  <POSConsensusDemo />
</Header>
```

### 5. 使用量指示器 (`components/permissions/UsageIndicator.tsx`)

```typescript
<UsageIndicator type="articles" />
<UsageIndicator type="exports" />
```

## 使用方法

### 1. 基础权限检查

```typescript
import { useAccess } from '@/src/shared/hooks/useAccess';

function MyComponent() {
  const { checkPermission } = useAccess();
  
  const handlePOSAccess = () => {
    const result = checkPermission('pos_access');
    if (result.hasPermission) {
      // 允许访问
    } else {
      // 显示升级提示
      console.log(result.reason);
      console.log(result.upgradeRequired);
    }
  };
}
```

### 2. 声明式权限控制

```typescript
// 有权限时显示内容，无权限时显示升级提示
<Header permission="pos_access">
  <POSDemo />
</Header>

// 自定义无权限时的显示内容
<Header 
  permission="pos_access"
  fallback={<CustomUpgradePrompt />}
>
  <POSDemo />
</Header>

// 仅检查权限，不显示升级提示
<Header 
  permission="pos_access"
  showUpgradePrompt={false}
>
  <POSDemo />
</Header>
```

### 3. 使用统计记录

```typescript
const { recordUsage } = useAccess();

// 记录文章阅读
await recordUsage('article_view', { 
  articleId: 'blockchain-basics',
  readTime: 300 
});

// 记录共识机制访问
await recordUsage('consensus_access', { 
  type: 'pos',
  duration: 120 
});

// 记录数据导出
await recordUsage('data_export', { 
  format: 'json',
  recordCount: 1000 
});
```

### 4. 使用量显示

```typescript
// 显示文章阅读使用量
<UsageIndicator type="articles" />

// 显示数据导出使用量  
<UsageIndicator type="exports" />
```

## 实际应用示例

### 1. 共识机制页面

```typescript
// pages/pos/staking.tsx
export default function POSStakingPage() {
  return (
    <Header permission="pos_access">
      <POSStakingDemo />
    </Header>
  );
}
```

### 2. 文章详情页面

```typescript
// pages/article/[slug].tsx
export default function ArticleDetailPage() {
  const { recordUsage } = useAccess();
  
  useEffect(() => {
    // 记录文章阅读
    recordUsage('article_view', { articleId: slug });
  }, [slug]);
  
  return (
    <Header permission="article_read">
      <ArticleContent />
    </Header>
  );
}
```

### 3. 数据导出功能

```typescript
// components/DataExportButton.tsx
function DataExportButton() {
  const { checkPermission, recordUsage } = useAccess();
  
  const handleExport = async () => {
    const result = checkPermission('export_data');
    if (!result.hasPermission) {
      // 显示升级提示
      return;
    }
    
    // 执行导出
    await exportData();
    await recordUsage('data_export', { format: 'csv' });
  };
  
  return (
    <Header permission="export_data">
      <button onClick={handleExport}>
        导出数据
      </button>
    </Header>
  );
}
```

### 4. 侧边栏使用量显示

```typescript
// components/Sidebar.tsx
function Sidebar() {
  return (
    <div className="sidebar">
      {/* 其他内容 */}
      
      <div className="usage-section">
        <h3>使用统计</h3>
        <UsageIndicator type="articles" />
        <UsageIndicator type="exports" />
      </div>
    </div>
  );
}
```

## 扩展性设计

### 1. 添加新权限

在 `types/permission.ts` 中添加新的权限类型：

```typescript
export type Header = 
  | 'existing_permissions...'
  | 'new_feature_access';    // 新权限
```

在 `config/subscriptions.ts` 中配置权限分配：

```typescript
export const SUBSCRIPTION_PLANS = {
  premium: {
    permissions: [..., 'new_feature_access']
  }
};
```

### 2. 添加新的使用限制

```typescript
interface SubscriptionConfig {
  limitations?: {
    maxArticleViews?: number;
    maxExports?: number;
    maxNewFeatureUsage?: number;  // 新限制
  };
}
```

### 3. 自定义权限检查逻辑

```typescript
const customPermissionCheck = useCallback((permission: Header) => {
  const baseResult = checkPermission(permission);
  
  // 添加自定义逻辑
  if (permission === 'special_feature' && isWeekend()) {
    return { hasPermission: false, reason: '周末不可用' };
  }
  
  return baseResult;
}, [checkPermission]);
```

## 最佳实践

### 1. 权限检查时机

- **页面级**: 在页面组件中使用 `Header`
- **功能级**: 在具体功能按钮/组件中检查权限
- **API 调用前**: 在发起 API 请求前验证权限

### 2. 用户体验优化

- 提供清晰的升级路径和价格信息
- 显示使用量进度，提前提醒用户
- 为接近限制的用户提供升级建议

### 3. 性能考虑

- 权限配置使用静态数据，避免频繁 API 调用
- 使用 React.memo 优化权限组件渲染
- 合理缓存用户订阅和使用统计数据

### 4. 安全考虑

- 前端权限检查仅用于 UI 控制
- 后端 API 必须进行独立的权限验证
- 敏感操作需要额外的身份验证

这个权限系统设计灵活、可扩展，能够很好地支持当前的定价模式，并为未来的功能扩展提供了良好的基础。
