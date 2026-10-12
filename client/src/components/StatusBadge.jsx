import React from 'react';

export default function StatusBadge({
  status = 'active',
  label,
  size = 'md', // 'sm' | 'md' | 'lg'
  dot = true,
  className = '',
}) {
  const normalizedStatus = status.toLowerCase();

  const statusConfigs = {
    optimal: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      text: 'text-emerald-700 dark:text-emerald-400',
      dot: 'bg-emerald-500',
      border: 'border-emerald-500/20',
      defaultLabel: 'Optimal',
    },
    active: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      text: 'text-emerald-700 dark:text-emerald-400',
      dot: 'bg-emerald-500 animate-pulse',
      border: 'border-emerald-500/20',
      defaultLabel: 'Active',
    },
    warning: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      text: 'text-amber-700 dark:text-amber-400',
      dot: 'bg-amber-500',
      border: 'border-amber-500/20',
      defaultLabel: 'Warning',
    },
    critical: {
      bg: 'bg-rose-500/10 dark:bg-rose-500/20',
      text: 'text-rose-700 dark:text-rose-400',
      dot: 'bg-rose-500 animate-ping',
      border: 'border-rose-500/20',
      defaultLabel: 'Critical',
    },
    offline: {
      bg: 'bg-slate-500/10 dark:bg-slate-500/20',
      text: 'text-slate-600 dark:text-slate-400',
      dot: 'bg-slate-400',
      border: 'border-slate-500/20',
      defaultLabel: 'Offline',
    },
    info: {
      bg: 'bg-blue-500/10 dark:bg-blue-500/20',
      text: 'text-blue-700 dark:text-blue-400',
      dot: 'bg-blue-500',
      border: 'border-blue-500/20',
      defaultLabel: 'Info',
    },
  };

  const config = statusConfigs[normalizedStatus] || statusConfigs.info;
  const displayLabel = label || config.defaultLabel;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center space-x-1.5 rounded-full font-medium border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />}
      <span>{displayLabel}</span>
    </span>
  );
}
