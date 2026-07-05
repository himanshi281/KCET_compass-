import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Configure axios to use token
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      loadUser();
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user || res.data); // depending on how backend sends it
    } catch (err) {
      console.error('Error loading user', err);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    setToken(null);
  };

  const toggleLike = async (collegeId) => {
    if (!user) return;
    try {
      const res = await api.post(`/auth/like/${collegeId}`);
      setUser(res.data.user);
    } catch (err) {
      console.error('Error toggling like', err);
    }
  };

  const updateAvatar = async (avatar) => {
    if (!user) return;
    try {
      const res = await api.put('/auth/avatar', { avatar });
      setUser(res.data.user);
    } catch (err) {
      console.error('Error updating avatar', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, toggleLike, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};
