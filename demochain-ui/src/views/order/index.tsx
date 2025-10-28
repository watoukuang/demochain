import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import {PaymentOrder} from '@/src/shared/types/order';
import {pageOrder} from '@/src/shared/api/order';
import {useAuth} from '@/src/shared/hooks/useAuth';
import OrderTable from './components/order-table';
import Empty from './components/empty';
import Loading from './components/loading'

export default function OrdersPage() {
    const {user, isAuthenticated} = useAuth();
    const [orders, setOrders] = useState<PaymentOrder[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [fetched, setFetched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const MIN_LOADING_MS = 300; // 最少loading时长，避免闪烁

    const isInitial = orders === null;

    useEffect(() => {
        const loadOrders = async () => {
            const start = Date.now();
            if (!isAuthenticated || !user) {
                const elapsed = Date.now() - start;
                const delay = Math.max(0, MIN_LOADING_MS - elapsed);
                setTimeout(() => {
                    setOrders([]);
                    setLoading(false);
                    setFetched(true);
                }, delay);
                return;
            }
            try {
                const userOrders = await pageOrder(currentPage, pageSize);
                setOrders(userOrders);
            } catch (error) {
                console.error('Failed to load orders:', error);
            } finally {
                const elapsed = Date.now() - start;
                const delay = Math.max(0, MIN_LOADING_MS - elapsed);
                setTimeout(() => {
                    setLoading(false);
                    setFetched(true);
                }, delay);
            }
        };

        loadOrders();
    }, [isAuthenticated, user, currentPage, pageSize]);

    // 分页逻辑 - 使用后端分页
    const totalPages = Math.ceil(totalCount / pageSize);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (!isAuthenticated) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
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

            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">订单管理</h1>
                        <p className="text-gray-600 dark:text-gray-400">查看您的订阅订单历史和支付记录</p>
                    </div>

                    {isInitial || loading ? (
                        <Loading/>
                    ) : (orders && orders.length > 0) ? (
                        <OrderTable
                            orders={orders}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalCount={totalCount}
                            onPageChange={handlePageChange}
                        />
                    ) : (
                        <Empty/>
                    )}
                </div>
            </div>
        </>
    );
}
