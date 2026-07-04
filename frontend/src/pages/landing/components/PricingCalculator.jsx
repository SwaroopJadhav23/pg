import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Percent, Sparkles } from 'lucide-react';
import { PRICING, ROOM_TYPES } from '../landingData';
import { SectionHeading } from './SectionHeading';
import { AnimatedCounter } from './AnimatedCounter';
import { btnGradientFull, inputField, lndCard, sectionY } from './landingUi';
import { fadeUp, viewport } from '../motion';

export function PricingCalculator({ onBook }) {
  const [room, setRoom] = useState('premium');
  const [duration, setDuration] = useState('6');
  const [food, setFood] = useState(true);
  const [laundry, setLaundry] = useState(true);
  const [discount, setDiscount] = useState(0);

  const total = useMemo(() => {
    const base = PRICING.rooms[room] || 8500;
    const foodCost = food ? PRICING.food : 0;
    const laundryCost = laundry ? PRICING.laundry : 0;
    const subtotal = base + foodCost + laundryCost;
    const durationMultiplier = PRICING.durations[duration] || 1;
    return Math.round(subtotal * durationMultiplier * (1 - discount / 100));
  }, [room, duration, food, laundry, discount]);

  return (
    <section id="pricing" className={`bg-lnd-bg ${sectionY}`}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow="Pricing calculator"
          title="Know your exact monthly cost"
          description="Transparent pricing with no hidden charges. Customize your plan and see the total instantly."
        />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-14 grid gap-8 lg:grid-cols-2"
        >
          <div className={`${lndCard} space-y-5 rounded-[24px] p-8`}>
            <label className="block">
              <span className="text-sm font-semibold text-slate-500">Room type</span>
              <select value={room} onChange={(e) => setRoom(e.target.value)} className={`${inputField} mt-2`}>
                {ROOM_TYPES.map((r) => <option key={r.id} value={r.id}>{r.name} — ₹{r.price.toLocaleString('en-IN')}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-500">Duration</span>
              <select value={duration} onChange={(e) => setDuration(e.target.value)} className={`${inputField} mt-2`}>
                <option value="1">1 Month</option>
                <option value="3">3 Months (3% off)</option>
                <option value="6">6 Months (6% off)</option>
                <option value="12">12 Months (10% off)</option>
              </select>
            </label>
            <div className="flex flex-wrap gap-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-lnd-border bg-lnd-mint/50 px-4 py-3">
                <input type="checkbox" checked={food} onChange={(e) => setFood(e.target.checked)} className="h-4 w-4 accent-lnd-primary" />
                <span className="text-body text-slate-900">Food (+₹2,500)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-lnd-border bg-lnd-mint/50 px-4 py-3">
                <input type="checkbox" checked={laundry} onChange={(e) => setLaundry(e.target.checked)} className="h-4 w-4 accent-lnd-primary" />
                <span className="text-body text-slate-900">Laundry (+₹500)</span>
              </label>
            </div>
            <label className="block">
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-500"><Percent className="h-4 w-4" /> Discount</span>
              <input type="range" min="0" max="15" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="mt-3 w-full accent-lnd-primary" />
              <p className="mt-1 text-body text-slate-500">{discount}% applied</p>
            </label>
          </div>

          <motion.div
            whileHover={{ y: -4 }}
            className="pricing-panel flex flex-col justify-between rounded-[24px] p-8 shadow-float md:p-10"
          >
            <div>
              <p className="flex items-center gap-2 text-caption uppercase tracking-widest text-white/70">
                <Sparkles className="h-4 w-4" /> Your estimate
              </p>
              <p className="mt-8 flex items-start gap-1">
                <IndianRupee className="mt-3 h-8 w-8 text-lnd-accent" />
                <span className="text-[2.25rem] font-extrabold leading-none tracking-tight sm:text-[2.75rem] md:text-[3.5rem]">
                  <AnimatedCounter key={total} end={total} duration={0.8} />
                </span>
              </p>
              <p className="mt-3 text-body-lg text-white/80">per month, all inclusive</p>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBook}
              className="btn-lnd-outline mt-10 w-full border-white/30 bg-white py-4 font-bold text-lnd-primary hover:bg-white"
            >
              Book Now
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
