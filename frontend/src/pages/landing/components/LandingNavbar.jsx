import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BedDouble, Menu, X } from 'lucide-react';
import { BRAND } from '../landingData';

const LINKS = [
  { label: 'Rooms', href: '#rooms' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' }
];

export function LandingNavbar({ scrolled, onBook }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'lnd-glass border-b border-lnd-border/60 py-3 shadow-lg'
            : 'border-b border-transparent bg-white/40 py-5 backdrop-blur-xl'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
          <a href="#" className="flex shrink-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-gradient shadow-card">
              <BedDouble className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold leading-tight text-slate-900">{BRAND.name}</p>
              <p className="text-xs text-slate-500">{BRAND.location}</p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-500 transition hover:text-lnd-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="btn-lnd-ghost hidden px-5 py-2.5 text-sm md:inline-flex"
            >
              Login
            </Link>
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBook}
              className="btn-lnd-primary px-5 py-2.5 text-sm"
            >
              Book Now
            </motion.button>
            <button type="button" onClick={() => setOpen(true)} className="rounded-xl p-2.5 text-slate-900 lg:hidden">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </motion.header>

      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[60] bg-lnd-dark/95 p-6 backdrop-blur-xl lg:hidden"
        >
          <div className="flex justify-end">
            <button type="button" onClick={() => setOpen(false)} className="rounded-full bg-white/10 p-3 text-white">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-12 flex flex-col gap-6">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-3xl font-bold text-white">
                {link.label}
              </a>
            ))}
            <Link to="/login" onClick={() => setOpen(false)} className="text-xl font-semibold text-white/70">Login</Link>
            <button type="button" onClick={() => { setOpen(false); onBook(); }} className="btn-lnd-primary mt-4 py-4 text-lg">
              Book Now
            </button>
          </nav>
        </motion.div>
      ) : null}
    </>
  );
}
