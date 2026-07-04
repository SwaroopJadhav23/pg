import { motion } from 'framer-motion';
import { LIVE_ROOMS } from '../landingData';
import { SectionHeading } from './SectionHeading';
import { lndCard, sectionY } from './landingUi';
import { fadeUp, staggerContainer, viewport } from '../motion';

const statusConfig = {
  available: {
    label: 'Available',
    dot: 'bg-emerald-500',
    pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    text: 'Available now',
    pulse: true
  },
  limited: {
    label: 'Fast Filling',
    dot: 'bg-amber-500',
    pill: 'bg-amber-50 text-amber-700 border-amber-200',
    text: (beds) => `${beds} beds left`,
    pulse: true
  },
  booked: {
    label: 'Sold Out',
    dot: 'bg-red-500',
    pill: 'bg-red-50 text-red-700 border-red-200',
    text: 'Fully booked',
    pulse: false
  }
};

function StatusDot({ color, pulse }) {
  return (
    <span className="relative flex h-3 w-3">
      {pulse ? <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${color} opacity-50`} /> : null}
      <span className={`relative inline-flex h-3 w-3 rounded-full ${color}`} />
    </span>
  );
}

export function LiveAvailability({ onBook }) {
  return (
    <section className={`section-alt ${sectionY}`}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow="Live availability"
          title="Real-time room status"
          description="See what's available right now. Rooms update instantly as bookings come in."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-14"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-teal-200/60 bg-teal-50 px-5 py-3">
            <p className="text-caption uppercase tracking-widest text-teal-800">Live dashboard</p>
            <span className="flex items-center gap-2 text-sm text-slate-600">
              <StatusDot color="bg-emerald-500" pulse />
              Updated just now
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {LIVE_ROOMS.map((room, i) => {
              const cfg = statusConfig[room.status];
              const statusText = room.status === 'limited' ? cfg.text(room.bedsLeft) : cfg.text;
              return (
                <motion.button
                  key={room.id}
                  type="button"
                  variants={fadeUp}
                  custom={i * 0.08}
                  whileHover={room.status !== 'booked' ? { y: -6, scale: 1.02 } : undefined}
                  whileTap={room.status !== 'booked' ? { scale: 0.98 } : undefined}
                  onClick={room.status !== 'booked' ? onBook : undefined}
                  disabled={room.status === 'booked'}
                  className={`${lndCard} rounded-[24px] p-6 text-left ${room.status === 'booked' ? 'cursor-not-allowed opacity-70' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <StatusDot color={cfg.dot} pulse={cfg.pulse} />
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase ${cfg.pill}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="mt-5 text-h3 text-slate-900">{room.name}</p>
                  <p className="mt-1 text-body text-slate-500">{room.type}</p>
                  <p className="mt-4">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${cfg.pill}`}>
                      {statusText}
                    </span>
                  </p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
