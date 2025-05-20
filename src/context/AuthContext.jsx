import { createContext, useContext, useState, useEffect } from "react";

import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Lee el token y el user de localStorage al montar
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  // Si más tarde cambias token o user, sincroniza localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async(userData, tokenData) => {
    localStorage.setItem('token', tokenData);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('🔐 [Login] token y user guardados en localStorage');
    setUser(userData);
    setToken(tokenData);

    if (userData.rol.toLowerCase() === 'tutor' || userData.rol.toLowerCase() === 'admin') {
      console.log('🔐 [Login] usuario es tutor, solicitando datos de tutor...');
      console.log("🔐 [Token enviado]:",tokenData);
      
      //const resTutor = await axios.get('http://localhost:8000/api/tutor', {
      const resTutor = await axios.get(`${apiUrl}/tutor`, {
          headers: { Authorization: `Bearer ${tokenData}` }
      });
      console.log('🔐 [Login] respuesta tutor:', resTutor);
      localStorage.setItem('tutor', JSON.stringify(resTutor.data.tutor));
      console.log('Tutor asociado:', resTutor.data.tutor);
  }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tutor');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};