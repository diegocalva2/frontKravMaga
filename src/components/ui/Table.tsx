import React from 'react';
import type { ReactNode } from 'react';

interface TableProps {
    children:ReactNode;
    className?: string;
}

export const Table: React.FC<TableProps>= ({children, className = ''}) => {
    return (
         <div className={`bg-slate-800/60 rounded-xl shadow-xl shadow-black/20 overflow-x-auto ${className}`}>
            <table className="w-full text-left min-w-[800px]">
                {children}
            </table>
        </div>
     )
};

interface TableHeaderProps {
    children:ReactNode;
}

export const TableHeader: React.FC<TableHeaderProps>= ({children})=>
{
    return (
        <thead className='bg-slate-900/80'>
            {children}
            </thead>
    )
}

interface TableBodyProps {
    children: ReactNode;
}

export const TableBody: React.FC<TableBodyProps> = ({children}) => {
    return (
        <tbody className="divide-y divide-slate-700">
            {children}
        </tbody>

    );
};

interface TableRowProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export const TableRow: React.FC<TableRowProps> = ({ children, className = '', onClick }) => {
    return (
        <tr 
            className={`hover:bg-slate-700/40 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
            onClick={onClick}
        >
            {children}
        </tr>
    );
};

interface TableCellProps {
    children: ReactNode;
    className?: string;
}

export const TableCell: React.FC<TableCellProps> = ({ children, className = '' }) => {
    return (
        <td className={`p-4 ${className}`}>
            {children}
        </td>
    );
};