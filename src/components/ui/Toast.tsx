import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  toast: (options: { type: ToastType; title: string; description?: string }) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type, title, description }: { type: ToastType; title: string; description?: string }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newToast: ToastMessage = { id, type, title, description };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, description?: string) => addToast({ type: 'success', title, description }),
    [addToast]
  );
  const error = useCallback(
    (title: string, description?: string) => addToast({ type: 'error', title, description }),
    [addToast]
  );
  const info = useCallback(
    (title: string, description?: string) => addToast({ type: 'info', title, description }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, info }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-20 sm:bottom-5 right-4 sm:right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-2 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xs border transition-all duration-300 transform translate-y-0 ${
              t.type === 'success'
                ? 'bg-[#E8F4EE] text-[#1F1D1B] border-[#2E7D5B]/30'
                : t.type === 'error'
                ? 'bg-[#FCECEC] text-[#1F1D1B] border-[#C94A4A]/30'
                : 'bg-[#FDF3E7] text-[#1F1D1B] border-[#EAE4DE]'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#2E7D5B]" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-[#C94A4A]" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-[#8C530A]" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight text-[#1F1D1B]">{t.title}</p>
              {t.description && (
                <p className="text-xs mt-1 leading-relaxed text-[#736B65]">
                  {t.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors text-[#736B65] hover:text-[#1F1D1B]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
