import { motion } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react';
import { BRAND, OWNER } from '../landingData';
import { pickImage } from '../utils/resolveImageUrl';
import { GalleryImage } from './GalleryImage';
import { btnOutline, sectionAlt, sectionY } from './landingUi';
import { slideInLeft, slideInRight, viewport } from '../motion';

export function OwnerSection({ images }) {
  const portrait = images.length ? pickImage(images, OWNER.imageIndex) : '';

  return (
    <section className={`${sectionAlt} ${sectionY}`}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={viewport} className="mx-auto w-full max-w-md">
            <div className="lnd-card relative overflow-hidden rounded-[24px] p-0 shadow-float">
              <GalleryImage src={portrait} alt={OWNER.name} aspectClass="aspect-[4/5]" className="w-full" />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-lnd-primary shadow-float">
                  <svg className="h-9 w-9 fill-lnd-primary" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </span>
              </div>
            </div>
            <div className="mt-5 lnd-card pricing-panel rounded-[20px] px-6 py-5 text-center">
              <p className="text-h2 font-extrabold">8+</p>
              <p className="text-sm font-medium text-white/80">Years of care</p>
            </div>
          </motion.div>

          <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={viewport}>
            <p className="text-caption uppercase tracking-[0.2em] text-lnd-primary">Meet the owner</p>
            <h2 className="mt-4 text-h1 text-slate-900">Hospitality with a personal touch</h2>
            <p className="mt-2 text-body-lg font-semibold text-slate-500">{OWNER.name} · {OWNER.role}</p>

            <blockquote className="relative mt-8 rounded-[20px] border border-lnd-border bg-white p-6 shadow-card">
              <span className="font-serif text-6xl leading-none text-lnd-primary/20" aria-hidden>&ldquo;</span>
              <p className="font-serif text-body-lg italic leading-relaxed text-slate-900">{OWNER.story}</p>
            </blockquote>

            <p className="mt-6 rounded-[20px] bg-lnd-mint px-6 py-4 text-body text-slate-500">
              <strong className="text-slate-900">Our mission:</strong> {OWNER.mission}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <motion.a whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-body font-bold text-white shadow-card">
                <MessageCircle className="h-5 w-5" /> WhatsApp
              </motion.a>
              <motion.a whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} href={`tel:${BRAND.phoneTel}`} className={`${btnOutline} px-6 py-3.5`}>
                <Phone className="h-5 w-5 text-lnd-primary" /> {BRAND.phone}
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
