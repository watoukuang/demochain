# POS 权限系统使用指南

本文档详细说明如何在 POS (权益证明) 功能模块中使用权限系统。

## 🎯 权限控制概述

POS 功能属于付费功能，需要以下权限：
- **权限名称**: `pos_access`
- **所需订阅**: 月度会员 ($3/月) 及以上
- **免费用户**: 无法访问，会显示升级提示

## 📁 文件结构

```
pages/pos/
├── staking.tsx      # 质押池演示 (已集成权限系统)
├── validators.tsx   # 验证者选择 (已集成权限系统)  
├── delegation.tsx   # 委托投票
├── slashing.tsx     # 惩罚机制
└── chain.tsx        # POS 区块链
```

## 🔧 集成步骤

### 1. 导入必要组件

```typescript
import React, { useState, useEffect } from 'react'
import PermissionGate from '@/components/permission/PermissionGate'
import { usePerms } from '@/src/shared/hooks/usePerms'
```

### 2. 使用权限 Hook

```typescript
export default function POSComponent() {
  const { recordUsage } = usePerms()
  
  // 记录页面访问
  useEffect(() => {
    recordUsage('consensus_access', { 
      type: 'pos', 
      module: 'staking', // 或 'validators', 'delegation' 等
      timestamp: new Date().toISOString()
    })
  }, [recordUsage])
  
  // 其他组件逻辑...
}
```

### 3. 包装页面内容

```typescript
return (
  <PermissionGate permission="pos_access">
    {/* 页面内容 */}
    <div className="px-4 py-8">
      {/* 实际功能组件 */}
    </div>
  </PermissionGate>
)
```

### 4. 记录用户操作

```typescript
const handleStaking = async (amount: number) => {
  // 执行质押逻辑
  setStaked(prev => prev + amount)
  
  // 记录操作统计
  await recordUsage('pos_staking', { 
    action: 'stake', 
    amount,
    newBalance: balance - amount,
    newStaked: staked + amount
  })
}
```

## 📊 使用统计记录

### 页面访问统计

```typescript
// 记录页面访问
useEffect(() => {
  recordUsage('consensus_access', { 
    type: 'pos',
    module: 'staking', // 模块名称
    timestamp: new Date().toISOString()
  })
}, [recordUsage])
```

### 功能操作统计

```typescript
// 质押操作
await recordUsage('pos_staking', { 
  action: 'stake',
  amount: 100,
  newBalance: 900,
  newStaked: 100
})

// 验证者选择
await recordUsage('pos_validator_selection', { 
  selectedValidator: 'V2',
  validatorStake: 500,
  totalStake: 1000,
  probability: '50.00'
})

// 委托投票
await recordUsage('pos_delegation', { 
  action: 'delegate',
  validator: 'V1',
  amount: 200
})
```

## 🎨 UI 设计模式

### 1. 页面标题区域

```typescript
{/* 页面标题和权限提示 */}
<div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
        POS · 质押池
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        权益证明共识机制演示 - 付费功能
      </p>
    </div>
    <div className="flex items-center space-x-2">
      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
        已解锁
      </span>
    </div>
  </div>
</div>
```

### 2. 功能说明区域

```typescript
{/* 说明信息 */}
<div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
  <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
    💡 演示要点
  </h3>
  <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
    <li>• 通过质押代币获得验证权益，质押越多被选中概率越高</li>
    <li>• 质押的代币会被锁定，但可以获得区块奖励</li>
    <li>• 赎回操作通常有等待期，防止恶意行为</li>
  </ul>
</div>
```

## 🚫 权限拒绝处理

当用户没有 `pos_access` 权限时，`PermissionGate` 会自动显示升级提示：

### 升级提示内容
- **标题**: "需要升级访问权限"
- **说明**: 当前免费版不支持此功能
- **推荐计划**: 月度会员 ($3/月)
- **功能列表**: 显示升级后可获得的功能
- **操作按钮**: "查看所有计划" 和 "了解更多"

### 自定义权限拒绝

```typescript
<PermissionGate 
  permission="pos_access"
  fallback={<CustomUpgradePrompt />}
>
  <POSContent />
</PermissionGate>
```

## 🔍 权限检查方式

### 1. 声明式检查 (推荐)

```typescript
<PermissionGate permission="pos_access">
  <POSStakingDemo />
</PermissionGate>
```

### 2. 编程式检查

```typescript
const { checkPermission } = usePerms()

const handlePOSAccess = () => {
  const result = checkPermission('pos_access')
  if (result.hasPermission) {
    // 允许访问
    navigateToPOSDemo()
  } else {
    // 显示升级提示
    showUpgradeModal(result.upgradeRequired)
  }
}
```

### 3. 模块级检查

```typescript
const { checkModuleAccess } = usePerms()

const result = checkModuleAccess('pos_consensus')
if (result.hasPermission) {
  // 允许访问 POS 共识模块
}
```

## 📈 数据分析

### 使用统计数据结构

```typescript
// 用户使用统计
{
  userId: "user123",
  period: "2024-01",
  consensusAccess: {
    "pow": 15,  // POW 访问次数
    "pos": 8,   // POS 访问次数 (付费功能)
    "dpos": 3,  // DPoS 访问次数
    "bft": 2,   // BFT 访问次数
    "poh": 1    // POH 访问次数
  }
}
```

### 操作统计示例

```typescript
// POS 质押操作统计
{
  action: "pos_staking",
  metadata: {
    action: "stake",
    amount: 100,
    newBalance: 900,
    newStaked: 100,
    timestamp: "2024-01-15T10:30:00Z"
  }
}

// POS 验证者选择统计
{
  action: "pos_validator_selection", 
  metadata: {
    selectedValidator: "V2",
    validatorStake: 500,
    totalStake: 1000,
    probability: "50.00",
    timestamp: "2024-01-15T10:35:00Z"
  }
}
```

## 🎯 最佳实践

### 1. 权限检查时机
- **页面级**: 使用 `PermissionGate` 包装整个页面
- **功能级**: 在具体操作前检查权限
- **导航级**: 在菜单中显示权限状态

### 2. 用户体验优化
- 清晰标识付费功能
- 提供升级路径指引
- 记录详细的使用统计

### 3. 错误处理
- 优雅处理权限拒绝
- 提供有意义的错误信息
- 引导用户进行升级

### 4. 性能优化
- 权限检查结果缓存
- 避免频繁的权限验证
- 合理使用 React.memo

## 🔄 完整示例

以下是一个完整的 POS 页面权限集成示例：

```typescript
"use client"

import React, { useState, useEffect } from 'react'
import PermissionGate from '@/components/permission/PermissionGate'
import { usePerms } from '@/src/shared/hooks/usePerms'

export default function POSStaking() {
  const { recordUsage } = usePerms()
  const [balance, setBalance] = useState(1000)
  const [staked, setStaked] = useState(0)

  // 记录页面访问
  useEffect(() => {
    recordUsage('consensus_access', { 
      type: 'pos', 
      module: 'staking',
      timestamp: new Date().toISOString()
    })
  }, [recordUsage])

  const handleStake = async (amount: number) => {
    setBalance(prev => prev - amount)
    setStaked(prev => prev + amount)
    
    await recordUsage('pos_staking', { 
      action: 'stake', 
      amount,
      newBalance: balance - amount,
      newStaked: staked + amount
    })
  }

  return (
    <PermissionGate permission="pos_access">
      <div className="px-4 py-8">
        {/* 页面内容 */}
        <POSStakingInterface 
          balance={balance}
          staked={staked}
          onStake={handleStake}
        />
      </div>
    </PermissionGate>
  )
}
```

通过这种方式，POS 功能完全集成了权限系统，确保只有付费用户才能访问，同时提供了良好的用户体验和详细的使用统计。
