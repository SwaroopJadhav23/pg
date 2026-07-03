import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="grid min-h-screen bg-slate-50 lg:grid-cols-[1.1fr_0.9fr]">
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
      <section className="flex items-center justify-center p-6"><Outlet /></section>
    </div>
  );
}
