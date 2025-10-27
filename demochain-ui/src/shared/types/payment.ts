import { SubscriptionPlan } from './subscription';

// 支付方式
export type PaymentMethod = 'usdt_trc20' | 'usdt_erc20' | 'usdt_bep20';

// 支付状态
export type PaymentStatus = 'pending' | 'confirming' | 'completed' | 'failed' | 'expired';

// 订单状态
export type OrderStatus = 'created' | 'pending_payment' | 'paid' | 'confirmed' | 'completed' | 'cancelled' | 'expired';

// USDT 网络配置
export interface USDTNetwork {
  id: PaymentMethod;
  name: string;
  symbol: string;
  network: string;
  contractAddress?: string;
  decimals: number;
  minAmount: number;
  confirmations: number;
  fee: number;
}

// 支付订单
export interface PaymentOrder {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  amount: number; // USDT 金额
  currency: 'USDT';
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  
  // 支付信息
  paymentAddress: string; // 收款地址
  paymentAmount: number;  // 实际支付金额（包含手续费）
  
  // 交易信息
  txHash?: string;        // 交易哈希
  blockHeight?: number;   // 区块高度
  confirmations?: number; // 确认数
  
  // 时间信息
  createdAt: string;
  expiresAt: string;      // 订单过期时间
  paidAt?: string;        // 支付时间
  confirmedAt?: string;   // 确认时间
  
  // 元数据
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
  };
}

// 支付请求
export interface CreatePaymentRequest {
  plan: SubscriptionPlan;
  paymentMethod: PaymentMethod;
  returnUrl?: string;
}

// 支付响应
export interface CreatePaymentResponse {
  order: PaymentOrder;
  qrCode: string;         // 支付二维码
  deepLink: string;       // 钱包深链接
}

// 支付验证请求
export interface VerifyPaymentRequest {
  orderId: string;
  txHash: string;
}

// 支付验证响应
export interface VerifyPaymentResponse {
  success: boolean;
  order: PaymentOrder;
  message?: string;
}

// 汇率信息
export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: string;
}

// 支付配置
export interface PaymentConfig {
  networks: USDTNetwork[];
  exchangeRates: ExchangeRate[];
  orderTimeout: number;    // 订单超时时间（分钟）
  minConfirmations: number; // 最小确认数
  supportEmail: string;
}
