import React, {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {HeaderProps} from '../types';
import Logo from './icons/Logo';
import LoginModal from './LoginModal';

const MENU_ITEMS: { name: string; href: string; icon: React.ReactNode }[] = [
    {
        name: '哈希',
        href: '/hash',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
        ),
    },
    {
        name: '区块',
        href: '/mock',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 17h5l-5 5v-5zM4 19h5v-5H4v5zM13 7h5l-5-5v5zM4 1h5v5H4V1z"/>
            </svg>
        ),
    },
    {
        name: '区块链',
        href: '/question',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
        ),
    },
    {
        name: '分布式',
        href: '/question',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
        ),
    },
    {
        name: '币基',
        href: '/question',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
        ),
    },
    {
        name: '代币',
        href: '/question',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
        ),
    },
];

export default function Header({toggleSidebar}: HeaderProps): React.ReactElement {
    // Theme state: 'light' | 'dark' | 'system'
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
        if (typeof window === 'undefined') return 'system';
        return (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';
    });

    // 下拉开关 & 系统深色侦测
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [systemDark, setSystemDark] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Router for active nav highlighting
    const router = useRouter();
    const {pathname} = router;

    const isDarkMode = theme === 'dark' || (theme === 'system' && systemDark);

    // Apply theme based on preference and system setting
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const root = document.documentElement;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setSystemDark(mediaQuery.matches);

        const applyTheme = () => {
            const isDark = theme === 'dark' || (theme === 'system' && mediaQuery.matches);
            root.classList.toggle('dark', isDark);
        };

        // 初始应用主题
        applyTheme();
        localStorage.setItem('theme', theme);

        // 监听系统主题变化
        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            setSystemDark(e.matches);
            if (theme === 'system') {
                root.classList.toggle('dark', e.matches);
            }
        };

        // 添加事件监听 (兼容新旧API)
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleSystemThemeChange);
            return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
        } else {
            // 旧版浏览器支持
            mediaQuery.addListener(handleSystemThemeChange);
            return () => mediaQuery.removeListener(handleSystemThemeChange);
        }
    }, [theme]);

    // 点击外部关闭菜单
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
        };
        if (menuOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [menuOpen]);
    return (
        <>
            <header
                className="sticky top-0 z-40 relative py-4 border-b border-gray-100 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-gray-800 dark:bg-[#121212]/85">
                <div
                    className="px-4 lg:px-12 max-w-screen-2xl mx-auto w-full relative flex justify-between items-center">
                    <div className="flex items-center">
                        <button
                            onClick={toggleSidebar}
                            className="mr-3 lg:hidden"
                            aria-label="Toggle menu"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                        </button>

                        {/* 品牌Logo和标题 - 在所有屏幕尺寸下都显示 */}
                        <Link href="/" className="flex items-center gap-2">
                            <Logo/>
                            <span
                                className="text-xl md:text-2xl font-bold tracking-wide leading-none select-none bg-gradient-to-r from-orange-500 to-purple-600 dark:from-orange-400 dark:to-purple-400
                        bg-clip-text text-transparent drop-shadow-sm">DemoChain</span>
                        </Link>

                        {/* 桌面端水平导航（绝对居中于容器） */}
                        <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="flex items-center space-x-3">
                                {MENU_ITEMS.map((item) => {
                                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`px-5 py-2.5 rounded-lg text-base font-semibold tracking-wide flex items-center space-x-2 transition-all duration-200 ${
                                                isActive
                                                    ? 'text-orange-600 dark:text-orange-400'
                                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-[#1a1d24]'
                                            }`}
                                        >
                                            {item.icon}
                                            <span>{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setMenuOpen((v) => !v)}
                                className="h-8 w-8 flex items-center justify-center transition-colors md:block"
                                aria-label="主题/设置"
                                aria-expanded={menuOpen}
                                aria-haspopup="menu"
                            >
                                {isDarkMode ? (
                                    <svg className="h-5 w-5 text-gray-200" fill="none" viewBox="0 0 24 24"
                                         stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24"
                                         stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                                    </svg>
                                )}
                            </button>
                            {menuOpen && (
                                <div
                                    role="menu"
                                    aria-label="主题切换"
                                    className="absolute right-0 mt-2 w-56 rounded-2xl border bg-white/98 backdrop-blur-sm shadow-lg ring-1 ring-black/5 p-2
                                       border-gray-200 dark:bg-[#1e1e1e] dark:border-[#2d2d30] dark:ring-white/5 dark:text-gray-200 z-50"
                                >
                                    <button
                                        role="menuitemradio"
                                        aria-checked={theme === 'light'}
                                        onClick={() => {
                                            setTheme('light');
                                            setMenuOpen(false);
                                        }}
                                        className={`group flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${theme === 'light' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                                    >
                                        <span className="text-yellow-500">☀️</span>
                                        <span className="flex-1 text-left">明亮主题</span>
                                        {theme === 'light' && (
                                            <span aria-hidden
                                                  className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"/>
                                        )}
                                    </button>
                                    <div className="my-1 h-px bg-gray-200 dark:bg-gray-800"/>
                                    <button
                                        role="menuitemradio"
                                        aria-checked={theme === 'dark'}
                                        onClick={() => {
                                            setTheme('dark');
                                            setMenuOpen(false);
                                        }}
                                        className={`group flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${theme === 'dark' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                                    >
                                        <span className="text-gray-700 dark:text-gray-300">🌙</span>
                                        <span className="flex-1 text-left">暗黑主题</span>
                                        {theme === 'dark' && (
                                            <span aria-hidden
                                                  className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"/>
                                        )}
                                    </button>
                                    <div className="my-1 h-px bg-gray-200 dark:bg-gray-800"/>
                                    <button
                                        role="menuitemradio"
                                        aria-checked={theme === 'system'}
                                        onClick={() => {
                                            setTheme('system');
                                            setMenuOpen(false);
                                        }}
                                        className={`group flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${theme === 'system' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                                    >
                                        <span className="text-indigo-600">🖥️</span>
                                        <span className="flex-1 text-left">跟随系统</span>
                                        {theme === 'system' && (
                                            <span aria-hidden
                                                  className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"/>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* 移动端导航开关 */}
                        <button
                            className="md:hidden ml-1 p-2 rounded-md bg-gray-100 dark:bg-[#1a1d24] text-gray-600 dark:text-gray-300"
                            aria-label="打开主菜单"
                            aria-controls="mobile-nav"
                            aria-expanded={mobileMenuOpen}
                            onClick={() => setMobileMenuOpen(v => !v)}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)}/>
            </header>

            {/* 移动端菜单 */}
            {mobileMenuOpen && (
                <div className="md:hidden border-b border-gray-200 dark:border-[#1f232b] bg-gray-50 dark:bg-[#111317]"
                     id="mobile-nav">
                    <div className="px-3 py-2 space-y-1">
                        {MENU_ITEMS.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`block px-5 py-3 rounded-lg text-lg font-semibold tracking-wide flex items-center space-x-3 transition-all duration-200 ${
                                        isActive
                                            ? 'text-orange-600 dark:text-orange-400'
                                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-[#1a1d24]'
                                    }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
}

