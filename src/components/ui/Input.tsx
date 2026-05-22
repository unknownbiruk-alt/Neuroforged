import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className, ...props }: InputProps) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full bg-gray-900 border text-white placeholder-gray-600 rounded-lg px-4 py-2.5 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500',
            'transition-colors duration-200',
            icon && 'pl-10',
            error ? 'border-red-500' : 'border-gray-700 hover:border-gray-600',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
