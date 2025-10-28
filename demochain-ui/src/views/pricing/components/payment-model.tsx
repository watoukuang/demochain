import React, {useEffect, useState} from 'react';
import {CreateOrderPayload, Network, PaymentOrder} from '@/src/shared/types/order';
import {SubscriptionPlan} from '@/src/shared/types/subscription';
import {checkOrderStatus, createOrderAPI} from '@/src/shared/api/order';
import {useToast} from '@/components/toast';
import StepHeader from './step-header';
import SelectStep from './select-step';
import PaymentStep from './payment-step';

const PLAN_META = {
    monthly: {name: '月度会员', price: 3, period: '每月'},
    yearly: {name: '年度会员', price: 10, period: '每年'},
    lifetime: {name: '终身会员', price: 15, period: '一次性'}
} as const;

interface PaymentProps {
    isOpen: boolean;
    onClose: () => void;
    plan: SubscriptionPlan;
}

export default function PaymentModel({isOpen, onClose, plan}: PaymentProps) {
    const {success, error} = useToast();
    const [step, setStep] = useState<'select' | 'payment'>('select');
    const [selectedNetwork, setSelectedNetwork] = useState<Network>('usdt_trc20');
    const [paymentOrder, setPaymentOrder] = useState<PaymentOrder | null>(null);
    const [qrCode, setQrCode] = useState<string>('');
    const [deepLink, setDeepLink] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

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
        } catch {
        }

        // 2) 检查订单状态
        try {
            const updatedOrder = await checkOrderStatus(paymentOrder.id);
            if (updatedOrder && updatedOrder.status === 'confirmed') {
                success('支付成功！订阅已激活');
                onClose();
                return;
            }
        } catch (err) {
            console.error('Failed to check order status:', err);
        }

        // 3) 如果支付未确认，关闭弹窗并提示稍后查看
        onClose();
        success('订单已记录，请稍后在订单中心查看支付状态');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3">
            <div
                className={
                    `bg-white dark:bg-[#0b0f17] rounded-xl border border-gray-200 dark:border-white/12 shadow-xl w-full max-w-sm md:max-w-md max-h-[85vh] overflow-y-auto text-gray-900 dark:text-gray-100 ` +
                    `transform transition-all duration-200 ease-out opacity-100 scale-100 translate-y-0`
                }
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
                                已支付，立即查看
                            </button>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                链上确认可能需要时间，请耐心等待
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
