import React from 'react';
import Link from 'next/link';

export default function ApiMockHome(): React.ReactElement {
    return (
        <div className="space-y-12">
            {/* 功能亮点区域 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 接口模拟 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h5v-5H4v5zM13 7h5l-5-5v5zM4 1h5v5H4V1z"/>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">接口模拟</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        可视化配置请求方式、路径、参数与响应内容，快速生成 Mock 接口
                    </p>
                    <Link 
                        href="/"
                        className="inline-flex items-center text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium"
                    >
                        开始模拟
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                        </svg>
                    </Link>
                </div>

                {/* 接口测试 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">接口测试</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        构造请求并验证响应，支持多状态码与 Headers，助力联调测试
                    </p>
                    <Link 
                        href="/sender"
                        className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                    >
                        开始测试
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                        </svg>
                    </Link>
                </div>

                {/* 问题反馈 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">问题反馈</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        向我们反馈问题与建议，帮助我们持续改进 ApiTool 体验
                    </p>
                    <Link 
                        href="/question"
                        className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                    >
                        提交反馈
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                        </svg>
                    </Link>
                </div>
            </div>

            {/* 快速开始区域 */}
            <div className="bg-gradient-to-r from-orange-50 to-purple-50 dark:from-orange-900/20 dark:to-purple-900/20 rounded-xl p-8 border border-orange-200/50 dark:border-orange-800/50">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        快速开始使用 ApiTool
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        三步即可创建你的第一个 Mock 接口，加速前后端并行开发
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                                1
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">配置接口</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">设置请求方式、路径和参数</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                                2
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">定义响应</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">配置返回内容和状态码</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                                3
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">立即使用</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">获取 Mock URL 开始调试</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                        <Link
                            href="/"
                            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors inline-flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                            创建 Mock 接口
                        </Link>
                        <Link
                            href="/sender"
                            className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-300 dark:border-gray-600 transition-colors inline-flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                            </svg>
                            测试现有接口
                        </Link>
                    </div>
                </div>
            </div>

            {/* 使用场景 */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    适用场景
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-3">
                            <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">前后端并行开发</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">后端接口未就绪时，前端可先行开发调试</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-3">
                            <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">自动化测试</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">提供稳定可控的响应源，支持测试用例</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-3">
                            <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">产品演示</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">快速搭建演示环境，展示产品功能</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-3">
                            <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">接口调试</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">模拟各种响应场景，测试错误处理</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
