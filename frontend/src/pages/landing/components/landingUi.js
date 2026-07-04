/** Premium SaaS landing design tokens — teal palette */
export const lndCard =
  'lnd-card rounded-card border border-lnd-border bg-lnd-card';

export const lndCardHover =
  'transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover';

export const sectionY = 'py-14 sm:py-20 md:py-28 lg:py-32';

export const sectionAlt = 'section-alt';

export const inputField =
  'h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-body text-slate-900 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20';

export const selectField =
  'h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 text-body text-slate-900 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20';

export const btnGradient =
  'btn-lnd-primary px-8 py-3.5 text-body';

export const btnOutline =
  'btn-lnd-outline px-8 py-3.5 text-body';

export const btnGradientFull =
  'btn-lnd-primary w-full px-6 py-3.5 text-body font-semibold';

export const iconCircle =
  'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl';

export const ICON_CHIP_COLORS = [
  'bg-teal-50 text-lnd-primary',
  'bg-emerald-50 text-emerald-600',
  'bg-cyan-50 text-cyan-600',
  'bg-sky-50 text-sky-600',
  'bg-violet-50 text-violet-600',
  'bg-amber-50 text-amber-600',
  'bg-rose-50 text-rose-500',
  'bg-indigo-50 text-indigo-600'
];

/* backwards-compat aliases used by some imports */
export const premiumCard = lndCard;
export const premiumCardHover = lndCardHover;
export const btnAccent = btnGradientFull;
export const btnPrimary = btnGradient;
