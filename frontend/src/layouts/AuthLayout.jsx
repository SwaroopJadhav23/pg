import { Outlet } from 'react-router-dom';
import { Building2 } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="grid min-h-screen min-h-[100dvh] bg-slate-50 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hidden flex-col justify-between bg-[#130f2e] p-12 text-white lg:flex">
        <div className="text-lg font-bold">Om Sai PG Management</div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">Enterprise PG OS</p>
          <h1 className="mt-5 max-w-2xl text-5xl font-extrabold leading-tight">One operating system for students, caretakers and owners.</h1>
          <p className="mt-5 max-w-xl text-violet-100">Role based portals, rent operations, complaints, documents, notices, analytics, audit logs and property control.</p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm text-violet-100">
          <div className="rounded-3xl bg-white/10 p-4">Zoho-grade workflows</div>
          <div className="rounded-3xl bg-white/10 p-4">Razorpay-style finance</div>
          <div className="rounded-3xl bg-white/10 p-4">Airbnb-like property ops</div>
        </div>
      </section>
      <section className="safe-top safe-bottom safe-x relative flex min-h-[100dvh] items-center justify-center p-4 sm:p-6">
        <div className="absolute left-4 top-[max(1rem,env(safe-area-inset-top))] flex items-center gap-2 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <p className="text-sm font-bold">Om Sai PG OS</p>
        </div>
        <div className="w-full max-w-md pt-12 lg:pt-0"><Outlet /></div>
      </section>
    </div>
  );
}
