import React, {useRef, useEffect} from 'react';
import {useAuth} from '../../src/shared/hooks/useAuth';

interface UserMenuProps {
    userMenuOpen: boolean;
    setUserMenuOpen: (open: boolean) => void;
    setLoginOpen: (open: boolean) => void;
}

export default function Account({userMenuOpen, setUserMenuOpen, setLoginOpen}: UserMenuProps) {
    const userMenuRef = useRef<HTMLDivElement | null>(null);
    const {user, isAuthenticated, logout: handleLogout} = useAuth();

    // 点击外部关闭菜单
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!userMenuRef.current) return;
            if (!userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
        };
        if (userMenuOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [userMenuOpen, setUserMenuOpen]);

    const handleUserLogout = async () => {
        try {
            await handleLogout();
            setUserMenuOpen(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (isAuthenticated) {
        return (
            <div className="relative" ref={userMenuRef}>
                <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
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

                {userMenuOpen && (
                    <div
                        role="menu"
                        aria-label="用户菜单"
                        className="absolute right-0 mt-2 w-48 rounded-2xl border bg-white/98 backdrop-blur-sm shadow-lg ring-1 ring-black/5 p-2 border-gray-200 dark:bg-[#1e1e1e] dark:border-[#2d2d30] dark:ring-white/5 dark:text-gray-200 z-50"
                    >
                        <div
                            className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                            {user?.email}
                        </div>
                        <button
                            onClick={() => {
                                setUserMenuOpen(false);
                                if (typeof window !== 'undefined') {
                                    window.location.href = '/order';
                                }
                            }}
                            className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            role="menuitem"
                        >
                            订单记录
                        </button>
                        <button
                            onClick={handleUserLogout}
                            className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            role="menuitem"
                        >
                            登出
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <button
            onClick={() => setLoginOpen(true)}
            className="px-3 py-1.5 md:px-4 rounded-full text-sm whitespace-nowrap bg-white/90 text-gray-900 border border-gray-200 shadow-sm hover:bg-white dark:hover:bg-white/20 dark:bg-white/10 dark:text-white dark:border-white/10 backdrop-blur-sm transition-colors"
        >
            登录/注册
        </button>
    );
}
