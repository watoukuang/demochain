import { useState, useEffect, useCallback } from 'react';
import { User, getLocalUser, getLocalToken, isTokenValid, logout } from '../api/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });
  
  const [mounted, setMounted] = useState(false);

  // 处理客户端挂载
  useEffect(() => {
    setMounted(true);
  }, []);

  // 初始化与刷新认证状态
  useEffect(() => {
    if (!mounted) return; // 只在客户端执行

    const refreshAuth = () => {
      const token = getLocalToken();
      const user = getLocalUser();

      if (token && user && isTokenValid()) {
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_info');
        }
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    // 初始化
    refreshAuth();

    // 监听同标签自定义事件与跨标签 storage 事件
    const onAuthChanged = () => refreshAuth();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'auth_token' || e.key === 'user_info') refreshAuth();
    };

    window.addEventListener('authChanged', onAuthChanged as EventListener);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('authChanged', onAuthChanged as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, [mounted]);

  // 登录成功后更新状态
  const handleLoginSuccess = useCallback((user: User, token: string) => {
    setAuthState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  // 登出
  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  // 更新用户信息
  const updateUser = useCallback((user: User) => {
    setAuthState(prev => ({
      ...prev,
      user,
    }));
    
    // 更新本地存储
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_info', JSON.stringify(user));
    }
  }, []);

  // 在服务端渲染时返回默认状态，避免水合不匹配
  if (!mounted) {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      login: handleLoginSuccess,
      logout: handleLogout,
      updateUser,
    };
  }

  return {
    ...authState,
    login: handleLoginSuccess,
    logout: handleLogout,
    updateUser,
  };
}
