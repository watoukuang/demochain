import {
    CreateOrderPayload,
    CreatePaymentResponse,
    PaymentOrder,
    VerifyPaymentRequest,
    VerifyPaymentResponse
} from '../types/order';
import request from '../utils/request';
import {R} from "@/types/response";

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
export async function createOrderAPI(payload: CreateOrderPayload): Promise<CreatePaymentResponse> {
    // 免费计划不需要支付
    if (payload.plan === 'free') {
        throw new Error('免费计划无需支付');
    }
    // 转换前端 payload 为后端期望的格式
    const backendPayload = {
        plan: payload.plan,
        network: payload.network
    };
    const res = await request.post<any>('/api/order/create', backendPayload);
    if (!res.success || !res.data) throw new Error(res.message || '创建订单失败');
    // 新后端直接返回 Order（包含 qr_code、deep_link）
    const o: any = res.data;
    const mapped: CreatePaymentResponse = {
        order: {
            id: o.id,
            userId: o.user_id,
            plan: o.plan,
            amount: o.amount,
            currency: o.currency,
            paymentMethod: o.network, // 后端字段 network
            status: o.state,          // 后端字段 state
            paymentAddress: o.payment_address,
            paymentAmount: o.payment_amount,
            createdAt: o.created,     // 后端字段 created
            expiresAt: o.expires,     // 后端字段 expires
            txHash: o.tx_hash ?? undefined,
            paidAt: o.paid ?? undefined,
            confirmations: o.confirmations ?? undefined,
            confirmedAt: o.confirmed ?? undefined,
        },
        qrCode: o.qr_code,
        deepLink: o.deep_link,
    };
    return mapped;
}

// 获取支付订单
export async function getPaymentOrder(orderId: string): Promise<PaymentOrder | null> {
    const res = await request.get<PaymentOrder>(`/api/payments/orders/${orderId}`);
    if (!res.success) return null;
    const order: any = res.data;
    if (!order) return null;
    return {
        id: order.id,
        userId: order.user_id,
        plan: order.plan,
        amount: order.amount,
        currency: order.currency,
        paymentMethod: order.payment_method,
        status: order.status,
        paymentAddress: order.payment_address,
        paymentAmount: order.payment_amount,
        createdAt: order.created_at,
        expiresAt: order.expires_at,
        txHash: order.tx_hash ?? undefined,
        paidAt: order.paid_at ?? undefined,
        confirmations: order.confirmations ?? undefined,
        confirmedAt: order.confirmed_at ?? undefined,
    };
}

// 更新支付订单
export async function updatePaymentOrder(orderId: string, updates: Partial<PaymentOrder>): Promise<PaymentOrder> {
    throw new Error('Not implemented on client. Use backend API.');
}

// 验证支付
export async function verifyPayment(request: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
    // 需要后端实现验证接口，这里暂时返回失败或直接返回当前订单
    const order = await getPaymentOrder(request.orderId);
    return {
        success: !!order,
        order: order as any,
        message: order ? 'OK' : '订单不存在',
    };
}

// 检查订单状态
export async function checkOrderStatus(orderId: string): Promise<PaymentOrder | null> {
    return getPaymentOrder(orderId);
}

// 获取用户订单历史
export async function pageOrder(page: number = 1, size: number = 10): Promise<PaymentOrder[]> {
    const resp = await request.get<PaymentOrder[]>(`/api/order/page?page=${page}&size=${size}`);
    if (!resp.success) {
        throw new Error(resp.message || '获取订单失败');
    }
    return resp.data ? resp.data : [];
}

// 取消订单
export async function cancelOrder(orderId: string): Promise<PaymentOrder> {
    throw new Error('Not implemented on backend');
}
