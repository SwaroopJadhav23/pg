import { motion } from 'framer-motion';
import { Droplets, Leaf, Shield, Shirt, Sparkles, Wallet, Wifi, Zap } from 'lucide-react';
import { FEATURES } from '../landingData';
import { SectionHeading } from './SectionHeading';
import { ICON_CHIP_COLORS, lndCard, sectionAlt, sectionY } from './landingUi';
import { fadeUp, staggerContainer, viewport } from '../motion';

const ICONS = { sparkles: Sparkles, wifi: Wifi, droplets: Droplets, shirt: Shirt, leaf: Leaf, zap: Zap, shield: Shield, wallet: Wallet };

export function WhyChooseUs() {
  return (
    <section className={`${sectionAlt} ${sectionY}`}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow="Why choose us"
          title="Every detail designed for your comfort"
          description="We don't just offer a bed — we deliver a premium living experience that students and professionals deserve."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
        >
          {FEATURES.map((feature, i) => {
            const Icon = ICONS[feature.icon] || Sparkles;
            const chipColor = ICON_CHIP_COLORS[i % ICON_CHIP_COLORS.length];
            return (
              <motion.article
                key={feature.title}
                variants={fadeUp}
                custom={i * 0.08}
                whileHover={{ y: -8, boxShadow: '0 20px 50px rgba(15, 118, 110, 0.2)' }}
                className={`${lndCard} group rounded-[20px] p-8`}
              >
                <motion.span
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`${chipColor} inline-flex h-16 w-16 items-center justify-center rounded-2xl transition-shadow group-hover:shadow-glow`}
                >
                  <Icon className="h-8 w-8" strokeWidth={1.75} />
                </motion.span>
                <h3 className="mt-6 text-h3 text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-body leading-relaxed text-slate-500">{feature.description}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
