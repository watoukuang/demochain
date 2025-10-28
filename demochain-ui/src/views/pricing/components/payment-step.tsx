import React from 'react';
import {PaymentOrder} from '@/src/shared/types/order';
import {USDT_NETWORKS} from '@/src/shared/config/payment';

function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function PaymentStep({
                                        paymentOrder,
                                        timeLeft,
                                        qrCode,
                                        copyToClipboard,
                                    }: {
    paymentOrder: PaymentOrder;
    timeLeft: number;
    qrCode: string;
    copyToClipboard: (text: string) => void;
}) {
    return (
        <div className="space-y-4">
            <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">订单将在以下时间后过期</div>
                <div className="text-xl font-bold text-red-500">{formatTime(timeLeft)}</div>
            </div>

            <div
                className="bg-gray-50 dark:bg-white/[0.06] rounded-lg p-3 space-y-3 border border-gray-200 dark:border-white/10">
                <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">支付金额:</span>
                    <span className="font-bold">{paymentOrder.paymentAmount} USDT</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">网络:</span>
                    <span>{USDT_NETWORKS.find((n) => n.id === paymentOrder.paymentMethod)?.name}</span>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">收款地址</label>
                <div className="flex items-center gap-3">
                    <div
                        className="flex items-center gap-2 flex-1 h-9 px-3 rounded-lg border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/[0.06] overflow-hidden">
                        <span
                            className="font-mono text-sm text-gray-900 dark:text-gray-100 truncate">{paymentOrder.paymentAddress}</span>
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

            <div className="text-center">
                <div
                    className="inline-block p-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.04]">
                    <img src={qrCode} alt="PaymentModel QR Code" className="w-40 h-40"/>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">使用钱包扫描二维码支付</p>
            </div>

            <div
                className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">⚠️ 支付注意事项</h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• 请确保转账金额完全一致: {paymentOrder.paymentAmount} USDT</li>
                    <li>• 请使用正确的网络进行转账</li>
                    <li>• 支付完成后系统会自动确认，请耐心等待</li>
                    <li>• 如有问题请联系客服</li>
                </ul>
            </div>
        </div>
    );
}
