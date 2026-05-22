import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
}

export function Card({ children, className, glow = false, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-gray-900 border border-gray-800 rounded-xl p-6',
        glow && 'shadow-lg shadow-violet-900/20',
        hover && 'hover:border-gray-700 transition-colors cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  className,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; label: string };
  className?: string;
}) {
  return (
    <Card className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400 font-medium">{label}</span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-violet-400">
            {icon}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
      {trend && (
        <div className={cn('text-xs font-medium', trend.value >= 0 ? 'text-emerald-400' : 'text-red-400')}>
          {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
        </div>
      )}
    </Card>
  );
}
