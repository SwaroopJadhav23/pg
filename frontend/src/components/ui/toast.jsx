import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

const ToastContext = createContext(null);

export function emitToast(toast) {
  window.dispatchEvent(new CustomEvent('pg-toast', { detail: toast }));
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((payload) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, variant: 'default', ...payload }]);
    setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), payload.duration || 3500);
  }, []);

  useEffect(() => {
    const handler = (event) => toast(event.detail);
    window.addEventListener('pg-toast', handler);
    return () => window.removeEventListener('pg-toast', handler);
  }, [toast]);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="safe-top fixed inset-x-3 top-3 z-[100] flex max-w-sm flex-col gap-3 sm:inset-x-auto sm:right-4 sm:top-4">
        {toasts.map((item) => (
          <div key={item.id} className={cn('rounded-2xl border bg-white p-4 shadow-soft dark:bg-slate-950', item.variant === 'destructive' && 'border-rose-200 bg-rose-50 text-rose-700 dark:bg-rose-950')}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="break-words font-bold">{item.title}</p>
                {item.description ? <p className="mt-1 break-words text-sm text-muted-foreground">{item.description}</p> : null}
              </div>
              <button type="button" className="flex h-10 w-10 shrink-0 items-center justify-center" onClick={() => setToasts((current) => current.filter((toastItem) => toastItem.id !== item.id))}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
}
