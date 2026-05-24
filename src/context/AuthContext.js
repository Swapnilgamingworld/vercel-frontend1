import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/api';

const AuthContext = createContext();

const parseJwt = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const payload = parseJwt(token);
      if (payload && payload.email) {
        setUser({
          id: payload.id || payload._id,
          email: payload.email,
          role: payload.role,
          fullName: payload.fullName,
          rollNumber: payload.rollNumber,
        });
      } else {
        // Invalid token—clear it automatically
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const jwt = response.data.token || response.data.accessToken || response.data.data?.token;
    const userData = response.data.user || response.data.data?.user;
    if (!jwt || !userData) {
      throw new Error('Invalid login response');
    }
    localStorage.setItem('token', jwt);
    setToken(jwt);
    const payload = parseJwt(jwt);
    const loggedUser = {
      id: userData.id || payload.id || payload._id,
      email: userData.email || payload.email,
      role: userData.role || payload.role,
      fullName: userData.fullName || payload.fullName,
      rollNumber: userData.rollNumber || payload.rollNumber,
    };
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (fullName, email, password, role) => {
    const response = await api.post('/auth/register', { fullName, email, password, role });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({ user, token, loading, login, logout, register }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
