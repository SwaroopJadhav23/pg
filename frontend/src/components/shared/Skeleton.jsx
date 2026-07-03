import { cn } from '../../lib/utils';

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800', className)} />;
}

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }).map((__, column) => <Skeleton key={column} className="h-10" />)}
        </div>
      ))}
    </div>
  );
}
