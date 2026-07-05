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

export function SuperHeader({ title, description, actionLabel, onAction, eyebrow = 'Super Admin Portal' }) {
  return (
    <div className="gradient-panel min-w-0 max-w-full overflow-visible rounded-2xl border p-5 shadow-soft sm:rounded-[2rem] sm:p-6 md:px-8 md:py-7 lg:px-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1 pl-1 md:pl-1.5">
          <p className="portal-header-eyebrow text-xs font-bold uppercase text-primary sm:text-sm">{eyebrow}</p>
          <h1 className="mt-2 break-words text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">{title}</h1>
          <p className="mt-2 max-w-3xl break-words text-sm text-muted-foreground sm:text-base">{description}</p>
        </div>
        {actionLabel ? (
          <Button type="button" className="h-11 w-full shrink-0 md:w-auto md:min-w-[9rem]" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function SuperStatus({ status }) {
  return <Badge variant={superStatusVariant(status)}>{status?.replaceAll('_', ' ') || 'unknown'}</Badge>;
}
