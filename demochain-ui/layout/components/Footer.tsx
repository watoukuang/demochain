import React from "react";
import TelegramIcon from "@/components/Icons/TelegramIcon";
import TwitterIcon from "@/components/Icons/TwitterIcon";
import Logo from "@/components/Logo";

export default function Footer(): React.ReactElement {
    const currentYear = new Date().getFullYear();

    const socialLinkClass =
        "inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 dark:border-[#2a2c31] dark:text-gray-300 transition-all duration-300 transform hover:scale-110";

    return (
        <footer
            className="mt-8 border-t border-gray-200 dark:border-[#1f232b] bg-gradient-to-r from-white/60 via-white/30 to-white/10 dark:from-[#111317]/70 dark:via-[#111317]/50 dark:to-[#111317]/30 backdrop-blur"
        >
            <div className="px-4 lg:px-12 max-w-screen-2xl mx-auto py-6">
                <div
                    className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 text-center md:text-left w-full">

                    {/* 左侧 Logo + 版权 */}
                    <div
                        className="flex flex-col md:flex-row items-center md:items-center justify-center md:justify-start gap-1 md:gap-4 w-full md:w-auto">
                        <Logo className="mx-auto md:mx-0"/>
                        <p className="text-xs md:text-[13px] text-gray-600 dark:text-gray-400 mt-1 md:mt-0 text-center md:text-left">
                            © {currentYear} demochain.org · 区块链演示平台
                        </p>
                    </div>

                    {/* 右侧邮箱 + 社交 */}
                    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
                        <a
                            href="mailto:demochain@gmail.com"
                            className="text-xs md:text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-300"
                        >
                            联系邮箱：demochain@gmail.com
                        </a>
                        <div className="flex items-center gap-3 justify-center">
                            <a
                                href="https://x.com/thexiaokuige"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Twitter"
                                className={`${socialLinkClass} hover:border-sky-300 hover:text-sky-600`}
                            >
                                <TwitterIcon className="h-4 w-4"/>
                            </a>
                            <a
                                href="https://t.me/thexiaokuige"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Telegram"
                                className={`${socialLinkClass} hover:border-blue-300 hover:text-blue-600`}
                            >
                                <TelegramIcon className="h-4 w-4"/>
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
}
