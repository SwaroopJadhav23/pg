import { cn } from '../../lib/utils';

export function Input({ className, ...props }) {
  return <input className={cn('no-yellow-autofill box-border flex h-11 min-w-0 max-w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50', className)} {...props} />;
}
