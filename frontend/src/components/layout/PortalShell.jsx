import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Building2, LogOut, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAuth } from '../../auth/AuthContext';

export function PortalShell({ roleLabel, navigation }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('pg_theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) setOpen(false);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open || searchOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open, searchOpen]);

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
    <div className="min-h-screen min-h-[100dvh] bg-slate-50 dark:bg-background">
      {open ? <button aria-label="Close sidebar" className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setOpen(false)} /> : null}
      <aside className={cn('safe-top fixed inset-y-0 left-0 z-40 w-[min(17rem,85vw)] overflow-y-auto border-r bg-white/95 p-3 shadow-sm backdrop-blur transition-transform dark:bg-slate-950/95 lg:translate-x-0', open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')}>
        <div className="flex items-center gap-2.5 rounded-xl bg-primary/10 p-2.5 text-primary">
          <Building2 className="h-5 w-5 shrink-0" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">Om Sai PG OS</p>
            <p className="truncate text-[11px] text-muted-foreground">{roleLabel}</p>
          </div>
        </div>
        <nav className="mt-4 space-y-0.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.path} to={item.path} end={item.path.split('/').length <= 2} onClick={() => setOpen(false)} className={({ isActive }) => cn('flex min-h-11 items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition', isActive ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'text-slate-600 hover:bg-accent hover:text-primary dark:text-slate-300')}>
                <Icon className="h-4 w-4 shrink-0" /> <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0 w-full max-w-full overflow-x-clip lg:pl-60">
        <header className="safe-top sticky top-0 z-30 border-b bg-white/80 px-3 py-2 backdrop-blur dark:bg-slate-950/80 sm:px-4 md:px-6">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-xl border bg-background px-3 py-1.5 text-sm text-muted-foreground md:flex">
                <Search className="h-3.5 w-3.5 shrink-0" />
                <input className="no-yellow-autofill min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" name="pg-master-search" autoComplete="off" spellCheck="false" placeholder="Search tenants, rooms, rent..." />
              </div>
              <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 md:hidden" onClick={() => setSearchOpen(true)} aria-label="Search">
                <Search className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <Button variant="ghost" size="icon" className="h-10 w-10" onClick={toggleTheme} aria-label="Toggle theme">
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <div className="hidden min-w-0 text-right sm:block">
                <p className="truncate text-sm font-semibold">{user?.name || 'Demo User'}</p>
                <p className="truncate text-[11px] text-muted-foreground">{roleLabel}</p>
              </div>
              <Button variant="outline" size="sm" className="h-10" onClick={handleLogout}>
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </header>

        {searchOpen ? (
          <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setSearchOpen(false)}>
            <div className="safe-top safe-x border-b bg-white p-4 dark:bg-slate-950" onClick={(event) => event.stopPropagation()}>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold">Search</p>
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setSearchOpen(false)} aria-label="Close search">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input className="h-11 pl-9" autoFocus placeholder="Search tenants, rooms, rent..." name="pg-mobile-search" autoComplete="off" />
              </div>
            </div>
          </div>
        ) : null}

        <main className="box-border w-full min-w-0 max-w-full space-y-4 overflow-x-clip px-3 py-3 text-sm sm:space-y-5 sm:px-4 sm:py-4 md:px-5 md:py-5 lg:px-6 [&>*]:min-w-0 [&>*]:max-w-full"><Outlet /></main>
      </div>
    </div>
  );
}
