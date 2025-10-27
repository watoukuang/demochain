import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import {PaymentOrder} from '@/src/shared/types/order';
import {getUserOrders} from '@/src/shared/api/order';
import {useAuth} from '@/src/shared/hooks/useAuth';

export default function OrdersPage() {
    const {user, isAuthenticated} = useAuth();
    const [orders, setOrders] = useState<PaymentOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            if (!isAuthenticated || !user) {
                setLoading(false);
                return;
            }

            try {
                const userOrders = await getUserOrders(user.id);
                setOrders(userOrders);
            } catch (error) {
                console.error('Failed to load orders:', error);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [isAuthenticated, user]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
            case 'confirmed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'paid':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            case 'pending_payment':
            case 'created':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'cancelled':
            case 'expired':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'created':
                return '已创建';
            case 'pending_payment':
                return '待支付';
            case 'paid':
                return '已支付';
            case 'confirmed':
                return '已确认';
            case 'completed':
                return '已完成';
            case 'cancelled':
                return '已取消';
            case 'expired':
                return '已过期';
            default:
                return status;
        }
    };

    const getPlanText = (plan: string) => {
        switch (plan) {
            case 'monthly':
                return '月度会员';
            case 'yearly':
                return '年度会员';
            case 'lifetime':
                return '终身会员';
            default:
                return plan;
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        请先登录
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        您需要登录后才能查看订单历史
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>订单管理 - DemoChain</title>
                <meta name="description" content="查看您的订阅订单历史和支付记录"/>
            </Head>

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* 页面标题 */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            订单管理
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            查看您的订阅订单历史和支付记录
                        </p>
                    </div>

                    {loading ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                            <div className="animate-pulse space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-center space-x-4">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
                            <div className="text-gray-400 dark:text-gray-500 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                暂无订单记录
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                您还没有任何订阅订单
                            </p>
                            <a
                                href="/pricing"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                查看订阅计划
                            </a>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            订单号
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            订阅计划
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            金额
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            支付方式
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            状态
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            创建时间
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            操作
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-mono text-gray-900 dark:text-white">
                                                    {order.id.substring(0, 20)}...
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {getPlanText(order.plan)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {order.amount} USDT
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {order.paymentMethod.toUpperCase()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                          <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button className="text-blue-600 dark:text-blue-400 hover:underline">
                                                    查看详情
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
