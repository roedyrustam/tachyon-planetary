import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import './ui.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    icon?: ReactNode;
    iconOnly?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    icon,
    iconOnly = false,
    className = '',
    ...props
}) => {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const iconClass = iconOnly ? 'btn-icon-only' : '';

    return (
        <button
            className={`${baseClass} ${variantClass} ${iconClass} ${className}`}
            {...props}
        >
            {icon && <span className="flex-center">{icon}</span>}
            {!iconOnly && children}
        </button>
    );
};

export default Button;
