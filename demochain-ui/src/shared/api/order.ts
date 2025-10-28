import {OrderDTO, OrderVO} from '../types/order';
import request from '../utils/request';
import {R} from "@/src/shared/types/response";

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

// 创建支付订单（后端）
export async function addOrderAPI(payload: OrderDTO): Promise<R<String>> {
    const response = await request.post<any>('/api/order/add', payload);
    if (!response.success) {
        throw new Error(response.message || '注册失败');
    }
    return response;
}


// 获取用户订单历史
export async function pageOrder(page: number = 1, size: number = 10): Promise<OrderVO[]> {
    const resp = await request.get<OrderVO[]>(`/api/order/page?page=${page}&size=${size}`);
    if (!resp.success) {
        throw new Error(resp.message || '获取订单失败');
    }
    return resp.data ? resp.data : [];
}
