import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: string; positive: boolean };
  className?: string;
  iconBg?: string;
  pastelBg?: string;
}

export function StatCard({ title, value, subtitle, icon, trend, className, iconBg, pastelBg }: Props) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:shadow-md',
        pastelBg || 'border-slate-100 bg-white hover:border-slate-200',
        className
      )}
    >
      <div className="absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-white/30 transition-transform group-hover:scale-125" />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold tracking-tight text-slate-900">{value}</p>
              {trend && (
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                    trend.positive
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-red-50 text-red-600'
                  )}
                >
                  {trend.value}
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
          </div>
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm',
              iconBg || 'bg-gradient-to-br from-navy-50 to-navy-100 text-navy-600'
            )}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}
