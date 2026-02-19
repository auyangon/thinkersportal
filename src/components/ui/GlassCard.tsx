import { cn } from '@/utils/cn';

interface Props {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function GlassCard({ children, className, noPadding }: Props) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-100 bg-white/80 shadow-sm backdrop-blur-sm',
        !noPadding && 'p-5 sm:p-6',
        className
      )}
    >
      {children}
    </div>
  );
}
