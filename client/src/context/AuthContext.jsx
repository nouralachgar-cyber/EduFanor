import React, { createContext, useCallback, useEffect, useState } from 'react';
import { apiRequest, getStoredToken, setStoredToken } from '../lib/api';

export const AuthContext = createContext();

const readStoredUser = () => {
  try {
    const stored = localStorage.getItem('edu_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem('edu_user');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getStoredToken());
  const [loading, setLoading] = useState(true);

  const persistSession = useCallback((nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken || '');
    setStoredToken(nextToken);
    try {
      localStorage.setItem('edu_user', JSON.stringify(nextUser));
    } catch {
      /* Storage can be unavailable. */
    }
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setToken('');
    setStoredToken('');
    try {
      localStorage.removeItem('edu_user');
    } catch {
      /* Storage can be unavailable. */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const storedUser = readStoredUser();
    const storedToken = getStoredToken();

    if (storedUser) setUser(storedUser);
    if (!storedToken) {
      setLoading(false);
      return undefined;
    }

    apiRequest('/auth/me', { auth: true })
      .then((data) => {
        if (!cancelled && data?.user) {
          setUser(data.user);
          try {
            localStorage.setItem('edu_user', JSON.stringify(data.user));
          } catch {
            /* Storage can be unavailable. */
          }
        }
      })
      .catch((error) => {
        if (!cancelled && error.status === 401) {
          clearSession();
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [clearSession]);

  useEffect(() => {
    const handleUnauthorized = () => clearSession();
    window.addEventListener('edu:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('edu:unauthorized', handleUnauthorized);
  }, [clearSession]);

  const legacyLogin = (cleanEmail) => {
    const legacyUser = {
      name: cleanEmail ? cleanEmail.split('@')[0] : 'Student',
      email: cleanEmail || 'student@edufanor.com',
      role: 'student',
      legacy: true,
    };
    persistSession(legacyUser, '');
    return { success: true, user: legacyUser };
  };

  const login = async (email, password) => {
    const cleanEmail = String(email || '').trim().toLowerCase();

    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: { email: cleanEmail, password },
      });
      persistSession(data, data.token);
      return { success: true, user: data };
    } catch (loginError) {
      if (loginError.status === 403 && loginError.code === 'ACCOUNT_SUSPENDED') {
        return { success: false, message: loginError.message };
      }

      if (loginError.status === 401) {
        try {
          const adminData = await apiRequest('/auth/admin-login', {
            method: 'POST',
            body: { email: cleanEmail, password },
          });
          persistSession(adminData, adminData.token);
          return { success: true, user: adminData };
        } catch (adminError) {
          if (adminError.code === 'NO_ACCOUNT' || adminError.status === 0) {
            return legacyLogin(cleanEmail);
          }
          return { success: false, message: adminError.message };
        }
      }

      if (loginError.status === 0) {
        return legacyLogin(cleanEmail);
      }

      return { success: false, message: loginError.message };
    }
  };

  const register = async (name, email, password) => {
    const cleanEmail = String(email || '').trim().toLowerCase();

    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: { name, email: cleanEmail, password },
      });
      persistSession(data, data.token);
      return { success: true, user: data };
    } catch (error) {
      if (error.status === 0) {
        const localUser = {
          name: name || 'New student',
          email: cleanEmail || 'student@edufanor.com',
          role: 'student',
          legacy: true,
        };
        persistSession(localUser, '');
        return { success: true, user: localUser };
      }
      return { success: false, message: error.message };
    }
  };

  const updateUser = (updates) => {
    setUser((previous) => {
      if (!previous) return previous;
      const nextUser = { ...previous, ...updates };
      try {
        localStorage.setItem('edu_user', JSON.stringify(nextUser));
      } catch {
        /* Storage can be unavailable. */
      }
      return nextUser;
    });
  };

  const refreshUser = async () => {
    if (!getStoredToken()) return null;
    try {
      const data = await apiRequest('/auth/me', { auth: true });
      if (data?.user) {
        setUser(data.user);
        try {
          localStorage.setItem('edu_user', JSON.stringify(data.user));
        } catch {
          /* Storage can be unavailable. */
        }
      }
      return data?.user || null;
    } catch {
      return null;
    }
  };

  const logout = () => clearSession();

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, updateUser, refreshUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
