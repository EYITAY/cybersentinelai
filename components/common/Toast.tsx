import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextValue {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

const icons: Record<ToastType, React.ReactNode> = {
    success: (
        <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    ),
    error: (
        <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    info: (
        <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

const borderColors: Record<ToastType, string> = {
    success: 'border-green-500/40',
    error: 'border-red-500/40',
    info: 'border-cyan-500/40',
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const counter = useRef(0);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = ++counter.current;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const dismiss = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3 pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-start gap-3 bg-gray-800 border ${borderColors[toast.type]} rounded-lg px-4 py-3 shadow-2xl max-w-sm animate-fade-in`}
                    >
                        {icons[toast.type]}
                        <p className="text-sm text-gray-200 flex-1">{toast.message}</p>
                        <button
                            onClick={() => dismiss(toast.id)}
                            className="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0"
                            aria-label="Dismiss"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
