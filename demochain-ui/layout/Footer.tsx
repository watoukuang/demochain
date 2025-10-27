import React from 'react';
import Logo from '../components/icons/Logo';

export default function Footer(): React.ReactElement {
    return (
        <footer
            className="mt-8 border-t border-gray-200 dark:border-[#1f232b] bg-white/50 dark:bg-[#111317]/60 backdrop-blur">
            <div className="px-4 lg:px-12 max-w-screen-2xl mx-auto py-6 md:py-8">
                <div className="grid gap-6 md:gap-8 md:grid-cols-5 items-start">
                    {/* 左侧品牌与备案（占两列） */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                            <Logo/>
                            <span
                                className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Demo Chain</span>
                        </div>
                        <div className="space-y-1.5 text-xs md:text-[13px] text-gray-600 dark:text-gray-400">
                            <p>© {new Date().getFullYear()} demochain.org· 区块链演示平台</p>
                        </div>
                    </div>

                    {/* 中间：站点链接 */}
                    <div>
                        <ul className="space-y-1 text-sm">
                            {/*<li><Link*/}
                            {/*    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"*/}
                            {/*    href="/submit-tool">提交问题</Link></li>*/}
                        </ul>
                    </div>

                    {/* 右侧：政策 */}
                    <div>
                        <ul className="space-y-1 text-sm">
                            <li>
                                {/*<Link*/}
                                {/*    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"*/}
                                {/*    href="/disclaimer">免责声明*/}
                                {/*</Link>*/}
                            </li>
                        </ul>
                    </div>
                    <div>
                        <ul className="space-y-1 text-sm">
                            <li>
                                <a
                                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                    href="mailto:651023907@qq.com">联系邮箱：651023907@qq.com</a>
                            </li>
                            <li>
                                <div className="flex items-center gap-3 pt-1">
                                    {/* Discord */}
                                    {/*<a href="#" target="_blank" rel="noopener noreferrer" aria-label="Discord"*/}
                                    {/*   className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-300 dark:border-[#2a2c31] dark:text-gray-300 dark:hover:text-indigo-400">*/}
                                    {/*    /!*<DiscordIcon className="h-4 w-4" />*!/*/}
                                    {/*</a>*/}
                                    {/* Twitter/X */}
                                    {/*<a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter"*/}
                                    {/*   className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:text-sky-600 hover:border-sky-300 dark:border-[#2a2c31] dark:text-gray-300 dark:hover:text-sky-400">*/}
                                    {/*    /!*<TwitterIcon className="h-4 w-4" />*!/*/}
                                    {/*</a>*/}
                                    {/* Telegram */}
                                    {/*<a href="#" target="_blank" rel="noopener noreferrer" aria-label="Telegram"*/}
                                    {/*   className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-300 dark:border-[#2a2c31] dark:text-gray-300 dark:hover:text-blue-400">*/}
                                    {/*    <TelegramIcon className="h-4 w-4" />*/}
                                    {/*</a>*/}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}
