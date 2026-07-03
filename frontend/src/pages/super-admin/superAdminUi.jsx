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

export function SuperHeader({ title, description, actionLabel }) {
  return (
    <div className="gradient-panel rounded-[2rem] border p-6 shadow-soft">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Owner Portal</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">{description}</p>
        </div>
        {actionLabel ? <Button>{actionLabel}</Button> : null}
      </div>
    </div>
  );
}

export function SuperStatus({ status }) {
  return <Badge variant={superStatusVariant(status)}>{status?.replaceAll('_', ' ') || 'unknown'}</Badge>;
}
