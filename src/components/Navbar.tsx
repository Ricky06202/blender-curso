import React, { useState, useEffect } from 'react';
import BlenderLogo from '../assets/BlenderLogo.png';
import { getChapters } from '../lib/api';

interface User {
  email: string;
  name: string;
  role: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [capitulos, setCapitulos] = useState<any[]>([]);
  const [firstChapterhref, setFirstChapterhref] = useState('/');

  useEffect(() => {
    checkAuthStatus();
    getChaptersData();
  }, []);

  const getChaptersData = async () => {
    try {
      const chapters = await getChapters();
      setCapitulos(chapters);
      const firstChapterId = chapters[0]?.slug;
      setFirstChapterhref(`/capitulos/${firstChapterId}`);
    } catch (error) {
      console.error('Error getting chapters:', error);
    }
  };

  const checkAuthStatus = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // First check if user data is already in localStorage (from Google OAuth)
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setLoading(false);
        return;
      }

      // If not, fetch from API
      const response = await fetch('https://blenderapi.rsanjur.com/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        await fetch('https://blenderapi.rsanjur.com/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        // Error en logout
      }
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    setUser(null);
    window.location.href = '/';
  };

  const isHome = window.location.pathname === '/';
  const isCapitulos = window.location.pathname.startsWith('/capitulos');
  const hrefCapitulos = isCapitulos ? '#' : firstChapterhref;

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img 
            src={BlenderLogo.src} 
            alt="Blender Logo" 
            width="32" 
            height="32"
            className="w-8 h-8 object-contain"
          />
          <span className="font-bold text-xl text-slate-900">Blender: de cero a render</span>
        </a>

        <nav className="flex items-center gap-4">
          <a 
            className={`hover:text-slate-900 ${isHome ? 'text-slate-900 font-semibold' : 'text-slate-700'}`} 
            href="/" 
            aria-current={isHome ? 'page' : undefined}
          >
            Inicio
          </a>
          <a 
            className={`hover:text-slate-900 ${isCapitulos ? 'text-slate-900 font-semibold' : 'text-slate-700'}`} 
            href={hrefCapitulos} 
            aria-current={isCapitulos ? 'page' : undefined}
          >
            Capítulos
          </a>
          
          {loading ? (
            <div className="w-20 h-8"></div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50">
                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-700">{user.name}</span>
              </div>
              <button 
                onClick={logout} 
                className="text-sm text-slate-600 hover:text-red-600 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <a 
              className="inline-block px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-900 hover:bg-slate-100 transition" 
              href="/auth/login"
            >
              Iniciar sesión
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
