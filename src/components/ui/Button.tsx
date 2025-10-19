import React from 'react';
import type { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger'|'ghost';
    size?: 'sm' | 'md'|'lg';
    children: ReactNode;
    icon?: ReactNode;
}

export const Button:React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    children,
    icon,
    className = '',
    disabled,...props
})=>{
const baseClasses = 'font-bold rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap';
    
    const variantClasses = {
        primary:'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400',
         secondary: 'bg-slate-600 hover:bg-slate-700 text-white disabled:bg-slate-400',
        danger: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400',
        ghost: 'bg-transparent hover:bg-slate-700 text-blue-400 hover:text-blue-300'
    }

    const sizeClasses = {
        sm: 'py-1 px-2 text-sm',
        md: 'py-2 px-4',
        lg: 'py-3 px-6 text-lg'
    };

    return(
        <button
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        disabled = {disabled}
        {...props}
        > {icon}
          {children}
            </button>
    );
};