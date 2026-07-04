import { Button } from '../ui/button';

export function PageHeader({ eyebrow, title, description, actionLabel, onAction }) {
  return (
    <div className="gradient-panel rounded-2xl border p-4 shadow-soft sm:rounded-[2rem] sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary sm:text-sm">{eyebrow}</p> : null}
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">{title}</h1>
          {description ? <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">{description}</p> : null}
        </div>
        {actionLabel ? <Button type="button" className="h-11 w-full shrink-0 sm:w-auto" onClick={onAction}>{actionLabel}</Button> : null}
      </div>
    </div>
  );
}
