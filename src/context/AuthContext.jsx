import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginUser, logoutUser } from '@/services/api';

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  token: null,
  login: async () => {},
  logout: async () => {},
});

const STORAGE_KEY = 'auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.token) setToken(parsed.token);
        if (parsed?.user) setUser(parsed.user);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    const payload = user || token ? { user, token } : null;
    if (payload) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user, token]);

  const login = async (username, password) => {
    const { token: t, user: u } = await loginUser({ username, password });
    setToken(t);
    setUser(u);
    return { token: t, user: u };
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // still clear local state on failure
    }
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({
    isAuthenticated: !!token,
    user,
    token,
    login,
    logout,
    loading,
  }), [token, user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
