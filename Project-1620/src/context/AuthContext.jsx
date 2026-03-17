import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const register = async (userData) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Registration failed');
    }

    const data = await res.json();
    setToken(data.token || null);
    const srv = data.user || {};
    const frontendUser = {
      id: srv._id || srv.id,
      fullName: srv.name || '',
      email: srv.email || '',
      phone: srv.phone || '',
      createdAt: srv.createdAt || srv.created_at,
    };
    setUser(frontendUser);
    return frontendUser;
  };

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Login failed');
    }

    const data = await res.json();
    setToken(data.token || null);
    const srv = data.user || {};
    const frontendUser = {
      id: srv._id || srv.id,
      fullName: srv.name || '',
      email: srv.email || '',
      phone: srv.phone || '',
      createdAt: srv.createdAt || srv.created_at,
    };
    setUser(frontendUser);
    return frontendUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const updateProfile = async (updatedData) => {
    if (!user || !token) throw new Error('Not authenticated');

    // map frontend field fullName -> backend name
    const bodyToSend = { ...updatedData };
    if (bodyToSend.fullName !== undefined) {
      bodyToSend.name = bodyToSend.fullName;
      delete bodyToSend.fullName;
    }

    const res = await fetch('/api/auth/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(bodyToSend),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Update failed');
    }

    const data = await res.json();
    const srv = data.user || {};
    const frontendUser = {
      id: srv._id || srv.id,
      fullName: srv.name || '',
      email: srv.email || '',
      phone: srv.phone || '',
      createdAt: srv.createdAt || srv.created_at,
    };
    setUser(frontendUser);
    return frontendUser;
  };

  const value = {
    user,
    token,
    isLoading,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}