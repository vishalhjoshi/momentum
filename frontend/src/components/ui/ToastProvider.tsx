
import React, { createContext, useContext, useState, useCallback } from 'react';

import { ToastProps, ToastType } from './Toast';

interface ToastOptions {
  title?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastProps[];
  addToast: (message: string, type?: ToastType, options?: ToastOptions) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', options: ToastOptions = {}) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: ToastProps = {
        id,
        message,
        type,
        title: options.title,
        duration: options.duration,
        onDismiss: removeToast,
      };
      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
