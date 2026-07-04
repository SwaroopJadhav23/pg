import { motion } from 'framer-motion';
import { Maximize2, Play } from 'lucide-react';
import { VIRTUAL_TOUR_SPOTS } from '../landingData';
import { pickImage } from '../utils/resolveImageUrl';
import { SectionHeading } from './SectionHeading';
import { GalleryImage } from './GalleryImage';
import { sectionAlt, sectionY } from './landingUi';
import { fadeUp, staggerContainer, viewport } from '../motion';

export function VirtualTour({ images, onSpotClick }) {
  if (!images.length) return null;

  const mainSpot = VIRTUAL_TOUR_SPOTS[2];

  return (
    <section id="tour" className={`${sectionAlt} ${sectionY}`}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow="360° Virtual Tour"
          title="Walk through before you visit"
          description="Explore entrance, rooms, kitchen, and terrace — from wherever you are."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-14 grid gap-5 lg:grid-cols-12"
        >
          <motion.div variants={fadeUp} className="group relative overflow-hidden rounded-[24px] shadow-float lg:col-span-7">
            <GalleryImage
              src={pickImage(images, mainSpot.imageIndex)}
              alt="Virtual tour preview"
              aspectClass="aspect-[4/3]"
              imgClassName="transition duration-500 group-hover:scale-105"
              onClick={() => onSpotClick(mainSpot.imageIndex)}
              asButton
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-lnd-primary shadow-float">
                <Play className="h-9 w-9 fill-lnd-primary" />
              </span>
            </div>
            <span className="pointer-events-none absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-lnd-dark/70 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              <Maximize2 className="h-4 w-4" /> Click to expand
            </span>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 lg:col-span-5">
            {VIRTUAL_TOUR_SPOTS.map((spot, i) => (
              <motion.div key={spot.id} variants={fadeUp} custom={i * 0.08} className="group overflow-hidden rounded-[20px] shadow-card">
                <GalleryImage
                  src={pickImage(images, spot.imageIndex)}
                  alt={spot.label}
                  aspectClass="aspect-[4/3]"
                  imgClassName="transition duration-500 group-hover:scale-105"
                  onClick={() => onSpotClick(spot.imageIndex)}
                  asButton
                />
                <p className="bg-white px-3 py-2.5 text-center text-sm font-semibold text-slate-900">{spot.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
