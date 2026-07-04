import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Calendar, MessageCircle } from 'lucide-react';
import { BRAND } from '../landingData';

export function FloatingActions({ onBook }) {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 hidden flex-col items-end gap-4 md:flex">
        <AnimatePresence>
          {showTop ? (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-emerald-400 shadow-card transition hover:shadow-glow"
              aria-label="Back to top"
            >
              <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
            </motion.button>
          ) : null}
        </AnimatePresence>

        <motion.a
          href={`https://wa.me/${BRAND.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: 'spring' }}
          whileHover={{ scale: 1.06 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-card"
          aria-label="WhatsApp"
        >
          <MessageCircle className="h-7 w-7" />
        </motion.a>

        <motion.button
          type="button"
          initial={{ x: 80 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.8, type: 'spring' }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBook}
          className="btn-lnd-primary flex items-center gap-2 px-6 py-3.5 text-sm"
        >
          <Calendar className="h-4 w-4" />
          Book Now
        </motion.button>
      </div>

      <motion.a
        href={`https://wa.me/${BRAND.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-[4.75rem] right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-card md:hidden"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </motion.a>

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-lnd-border bg-white/95 p-3 backdrop-blur-xl md:hidden"
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={onBook}
          className="btn-lnd-primary w-full py-3.5 text-sm font-bold"
        >
          <Calendar className="h-4 w-4" /> Book Now
        </motion.button>
      </motion.div>
    </>
  );
}
