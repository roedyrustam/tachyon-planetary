import React, { ReactNode } from 'react';
import './ui.css';

interface BadgeProps {
    children: ReactNode;
    variant?: 'success' | 'warning' | 'danger' | 'info';
    className?: string;
}

const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'info',
    className = '',
}) => {
    return (
        <span className={`badge badge-${variant} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
