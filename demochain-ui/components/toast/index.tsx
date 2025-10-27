import React, {createContext, useCallback, useContext, useMemo, useState} from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  success: (msg: string) => void;
  error: (msg: string) => void;
  info: (msg: string) => void;
  warning: (msg: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((type: ToastType, message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const item: ToastItem = { id, type, message };
    setToasts(prev => [...prev, item]);
    // 自动销毁
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2500);
  }, []);

  const api = useMemo<ToastContextValue>(() => ({
    success: (m: string) => push('success', m),
    error:   (m: string) => push('error', m),
    info:    (m: string) => push('info', m),
    warning: (m: string) => push('warning', m),
  }), [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/* 容器 */}
      <div style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 2147483647,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        pointerEvents: 'none',
      }}>
        {toasts.map(t => {
          const bg = t.type === 'success'
            ? '#10b981'
            : t.type === 'error'
              ? '#ef4444'
              : t.type === 'warning'
                ? '#f59e0b'
                : '#3b82f6';

          const icon = t.type === 'success'
            ? '✓'
            : t.type === 'error'
              ? '!' 
              : t.type === 'warning'
                ? '!' 
                : 'i';

          return (
            <div key={t.id} role="status" style={{
              minWidth: 240,
              maxWidth: 360,
              padding: '10px 12px',
              borderRadius: 12,
              boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
              fontSize: 14,
              fontWeight: 500,
              color: '#fff',
              background: bg,
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span aria-hidden style={{
                width: 18,
                height: 18,
                borderRadius: 9999,
                background: 'rgba(255,255,255,0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 800,
                lineHeight: 1,
              }}>{icon}</span>
              <span>{t.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
