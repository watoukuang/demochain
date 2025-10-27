import React, {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {HeaderProps} from '../types';
import Logo from '../components/icons/Logo';
import LoginModal from '../components/login/index';
import HashIcon from '../components/icons/HashIcon';
import BlockIcon from '../components/icons/BlockIcon';
import ChainIcon from '../components/icons/ChainIcon';
import NetworkIcon from '../components/icons/NetworkIcon';
import CoinIcon from '../components/icons/CoinIcon';
import TokenIcon from '../components/icons/TokenIcon';
import NameIcon from '../components/icons/NameIcon';
import {useAuth} from '../src/shared/hooks/useAuth';

type Consensus = 'POW' | 'POS' | 'DPoS' | 'BFT' | 'POH'

const MENUS: Record<Consensus, { name: string; href: string; icon: React.ReactNode }[]> = {
    POW: [
        {name: '哈希', href: '/', icon: (<HashIcon className="w-5 h-5"/>)},
        {name: '区块', href: '/pow/block', icon: (<BlockIcon className="w-5 h-5"/>)},
        {name: '区块链', href: '/pow/blockchain', icon: (<ChainIcon className="w-5 h-5"/>)},
        {name: '分布式', href: '/pow/distribution', icon: (<NetworkIcon className="w-5 h-5"/>)},
        {name: '代币', href: '/pow/token', icon: (<TokenIcon className="w-5 h-5"/>)},
        {name: '币基', href: '/pow/coinbase', icon: (<CoinIcon className="w-5 h-5"/>)},
    ],
    POS: [
        {name: '质押池', href: '/pos/staking', icon: (<CoinIcon className="w-5 h-5"/>)},
        {name: '验证者', href: '/pos/validators', icon: (<NetworkIcon className="w-5 h-5"/>)},
        {name: '委托投票', href: '/pos/delegation', icon: (<TokenIcon className="w-5 h-5"/>)},
        {name: '惩罚机制', href: '/pos/slashing', icon: (<HashIcon className="w-5 h-5"/>)},
        {name: '区块链', href: '/pos/chain', icon: (<ChainIcon className="w-5 h-5"/>)},
    ],
    DPoS: [
        {name: '候选人', href: '/dpos/candidates', icon: (<NetworkIcon className="w-5 h-5"/>)},
        {name: '出块轮次', href: '/dpos/rounds', icon: (<HashIcon className="w-5 h-5"/>)},
        {name: '投票与权重', href: '/dpos/vote', icon: (<TokenIcon className="w-5 h-5"/>)},
        {name: '区块链', href: '/dpos/chain', icon: (<ChainIcon className="w-5 h-5"/>)},
    ],
    BFT: [
        {name: '节点状态', href: '/bft/nodes', icon: (<NetworkIcon className="w-5 h-5"/>)},
        {name: 'BFT 流程', href: '/bft/steps', icon: (<HashIcon className="w-5 h-5"/>)},
        {name: '最终性', href: '/bft/finality', icon: (<CoinIcon className="w-5 h-5"/>)},
        {name: '区块链', href: '/bft/chain', icon: (<ChainIcon className="w-5 h-5"/>)},
    ],
    POH: [
        {name: '时序证明', href: '/poh/timeline', icon: (<HashIcon className="w-5 h-5"/>)},
        {name: 'VDF 演示', href: '/poh/vdf', icon: (<TokenIcon className="w-5 h-5"/>)},
        {name: '并行验证', href: '/poh/parallel', icon: (<NetworkIcon className="w-5 h-5"/>)},
        {name: '区块链', href: '/poh/chain', icon: (<ChainIcon className="w-5 h-5"/>)},
    ],
}

const CONSENSUS_ICON: Record<Consensus, React.ReactNode> = {
    POW: (
        <svg className="h-3.5 w-3.5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z"/>
        </svg>
    ),
    POS: (
        <svg className="h-3.5 w-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2">
            <path d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z"/>
            <path d="M9 12l2 2 4-4"/>
        </svg>
    ),
    DPoS: (
        <svg className="h-3.5 w-3.5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2">
            <path d="M3 7h18M6 12h12M9 17h6"/>
            <rect x="4" y="4" width="16" height="16" rx="3"/>
        </svg>
    ),
    BFT: (
        <svg className="h-3.5 w-3.5 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2">
            <path d="M14 4l6 6M8 20h8"/>
            <path d="M3 11l7-7 7 7-7 7-7-7z"/>
        </svg>
    ),
    POH: (
        <svg className="h-3.5 w-3.5 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 7v5l3 3"/>
        </svg>
    ),
}

export default function Header({toggleSidebar}: HeaderProps): React.ReactElement {
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
    const [consensusOpen, setConsensusOpen] = useState(false);
    const consensusRef = useRef<HTMLDivElement | null>(null);
    // 添加用户菜单状态
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement | null>(null);

    // 添加一个状态来跟踪是否已挂载（用于解决hydration问题）
    const [isMounted, setIsMounted] = useState(false);
    const [currentPathname, setCurrentPathname] = useState('');

    // 获取用户认证状态
    const {user, isAuthenticated, logout: handleLogout} = useAuth();
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

    // 点击外部关闭菜单
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
        };
        if (menuOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [menuOpen]);

    // 点击外部关闭共识选择菜单
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!consensusRef.current) return;
            if (!consensusRef.current.contains(e.target as Node)) setConsensusOpen(false);
        };
        if (consensusOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [consensusOpen]);

    // 点击外部关闭用户菜单
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!userMenuRef.current) return;
            if (!userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
        };
        if (userMenuOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [userMenuOpen]);

    // 处理用户登出
    const handleUserLogout = async () => {
        try {
            await handleLogout();
            setUserMenuOpen(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <>
            <header
                className="sticky top-0 z-40 relative py-4 border-b border-gray-100 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-gray-800 dark:bg-[#121212]/85">
                <div
                    className="px-4 lg:px-12 max-w-screen-2xl mx-auto w-full relative flex justify-between items-center">
                    <div className="flex items-center flex-1">
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
                        <Link href="/" className="flex items-center gap-2" onClick={() => {
                            setConsensus('POW')
                            if (typeof window !== 'undefined') {
                                localStorage.setItem('consensus', 'POW')
                                window.dispatchEvent(new Event('consensusChanged'))
                            }
                        }}
                        >
                            <Logo/>
                            <span
                                className="text-xl md:text-2xl font-bold tracking-wide leading-none select-none bg-gradient-to-r from-orange-500 to-purple-600 dark:from-orange-400 dark:to-purple-400
                        bg-clip-text text-transparent drop-shadow-sm">Demo Chain</span>
                        </Link>

                        {/* 桌面端导航 */}
                        <div className="hidden md:flex flex-1 justify-end mr-3">
                            <div className="flex items-baseline">
                                <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
                                    {isMounted && menuItems.map((item) => {
                                        const isActive = currentPathname === item.href;
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center space-x-2 transition-all duration-200 ${
                                                    isActive
                                                        ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
                                                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-[#1a1d24]'
                                                }`}
                                            >
                                                {item.icon}
                                                <span>{item.name}</span>
                                            </Link>
                                        );
                                    })}
                                    {isMounted && (
                                        <Link
                                            href="/glossary"
                                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center space-x-2 transition-all duration-200 ${
                                                currentPathname === '/glossary'
                                                    ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
                                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-[#1a1d24]'
                                            }`}
                                        >
                                            <NameIcon/>
                                            <span>名词</span>
                                        </Link>

                                    )}
                                    {isMounted && (
                                        <Link
                                            href="/article"
                                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center space-x-2 transition-all duration-200 ${
                                                currentPathname === '/article' || currentPathname.startsWith('/article/')
                                                    ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
                                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-[#1a1d24]'
                                            }`}
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                                 stroke="currentColor" strokeWidth="2">
                                                <rect x="5" y="3" width="14" height="18" rx="2"/>
                                                <path d="M8 8h8"/>
                                                <path d="M8 12h8"/>
                                                <path d="M8 16h6"/>
                                            </svg>
                                            <span>文章</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 md:space-x-3">
                        {/* 共识选择器（放在主题选择的右侧） */}
                        <div className="relative" ref={consensusRef}>
                            <button
                                onClick={() => setConsensusOpen(v => !v)}
                                className="h-7 px-3 inline-flex items-center gap-2 rounded-xl bg-white/90 backdrop-blur border border-gray-200 shadow-sm hover:bg-white dark:bg-[#1e1e1e]/90 dark:border-[#2d2d30] dark:text-gray-200"
                                aria-haspopup="menu"
                                aria-expanded={consensusOpen}
                                aria-label="选择共识机制"
                            >
                                <span className="inline-flex items-center gap-2">
                                    {CONSENSUS_ICON[consensus]}
                                    <span className="text-sm font-semibold tracking-wide">{consensus}</span>
                                </span>
                                <svg className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none"
                                     stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M19 9l-7 7-7-7"/>
                                </svg>
                            </button>
                            {consensusOpen && (
                                <div
                                    role="menu"
                                    aria-label="共识机制"
                                    className="absolute right-0 mt-2 w-56 rounded-2xl border bg-white/98 backdrop-blur-sm shadow-lg ring-1 ring-black/5 p-2 border-gray-200 dark:bg-[#1e1e1e] dark:border-[#2d2d30] dark:ring-white/5 z-50"
                                >
                                    {(['POW', 'POS', 'DPoS', 'BFT', 'POH'] as Consensus[]).map(opt => (
                                        <button
                                            key={opt}
                                            role="menuitemradio"
                                            aria-checked={opt === consensus}
                                            onClick={() => {
                                                setConsensus(opt)
                                                setConsensusOpen(false)
                                                if (typeof window !== 'undefined') {
                                                    localStorage.setItem('consensus', opt)
                                                    // 触发自定义事件通知首页更新
                                                    window.dispatchEvent(new Event('consensusChanged'))
                                                }
                                                // 无论选择什么共识机制，都跳转到首页
                                                router.push('/')
                                            }}
                                            className={`group flex w-full items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${opt === consensus ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-200'}`}
                                        >
                                            <span className="flex-1 text-left inline-flex items-center gap-2">
                                                {CONSENSUS_ICON[opt]}
                                                <span>{opt}</span>
                                            </span>
                                            {opt === consensus && (
                                                <span aria-hidden
                                                      className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"/>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setMenuOpen((v) => !v)}
                                className="h-8 w-8 flex items-center justify-center transition-colors md:block"
                                aria-label="主题/设置"
                                aria-expanded={menuOpen}
                                aria-haspopup="menu"
                            >
                                {isDarkMode !== null ? (
                                    isDarkMode ? (
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
                                    )
                                ) : (
                                    // 默认渲染（用于服务端渲染时保持一致）
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
                        <Link href="/pricing"
                              className="inline-flex items-center text-sm font-medium px-3 py-1.5 md:px-4 rounded-full whitespace-nowrap bg-gradient-to-r from-emerald-500 to-lime-500 text-white shadow-sm hover:opacity-90 transition-opacity dark:from-emerald-400 dark:to-lime-400"
                        >
                            订阅
                        </Link>

                        {/* 用户菜单 */}
                        {isAuthenticated ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setUserMenuOpen(v => !v)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm whitespace-nowrap bg-white/80 text-gray-900 border border-gray-200 shadow-sm hover:bg-white dark:hover:bg-white/20 dark:bg-white/10 dark:text-white dark:border-white/10 backdrop-blur-sm transition-colors"
                                    aria-haspopup="menu"
                                    aria-expanded={userMenuOpen}
                                >
                                    <span
                                        className="w-6 h-6 rounded-full bg-gray-200 text-black flex items-center justify-center text-xs font-bold">
                                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                    <span className="hidden md:inline">
                                        {user?.username || user?.email?.split('@')[0] || '用户'}
                                    </span>
                                </button>

                                {isAuthenticated && userMenuOpen && (
                                    <div role="menu" aria-label="用户菜单" className="absolute right-0 mt-2 w-48 rounded-2xl border bg-white/98 backdrop-blur-sm shadow-lg ring-1 ring-black/5 p-2
                                            border-gray-200 dark:bg-[#1e1e1e] dark:border-[#2d2d30] dark:ring-white/5 dark:text-gray-200 z-50">
                                        <div
                                            className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">{user?.email}
                                        </div>
                                        <button
                                            onClick={handleUserLogout}
                                            className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                        >
                                            登出
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => setLoginOpen(true)}
                                className="px-3 py-1.5 md:px-4 rounded-full text-sm whitespace-nowrap bg-white/90 text-gray-900 border border-gray-200 shadow-sm hover:bg-white dark:hover:bg-white/20 dark:bg-white/10 dark:text-white dark:border-white/10 backdrop-blur-sm transition-colors"
                            >
                                登录/注册
                            </button>
                        )}

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

            {/* 移动端菜单 */}
            {mobileMenuOpen && isMounted && (
                <div className="md:hidden border-b border-gray-200 dark:border-[#1f232b] bg-gray-50 dark:bg-[#111317]"
                     id="mobile-nav">
                    <div className="px-3 py-2 space-y-1">
                        {menuItems.map((item) => {
                            const isActive = currentPathname === item.href || currentPathname.startsWith(item.href + '/');
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

                        {/* 固定链接 */}
                        <Link
                            href="/glossary"
                            className={`block px-5 py-3 rounded-lg text-lg font-semibold tracking-wide flex items-center space-x-3 transition-all duration-200 ${
                                currentPathname === '/glossary'
                                    ? 'text-orange-600 dark:text-orange-400'
                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-[#1a1d24]'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <NameIcon/>
                            <span>名词</span>
                        </Link>

                        <Link
                            href="/article"
                            className={`block px-5 py-3 rounded-lg text-lg font-semibold tracking-wide flex items-center space-x-3 transition-all duration-200 ${
                                currentPathname === '/article' || currentPathname.startsWith('/article/')
                                    ? 'text-orange-600 dark:text-orange-400'
                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-[#1a1d24]'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 strokeWidth="2">
                                <rect x="5" y="3" width="14" height="18" rx="2"/>
                                <path d="M8 8h8"/>
                                <path d="M8 12h8"/>
                                <path d="M8 16h6"/>
                            </svg>
                            <span>文章</span>
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}