import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  Eye,
  Flame,
  IndianRupee,
  Play,
  Shield,
  Star,
  Users,
  Headphones
} from 'lucide-react';
import { BRAND, HERO_CHIPS, ROOM_TYPES } from '../landingData';
import { AnimatedCounter } from './AnimatedCounter';
import { btnGradient, btnGradientFull, btnOutline, inputField, sectionY } from './landingUi';
import { fadeUp, staggerContainer } from '../motion';

const TRUST_BADGES = [
  { icon: Star, label: `${BRAND.rating} Google Rated` },
  { icon: BadgeCheck, label: 'Verified PG' },
  { icon: Shield, label: 'Safe & Secure' },
  { icon: Users, label: 'Student Favourite' }
];

const HERO_STATS = [
  { end: 500, suffix: '+', decimals: 0, label: 'Happy Residents', icon: Users },
  { end: BRAND.rating, suffix: '', decimals: 1, label: 'Google Rating', icon: Star },
  { end: 8, suffix: ' yrs', decimals: 0, label: 'Experience', icon: BadgeCheck },
  { end: 24, suffix: '×7', decimals: 0, label: 'Support', icon: Headphones }
];

const FEATURE_PILLS = ['Fully Furnished', 'Food Included', 'High Speed WiFi', 'CCTV'];

function BookingWidget({ onBook }) {
  const [moveIn, setMoveIn] = useState('');
  const [budget, setBudget] = useState('8500');
  const [roomType, setRoomType] = useState('premium');

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="lnd-card overflow-hidden rounded-[24px] border border-lnd-border p-0 shadow-float"
    >
      <div className="border-b border-lnd-border bg-lnd-mint px-6 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-gradient text-white shadow-card">
            <CalendarCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="text-caption uppercase tracking-widest text-slate-500">Instant booking</p>
            <h3 className="text-h3 text-slate-900">Reserve your bed</h3>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-6 md:p-8">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-500">Move-in date</span>
          <input type="date" value={moveIn} onChange={(e) => setMoveIn(e.target.value)} className={inputField} />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-500">Budget / month</span>
          <select value={budget} onChange={(e) => setBudget(e.target.value)} className={inputField}>
            <option value="6500">₹6,500 — Classic</option>
            <option value="8500">₹8,500 — Premium</option>
            <option value="10500">₹10,500 — Luxury</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-500">Room type</span>
          <select value={roomType} onChange={(e) => setRoomType(e.target.value)} className={inputField}>
            {ROOM_TYPES.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </label>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBook}
          className={btnGradientFull}
        >
          <CalendarCheck className="h-5 w-5" />
          Search Rooms
        </motion.button>

        <div className="space-y-2 border-t border-lnd-border pt-4">
          <p className="flex items-center gap-2 text-body font-semibold text-slate-900">
            <Flame className="h-4 w-4 text-warning" />
            <span className="rounded-full bg-warning-light px-2.5 py-0.5 text-sm font-bold text-warning">Only 4 beds left</span>
          </p>
          <p className="flex items-center gap-2 text-body text-slate-500">
            <Eye className="h-4 w-4 text-lnd-secondary" /> 18 people viewing now
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function HeroSection({ onBook, onTour }) {
  const { scrollY } = useScroll();
  const orbY = useTransform(scrollY, [0, 500], [0, 80]);

  return (
    <section className={`hero-mesh relative overflow-hidden ${sectionY} pt-28 md:pt-36`}>
      <motion.div style={{ y: orbY }} className="pointer-events-none absolute inset-0">
        <div className="hero-orb absolute -left-24 top-16 h-80 w-80 rounded-full bg-lnd-secondary/20 blur-3xl" />
        <div className="hero-orb absolute -right-16 top-32 h-72 w-72 rounded-full bg-lnd-primary/15 blur-3xl [animation-delay:3s]" />
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.p variants={fadeUp} className="text-caption uppercase tracking-[0.2em] text-lnd-primary">
              Nashik&apos;s premium boys PG
            </motion.p>

            <motion.h1 variants={fadeUp} className="mt-5 text-display text-slate-900 md:text-[3.5rem] lg:text-display">
              More than a PG.
              <span className="mt-2 block">
                A <span className="text-gradient">home</span> away from home.
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-6 max-w-xl text-body-lg text-slate-500">
              {BRAND.subtagline}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-2">
              {FEATURE_PILLS.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center gap-2 rounded-full border border-lnd-border bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-glass"
                >
                  <Check className="h-4 w-4 text-lnd-primary" />
                  {pill}
                </span>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-5 flex flex-wrap gap-2">
              {HERO_CHIPS.slice(0, 5).map((chip) => (
                <span key={chip} className="rounded-full bg-lnd-mint px-3 py-1 text-xs font-medium text-lnd-primary">
                  {chip}
                </span>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-2">
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-glass">
                  <Icon className="h-3.5 w-3.5 text-lnd-primary" />
                  {label}
                </span>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBook}
                className={btnGradient}
              >
                Book a Visit <ArrowRight className="h-5 w-5" />
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onTour}
                className={btnOutline}
              >
                <Play className="h-5 w-5 text-lnd-primary" /> Explore Rooms
              </motion.button>
            </motion.div>
          </motion.div>

          <div className="mx-auto w-full max-w-md lg:max-w-none lg:pt-2">
            <BookingWidget onBook={onBook} />
          </div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {HERO_STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                custom={i * 0.1}
                whileHover={{ y: -6, scale: 1.02 }}
                className="lnd-card flex flex-col items-center rounded-[24px] px-5 py-8 text-center"
              >
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-lnd-mint text-lnd-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <p className="text-[1.75rem] font-extrabold leading-none text-slate-900">
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} decimals={stat.decimals} duration={2} />
                </p>
                <p className="mt-2 text-sm font-medium text-slate-500">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export { BookingWidget };
