import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { landingService } from '../../services/landingService';
import { BookRoomModal } from './BookRoomModal';
import { ComparisonTable } from './components/ComparisonTable';
import { CTASection } from './components/CTASection';
import { FAQSection } from './components/FAQSection';
import { FloatingActions } from './components/FloatingActions';
import { HeroSection } from './components/HeroSection';
import { ImageLightbox } from './components/ImageLightbox';
import { LandingFooter } from './components/LandingFooter';
import { LandingNavbar } from './components/LandingNavbar';
import { LifestyleGallery } from './components/LifestyleGallery';
import { LiveAvailability } from './components/LiveAvailability';
import { NearbyPlaces } from './components/NearbyPlaces';
import { OwnerSection } from './components/OwnerSection';
import { PricingCalculator } from './components/PricingCalculator';
import { RoomCategories } from './components/RoomCategories';
import { TakeLookInside } from './components/TakeLookInside';
import { TestimonialsSection } from './components/TestimonialsSection';
import { VirtualTour } from './components/VirtualTour';
import { WhyChooseUs } from './components/WhyChooseUs';
import './landing.css';

function PageLoader() {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0f172a] text-white">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="h-12 w-12 rounded-full border-2 border-white/20 border-t-lnd-secondary"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-sm font-semibold tracking-widest text-white/60"
      >
        PG ROOMS FOR BOYS
      </motion.p>
    </div>
  );
}

export function LandingPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const openBook = useCallback(() => setBookOpen(true), []);
  const openLightbox = useCallback((index) => setLightboxIndex(index), []);

  useEffect(() => {
    landingService.getImages()
      .then((data) => setImages(data || []))
      .catch(() => setImages([]))
      .finally(() => setTimeout(() => setLoading(false), 800));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { document.documentElement.style.scrollBehavior = ''; };
  }, []);

  const scrollToGallery = () => {
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return <PageLoader />;

  return (
    <div className="landing-page section-light pb-28 md:pb-0">
      <LandingNavbar
        scrolled={scrolled}
        onBook={openBook}
      />

      <HeroSection onBook={openBook} onTour={scrollToGallery} />
      <WhyChooseUs />
      <RoomCategories images={images} onBook={openBook} />
      <LiveAvailability onBook={openBook} />
      <TakeLookInside images={images} onPreview={openLightbox} />
      <VirtualTour images={images} onSpotClick={openLightbox} />
      <LifestyleGallery images={images} onPreview={openLightbox} />
      <NearbyPlaces />
      <ComparisonTable />
      <PricingCalculator onBook={openBook} />
      <OwnerSection images={images} />
      <TestimonialsSection images={images} />
      <FAQSection />
      <CTASection onBook={openBook} />
      <LandingFooter />

      <FloatingActions onBook={openBook} />
      <BookRoomModal open={bookOpen} onClose={() => setBookOpen(false)} />
      <ImageLightbox
        images={images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
