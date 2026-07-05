import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { ROLE_HOME } from '../../config/constants';
import { TENANT_DEFAULT_PASSWORD } from '../../config/credentials';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      setError(err.response?.data?.message || 'Unable to login. Check your credentials and try again.');
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Building2 className="h-7 w-7" /></div>
        <CardTitle className="text-xl sm:text-2xl">Login to PG OS</CardTitle>
        <CardDescription className="text-sm">Super admin: superadmin / 123456. Tenants: email / {TENANT_DEFAULT_PASSWORD}. Property admins: login ID + password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="text" placeholder="Tenant email or admin login ID" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <Input type="password" placeholder="Password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {error ? <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p> : null}
          <Button className="h-11 w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
        </form>
        <p className="mt-6 hidden text-center text-sm text-muted-foreground sm:block">
          <Link to="/" className="font-semibold text-primary hover:underline">← Back to PG listing</Link>
        </p>
      </CardContent>
    </Card>
  );
}
