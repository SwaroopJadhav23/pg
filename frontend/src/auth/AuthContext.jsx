import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('pg_token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('pg_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    api.get('/auth/me').then(({ data }) => {
      setUser(data.data.user);
      localStorage.setItem('pg_user', JSON.stringify(data.data.user));
    }).catch(() => logout());
  }, [token]);

  async function login(email, password) {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('pg_token', data.data.token);
      localStorage.setItem('pg_refresh_token', data.data.refreshToken);
      localStorage.setItem('pg_user', JSON.stringify(data.data.user));
      setToken(data.data.token);
      setUser(data.data.user);
      return data.data.user;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    const refreshToken = localStorage.getItem('pg_refresh_token');
    if (refreshToken) api.post('/auth/logout', { refreshToken }).catch(() => {});
    localStorage.removeItem('pg_token');
    localStorage.removeItem('pg_refresh_token');
    localStorage.removeItem('pg_user');
    setToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({ token, user, loading, login, logout, isAuthenticated: Boolean(token && user) }), [token, user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
