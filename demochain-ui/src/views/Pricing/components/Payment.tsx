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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* 头部 */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {step === 'select' && '选择支付方式'}
                        {step === 'payment' && '完成支付'}
                        {step === 'confirm' && '支付成功'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                {/* 内容 */}
                <div className="p-6">
                    {step === 'select' && (
                        <div className="space-y-6">
                            {/* 订阅信息 */}
                            <div
                                className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {planInfo?.name}
                                </h3>
                                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
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
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
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
                                                <div
                                                    className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="currentColor"
                                                         viewBox="0 0 20 20">
                                                        <path fillRule="evenodd"
                                                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                              clipRule="evenodd"/>
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
                                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                            >
                                {loading ? '创建订单中...' : '确认支付'}
                            </button>
                        </div>
                    )}

                    {step === 'payment' && paymentOrder && (
                        <div className="space-y-6">
                            {/* 倒计时 */}
                            <div className="text-center">
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    订单将在以下时间后过期
                                </div>
                                <div className="text-2xl font-bold text-red-500">
                                    {formatTime(timeLeft)}
                                </div>
                            </div>

                            {/* 支付信息 */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
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
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={paymentOrder.paymentAddress}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm font-mono"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(paymentOrder.paymentAddress)}
                                        className="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                                    >
                                        复制
                                    </button>
                                </div>
                            </div>

                            {/* 二维码 */}
                            <div className="text-center">
                                <div className="inline-block p-4 bg-white rounded-lg border">
                                    <img src={qrCode} alt="Payment QR Code" className="w-48 h-48"/>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    使用钱包扫描二维码支付
                                </p>
                            </div>

                            {/* 支付说明 */}
                            <div
                                className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
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
                        <div className="text-center space-y-6">
                            {/* 成功图标 */}
                            <div
                                className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor"
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
                                className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300"
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
