import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { ROLE_HOME, demoUsers } from '../../config/constants';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

export function LoginPage() {
  const [email, setEmail] = useState('owner@pg.test');
  const [password, setPassword] = useState('Password@123');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      navigate(ROLE_HOME[user.role], { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login. Seed demo users from backend first.');
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Building2 className="h-7 w-7" /></div>
        <CardTitle className="text-2xl">Login to PG OS</CardTitle>
        <CardDescription>Role-based access for student, admin and owner portals.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="email" placeholder="Email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <Input type="password" placeholder="Password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
          {error ? <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p> : null}
          <Button className="w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
        </form>
        <div className="mt-6 space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Demo accounts</p>
          {demoUsers.map((demo) => (
            <button key={demo.email} type="button" onClick={() => { setEmail(demo.email); setPassword(demo.password); }} className="flex w-full items-center justify-between rounded-xl border p-3 text-left text-sm hover:bg-accent">
              <span>{demo.email}</span><Badge>{demo.role}</Badge>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
