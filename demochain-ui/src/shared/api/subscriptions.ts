import { UserSubscription, UsageStats, SubscriptionPlan } from '../types/subscription';

// 模拟 API 延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 获取用户订阅信息
export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  await delay(300);
  
  // 模拟数据 - 实际应用中从后端 API 获取
  return {
    id: '1',
    userId,
    plan: 'free',
    status: 'active',
    startDate: '2024-01-01T00:00:00Z',
    autoRenew: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };
}

// 获取用户使用统计
export async function getUserUsageStats(userId: string): Promise<UsageStats | null> {
  await delay(200);
  
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  
  return {
    userId,
    period: currentMonth,
    articleViews: Math.floor(Math.random() * 15), // 模拟随机使用量
    dataExports: Math.floor(Math.random() * 5),
    consensusAccess: {
      'pow': Math.floor(Math.random() * 20),
      'pos': Math.floor(Math.random() * 10),
      'dpos': Math.floor(Math.random() * 8),
      'bft': Math.floor(Math.random() * 6),
      'poh': Math.floor(Math.random() * 4)
    },
    lastUpdated: new Date().toISOString()
  };
}

// 创建订阅
export async function createSubscription(data: {
  userId: string;
  plan: SubscriptionPlan;
  paymentMethod: string;
}): Promise<UserSubscription> {
  await delay(500);
  
  const now = new Date().toISOString();
  const startDate = now;
  let endDate: string | undefined;
  
  // 计算结束日期
  if (data.plan === 'monthly') {
    const end = new Date();
    end.setMonth(end.getMonth() + 1);
    endDate = end.toISOString();
  } else if (data.plan === 'yearly') {
    const end = new Date();
    end.setFullYear(end.getFullYear() + 1);
    endDate = end.toISOString();
  }
  // lifetime 计划没有结束日期
  
  return {
    id: Date.now().toString(),
    userId: data.userId,
    plan: data.plan,
    status: 'active',
    startDate,
    endDate,
    autoRenew: data.plan !== 'lifetime',
    paymentMethod: data.paymentMethod,
    createdAt: now,
    updatedAt: now
  };
}

// 更新订阅
export async function updateSubscription(
  subscriptionId: string,
  updates: Partial<UserSubscription>
): Promise<UserSubscription> {
  await delay(300);
  
  // 模拟更新 - 实际应用中调用后端 API
  const existing = await getUserSubscription(updates.userId || '');
  if (!existing) {
    throw new Error('Subscription not found');
  }
  
  return {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };
}

// 取消订阅
export async function cancelSubscription(subscriptionId: string): Promise<void> {
  await delay(300);
  
  // 模拟取消操作 - 实际应用中调用后端 API
  console.log(`Subscription ${subscriptionId} cancelled`);
}

// 记录使用统计
export async function recordUsage(data: {
  userId: string;
  action: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  await delay(100);
  
  // 模拟记录使用统计 - 实际应用中发送到后端分析服务
  console.log('Usage recorded:', data);
}

// 获取订阅历史
export async function getSubscriptionHistory(userId: string): Promise<UserSubscription[]> {
  await delay(300);
  
  // 模拟历史数据
  return [
    {
      id: '1',
      userId,
      plan: 'free',
      status: 'active',
      startDate: '2024-01-01T00:00:00Z',
      autoRenew: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];
}

// 验证支付并激活订阅
export async function verifyPaymentAndActivate(data: {
  userId: string;
  plan: SubscriptionPlan;
  paymentId: string;
}): Promise<UserSubscription> {
  await delay(1000); // 模拟支付验证时间
  
  // 模拟支付验证成功
  return createSubscription({
    userId: data.userId,
    plan: data.plan,
    paymentMethod: 'stripe'
  });
}
