import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

export function adminStatusVariant(status) {
  if (['paid', 'approved', 'resolved', 'checked_out', 'active', 'occupied', 'present', 'done'].includes(status)) return 'success';
  if (['pending', 'submitted', 'assigned', 'in_progress', 'checked_in', 'requested', 'vacant', 'todo'].includes(status)) return 'warning';
  if (['overdue', 'rejected', 'maintenance', 'inactive', 'absent'].includes(status)) return 'danger';
  return 'slate';
}

export function formatDate(value) {
  if (!value) return 'Not available';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

export function AdminModuleHeader({ title, description, actionLabel, onAction }) {
  return (
    <div className="gradient-panel rounded-2xl border p-4 shadow-soft sm:rounded-[2rem] sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary sm:text-sm">Admin Portal</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">{description}</p>
        </div>
        {actionLabel ? <Button type="button" className="h-11 w-full shrink-0 sm:w-auto" onClick={onAction}>{actionLabel}</Button> : null}
      </div>
    </div>
  );
}

export function AdminCard({ title, description, children }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function AdminStatus({ status }) {
  return <Badge variant={adminStatusVariant(status)}>{status?.replaceAll('_', ' ') || 'unknown'}</Badge>;
}

export function MiniTimeline({ items = [] }) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={`${item.status}-${index}`} className="rounded-2xl bg-slate-50 p-3 text-sm dark:bg-slate-900">
          <AdminStatus status={item.status} />
          <p className="mt-1 text-muted-foreground">{item.note}</p>
        </div>
      ))}
    </div>
  );
}
