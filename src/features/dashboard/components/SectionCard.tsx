import React from 'react';
import type { ElementType,ReactNode } from 'react';

export const SectionCard: React.FC<{
  title: string;
  subtitle?: string;
  Icon?: ElementType;
  children: ReactNode;
  className?: string;
}> = ({ title, subtitle, Icon, children, className = '' }) => {
  const titleColorClass = className.includes('border-red') ? 'text-red-700' :
                         className.includes('border-yellow') ? 'text-yellow-700' : 'text-gray-800';
  return (
    <div className={`bg-slate-800/60 border border-slate-700 p-6 rounded-xl shadow-xl shadow-black/40 ${className}`}>
      <div className="flex items-center mb-4">
        {Icon && <Icon className={`w-5 h-5 mr-2 ${titleColorClass}`} />}
        <h2 className={`text-xl font-semibold ${titleColorClass}`}>{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-gray-400 mb-4">{subtitle}</p> }
      <div>{children}</div>
    </div>
  );
};