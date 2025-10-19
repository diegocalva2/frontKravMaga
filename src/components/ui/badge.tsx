import React from 'react';
import type { ReactNode } from 'react';

interface BadgeProps {
    children: ReactNode;
    variant?: 'success' | 'warning' | 'danger' | 'info';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
    children, 
    variant = 'info',
    className = '' 
}) => {
    const variantClasses = {
        success: 'bg-green-500/20 text-green-400 border border-green-500/30',
        warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
        danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
        info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
    };

    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${variantClasses[variant]} ${className}`}>
            {children}
        </span>
    );
};

