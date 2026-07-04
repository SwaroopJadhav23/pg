import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FAQS } from '../landingData';
import { SectionHeading } from './SectionHeading';
import { sectionAlt, sectionY } from './landingUi';
import { fadeUp, viewport } from '../motion';

export function FAQSection() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className={`${sectionAlt} ${sectionY}`}>
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions? We've got answers"
          description="Everything you need to know before booking your room at PG Rooms for Boys."
        />

        <div className="mt-14 space-y-4">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={faq.q}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={fadeUp}
                custom={i * 0.08}
                className={`lnd-card overflow-hidden rounded-[20px] ${isOpen ? 'ring-2 ring-lnd-primary/30' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-7 py-6 text-left"
                >
                  <span className="text-body font-bold text-slate-900">{faq.q}</span>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="h-5 w-5 shrink-0 text-lnd-primary" />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="border-t border-lnd-border px-7 pb-6 pt-4 text-body leading-relaxed text-slate-500">
                        {faq.a}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
