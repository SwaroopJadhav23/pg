import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { BRAND } from '../landingData';
import { btnGradient, btnOutline, sectionY } from './landingUi';
import { fadeUp, viewport } from '../motion';

export function CTASection({ onBook }) {
  return (
    <section id="contact" className={`px-4 md:px-8 ${sectionY}`}>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="section-dark relative mx-auto max-w-7xl overflow-hidden rounded-[24px] bg-gradient-to-br from-teal-800 via-teal-900 to-slate-900 px-8 py-20 text-center text-white shadow-float md:px-16 md:py-28"
      >
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

        <p className="relative text-caption uppercase tracking-[0.25em] text-emerald-300">Limited beds available</p>
        <h2 className="relative mt-5 text-h1 uppercase tracking-tight text-white md:text-display">Ready to move in?</h2>
        <p className="relative mx-auto mt-5 max-w-2xl text-body-lg text-white/75">
          Book your room today at PG Rooms for Boys, Satpur Colony — Nashik&apos;s most trusted boys PG.
        </p>

        <div className="relative mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <motion.button
            type="button"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBook}
            className="btn-lnd-primary px-10 py-4 text-body"
          >
            Book a Visit <ArrowRight className="h-5 w-5" />
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href={`tel:${BRAND.phoneTel}`}
            className="btn-lnd-outline border-white/25 bg-white/10 px-10 py-4 text-white backdrop-blur hover:border-lnd-accent"
          >
            <Phone className="h-5 w-5" /> Call {BRAND.phone}
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href={`https://wa.me/${BRAND.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="btn-lnd-outline border-white/25 bg-white/10 px-10 py-4 text-white backdrop-blur hover:border-lnd-accent"
          >
            <MessageCircle className="h-5 w-5" /> WhatsApp
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
