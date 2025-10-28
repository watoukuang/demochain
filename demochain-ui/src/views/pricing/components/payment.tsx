import React, {useEffect, useState} from 'react';
import {CreateOrderPayload, Network, PaymentOrder} from '@/src/shared/types/order';
import {SubscriptionPlan} from '@/src/shared/types/subscription';
import {checkOrderStatus, createOrderAPI} from '@/src/shared/api/order';
import {useToast} from '@/components/toast';
import StepHeader from './step-header';
import SelectStep from './select-step';
import PaymentStep from './payment-step';
import ConfirmStep from './confirm-step';

const PLAN_META = {
    monthly: {name: '月度会员', price: 3, period: '每月'},
    yearly: {name: '年度会员', price: 10, period: '每年'},
    lifetime: {name: '终身会员', price: 15, period: '一次性'}
} as const;

interface PaymentProps {
    isOpen: boolean;
    onClose: () => void;
    plan: SubscriptionPlan;
    onSuccess?: (order: PaymentOrder) => void;
}

export default function Payment({isOpen, onClose, plan, onSuccess}: PaymentProps) {
    const {success, error} = useToast();
    const [entered, setEntered] = useState(false);
    const [step, setStep] = useState<'select' | 'payment' | 'confirm'>('select');
    const [selectedNetwork, setSelectedNetwork] = useState<Network>('usdt_trc20');
    const [paymentOrder, setPaymentOrder] = useState<PaymentOrder | null>(null);
    const [qrCode, setQrCode] = useState<string>('');
    const [deepLink, setDeepLink] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [wsConnected, setWsConnected] = useState(false);
    const [wsTried, setWsTried] = useState(false);

    // 获取计划信息
    const planInfo = plan !== 'free' ? PLAN_META[plan] : null;

    // 倒计时
    useEffect(() => {
        if (paymentOrder && step === 'payment') {
            const expiresAt = new Date(paymentOrder.expiresAt).getTime();
            const timer = setInterval(() => {
                const now = Date.now();
                const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
                setTimeLeft(remaining);
                if (remaining === 0) {
                    clearInterval(timer);
                    error('订单已过期，请重新创建');
                    handleClose();
                }
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [paymentOrder, step, error]);

    // WebSocket 实时状态（主通道）
    useEffect(() => {
        if (!paymentOrder || step !== 'payment') return;

        // 构造 ws 地址
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://demochain.org:8085';
        let wsBase = '';
        try {
            const u = new URL(apiBase);
            wsBase = `${u.protocol === 'https:' ? 'wss' : 'ws'}://${u.host}`;
        } catch {
            // 如果环境变量不是标准 URL，回退为当前站点
            wsBase = (typeof window !== 'undefined' && window.location.protocol === 'https:')
                ? `wss://${window.location.host}`
                : `ws://${typeof window !== 'undefined' ? window.location.host : ''}`;
        }

        const wsUrl = `${wsBase}/api/payments/orders/${paymentOrder.id}/ws`;
        let socket: WebSocket | null = null;
        try {
            socket = new WebSocket(wsUrl);
        } catch (e) {
            console.warn('WS construct failed, fallback to polling:', e);
            setWsConnected(false);
            setWsTried(true);
            return;
        }

        let closed = false;
        socket.onopen = () => {
            setWsConnected(true);
            setWsTried(true);
        };
        socket.onmessage = (evt) => {
            try {
                const data = JSON.parse(evt.data || '{}');
                // 兼容后端字段：state/confirmed/expired 等
                if (data.state) {
                    const next = {
                        ...paymentOrder,
                        status: data.state,
                        txHash: data.tx_hash ?? paymentOrder.txHash,
                        confirmations: data.confirmations ?? paymentOrder.confirmations,
                        // 时间字段如果存在则覆盖
                        paidAt: data.paid ?? paymentOrder.paidAt,
                        confirmedAt: data.confirmed ?? paymentOrder.confirmedAt,
                    } as PaymentOrder;
                    setPaymentOrder(next);
                    if (data.state === 'confirmed') {
                        success('支付成功！订阅已激活');
                        setStep('confirm');
                        onSuccess?.(next);
                        socket?.close();
                    } else if (data.state === 'expired') {
                        error('订单已过期');
                        socket?.close();
                        handleClose();
                    }
                }
            } catch (e) {
                // 忽略无法解析的数据
            }
        };
        socket.onerror = () => {
            setWsConnected(false);
        };
        socket.onclose = () => {
            if (!closed) setWsConnected(false);
        };

        return () => {
            closed = true;
            try { socket?.close(); } catch {}
        };
    }, [paymentOrder, step, success, error, onSuccess]);

    // 轮询订单状态（WS 失效兜底，低频）
    useEffect(() => {
        if (paymentOrder && step === 'payment' && wsTried && !wsConnected) {
            const pollInterval = setInterval(async () => {
                try {
                    const updatedOrder = await checkOrderStatus(paymentOrder.id);
                    if (updatedOrder) {
                        setPaymentOrder(updatedOrder);
                        if (updatedOrder.status === 'confirmed') {
                            success('支付成功！订阅已激活');
                            setStep('confirm');
                            onSuccess?.(updatedOrder);
                        } else if (updatedOrder.status === 'expired') {
                            error('订单已过期');
                            handleClose();
                        }
                    }
                } catch (err) {
                    console.error('Failed to check order status:', err);
                }
            }, 15000); // 15 秒兜底
            return () => clearInterval(pollInterval);
        }
    }, [paymentOrder, step, wsConnected, wsTried, success, error, onSuccess]);

    const handleClose = () => {
        setStep('select');
        setPaymentOrder(null);
        setQrCode('');
        setDeepLink('');
        setTimeLeft(0);
        onClose();
    };

    const handleCreateOrder = async () => {
        if (!planInfo) return;
        setLoading(true);
        try {
            const payload: CreateOrderPayload = {
                plan,
                network: selectedNetwork
            };
            const response = await createOrderAPI(payload);
            setPaymentOrder(response.order);
            setQrCode(response.qrCode);
            setDeepLink(response.deepLink);
            setStep('payment');
            success('订单创建成功，请完成支付');
        } catch (err: any) {
            error(err.message || '创建订单失败');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        success('已复制到剪贴板');
    };

    // 手动验证：用户点击“已支付，立即验证”时触发一次检查
    const handleManualVerify = async () => {
        if (!paymentOrder) return;
        // 1) 本地记录挂起订单，便于用户稍后在订单中心查看
        try {
            const snapshot = {
                id: paymentOrder.id,
                network: paymentOrder.paymentMethod,
                expiresAt: paymentOrder.expiresAt,
            };
            if (typeof window !== 'undefined') {
                localStorage.setItem('pending_order', JSON.stringify(snapshot));
            }
        } catch {}
        // 2) 立即关闭弹窗，避免用户长时间停留
        onClose();
        // 3) 后台做一次轻量验证（不影响已关闭的 UI）
        try {
            void checkOrderStatus(paymentOrder.id);
        } catch {}
        // 4) 轻提示
        success('我们将后台持续为你确认链上支付，你可稍后在订单中心查看');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3">
            <div
                className={
                    `bg-white dark:bg-[#0b0f17] rounded-xl border border-gray-200 dark:border-white/12 shadow-xl w-full max-w-sm md:max-w-md max-h-[85vh] overflow-y-auto text-gray-900 dark:text-gray-100 ` +
                    `transform transition-all duration-200 ease-out ` +
                    (entered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-[0.98] translate-y-1')
                }
                onAnimationEnd={() => setEntered(true)}
                onTransitionEnd={() => setEntered(true)}
                onMouseEnter={() => !entered && setEntered(true)}
            >
                {/* 头部 */}
                <StepHeader step={step} onClose={handleClose}/>

                {/* 内容 */}
                <div className="p-4">
                    {step === 'select' && (
                        <SelectStep
                            planInfo={planInfo}
                            selectedNetwork={selectedNetwork}
                            setSelectedNetwork={setSelectedNetwork}
                            onCreate={handleCreateOrder}
                            loading={loading}
                        />
                    )}

                    {step === 'payment' && paymentOrder && (
                        <PaymentStep
                            paymentOrder={paymentOrder}
                            timeLeft={timeLeft}
                            qrCode={qrCode}
                            copyToClipboard={copyToClipboard}
                        />
                    )}

                    {step === 'payment' && paymentOrder && (
                        <div className="mt-3 flex items-center justify-between gap-3">
                            <button
                                onClick={handleManualVerify}
                                className="inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50"
                            >
                                已支付，立即验证
                            </button>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                链上确认可能需要时间，请耐心等待
                            </div>
                        </div>
                    )}

                    {step === 'confirm' && paymentOrder && (
                        <ConfirmStep planName={planInfo?.name} paymentOrder={paymentOrder} onClose={handleClose}/>
                    )}
                </div>
            </div>
        </div>
    );
}
