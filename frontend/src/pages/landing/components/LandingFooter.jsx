import { Link } from 'react-router-dom';
import { BedDouble, Mail, MapPin, Phone } from 'lucide-react';
import { BRAND, FOOTER_LINKS } from '../landingData';

export function LandingFooter() {
  return (
    <footer className="section-dark-deep border-t border-white/10 bg-[#0f172a] text-white">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lnd-gradient shadow-glow">
                <BedDouble className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">{BRAND.name}</p>
                <p className="text-sm text-lnd-accent">{BRAND.location}</p>
              </div>
            </div>
            <p className="mt-6 max-w-sm leading-relaxed text-white/60">
              Premium boys PG accommodation in Nashik. Safe, clean, and affordable living for students and professionals.
            </p>
          </div>

          <div>
            <p className="font-bold text-lnd-accent">Quick Links</p>
            <ul className="mt-5 space-y-3">
              {FOOTER_LINKS.quick.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-white/60 transition hover:text-lnd-accent">{link.label}</a>
                </li>
              ))}
              <li>
                <Link to="/login" className="text-sm font-semibold text-lnd-accent hover:underline">Resident Portal</Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-lnd-accent">Amenities</p>
            <ul className="mt-5 space-y-3">
              {FOOTER_LINKS.amenities.slice(0, 6).map((item) => (
                <li key={item} className="text-sm text-white/60">{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-bold text-lnd-accent">Contact</p>
            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/65">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-lnd-accent" />
                {BRAND.address}
              </li>
              <li>
                <a href={`tel:${BRAND.phoneTel}`} className="flex items-center gap-3 text-sm text-white/65 transition hover:text-lnd-accent">
                  <Phone className="h-4 w-4 text-lnd-accent" /> {BRAND.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:support@omsai.test`} className="flex items-center gap-3 text-sm text-white/65 transition hover:text-lnd-accent">
                  <Mail className="h-4 w-4 text-lnd-accent" /> support@omsai.test
                </a>
              </li>
            </ul>
            <div className="mt-6 flex gap-4">
              {FOOTER_LINKS.social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-white/50 transition hover:text-lnd-accent hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/40 md:flex-row">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p>Made with care in Nashik, Maharashtra</p>
        </div>
      </div>
    </footer>
  );
}
