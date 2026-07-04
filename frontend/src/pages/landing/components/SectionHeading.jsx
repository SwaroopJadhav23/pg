import { motion } from 'framer-motion';
import { fadeUp, viewport } from '../motion';

export function SectionHeading({ eyebrow, title, description, align = 'center', dark = false }) {
  const alignClass = align === 'center' ? 'mx-auto text-center' : 'text-left';
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className={`max-w-3xl ${alignClass}`}
    >
      {eyebrow ? (
        <p className={`text-caption uppercase tracking-[0.2em] ${dark ? 'text-emerald-400' : 'text-teal-800'}`}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`mt-4 text-h1 text-slate-900 md:text-[2.75rem] ${dark ? '!text-white' : ''}`}>{title}</h2>
      {description ? (
        <p className={`mt-4 text-body-lg ${dark ? 'text-slate-300' : 'text-slate-500'}`}>{description}</p>
      ) : null}
    </motion.div>
  );
}
