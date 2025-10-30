import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import LoginModal from '@/components/Login';
import Logo from "@/components/Logo";
import Menu, { type Consensus, MENUS } from './Menu';
import Theme from "@/layout/components/Theme";
import Conses from '@/layout/components/Conses'
import Account from "@/layout/components/Account";

export default function Header(): React.ReactElement {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
        if (typeof window === 'undefined') return 'system';
        return (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';
    });

    // 下拉开关 & 系统深色侦测
    const [systemDark, setSystemDark] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    // 用户菜单开关（逻辑在 Account 内部处理点击外部关闭）
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // 添加一个状态来跟踪是否已挂载（用于解决hydration问题）
    const [isMounted, setIsMounted] = useState(false);
    const [currentPathname, setCurrentPathname] = useState('');

    const router = useRouter();

    // 共识选择与菜单（避免 SSR 水合不一致：初始固定为 POW，挂载后再同步 localStorage）
    const [consensus, setConsensus] = useState<Consensus>('POW');
    const menuItems = MENUS[consensus];

    // 标记组件已挂载（用于解决hydration问题）
    useEffect(() => {
        setIsMounted(true);
        setCurrentPathname(router.pathname);
    }, [router.pathname]);

    useEffect(() => {
        if (typeof window === 'undefined' || !isMounted) return;
        const saved = (localStorage.getItem('consensus') as Consensus) || 'POW';
        if (saved !== consensus) setConsensus(saved);
    }, [isMounted]);

    // respond to external consensus changes (e.g., Logo click resets to POW)
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const handler = () => {
            const saved = (localStorage.getItem('consensus') as Consensus) || 'POW';
            setConsensus(saved);
        };
        window.addEventListener('consensusChanged', handler as EventListener);
        return () => window.removeEventListener('consensusChanged', handler as EventListener);
    }, []);

    const isDarkMode = isMounted ? (theme === 'dark' || (theme === 'system' && systemDark)) : null;

    // Apply theme based on preference and system setting
    useEffect(() => {
        if (typeof window === 'undefined' || !isMounted) return;

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
    }, [theme, isMounted]);

    // 点击外部关闭、用户登出等职责已下放到子组件（Theme/Conses/Account/Menu）内部

    return (
        <>
            <header
                className="sticky top-0 z-40 relative py-4 border-b border-gray-100 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-gray-800 dark:bg-[#121212]/85">
                <div
                    className="px-4 lg:px-12 max-w-screen-2xl mx-auto w-full relative flex justify-between items-center">
                    <div className="flex items-center flex-1">
                        <Logo/>
                        <div className="hidden md:flex flex-1 justify-end mr-3">
                            {isMounted && (
                                <Menu
                                    variant="desktop"
                                    currentPathname={currentPathname}
                                    menuItems={menuItems}
                                />
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 md:space-x-3">

                        <Conses 
                          consensus={consensus} 
                          setConsensus={setConsensus}
                        />
                        <Theme 
                          theme={theme} 
                          setTheme={setTheme}
                          isDarkMode={isDarkMode}
                        />
                        <Link href="/pricing"
                              className="inline-flex items-center text-sm font-medium px-3 py-1.5 md:px-4 rounded-full whitespace-nowrap bg-gradient-to-r from-emerald-500 to-lime-500 text-white shadow-sm hover:opacity-90 transition-opacity dark:from-emerald-400 dark:to-lime-400"
                        >
                            订阅
                        </Link>

                        <Account 
                          userMenuOpen={userMenuOpen} 
                          setUserMenuOpen={setUserMenuOpen} 
                          setLoginOpen={setLoginOpen}
                        />

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
                <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onSuccess={() => setLoginOpen(false)}/>
            </header>

            {/* 移动端菜单 */
            }
            {
                mobileMenuOpen && isMounted && (
                    <div className="md:hidden border-b border-gray-200 dark:border-[#1f232b] bg-gray-50 dark:bg-[#111317]"
                         id="mobile-nav">
                        <Menu
                            variant="mobile"
                            currentPathname={currentPathname}
                            menuItems={menuItems}
                            onNavigate={() => setMobileMenuOpen(false)}
                        />
                    </div>
                )
            }
        </>
    )
        ;
}