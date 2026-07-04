import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { BadgeCheck, Star } from 'lucide-react';
import { BRAND, TESTIMONIALS } from '../landingData';
import { pickImage, resolveImageUrl, IMAGE_FALLBACK } from '../utils/resolveImageUrl';
import { SectionHeading } from './SectionHeading';
import { lndCard, sectionY } from './landingUi';
import { fadeUp, viewport } from '../motion';
import 'swiper/css';
import 'swiper/css/pagination';

export function TestimonialsSection({ images }) {
  return (
    <section id="reviews" className={`bg-lnd-bg ${sectionY}`}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="Stories from our residents"
          description={`Rated ${BRAND.rating} on Google with ${BRAND.reviewCount}+ verified reviews.`}
        />

        <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp} className="mt-14">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={28}
            slidesPerView={1}
            breakpoints={{ 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="testimonial-swiper pb-16"
          >
            {TESTIMONIALS.map((t, index) => (
              <SwiperSlide key={t.id}>
                <motion.article
                  initial={{ opacity: 0, y: 24, rotate: index % 2 === 0 ? -0.5 : 0.5 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={viewport}
                  whileHover={{ y: -6 }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  className={`${lndCard} flex h-full flex-col rounded-[24px] p-8`}
                >
                  <div className="flex text-warning">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>

                  <p className="mt-5 flex-1 font-serif text-body-lg italic leading-relaxed text-slate-900">&ldquo;{t.text}&rdquo;</p>

                  <div className="mt-6 flex items-center gap-4 border-t border-lnd-border pt-5">
                    <img
                      src={images.length ? resolveImageUrl(pickImage(images, t.imageIndex)) : IMAGE_FALLBACK}
                      alt={t.name}
                      className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-lnd-primary/30"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900">{t.name}</p>
                      <p className="text-sm text-slate-500">{t.role}</p>
                    </div>
                    {t.verified ? (
                      <span className="flex items-center gap-1 rounded-full bg-success-light px-2.5 py-1 text-xs font-semibold text-success">
                        <BadgeCheck className="h-3.5 w-3.5" /> Verified
                      </span>
                    ) : null}
                  </div>
                </motion.article>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
