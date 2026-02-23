import React, { InputHTMLAttributes, ReactNode } from 'react';
import './ui.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    icon,
    className = '',
    id,
    ...props
}) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="input-group">
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                </label>
            )}
            <div className="input-wrapper">
                {icon && <span className="input-icon-left flex-center">{icon}</span>}
                <input
                    id={inputId}
                    className={`input-field ${icon ? 'input-with-icon' : ''} ${className}`}
                    {...props}
                />
            </div>
        </div>
    );
};
