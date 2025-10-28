import {OrderDTO, OrderVO} from '../types/order';
import request from '../utils/request';
import {R} from "@/src/shared/types/response";

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
const generateDeepLink = (address: string, amount: number, method: string) => {
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

// 创建支付订单（后端）
export async function addOrderAPI(payload: OrderDTO): Promise<R<String>> {
    const response = await request.post<any>('/api/order/add', payload);
    if (!response.success) {
        throw new Error(response.message || '注册失败');
    }
    return response;
}


// 获取用户订单历史
export async function pageOrder(page: number = 1, size: number = 10): Promise<PaymentOrder[]> {
    const resp = await request.get<PaymentOrder[]>(`/api/order/page?page=${page}&size=${size}`);
    if (!resp.success) {
        throw new Error(resp.message || '获取订单失败');
    }
    return resp.data ? resp.data : [];
}
