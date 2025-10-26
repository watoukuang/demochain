import React, {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {login, register, LoginRequest, RegisterRequest} from '../../src/shared/api/auth';

interface LoginModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: (user: any) => void; // 登录成功回调
}

export default function Index({open, onClose, onSuccess}: LoginModalProps): React.ReactElement | null {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    // 表单数据
    const [formState, setFormState] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const googleUrl = (typeof window !== 'undefined' && (window as any).NEXT_PUBLIC_GOOGLE_OAUTH_URL) || process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL || '/api/auth/google';

    const onGoogle = () => {
        try {
            window.location.href = googleUrl as string;
        } catch (e) {
            console.error('Google OAuth redirect failed:', e);
        }
    };

    // Esc 关闭
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (open) document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    // 重置表单
    const resetForm = () => {
        setFormState({
            email: '',
            password: '',
            confirmPassword: '',
        });
        setError('');
    };

    // 切换模式时重置表单
    const handleModeChange = (newMode: 'login' | 'signup') => {
        setMode(newMode);
        resetForm();
    };

    // 表单输入处理
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: value,
        }));
        // 清除错误信息
        if (error) setError('');
    };

    // 表单验证
    const validateForm = (): boolean => {
        if (!formState.email || !formState.password) {
            setError('请填写邮箱和密码');
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
            setError('请输入有效的邮箱地址');
            return false;
        }

        if (formState.password.length < 6) {
            setError('密码长度至少为6位');
            return false;
        }

        if (mode === 'signup' && formState.password !== formState.confirmPassword) {
            setError('两次输入的密码不一致');
            return false;
        }

        return true;
    };

    // 表单提交
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            if (mode === 'login') {
                const loginData: LoginRequest = {
                    email: formState.email,
                    password: formState.password,
                };
                const response = await login(loginData);

                // 登录成功
                onSuccess?.(response.user);
                onClose();
                resetForm();
            } else {
                const registerData: RegisterRequest = {
                    email: formState.email,
                    password: formState.password,
                };
                const response = await register(registerData);

                // 注册成功
                onSuccess?.(response.user);
                onClose();
                resetForm();
            }
        } catch (err: any) {
            setError(err.message || '操作失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-[1px]"
            onClick={handleBackdropClick}
        >
            <div
                ref={rootRef}
                role="dialog"
                aria-modal="true"
                aria-label="登录"
                className="w-[92%] max-w-md rounded-2xl border bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] ring-1 ring-black/5
                   border-gray-200 p-5 md:p-6 relative
                   dark:bg-[#1f2125] dark:border-[#2a2c31] dark:text-gray-100 dark:ring-white/5"
            >
                <button
                    onClick={onClose}
                    aria-label="关闭"
                    className="absolute right-3 top-3 rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-[#26292e]"
                >
                    ✕
                </button>

                <h2 className="text-xl md:text-2xl font-bold">{mode === 'login' ? '登录' : '注册'}</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {mode === 'login' ? '登录后可收藏内容并解锁更多功能' : '创建一个新账户以开始使用我们的服务'}
                </p>

                {/* 第三方登录 */}
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={onGoogle}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 dark:bg-[#141518] dark:text-gray-100 dark:border-[#2a2c31]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-4 w-4" aria-hidden>
                            <path fill="#FFC107"
                                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.64,6.053,29.084,4,24,4C12.955,4,4,12.955,4,24 s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                            <path fill="#FF3D00"
                                  d="M6.306,14.691l6.571,4.819C14.655,16.108,18.961,14,24,14c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C33.64,6.053,29.084,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                            <path fill="#4CAF50"
                                  d="M24,44c5.166,0,9.86-1.977,13.409-5.197l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.022C9.505,39.556,16.227,44,24,44z"/>
                            <path fill="#1976D2"
                                  d="M43.611,20.083H42V20H24v8h11.303c-0.793,2.237-2.231,4.166-4.094,5.565 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                        </svg>
                        使用 Google 登录
                    </button>

                    <div className="my-4 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                        <div className="h-px flex-1 bg-gray-200 dark:bg-[#2a2c31]"/>
                        <span>或使用邮箱{mode === 'signup' ? '注册' : '登录'}</span>
                        <div className="h-px flex-1 bg-gray-200 dark:bg-[#2a2c31]"/>
                    </div>
                </div>

                {/* 错误提示 */}
                {error && (
                    <div
                        className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-3">
                    <div>
                        <label className="block text-sm mb-1">邮箱</label>
                        <input
                            type="email"
                            name="email"
                            value={formState.email}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            placeholder="your@email.com"
                            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500
                         bg-white text-gray-900 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed
                         dark:bg-[#141518] dark:text-gray-100 dark:border-[#2a2c31]"
                        />
                    </div>
                    <div className="pt-2 border-t border-gray-200 dark:border-[#2a2c31]">
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-sm">密码</label>
                            {mode === 'login' && (
                                <a className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                                   href="#">忘记密码?</a>
                            )}
                        </div>
                        <input
                            type="password"
                            name="password"
                            value={formState.password}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            placeholder="•••••••"
                            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500
                         bg-white text-gray-900 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed
                         dark:bg-[#141518] dark:text-gray-100 dark:border-[#2a2c31]"
                        />
                    </div>

                    {mode === 'signup' && (
                        <div className="pt-2 border-t border-gray-200 dark:border-[#2a2c31]">
                            <label className="block text-sm mb-1">确认密码</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formState.confirmPassword}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                                placeholder="再次输入密码"
                                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500
                           bg-white text-gray-900 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed
                           dark:bg-[#141518] dark:text-gray-100 dark:border-[#2a2c31]"
                            />
                        </div>
                    )}

                    {/* 底部操作区：左侧切换、右侧提交按钮 */}
                    <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            {mode === 'login' ? (
                                <>
                                    没有账户？
                                    <button
                                        type="button"
                                        onClick={() => handleModeChange('signup')}
                                        disabled={loading}
                                        className="ml-1 text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-50"
                                    >
                                        去注册
                                    </button>
                                </>
                            ) : (
                                <>
                                    已有账户？
                                    <button
                                        type="button"
                                        onClick={() => handleModeChange('login')}
                                        disabled={loading}
                                        className="ml-1 text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-50"
                                    >
                                        去登录
                                    </button>
                                </>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex md:w-auto items-center justify-center rounded-lg bg-black text-white px-4 py-2 text-sm font-medium border border-transparent
                         hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-[#ffffff] dark:text-black"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white dark:text-black"
                                         fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor"
                                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {mode === 'login' ? '登录中...' : '注册中...'}
                                </>
                            ) : (
                                mode === 'login' ? '登录' : '注册'
                            )}
                        </button>
                    </div>
                </form>

                <p className="mt-3 text-[12px] text-gray-500 dark:text-gray-500">登录/注册即表示你同意用户协议和隐私政策</p>
            </div>
        </div>,
        document.body
    );
}
