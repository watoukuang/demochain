import React from 'react';
import { PaymentOrder } from '@/src/shared/types/order';

export default function ConfirmStep({ planName, paymentOrder, onClose }: { planName?: string; paymentOrder: PaymentOrder; onClose: () => void }) {
  return (
    <div className="text-center space-y-4">
      <div className="w-14 h-14 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">支付成功！</h3>
        <p className="text-gray-600 dark:text-gray-400">您的 {planName} 已激活</p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2 text-left">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">订单号:</span>
          <span className="font-mono">{paymentOrder.id}</span>
        </div>
        {paymentOrder.txHash && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">交易哈希:</span>
            <span className="font-mono text-xs">{paymentOrder.txHash.substring(0, 20)}...</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">支付时间:</span>
          <span>{paymentOrder.paidAt ? new Date(paymentOrder.paidAt).toLocaleString() : '-'}</span>
        </div>
      </div>
      <button onClick={onClose} className="w-full py-2.5 rounded-lg text-white font-medium transition-all duration-300 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 shadow-sm hover:shadow">完成</button>
    </div>
  );
}
