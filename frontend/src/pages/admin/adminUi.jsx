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
    <div className="gradient-panel min-w-0 max-w-full overflow-visible rounded-2xl border p-4 shadow-soft sm:rounded-[2rem] sm:p-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1 pl-0.5">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary sm:text-sm">Admin Portal</p>
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

export function AdminPageLayout({ children, className = '' }) {
  return (
    <div className={`admin-page-grid grid min-w-0 max-w-full grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] ${className}`.trim()}>
      {children}
    </div>
  );
}

export function AdminPageShell({ children }) {
  return (
    <div className="portal-page flex w-full min-w-0 max-w-full flex-col gap-4 overflow-visible sm:gap-5">
      {children}
    </div>
  );
}

export function AdminFormCard({ id, title, icon: Icon, children }) {
  return (
    <Card id={id} className="min-w-0 max-w-full overflow-hidden">
      <CardHeader className="p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="flex min-w-0 items-center gap-2 text-base sm:text-lg">
          {Icon ? <Icon className="h-5 w-5 shrink-0" /> : null}
          <span className="break-words">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="min-w-0 p-4 pt-0 sm:p-5 sm:pt-0">{children}</CardContent>
    </Card>
  );
}

export function AdminTableSection({ title, children }) {
  return (
    <section className="min-w-0 max-w-full overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="border-b p-4 sm:p-5">
        <h2 className="break-words text-base font-bold sm:text-lg">{title}</h2>
      </div>
      <div className="min-w-0 max-w-full">{children}</div>
    </section>
  );
}

export function AdminFormField({ children, className = '' }) {
  return <div className={`min-w-0 w-full space-y-4 ${className}`.trim()}>{children}</div>;
}

export function AdminCard({ title, description, children }) {
  return (
    <Card className="min-w-0 max-w-full overflow-hidden">
      <CardHeader className="p-4 sm:p-5">
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="min-w-0 p-4 pt-0 sm:p-5 sm:pt-0">{children}</CardContent>
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
          <p className="mt-1 break-words text-muted-foreground">{item.note}</p>
        </div>
      ))}
    </div>
  );
}
