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
      <aside className={cn('fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto border-r bg-white/95 p-4 shadow-soft backdrop-blur transition-transform dark:bg-slate-950/95 lg:translate-x-0', open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')}>
        <div className="flex items-center gap-3 rounded-2xl bg-primary/10 p-3 text-primary">
          <Building2 className="h-7 w-7" />
          <div>
            <p className="text-sm font-bold text-foreground">Om Sai PG OS</p>
            <p className="text-xs text-muted-foreground">{roleLabel}</p>
          </div>
        </div>
        <nav className="mt-6 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.path} to={item.path} end={item.path.split('/').length <= 2} onClick={() => setOpen(false)} className={({ isActive }) => cn('flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition', isActive ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-slate-600 hover:bg-accent hover:text-primary dark:text-slate-300')}>
                <Icon className="h-4 w-4" /> {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b bg-white/80 px-4 py-3 backdrop-blur dark:bg-slate-950/80 md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setOpen((value) => !value)}><Menu className="h-5 w-5" /></Button>
              <div className="hidden min-w-0 items-center gap-2 rounded-2xl border bg-background px-4 py-2 text-sm text-muted-foreground md:flex">
                <Search className="h-4 w-4 shrink-0" />
                <input className="no-yellow-autofill w-72 bg-transparent outline-none placeholder:text-muted-foreground" name="pg-master-search" autoComplete="off" spellCheck="false" placeholder="Master search tenants, rooms, rent, complaints" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={toggleTheme}>{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</Button>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold">{user?.name || 'Demo User'}</p>
                <p className="text-xs text-muted-foreground">{roleLabel}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Logout</span></Button>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl space-y-6 p-4 md:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
