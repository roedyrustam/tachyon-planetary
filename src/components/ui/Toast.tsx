import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import './ui.css';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type?: ToastType;
    duration?: number;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', duration = 3000, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onClose, 300); // Match animation duration
    };

    const icons = {
        success: <CheckCircle size={18} className="text-secondary" />,
        error: <AlertCircle size={18} className="text-danger" />,
        info: <Info size={18} className="text-primary" />
    };

    return (
        <div className={`toast-message toast-${type} ${isExiting ? 'toast-exit' : ''}`}>
            <div className="flex items-center gap-3">
                {icons[type]}
                <span className="text-sm font-medium">{message}</span>
            </div>
            <button onClick={handleClose} className="ml-4 text-muted hover:text-white transition-colors">
                <X size={14} />
            </button>
        </div>
    );
};

export const ToastContainer: React.FC<{ toasts: { id: string; message: string; type: ToastType }[]; removeToast: (id: string) => void }> = ({ toasts, removeToast }) => {
    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

export default Toast;
