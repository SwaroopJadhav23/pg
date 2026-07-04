import { motion } from 'framer-motion';
import { LIFESTYLE_ITEMS } from '../landingData';
import { pickImage } from '../utils/resolveImageUrl';
import { SectionHeading } from './SectionHeading';
import { GalleryImage } from './GalleryImage';
import { sectionY } from './landingUi';
import { fadeUp, staggerContainer, viewport } from '../motion';

export function LifestyleGallery({ images, onPreview }) {
  if (!images.length) return null;

  return (
    <section className={`bg-lnd-bg ${sectionY}`}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow="Life at our PG"
          title="More than just a room"
          description="Study sessions, friendships, festivals, and movie nights — the community that makes us home."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-14 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4"
        >
          {LIFESTYLE_ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              variants={fadeUp}
              custom={i * 0.06}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-[24px] shadow-card"
            >
              <GalleryImage
                src={pickImage(images, item.imageIndex)}
                alt={item.label}
                aspectClass="aspect-[4/3]"
                imgClassName="transition duration-500 group-hover:scale-110"
                onClick={() => onPreview?.(item.imageIndex % images.length)}
                asButton
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-lnd-dark/80 via-lnd-dark/20 to-transparent" />
              <span className="pointer-events-none absolute bottom-4 left-4 text-sm font-semibold text-white">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
