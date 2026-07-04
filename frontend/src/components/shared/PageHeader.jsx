import { Button } from '../ui/button';

export function PageHeader({ eyebrow, title, description, actionLabel, onAction }) {
  return (
    <div className="gradient-panel rounded-[2rem] border p-6 shadow-soft">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          {eyebrow ? <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p> : null}
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h1>
          {description ? <p className="mt-2 max-w-3xl text-muted-foreground">{description}</p> : null}
        </div>
        {actionLabel ? <Button type="button" onClick={onAction}>{actionLabel}</Button> : null}
      </div>
    </div>
  );
}
