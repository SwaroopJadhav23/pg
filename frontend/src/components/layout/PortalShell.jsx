import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Building2, LogOut, Menu, Moon, Search, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { useAuth } from '../../auth/AuthContext';

export function PortalShell({ roleLabel, navigation }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('pg_theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    localStorage.setItem('pg_theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background">
      {open ? <button aria-label="Close sidebar" className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setOpen(false)} /> : null}
      <aside className={cn('fixed inset-y-0 left-0 z-40 w-60 overflow-y-auto border-r bg-white/95 p-3 shadow-sm backdrop-blur transition-transform dark:bg-slate-950/95 lg:translate-x-0', open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')}>
        <div className="flex items-center gap-2.5 rounded-xl bg-primary/10 p-2.5 text-primary">
          <Building2 className="h-5 w-5" />
          <div>
            <p className="text-sm font-bold text-foreground">Om Sai PG OS</p>
            <p className="text-[11px] text-muted-foreground">{roleLabel}</p>
          </div>
        </div>
        <nav className="mt-4 space-y-0.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.path} to={item.path} end={item.path.split('/').length <= 2} onClick={() => setOpen(false)} className={({ isActive }) => cn('flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-semibold transition', isActive ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'text-slate-600 hover:bg-accent hover:text-primary dark:text-slate-300')}>
                <Icon className="h-4 w-4" /> {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 border-b bg-white/80 px-4 py-2 backdrop-blur dark:bg-slate-950/80 md:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setOpen((value) => !value)}><Menu className="h-4 w-4" /></Button>
              <div className="hidden min-w-0 items-center gap-2 rounded-xl border bg-background px-3 py-1.5 text-sm text-muted-foreground md:flex">
                <Search className="h-3.5 w-3.5 shrink-0" />
                <input className="no-yellow-autofill w-56 bg-transparent text-sm outline-none placeholder:text-muted-foreground" name="pg-master-search" autoComplete="off" spellCheck="false" placeholder="Master search tenants, rooms, rent, complaints" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={toggleTheme}>{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</Button>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">{user?.name || 'Demo User'}</p>
                <p className="text-[11px] text-muted-foreground">{roleLabel}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}><LogOut className="h-3.5 w-3.5" /><span className="hidden sm:inline">Logout</span></Button>
            </div>
          </div>
        </header>
        <main className="w-full space-y-5 p-4 text-sm md:p-5 lg:p-6"><Outlet /></main>
      </div>
    </div>
  );
}
