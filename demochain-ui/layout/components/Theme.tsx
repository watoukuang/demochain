import React, {useRef, useEffect, useState} from 'react';

interface ThemeSelectorProps {
    theme: 'light' | 'dark' | 'system';
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    isDarkMode: boolean | null;
}

export default function Theme({
                                  theme,
                                  setTheme,
                                  isDarkMode
                              }: ThemeSelectorProps) {
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    // 点击外部关闭菜单
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
        };
        if (menuOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [menuOpen]);

    const themeOptions = [
        {key: 'light', label: '明亮主题', icon: '☀️'},
        {key: 'dark', label: '暗黑主题', icon: '🌙'},
        {key: 'system', label: '跟随系统', icon: '🖥️'},
    ] as const;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="h-8 w-8 flex items-center justify-center transition-colors md:block"
                aria-label="主题/设置"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
            >
                {isDarkMode !== null ? (
                    isDarkMode ? (
                        <svg className="h-5 w-5 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                        </svg>
                    ) : (
                        <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                        </svg>
                    )
                ) : (
                    <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                )}
            </button>

            {menuOpen && (
                <div
                    role="menu"
                    aria-label="主题切换"
                    className="absolute right-0 mt-2 w-56 rounded-2xl border bg-white backdrop-blur-sm shadow-lg ring-1 ring-black/5 p-2 border-gray-200 dark:bg-[#1e1e1e] dark:border-[#2d2d30] dark:ring-white/5 dark:text-gray-200 z-50"
                >
                    {themeOptions.map((option, index) => (
                        <React.Fragment key={option.key}>
                            <button
                                role="menuitemradio"
                                aria-checked={theme === option.key}
                                onClick={() => {
                                    setTheme(option.key);
                                    setMenuOpen(false);
                                }}
                                className={`group flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
                                    theme === option.key ? 'bg-gray-100 dark:bg-gray-800' : ''
                                }`}
                            >
                <span
                    className={option.key === 'light' ? 'text-yellow-500' : option.key === 'system' ? 'text-indigo-600' : 'text-gray-700 dark:text-gray-300'}>
                  {option.icon}
                </span>
                                <span className="flex-1 text-left">{option.label}</span>
                                {theme === option.key && (
                                    <span aria-hidden
                                          className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"/>
                                )}
                            </button>
                            {index < themeOptions.length - 1 && (
                                <div className="my-1 h-px bg-gray-200 dark:bg-gray-800"/>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
}
