import { cn } from '../../lib/utils';

const variants = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-emerald-500/10 text-emerald-600',
  warning: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300',
  danger: 'bg-rose-500/10 text-rose-600',
  slate: 'bg-slate-500/10 text-slate-600 dark:text-slate-300'
};

export function Badge({ className, variant = 'default', ...props }) {
  return <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', variants[variant], className)} {...props} />;
}
