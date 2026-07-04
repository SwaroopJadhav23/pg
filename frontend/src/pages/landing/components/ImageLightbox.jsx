import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { resolveImageUrl } from '../utils/resolveImageUrl';

export function ImageLightbox({ images, index, onClose, onNavigate }) {
  if (index === null || !images[index]) return null;
  const current = images[index];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-lnd-dark/95 p-4 backdrop-blur-xl"
        onClick={onClose}
      >
        <button type="button" onClick={onClose} className="absolute right-5 top-5 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20">
          <X className="h-6 w-6" />
        </button>
        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onNavigate((index - 1 + images.length) % images.length); }}
              className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:left-8"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onNavigate((index + 1) % images.length); }}
              className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:right-8"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        ) : null}
        <motion.img
          key={current.url}
          src={resolveImageUrl(current.url)}
          alt={current.name || current.label || 'PG photo'}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.35 }}
          className="max-h-[85vh] max-w-[92vw] rounded-[24px] object-contain shadow-float"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="absolute bottom-6 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
          <ZoomIn className="h-4 w-4" />
          {index + 1} / {images.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
