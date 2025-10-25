import React from 'react';
import Link from 'next/link';

export default function Question(): React.ReactElement {
    return (
        <>
            <div className="relative overflow-hidden">
                {/* 背景装饰 */}
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div
                        className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-br from-sky-500/10 to-violet-500/10 blur-3xl"/>
                    <div
                        className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-tr from-emerald-500/10 to-indigo-500/10 blur-3xl"/>
                </div>

                <div className="container px-4 md:px-6 py-10 md:py-14">
                    {/* 英雄区 */}
                    <header className="text-center mb-8 md:mb-12">
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">关于 数据WsTool</h1>
                        <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            我们致力于提供最简单易用的WebSocket工具平台，让开发者和技术人员能够轻松管理WebSocket连接。
                        </p>
                    </header>

                    {/* 愿景卡片 */}
                    <section className="mb-10 md:mb-12">
                        <div
                            className="relative p-5 md:p-7 rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur dark:bg-[#15161a]/80 dark:border-[#2a2c31]">
                            <div className="absolute right-6 top-6 h-20 w-20 rounded-full bg-violet-500/10 blur-2xl"/>
                            <h2 className="text-lg md:text-xl font-bold mb-3">我们的愿景</h2>
                            <div
                                className="space-y-3 text-sm md:text-[15px] text-gray-700 dark:text-gray-300 leading-7">
                                <p>
                                    在实时通信技术快速发展的时代，WebSocket已成为现代应用不可或缺的技术。我们致力于简化WebSocket的使用和管理，让每个开发者都能轻松构建实时应用。
                                </p>
                                <p>
                                    我们相信，通过提供直观易用的工具，可以大大降低WebSocket技术的使用门槛，让更多人能够享受实时通信带来的便利。
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 我们做什么 */}
                    <section className="mb-10 md:mb-12">
                        <h2 className="text-lg md:text-xl font-bold mb-4">我们做什么</h2>
                        <div className="grid gap-4 md:gap-5 md:grid-cols-3">
                            <div
                                className="p-4 rounded-xl border border-gray-200 bg-white dark:bg-[#1a1b1e] dark:border-[#2a2c31]">
                                <div className="mb-2 text-violet-500">◎</div>
                                <h3 className="font-semibold mb-1">精选AI工具</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">筛选优质与高价值的AI工具，帮助用户快速落地高效方案。</p>
                            </div>
                            <div
                                className="p-4 rounded-xl border border-gray-200 bg-white dark:bg-[#1a1b1e] dark:border-[#2a2c31]">
                                <div className="mb-2 text-indigo-500">◎</div>
                                <h3 className="font-semibold mb-1">连接社区</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">连接产品与用户的双向桥梁，分享最佳实践与洞见。</p>
                            </div>
                            <div
                                className="p-4 rounded-xl border border-gray-200 bg-white dark:bg-[#1a1b1e] dark:border-[#2a2c31]">
                                <div className="mb-2 text-emerald-500">◎</div>
                                <h3 className="font-semibold mb-1">探索前沿</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">关注AI技术趋势与应用机会，助你把握最新方向。</p>
                            </div>
                        </div>
                    </section>

                    {/* 核心价值观 */}
                    <section className="mb-10 md:mb-12">
                        <h2 className="text-lg md:text-xl font-bold mb-4">核心价值观</h2>
                        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                            <div
                                className="p-4 rounded-xl border border-gray-200 bg-white dark:bg-[#1a1b1e] dark:border-[#2a2c31]">
                                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                    <li className="flex items-start gap-2"><span
                                        className="mt-1 h-2 w-2 rounded-full bg-violet-500"/> 创新与开放
                                    </li>
                                    <li className="flex items-start gap-2"><span
                                        className="mt-1 h-2 w-2 rounded-full bg-sky-500"/> 用户价值优先
                                    </li>
                                    <li className="flex items-start gap-2"><span
                                        className="mt-1 h-2 w-2 rounded-full bg-emerald-500"/> 品质与专业
                                    </li>
                                </ul>
                            </div>
                            <div
                                className="p-4 rounded-xl border border-gray-200 bg-white dark:bg-[#1a1b1e] dark:border-[#2a2c31]">
                                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                    <li className="flex items-start gap-2"><span
                                        className="mt-1 h-2 w-2 rounded-full bg-amber-500"/> 协作与共赢
                                    </li>
                                    <li className="flex items-start gap-2"><span
                                        className="mt-1 h-2 w-2 rounded-full bg-pink-500"/> 负责的开发与应用
                                    </li>
                                    <li className="flex items-start gap-2"><span
                                        className="mt-1 h-2 w-2 rounded-full bg-cyan-500"/> 长期主义
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 号召行动 */}
                    <section className="text-center mb-6 md:mb-8">
                        <h2 className="text-xl font-semibold mb-2">加入我们的旅程</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-2xl mx-auto">
                            无论你是AI开发者、技术爱好者，还是寻求升级效率工具的专业人士，挖头矿欢迎你的参与。
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <Link href="/"
                                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 dark:bg-[#1a1b1e] dark:border-[#2a2c31]">探索工具</Link>
                            <Link href="/subscribe"
                                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 text-white shadow-sm hover:opacity-90 transition-opacity dark:from-emerald-400 dark:to-lime-400">订阅更新</Link>
                        </div>
                    </section>

                    {/* 联系方式 */}
                    <div
                        className="mt-6 p-4 md:p-5 rounded-2xl border border-gray-200 bg-white dark:bg-[#1a1b1e] dark:border-[#2a2c31]">
                        <h3 className="font-semibold mb-2">联系我们</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            如需商务合作、收录与纠错，请发送邮件至：
                            <a className="ml-1 text-blue-600 dark:text-sky-400 underline"
                               href="mailto:hello@watoukuang.com">hello@watoukuang.com</a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
