import React from 'react';
import type { ElementType,ReactNode } from 'react';

export const SectionCard: React.FC<{
  title: string;
  subtitle?: string;
  Icon?: ElementType;
  children: ReactNode;
  className?: string;
}> = ({ title, subtitle, Icon, children, className = '' }) => {
  const titleColorClass = className.includes('border-red') ? 'text-red-500' :
                         className.includes('border-yellow') ? 'text-yellow-600' : 'text-gray-200';
  return (
    <div className={`bg-slate-600/50 border-slate-700 p-6 rounded-xl shadow-xl shadow-black/40 ${className}`}>
      <div className="flex items-center mb-4">
        {Icon && <Icon className={`w-5 h-5 mr-2 ${titleColorClass}`} />}
        <h2 className={`text-xl font-semibold ${titleColorClass}`}>{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-gray-100 mb-4">{subtitle}</p> }
      <div>{children}</div>
    </div>
  );
};