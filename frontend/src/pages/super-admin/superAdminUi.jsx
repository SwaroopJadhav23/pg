import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

export function superStatusVariant(status) {
  if (['active', 'paid', 'resolved', 'success'].includes(status)) return 'success';
  if (['pending', 'generated', 'assigned', 'in_progress', 'maintenance'].includes(status)) return 'warning';
  if (['disabled', 'inactive', 'overdue', 'rejected', 'urgent'].includes(status)) return 'danger';
  return 'slate';
}

export function formatDate(value) {
  if (!value) return 'Not available';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

export function SuperHeader({ title, description, actionLabel, onAction }) {
  return (
    <div className="gradient-panel rounded-2xl border p-4 shadow-sm md:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Owner Portal</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-[1.75rem]">{title}</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</p>
        </div>
        {actionLabel ? <Button type="button" size="sm" onClick={onAction}>{actionLabel}</Button> : null}
      </div>
    </div>
  );
}

export function SuperStatus({ status }) {
  return <Badge variant={superStatusVariant(status)}>{status?.replaceAll('_', ' ') || 'unknown'}</Badge>;
}
