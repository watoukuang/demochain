import React, {useState, useEffect} from 'react';
import {PaymentMethod, PaymentOrder, CreatePaymentRequest} from '@/src/shared/types/payment';
import {SubscriptionPlan} from '@/src/shared/types/subscription';
import {USDT_NETWORKS, SUBSCRIPTION_PRICES} from '@/src/shared/config/payment';
import {createPaymentOrder, checkOrderStatus} from '@/src/shared/api/payment';
import {useToast} from '@/components/toast';

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
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('usdt_trc20');
    const [paymentOrder, setPaymentOrder] = useState<PaymentOrder | null>(null);
    const [qrCode, setQrCode] = useState<string>('');
    const [deepLink, setDeepLink] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    // 获取计划信息
    const planInfoMap = {
        monthly: {name: '月度会员', price: 3, period: '每月'},
        yearly: {name: '年度会员', price: 10, period: '每年'},
        lifetime: {name: '终身会员', price: 15, period: '一次性'}
    };

    const planInfo = plan !== 'free' ? planInfoMap[plan] : null;

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

    // 轮询订单状态
    useEffect(() => {
        if (paymentOrder && step === 'payment') {
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
            }, 5000); // 每5秒检查一次

            return () => clearInterval(pollInterval);
        }
    }, [paymentOrder, step, success, error, onSuccess]);

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
            const request: CreatePaymentRequest = {
                plan,
                paymentMethod: selectedMethod
            };

            const response = await createPaymentOrder(request);
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

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        success('已复制到剪贴板');
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
                <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-white/10">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white leading-none">
                        {step === 'select' && '选择支付方式'}
                        {step === 'payment' && '完成支付'}
                        {step === 'confirm' && '支付成功'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                {/* 内容 */}
                <div className="p-4">
                    {step === 'select' && (
                        <div className="space-y-4">
                            {/* 订阅信息 */}
                            <div
                                className="rounded-lg p-4 border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.04]">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {planInfo?.name}
                                </h3>
                                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    ${planInfo?.price} USDT
                  </span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                    {planInfo?.period}
                  </span>
                                </div>
                            </div>

                            {/* 支付方式选择 */}
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                                    选择 USDT 网络
                                </h4>
                                <div className="space-y-2">
                                    {USDT_NETWORKS.map((network) => (
                                        <label
                                            key={network.id}
                                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                                                selectedMethod === network.id
                                                    ? 'border-blue-500 ring-1 ring-blue-500/20 bg-white dark:bg-white/[0.04]'
                                                    : 'border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/[0.03]'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={network.id}
                                                checked={selectedMethod === network.id}
                                                onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
                                                className="sr-only"
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {network.name}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {network.network} • 确认数: {network.confirmations}
                                                </div>
                                            </div>
                                            {selectedMethod === network.id && (
                                                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-blue-500 text-white">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* 确认按钮 */}
                            <button
                                onClick={handleCreateOrder}
                                disabled={loading}
                                className="w-full py-2.5 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-sm hover:shadow"
                            >
                                {loading ? '创建订单中...' : '确认支付'}
                            </button>
                        </div>
                    )}

                    {step === 'payment' && paymentOrder && (
                        <div className="space-y-4">
                            {/* 倒计时 */}
                            <div className="text-center">
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    订单将在以下时间后过期
                                </div>
                                <div className="text-xl font-bold text-red-500">
                                    {formatTime(timeLeft)}
                                </div>
                            </div>

                            {/* 支付信息 */}
                            <div className="bg-gray-50 dark:bg-white/[0.06] rounded-lg p-3 space-y-3 border border-gray-200 dark:border-white/10">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">订单号:</span>
                                    <span className="font-mono text-sm">{paymentOrder.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">支付金额:</span>
                                    <span className="font-bold">{paymentOrder.paymentAmount} USDT</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">网络:</span>
                                    <span>{USDT_NETWORKS.find(n => n.id === paymentOrder.paymentMethod)?.name}</span>
                                </div>
                            </div>

                            {/* 收款地址 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    收款地址
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 flex-1 h-9 px-3 rounded-lg border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/[0.06] overflow-hidden">
                                        <span className="font-mono text-sm text-gray-900 dark:text-gray-100 truncate">
                                            {paymentOrder.paymentAddress}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(paymentOrder.paymentAddress)}
                                        className="h-9 px-3 rounded-lg bg-gray-200 dark:bg-white/[0.08] text-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-white/[0.12] transition-colors shrink-0 border border-transparent dark:border-white/10"
                                        title="复制到剪贴板"
                                    >
                                        复制
                                    </button>
                                </div>
                            </div>

                            {/* 二维码 */}
                            <div className="text-center">
                                <div className="inline-block p-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.04]">
                                    <img src={qrCode} alt="Payment QR Code" className="w-40 h-40"/>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    使用钱包扫描二维码支付
                                </p>
                            </div>

                            {/* 支付说明 */}
                            <div
                                className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                                    ⚠️ 支付注意事项
                                </h4>
                                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                                    <li>• 请确保转账金额完全一致: {paymentOrder.paymentAmount} USDT</li>
                                    <li>• 请使用正确的网络进行转账</li>
                                    <li>• 支付完成后系统会自动确认，请耐心等待</li>
                                    <li>• 如有问题请联系客服</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {step === 'confirm' && paymentOrder && (
                        <div className="text-center space-y-4">
                            {/* 成功图标 */}
                            <div
                                className="w-14 h-14 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                                <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M5 13l4 4L19 7"/>
                                </svg>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    支付成功！
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    您的 {planInfo?.name} 已激活
                                </p>
                            </div>

                            {/* 交易信息 */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2 text-left">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">订单号:</span>
                                    <span className="font-mono">{paymentOrder.id}</span>
                                </div>
                                {paymentOrder.txHash && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">交易哈希:</span>
                                        <span
                                            className="font-mono text-xs">{paymentOrder.txHash.substring(0, 20)}...</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">支付时间:</span>
                                    <span>{paymentOrder.paidAt ? new Date(paymentOrder.paidAt).toLocaleString() : '-'}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleClose}
                                className="w-full py-2.5 rounded-lg text-white font-medium transition-all duration-300 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 shadow-sm hover:shadow"
                            >
                                完成
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
