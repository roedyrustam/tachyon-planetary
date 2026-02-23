import React, { ReactNode } from 'react';
import './ui.css';

interface CardProps {
    children: ReactNode;
    className?: string;
    hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false }) => {
    return (
        <div className={`card ${hoverable ? 'card-hoverable' : ''} ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`card-header ${className}`}>
        {children}
    </div>
);

export const CardTitle: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
    <h3 className={`card-title ${className}`}>
        {children}
    </h3>
);

export const CardBody: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`card-body ${className}`}>
        {children}
    </div>
);

export const CardFooter: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`card-footer ${className}`}>
        {children}
    </div>
);
