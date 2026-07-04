import { motion } from 'framer-motion';
import { ArrowRight, BedDouble, Check } from 'lucide-react';
import { ROOM_TYPES } from '../landingData';
import { pickImage } from '../utils/resolveImageUrl';
import { SectionHeading } from './SectionHeading';
import { GalleryImage } from './GalleryImage';
import { btnGradientFull, sectionY } from './landingUi';
import { fadeUp, staggerContainer, viewport } from '../motion';

export function RoomCategories({ images, onBook }) {
  return (
    <section id="rooms" className={`bg-lnd-bg ${sectionY}`}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow="Room categories"
          title="Choose your perfect space"
          description="Every plan includes the same premium standards — pick the layout that fits your lifestyle and budget."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-16 grid gap-8 lg:grid-cols-3"
        >
          {ROOM_TYPES.map((room, i) => (
            <motion.article
              key={room.id}
              variants={fadeUp}
              custom={i * 0.1}
              whileHover={{ y: -8 }}
              className={`lnd-card group relative flex flex-col overflow-hidden rounded-[24px] p-0 ${room.popular ? 'ring-2 ring-lnd-primary/40' : ''}`}
            >
              {(room.popular || room.badge) ? (
                <span className={`absolute right-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg ${room.popular ? 'bg-lnd-primary' : 'bg-warning'}`}>
                  {room.badge || 'Most Popular'}
                </span>
              ) : null}

              <div className="overflow-hidden">
                <GalleryImage
                  src={images.length ? pickImage(images, room.imageIndex) : ''}
                  alt={room.name}
                  aspectClass="aspect-[16/10]"
                  className="w-full"
                  imgClassName="transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col p-7">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-h3 text-slate-900">{room.name}</h3>
                    <p className="mt-1 text-2xl font-extrabold text-lnd-primary">
                      ₹{room.price.toLocaleString('en-IN')}
                      <span className="text-base font-medium text-slate-500">/mo</span>
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${room.available > 0 ? 'bg-warning-light text-warning' : 'bg-danger-light text-danger'}`}>
                    {room.available > 0 ? `${room.available} left` : 'Full'}
                  </span>
                </div>

                <p className="mt-4 flex items-center gap-2 text-body text-slate-500">
                  <BedDouble className="h-4 w-4 text-lnd-secondary" /> {room.beds}
                </p>

                <ul className="mt-5 flex-1 space-y-2.5">
                  {room.amenities.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-sm text-slate-500">
                      <Check className="h-4 w-4 shrink-0 text-lnd-primary" /> {a}
                    </li>
                  ))}
                </ul>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onBook}
                  className={`${btnGradientFull} mt-7`}
                >
                  Book {room.name} <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
