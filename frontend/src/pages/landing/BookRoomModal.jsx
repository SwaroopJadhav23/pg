import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Phone, Sparkles, User, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { landingService } from '../../services/landingService';
import { pgBusiness } from './landingData';

export function BookRoomModal({ open, onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', moveInDate: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await landingService.bookRoom(form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to submit booking. Please call us directly.');
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setSuccess(false);
    setError('');
    setForm({ name: '', phone: '', email: '', moveInDate: '', message: '' });
    onClose();
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-lnd-dark/70 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg rounded-[24px] border border-lnd-border bg-white p-8 shadow-float"
          >
        <button type="button" onClick={handleClose} className="absolute right-4 top-4 rounded-full p-2 text-slate-500 hover:bg-slate-100">
          <X className="h-5 w-5" />
        </button>

        {success ? (
          <div className="space-y-4 py-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl">✓</div>
            <h3 className="text-2xl font-bold text-slate-900">Booking request sent</h3>
            <p className="text-slate-600">We received your details. Our team will call you on {form.phone} shortly.</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild><a href={`tel:${pgBusiness.phoneTel}`}>Call {pgBusiness.phone}</a></Button>
              <Button variant="outline" onClick={handleClose}>Close</Button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
              <Sparkles className="h-6 w-6 text-lnd-primary" /> Book your room
            </h3>
            <p className="mt-1 text-sm text-slate-600">Share your details and we will confirm availability for Pg rooms for boys, Nashik.</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Input className="pl-10" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Input className="pl-10" placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </div>
              <Input type="email" placeholder="Email (optional)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Input className="pl-10" type="date" value={form.moveInDate} onChange={(e) => setForm({ ...form, moveInDate: e.target.value })} />
              </div>
              <Textarea placeholder="Any message (room type, budget, etc.)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              {error ? <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p> : null}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" className="flex-1" disabled={loading}>{loading ? 'Submitting...' : 'Submit booking'}</Button>
                <Button type="button" variant="outline" asChild><a href={`tel:${pgBusiness.phoneTel}`}>Call now</a></Button>
              </div>
            </form>
          </>
        )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
