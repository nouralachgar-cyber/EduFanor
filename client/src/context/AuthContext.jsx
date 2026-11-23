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

  const login = async (email, password) => {
    const cleanEmail = String(email || '').trim().toLowerCase();

    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: { email: cleanEmail, password },
      });
      const authenticatedUser = data?.user || data;

      // Validate response has required fields
      if (!data?.token) {
        return {
          success: false,
          code: 'MISSING_TOKEN',
          status: 0,
          message: 'Authentication response missing token',
        };
      }

      if (
        !authenticatedUser ||
        !['admin', 'student'].includes(String(authenticatedUser.role).toLowerCase())
      ) {
        return {
          success: false,
          code: 'INVALID_ROLE',
          status: 0,
          message: 'Invalid user role in authentication response',
        };
      }

      persistSession(authenticatedUser, data.token);
      return { success: true, user: authenticatedUser };
    } catch (loginError) {
      return {
        success: false,
        message: loginError.message,
        code: loginError.code,
        status: loginError.status,
      };
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
