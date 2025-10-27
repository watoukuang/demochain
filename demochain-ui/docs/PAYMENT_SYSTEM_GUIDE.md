# USDT 支付系统使用指南

本文档详细说明如何使用 USDT 支付系统完成订阅购买。

## 🎯 支付流程概览

```
选择订阅计划 → 选择支付网络 → 创建订单 → 完成支付 → 自动激活
```

## 💰 支持的支付方式

### USDT 网络支持

| 网络 | 代币标准 | 确认数 | 手续费 | 推荐度 |
|------|----------|--------|--------|--------|
| **TRON (TRC-20)** | TRC-20 | 1 | 极低 | ⭐⭐⭐⭐⭐ |
| **Ethereum (ERC-20)** | ERC-20 | 12 | 较高 | ⭐⭐⭐ |
| **BSC (BEP-20)** | BEP-20 | 3 | 低 | ⭐⭐⭐⭐ |

### 订阅价格

- **月度会员**: 3 USDT/月
- **年度会员**: 10 USDT/年 (节省 70%)
- **终身会员**: 15 USDT (一次性付费)

## 🛒 购买流程

### 1. 选择订阅计划

访问 `/pricing` 页面，选择适合的订阅计划：

```typescript
// 点击订阅按钮
<button onClick={() => handleSubscribe('月度会员')}>
  开始订阅 - 3 USDT
</button>
```

### 2. 选择支付网络

在支付弹窗中选择 USDT 网络：

- **推荐**: USDT (TRC-20) - 手续费最低
- **备选**: USDT (BEP-20) - 速度较快
- **传统**: USDT (ERC-20) - 最安全但手续费高

### 3. 创建支付订单

系统会自动创建支付订单：

```typescript
const order = await createPaymentOrder({
  plan: 'monthly',
  paymentMethod: 'usdt_trc20'
});
```

订单信息包括：
- 订单号 (30分钟有效期)
- 收款地址
- 支付金额
- 支付二维码

### 4. 完成支付

#### 方式一：扫码支付
1. 使用钱包 APP 扫描二维码
2. 确认支付金额和地址
3. 发送交易

#### 方式二：手动转账
1. 复制收款地址
2. 在钱包中手动输入地址和金额
3. 选择正确的网络发送

#### 方式三：钱包链接
1. 点击"打开钱包支付"按钮
2. 自动跳转到钱包 APP
3. 确认并发送交易

### 5. 等待确认

- 系统每 5 秒自动检查支付状态
- TRC-20: 通常 1-3 分钟确认
- BEP-20: 通常 1-5 分钟确认  
- ERC-20: 通常 5-15 分钟确认

## 🔧 技术实现

### 支付组件使用

```typescript
import PaymentModal from '@/components/payment/PaymentModal';

function PricingPage() {
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    plan: null
  });

  const handleSubscribe = (plan: SubscriptionPlan) => {
    setPaymentModal({ isOpen: true, plan });
  };

  const handlePaymentSuccess = (order: PaymentOrder) => {
    // 支付成功处理
    console.log('Payment successful:', order);
  };

  return (
    <>
      <button onClick={() => handleSubscribe('monthly')}>
        月度订阅
      </button>
      
      <PaymentModal
        isOpen={paymentModal.isOpen}
        plan={paymentModal.plan}
        onClose={() => setPaymentModal({ isOpen: false, plan: null })}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}
```

### API 接口

#### 创建支付订单

```typescript
const response = await createPaymentOrder({
  plan: 'monthly',
  paymentMethod: 'usdt_trc20'
});

// 返回数据
{
  order: PaymentOrder,
  qrCode: string,      // 支付二维码
  deepLink: string     // 钱包深链接
}
```

#### 检查订单状态

```typescript
const order = await checkOrderStatus(orderId);

// 订单状态
- 'created': 已创建
- 'pending_payment': 待支付  
- 'paid': 已支付
- 'confirmed': 已确认
- 'completed': 已完成
- 'expired': 已过期
```

#### 获取订单历史

```typescript
const orders = await getUserOrders(userId);
```

## 🎨 UI 组件

### PaymentModal 组件

支付弹窗包含三个步骤：

1. **选择支付方式** (`select`)
   - 显示订阅计划信息
   - 选择 USDT 网络
   - 确认支付按钮

2. **完成支付** (`payment`)
   - 倒计时显示
   - 收款地址和二维码
   - 支付说明和注意事项

3. **支付成功** (`confirm`)
   - 成功提示
   - 交易信息显示
   - 完成按钮

### 订单管理页面

访问 `/orders` 查看订单历史：

- 订单列表展示
- 状态筛选
- 详情查看
- 支付重试 (针对失败订单)

## 🔒 安全注意事项

### 用户端安全

1. **验证收款地址**
   - 仔细核对收款地址
   - 确认网络类型正确
   - 避免地址输入错误

2. **金额确认**
   - 支付金额必须完全一致
   - 不要多付或少付
   - 注意小数点位数

3. **网络选择**
   - 确保选择正确的网络
   - TRC-20 只能用 TRON 网络
   - ERC-20 只能用 Ethereum 网络
   - BEP-20 只能用 BSC 网络

### 系统端安全

1. **地址管理**
   ```typescript
   // 收款地址应该从环境变量获取
   const PAYMENT_ADDRESSES = {
     usdt_trc20: process.env.TRON_USDT_ADDRESS,
     usdt_erc20: process.env.ETH_USDT_ADDRESS,
     usdt_bep20: process.env.BSC_USDT_ADDRESS
   };
   ```

2. **订单验证**
   ```typescript
   // 后端需要验证交易真实性
   const isValidTransaction = await verifyBlockchainTransaction(
     txHash, 
     expectedAmount, 
     receiverAddress
   );
   ```

3. **重复支付检测**
   ```typescript
   // 防止同一交易被重复确认
   const existingOrder = await findOrderByTxHash(txHash);
   if (existingOrder) {
     throw new Error('Transaction already processed');
   }
   ```

## 📊 数据统计

### 支付统计

```typescript
// 记录支付相关统计
await recordUsage('payment_created', {
  plan: 'monthly',
  paymentMethod: 'usdt_trc20',
  amount: 3
});

await recordUsage('payment_completed', {
  orderId: 'ORDER_123',
  txHash: '0x...',
  confirmationTime: 120 // 秒
});
```

### 转化率分析

- 访问定价页面次数
- 点击订阅按钮次数
- 创建订单次数
- 完成支付次数
- 订阅激活次数

## 🚨 常见问题

### Q: 支付后多久到账？
A: 
- TRC-20: 1-3 分钟
- BEP-20: 1-5 分钟
- ERC-20: 5-15 分钟

### Q: 支付金额错误怎么办？
A: 
- 少付：订单会自动过期，需重新支付
- 多付：联系客服处理退款

### Q: 选错网络怎么办？
A: 
- 资产可能丢失，请务必选择正确网络
- 联系客服尝试恢复

### Q: 订单过期了怎么办？
A: 
- 重新创建订单
- 原订单会自动取消

### Q: 如何查看支付记录？
A: 
- 访问 `/orders` 页面
- 查看完整的订单历史

## 🔄 集成清单

### 前端集成

- [x] 支付类型定义
- [x] 支付配置管理
- [x] 支付 API 接口
- [x] PaymentModal 组件
- [x] 订单管理页面
- [x] 定价页面集成

### 后端集成 (待实现)

- [ ] 区块链交易验证
- [ ] 订单状态管理
- [ ] 支付回调处理
- [ ] 订阅激活逻辑
- [ ] 退款处理机制

### 测试清单

- [ ] 支付流程测试
- [ ] 网络切换测试
- [ ] 订单过期测试
- [ ] 支付确认测试
- [ ] 错误处理测试

这个 USDT 支付系统提供了完整的加密货币支付解决方案，支持多个主流网络，具有良好的用户体验和安全保障。
