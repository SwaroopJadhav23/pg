import { motion } from 'framer-motion';
import { TRUST_STATS } from '../landingData';
import { AnimatedCounter } from './AnimatedCounter';
import { fadeUp, staggerContainer } from '../motion';

export function TrustSection() {
  return (
    <section className="relative z-10 -mt-10 px-4 md:-mt-14 md:px-8">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mx-auto grid max-w-7xl gap-4 rounded-[2rem] border border-brand-border bg-white p-6 shadow-[0_24px_80px_rgba(16,24,40,0.08)] dark:border-white/10 dark:bg-brand-dark md:grid-cols-5 md:p-8"
      >
        {TRUST_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            custom={i}
            whileHover={{ y: -4 }}
            className="group rounded-2xl bg-brand-secondary px-5 py-6 text-center transition hover:shadow-lg dark:bg-white/5 md:text-left"
          >
            <p className="text-4xl font-extrabold text-brand-primary md:text-5xl">
              <AnimatedCounter end={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
            </p>
            <p className="mt-2 text-sm font-semibold text-brand-muted dark:text-white/60">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
