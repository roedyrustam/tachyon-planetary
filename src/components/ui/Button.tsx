import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import './ui.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    icon?: ReactNode;
    iconOnly?: boolean;
    loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    icon,
    iconOnly = false,
    loading = false,
    className = '',
    disabled,
    ...props
}) => {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const iconClass = iconOnly ? 'btn-icon-only' : '';
    const isLoadingClass = loading ? 'btn-loading' : '';

    return (
        <button
            className={`${baseClass} ${variantClass} ${iconClass} ${isLoadingClass} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <span className="animate-spin mr-2">◌</span>}
            {!loading && icon && <span className="flex-center">{icon}</span>}
            {!iconOnly && children}
        </button>
    );
};

export default Button;
