import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'violet' | 'cyan' | 'gold';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  const variants = {
    default: 'bg-gray-800 text-gray-300 border border-gray-700',
    success: 'bg-emerald-900/50 text-emerald-400 border border-emerald-700/50',
    warning: 'bg-amber-900/50 text-amber-400 border border-amber-700/50',
    danger: 'bg-red-900/50 text-red-400 border border-red-700/50',
    violet: 'bg-violet-900/50 text-violet-400 border border-violet-700/50',
    cyan: 'bg-cyan-900/50 text-cyan-400 border border-cyan-700/50',
    gold: 'bg-amber-900/60 text-amber-300 border border-amber-600/50',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span className={cn('inline-flex items-center gap-1 font-medium rounded-full', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
