import { cn } from '../../lib/utils';

export function Card({ className, ...props }) {
  return <div className={cn('min-w-0 max-w-full rounded-2xl border bg-card text-card-foreground shadow-sm', className)} {...props} />;
}
export function CardHeader({ className, ...props }) {
  return <div className={cn('flex min-w-0 flex-col gap-1.5 p-4 sm:p-5', className)} {...props} />;
}
export function CardTitle({ className, ...props }) {
  return <h3 className={cn('break-words text-base font-bold leading-snug tracking-tight', className)} {...props} />;
}
export function CardDescription({ className, ...props }) {
  return <p className={cn('break-words text-sm text-muted-foreground', className)} {...props} />;
}
export function CardContent({ className, ...props }) {
  return <div className={cn('min-w-0 p-4 pt-0 sm:p-5 sm:pt-0', className)} {...props} />;
}
