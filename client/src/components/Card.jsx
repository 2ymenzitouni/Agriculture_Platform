import React from 'react';

export default function Card({
  title,
  subtitle,
  icon,
  badge,
  actions,
  children,
  className = '',
  headerClassName = '',
  bodyClassName = '',
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-sm transition-all hover:shadow-md ${className}`}
    >
      {(title || subtitle || icon || badge || actions) && (
        <div
          className={`flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 px-5 py-4 ${headerClassName}`}
        >
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {typeof icon === 'string' ? (
                  <span className="material-symbols-outlined text-lg">{icon}</span>
                ) : (
                  icon
                )}
              </div>
            )}
            <div>
              {title && (
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm md:text-base">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {badge}
            {actions}
          </div>
        </div>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </div>
  );
}
