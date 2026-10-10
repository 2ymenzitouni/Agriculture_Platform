import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg' | 'icon'
  icon,
  iconRight,
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variantClasses = {
    primary:
      'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/30 focus:ring-emerald-500 border border-transparent',
    secondary:
      'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-slate-400 border border-slate-200 dark:border-slate-700',
    outline:
      'border border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-slate-400',
    ghost:
      'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-transparent focus:ring-slate-400',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-600/30 focus:ring-rose-500 border border-transparent',
  };

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 space-x-1',
    md: 'text-sm px-4 py-2 space-x-2',
    lg: 'text-base px-5 py-2.5 space-x-2.5',
    icon: 'p-2',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.md} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="material-symbols-outlined animate-spin text-base">
          progress_activity
        </span>
      ) : icon ? (
        typeof icon === 'string' ? (
          <span className="material-symbols-outlined text-base">{icon}</span>
        ) : (
          icon
        )
      ) : null}

      {children && <span>{children}</span>}

      {!loading && iconRight ? (
        typeof iconRight === 'string' ? (
          <span className="material-symbols-outlined text-base">{iconRight}</span>
        ) : (
          iconRight
        )
      ) : null}
    </button>
  );
}
