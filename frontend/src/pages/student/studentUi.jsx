import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

export function statusVariant(status) {
  if (['paid', 'resolved', 'approved', 'checked_out', 'success'].includes(status)) return 'success';
  if (['pending', 'assigned', 'in_progress', 'waiting', 'requested'].includes(status)) return 'warning';
  if (['overdue', 'urgent', 'rejected'].includes(status)) return 'danger';
  return 'slate';
}

export function formatDate(value) {
  if (!value) return 'Not available';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

export function formatBytes(value = 0) {
  if (!value) return '0 KB';
  return `${Math.max(1, Math.round(value / 1024))} KB`;
}

export function EmptyState({ title, description }) {
  return (
    <Card className="border-dashed">
      <CardContent className="p-8 text-center">
        <p className="font-bold">{title}</p>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export function InfoTile({ label, value }) {
  return (
    <div className="rounded-2xl border bg-white p-4 dark:bg-slate-950">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-semibold">{value || 'Not available'}</p>
    </div>
  );
}

export function Timeline({ items = [] }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={`${item.status}-${index}`} className="flex gap-3">
          <div className="mt-1 h-3 w-3 rounded-full bg-primary" />
          <div>
            <Badge variant={statusVariant(item.status)}>{item.status?.replaceAll('_', ' ')}</Badge>
            <p className="mt-1 text-sm text-muted-foreground">{item.note || item.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ModuleCard({ title, description, children }) {
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
