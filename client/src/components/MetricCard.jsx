import React from 'react';

export default function MetricCard({
  label,
  value,
  unit = '',
  icon,
  trend,
  trendDirection = 'up', // 'up' | 'down' | 'neutral'
  color = 'emerald', // 'emerald' | 'blue' | 'amber' | 'purple' | 'rose'
  subtext,
  className = '',
}) {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-500/20',
      glow: 'shadow-emerald-500/10',
    },
    blue: {
      bg: 'bg-blue-500/10 dark:bg-blue-500/20',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-500/20',
      glow: 'shadow-blue-500/10',
    },
    amber: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-500/20',
      glow: 'shadow-amber-500/10',
    },
    purple: {
      bg: 'bg-purple-500/10 dark:bg-purple-500/20',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-500/20',
      glow: 'shadow-purple-500/10',
    },
    rose: {
      bg: 'bg-rose-500/10 dark:bg-rose-500/20',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-500/20',
      glow: 'shadow-rose-500/10',
    },
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-5 shadow-sm transition-all hover:shadow-md hover:scale-[1.01] ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {value}
            </span>
            {unit && (
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {unit}
              </span>
            )}
          </div>
        </div>

        {icon && (
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${scheme.bg} ${scheme.text}`}
          >
            {typeof icon === 'string' ? (
              <span className="material-symbols-outlined text-xl">{icon}</span>
            ) : (
              icon
            )}
          </div>
        )}
      </div>

      {(trend || subtext) && (
        <div className="mt-3 flex items-center space-x-2 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center font-medium ${
                trendDirection === 'up'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : trendDirection === 'down'
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-slate-500'
              }`}
            >
              <span className="material-symbols-outlined text-xs mr-0.5">
                {trendDirection === 'up'
                  ? 'trending_up'
                  : trendDirection === 'down'
                  ? 'trending_down'
                  : 'remove'}
              </span>
              {trend}
            </span>
          )}
          {subtext && (
            <span className="text-slate-500 dark:text-slate-400">{subtext}</span>
          )}
        </div>
      )}
    </div>
  );
}
