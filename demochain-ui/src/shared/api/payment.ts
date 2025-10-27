import { 
  CreatePaymentRequest, 
  CreatePaymentResponse, 
  PaymentOrder, 
  VerifyPaymentRequest, 
  VerifyPaymentResponse,
  PaymentMethod 
} from '../types/payment';
import { PAYMENT_ADDRESSES, SUBSCRIPTION_PRICES } from '../config/payment';

// 模拟 API 延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 生成订单 ID
const generateOrderId = () => `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// 生成支付地址二维码
const generateQRCode = (address: string, amount: number, network: string) => {
  // 实际项目中使用 QR 码生成库
  const qrData = `${network}:${address}?amount=${amount}`;
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="white"/>
      <text x="100" y="100" text-anchor="middle" font-size="12" fill="black">
        QR Code for ${amount} USDT
      </text>
      <text x="100" y="120" text-anchor="middle" font-size="10" fill="gray">
        ${address.substring(0, 20)}...
      </text>
    </svg>
  `)}`;
};

// 生成钱包深链接
const generateDeepLink = (address: string, amount: number, method: PaymentMethod) => {
  switch (method) {
    case 'usdt_trc20':
      return `tronlink://transfer?to=${address}&amount=${amount}&token=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`;
    case 'usdt_erc20':
      return `ethereum:${address}@1?value=${amount * 1e6}&token=0xdAC17F958D2ee523a2206206994597C13D831ec7`;
    case 'usdt_bep20':
      return `bnb:${address}?amount=${amount}&token=0x55d398326f99059fF775485246999027B3197955`;
    default:
      return '';
  }
};

// 创建支付订单
export async function createPaymentOrder(request: CreatePaymentRequest): Promise<CreatePaymentResponse> {
  await delay(500);
  
  // 免费计划不需要支付
  if (request.plan === 'free') {
    throw new Error('免费计划无需支付');
  }
  
  const orderId = generateOrderId();
  const amount = SUBSCRIPTION_PRICES[request.plan as keyof typeof SUBSCRIPTION_PRICES];
  const paymentAddress = PAYMENT_ADDRESSES[request.paymentMethod];
  
  if (!paymentAddress) {
    throw new Error(`Unsupported payment method: ${request.paymentMethod}`);
  }
  
  const order: PaymentOrder = {
    id: orderId,
    userId: 'current_user', // 实际项目中从认证上下文获取
    plan: request.plan,
    amount,
    currency: 'USDT',
    paymentMethod: request.paymentMethod,
    status: 'created',
    paymentAddress,
    paymentAmount: amount, // 暂时不加手续费
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30分钟后过期
  };
  
  const qrCode = generateQRCode(paymentAddress, amount, request.paymentMethod);
  const deepLink = generateDeepLink(paymentAddress, amount, request.paymentMethod);
  
  // 模拟保存到数据库
  localStorage.setItem(`payment_order_${orderId}`, JSON.stringify(order));
  
  return {
    order,
    qrCode,
    deepLink
  };
}

// 获取支付订单
export async function getPaymentOrder(orderId: string): Promise<PaymentOrder | null> {
  await delay(200);
  
  const orderData = localStorage.getItem(`payment_order_${orderId}`);
  if (!orderData) {
    return null;
  }
  
  return JSON.parse(orderData);
}

// 更新支付订单
export async function updatePaymentOrder(orderId: string, updates: Partial<PaymentOrder>): Promise<PaymentOrder> {
  await delay(200);
  
  const order = await getPaymentOrder(orderId);
  if (!order) {
    throw new Error('Order not found');
  }
  
  const updatedOrder = { ...order, ...updates };
  localStorage.setItem(`payment_order_${orderId}`, JSON.stringify(updatedOrder));
  
  return updatedOrder;
}

// 验证支付
export async function verifyPayment(request: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
  await delay(1000); // 模拟区块链查询延迟
  
  const order = await getPaymentOrder(request.orderId);
  if (!order) {
    return {
      success: false,
      order: null as any,
      message: '订单不存在'
    };
  }
  
  // 模拟交易验证逻辑
  const isValidTx = request.txHash.length === 64; // 简单验证
  
  if (isValidTx) {
    const updatedOrder = await updatePaymentOrder(request.orderId, {
      status: 'paid',
      txHash: request.txHash,
      paidAt: new Date().toISOString(),
      confirmations: 1
    });
    
    return {
      success: true,
      order: updatedOrder,
      message: '支付验证成功'
    };
  } else {
    return {
      success: false,
      order,
      message: '交易哈希无效'
    };
  }
}

// 检查订单状态
export async function checkOrderStatus(orderId: string): Promise<PaymentOrder | null> {
  await delay(300);
  
  const order = await getPaymentOrder(orderId);
  if (!order) {
    return null;
  }
  
  // 检查订单是否过期
  if (new Date() > new Date(order.expiresAt) && order.status === 'created') {
    const expiredOrder = await updatePaymentOrder(orderId, {
      status: 'expired'
    });
    return expiredOrder;
  }
  
  // 模拟自动确认逻辑
  if (order.status === 'paid' && order.confirmations && order.confirmations >= 1) {
    const confirmedOrder = await updatePaymentOrder(orderId, {
      status: 'confirmed',
      confirmedAt: new Date().toISOString()
    });
    return confirmedOrder;
  }
  
  return order;
}

// 获取用户订单历史
export async function getUserOrders(userId: string): Promise<PaymentOrder[]> {
  await delay(300);
  
  const orders: PaymentOrder[] = [];
  
  // 从 localStorage 获取所有订单（实际项目中从后端 API 获取）
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('payment_order_')) {
      const orderData = localStorage.getItem(key);
      if (orderData) {
        const order = JSON.parse(orderData);
        if (order.userId === userId) {
          orders.push(order);
        }
      }
    }
  }
  
  // 按创建时间倒序排列
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// 取消订单
export async function cancelOrder(orderId: string): Promise<PaymentOrder> {
  await delay(200);
  
  const order = await getPaymentOrder(orderId);
  if (!order) {
    throw new Error('订单不存在');
  }
  
  if (order.status !== 'created' && order.status !== 'pending_payment') {
    throw new Error('订单状态不允许取消');
  }
  
  return updatePaymentOrder(orderId, {
    status: 'cancelled'
  });
}
