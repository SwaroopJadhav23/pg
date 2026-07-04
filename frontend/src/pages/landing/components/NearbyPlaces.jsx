import { motion } from 'framer-motion';
import { Bus, Dumbbell, GraduationCap, Hospital, MapPin, ShoppingBag, Train, Utensils, Stethoscope } from 'lucide-react';
import { BRAND, NEARBY_PLACES } from '../landingData';
import { SectionHeading } from './SectionHeading';
import { sectionAlt, sectionY } from './landingUi';
import { fadeUp, staggerContainer, viewport } from '../motion';

const ICONS = {
  graduation: GraduationCap,
  hospital: Hospital,
  medical: Stethoscope,
  dumbbell: Dumbbell,
  bus: Bus,
  train: Train,
  utensils: Utensils,
  shopping: ShoppingBag
};

export function NearbyPlaces() {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BRAND.mapsQuery)}`;

  return (
    <section className={`${sectionAlt} ${sectionY}`}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow="Location advantage"
          title="Everything you need, minutes away"
          description="Prime Satpur Colony location with colleges, hospitals, transit, and markets at your doorstep."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[3fr_2fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            className="lnd-card relative overflow-hidden rounded-[24px] p-0 shadow-float"
          >
            <iframe
              title="PG Location Map"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(BRAND.mapsQuery)}&output=embed`}
              className="h-[320px] w-full border-0 lg:h-[480px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-teal-gradient px-5 py-2.5 text-sm font-bold text-white shadow-card"
            >
              <MapPin className="h-4 w-4" /> Open in Maps
            </a>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="space-y-3">
            {NEARBY_PLACES.map((place, i) => {
              const Icon = ICONS[place.icon] || MapPin;
              return (
                <motion.div
                  key={place.name}
                  variants={fadeUp}
                  custom={i * 0.08}
                  whileHover={{ x: 8 }}
                  className="lnd-card flex items-center gap-4 rounded-[20px] px-5 py-4"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lnd-mint text-lnd-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900">{place.name}</p>
                    <p className="text-sm text-slate-500">{place.type}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-emerald-300">{place.time}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
