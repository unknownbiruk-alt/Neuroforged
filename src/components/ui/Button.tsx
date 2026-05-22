import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  tooltip?: string;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  tooltip,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 select-none';

  const variants = {
    primary:
      'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 focus:ring-violet-500 shadow-lg shadow-violet-900/30 active:scale-95',
    secondary:
      'bg-gray-800 text-gray-100 hover:bg-gray-700 focus:ring-gray-600 border border-gray-700',
    ghost:
      'bg-transparent text-gray-400 hover:text-white hover:bg-gray-800 focus:ring-gray-700',
    danger:
      'bg-red-600 text-white hover:bg-red-500 focus:ring-red-500 shadow-lg shadow-red-900/30',
    outline:
      'border border-violet-500 text-violet-400 hover:bg-violet-500/10 focus:ring-violet-500',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
    xl: 'text-lg px-8 py-4',
  };

  const disabledStyle = 'opacity-50 cursor-not-allowed pointer-events-none';

  const isDisabled = disabled || loading;

  const btn = (
    <button
      className={cn(base, variants[variant], sizes[size], isDisabled && disabledStyle, className)}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  );

  if (tooltip && isDisabled) {
    return (
      <div className="relative group inline-block">
        {btn}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 border border-gray-700 text-gray-200 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-700" />
        </div>
      </div>
    );
  }

  return btn;
}
