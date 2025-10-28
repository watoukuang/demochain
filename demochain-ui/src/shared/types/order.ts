import {Plan} from "@/src/shared/types/plan";

export type Network = 'usdt_trc20' | 'usdt_erc20' | 'usdt_bep20';

export type OrderState = 'created' | 'pending_payment' | 'paid' | 'confirmed' | 'completed' | 'cancelled' | 'expired';

export interface USDTNetwork {
    id: Network;
    name: string;
    symbol: string;
    network: string;
    contractAddress?: string;
    decimals: number;
    minAmount: number;
    confirmations: number;
    fee: number;
}

export interface OrderDTO {
    plan_type: string,
    network: string
}

export interface Order {
    id: string;
    user_id: string;
    plan: string;
    amount: number;
    currency: string;
    network: string;
    state: OrderState;
    qrCode: string;
    deep_link: string;
    paymentAddress: string;
    paymentAmount: number;
}

export interface OrderVO {
    id: string;
    user_id: string;
    plan: string;
    amount: number;
    currency: string; // USDT
    network: string;
    state: OrderState; // 使用已定义的 OrderState 类型
    qr_code: string;
    deep_link: string;
    payment_address: string;
    payment_amount: number;
    created: string; // ISO date string
    expires: string; // ISO date string
    tx_hash?: string | null; // 可选字段
    paid?: string | null; // ISO date string
    confirmations?: number | null;
    confirmed?: string | null; // ISO date string
}


