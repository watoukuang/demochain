import { USDTNetwork, PaymentConfig } from '../types/order';

// USDT 网络配置
export const USDT_NETWORKS: USDTNetwork[] = [
  {
    id: 'usdt_trc20',
    name: 'USDT (TRC-20)',
    symbol: 'USDT',
    network: 'TRON',
    contractAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    decimals: 6,
    minAmount: 1,
    confirmations: 1,
    fee: 0 // TRC-20 转账费用很低
  },
  {
    id: 'usdt_erc20',
    name: 'USDT (ERC-20)',
    symbol: 'USDT',
    network: 'Ethereum',
    contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
    minAmount: 1,
    confirmations: 12,
    fee: 0 // 实际费用由用户承担
  },
  {
    id: 'usdt_bep20',
    name: 'USDT (BEP-20)',
    symbol: 'USDT',
    network: 'BSC',
    contractAddress: '0x55d398326f99059fF775485246999027B3197955',
    decimals: 18,
    minAmount: 1,
    confirmations: 3,
    fee: 0
  }
];

// 支付配置
export const PAYMENT_CONFIG: PaymentConfig = {
  networks: USDT_NETWORKS,
  exchangeRates: [
    {
      from: 'USD',
      to: 'USDT',
      rate: 1.0, // 1 USD = 1 USDT
      lastUpdated: new Date().toISOString()
    }
  ],
  orderTimeout: 30, // 30分钟订单超时
  minConfirmations: 1,
  supportEmail: 'support@demochain.com'
};

// 收款地址配置（实际项目中应该从环境变量或后端获取）
export const PAYMENT_ADDRESSES = {
  usdt_trc20: 'TYASr5UV6HEcXatwdFQfmLVUqQQQMUxHLS', // 示例地址
  usdt_erc20: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // 示例地址
  usdt_bep20: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'  // 示例地址
};

// 订阅计划价格（USDT）
export const SUBSCRIPTION_PRICES = {
  monthly: 3,
  yearly: 10,
  lifetime: 15
} as const;
