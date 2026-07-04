import { motion } from 'framer-motion';
import { Expand, ImageIcon } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { GalleryImage } from './GalleryImage';
import { sectionY } from './landingUi';
import { fadeUp, viewport } from '../motion';

export function TakeLookInside({ images, onPreview }) {
  const hasImages = images.length > 0;

  return (
    <section id="gallery" className={`section-light ${sectionY}`}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            align="left"
            eyebrow="First look"
            title="Take a look inside"
            description="Real spaces. Real comfort. A curated glimpse into life at PG Rooms for Boys."
          />
          {hasImages ? (
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPreview?.(0)}
              className="btn-lnd-outline shrink-0 px-6 py-3.5"
            >
              View Gallery <Expand className="h-4 w-4" />
            </motion.button>
          ) : null}
        </div>

        {hasImages ? (
          <div className="mt-14 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {images.map((image, index) => (
              <motion.div
                key={image.name}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={fadeUp}
                custom={index * 0.08}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-[24px] shadow-card ring-1 ring-slate-200"
              >
                <GalleryImage
                  src={image.url}
                  alt={`PG space ${index + 1}`}
                  aspectClass="aspect-[4/3]"
                  imgClassName="transition duration-500 group-hover:scale-110"
                  onClick={() => onPreview?.(index)}
                  asButton
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mt-14 flex flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-20 text-center">
            <ImageIcon className="h-12 w-12 text-teal-700" />
            <p className="mt-4 text-body-lg font-semibold text-slate-900">Photos loading soon</p>
            <p className="mt-1 text-body text-slate-500">Visit us for a walkthrough in person.</p>
          </div>
        )}
      </div>
    </section>
  );
}
