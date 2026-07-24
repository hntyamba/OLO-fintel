/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './components/ThemeContext.js';
import { LanguageProvider, useLanguage } from './components/LanguageContext.js';
import { AuthProvider, useAuth } from './components/AuthContext.js';
import LandingPage from './components/LandingPage.js';
import SurveyPage from './components/SurveyPage.js';
import AuthPages from './components/AuthPages.js';
import Dashboards from './components/Dashboards.js';
import BackendConnectionManager from './components/BackendConnectionManager.js';
import { Sun, Moon, Menu, X, Landmark, ShieldCheck } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const { t, locale, setLocale } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();

  // Root navigation state
  const [currentPage, setCurrentPage] = useState<'home' | 'survey' | 'login' | 'register' | 'dashboard'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect to dashboard if logged-in upon loading
  useEffect(() => {
    if (user) {
      setCurrentPage('dashboard');
    } else if (currentPage === 'dashboard') {
      setCurrentPage('home');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0E0E12] gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-iris border-t-transparent animate-spin" />
        <p className="text-sm font-semibold text-gray-400 font-mono">Iniciando Fintel OS...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0E0E12] text-gray-900 dark:text-white transition-colors duration-200">
      
      {/* PUBLIC NAVBAR (Rendered when not on dashboard) */}
      {currentPage !== 'dashboard' && (
        <nav className="sticky top-0 z-50 bg-white/95 dark:bg-[#0E0E12]/95 border-b border-gray-200 dark:border-[#2A2A35] backdrop-blur px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button 
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-2 text-left cursor-pointer"
            >
              <div className="px-3 h-9 rounded-xl bg-brand-iris text-white flex items-center justify-center font-bold text-base shadow-md shadow-brand-iris/20">
                OLO
              </div>
              <div>
                <span className="font-bold text-base leading-none text-gray-900 dark:text-white block">OLO Fintel</span>
                <span className="text-[10px] text-gray-400 block mt-0.5 font-sans">Economic Operating System</span>
              </div>
            </button>

            {/* Desktop Nav Items */}
            <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
              <button 
                onClick={() => setCurrentPage('home')}
                className={`transition-all hover:text-brand-iris ${currentPage === 'home' ? 'text-brand-iris' : 'text-gray-600 dark:text-gray-300'}`}
              >
                {t('nav.home')}
              </button>
              
              <button 
                onClick={() => setCurrentPage('survey')}
                className={`transition-all hover:text-brand-iris ${currentPage === 'survey' ? 'text-brand-iris' : 'text-gray-600 dark:text-gray-300'}`}
              >
                {t('nav.survey')}
              </button>

              <button 
                onClick={() => setCurrentPage('login')}
                className="px-4 py-2 border border-gray-200 dark:border-gray-800 hover:border-brand-iris dark:hover:border-brand-iris text-gray-700 dark:text-gray-300 rounded-xl transition-all"
              >
                {t('nav.login')}
              </button>

              <button 
                onClick={() => setCurrentPage('register')}
                className="px-5 py-2 bg-brand-iris text-white hover:bg-brand-iris-hover rounded-xl shadow-lg shadow-brand-iris/15 transition-all"
              >
                {t('nav.register')}
              </button>

              {/* Theme toggle in header */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-500"
              >
                {isDark ? <Sun size={16} className="text-yellow-500" /> : <Moon size={16} />}
              </button>

              <BackendConnectionManager />
            </div>

            {/* Mobile menu toggle */}
            <div className="flex md:hidden items-center gap-3">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 transition-all text-gray-500"
              >
                {isDark ? <Sun size={16} className="text-yellow-500" /> : <Moon size={16} />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-white"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-4 text-sm font-semibold">
              <button 
                onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }}
                className="text-left py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {t('nav.home')}
              </button>
              <button 
                onClick={() => { setCurrentPage('survey'); setMobileMenuOpen(false); }}
                className="text-left py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {t('nav.survey')}
              </button>
              <div className="h-px bg-gray-100 dark:bg-gray-800" />
              <button 
                onClick={() => { setCurrentPage('login'); setMobileMenuOpen(false); }}
                className="text-left py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-brand-iris"
              >
                {t('nav.login')}
              </button>
              <button 
                onClick={() => { setCurrentPage('register'); setMobileMenuOpen(false); }}
                className="py-2.5 px-3 bg-brand-iris text-white rounded-lg font-bold text-center"
              >
                {t('nav.register')}
              </button>
            </div>
          )}
        </nav>
      )}

      {/* CORE SCREENS ROUTING */}
      <div className="flex-1 flex flex-col">
        {currentPage === 'home' && <LandingPage onNavigate={setCurrentPage} />}
        {currentPage === 'survey' && <SurveyPage onNavigate={setCurrentPage} />}
        {currentPage === 'login' && <AuthPages view="login" onNavigate={setCurrentPage} />}
        {currentPage === 'register' && <AuthPages view="register" onNavigate={setCurrentPage} />}
        {currentPage === 'dashboard' && <Dashboards />}
      </div>

      {/* PUBLIC FOOTER (Only when not on dashboard) */}
      {currentPage !== 'dashboard' && (
        <footer className="bg-white dark:bg-[#1A1A21] border-t border-gray-200 dark:border-[#2A2A35] py-12 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="px-2.5 h-8 rounded-xl bg-brand-iris text-white flex items-center justify-center font-bold text-xs">
                  OLO
                </div>
                <span className="font-bold text-base text-gray-900 dark:text-white">OLO Fintel</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                {t('footer.desc')}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-4">{t('footer.platform')}</h4>
              <ul className="space-y-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                <li><button onClick={() => setCurrentPage('home')} className="hover:text-brand-iris">{t('nav.home')}</button></li>
                <li><button onClick={() => setCurrentPage('survey')} className="hover:text-brand-iris">{t('nav.inquerito_nacional')}</button></li>
                <li><button onClick={() => setCurrentPage('login')} className="hover:text-brand-iris">{t('nav.reserved_area')}</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-4">{t('footer.languages')}</h4>
              <ul className="space-y-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                <li><button onClick={() => setLocale('pt')} className={`hover:text-brand-iris ${locale === 'pt' ? 'text-brand-iris' : ''}`}>Português</button></li>
                <li><button onClick={() => setLocale('en')} className={`hover:text-brand-iris ${locale === 'en' ? 'text-brand-iris' : ''}`}>English</button></li>
                <li><button onClick={() => setLocale('umb')} className={`hover:text-brand-iris ${locale === 'umb' ? 'text-brand-iris' : ''}`}>Umbundu</button></li>
                <li><button onClick={() => setLocale('kmb')} className={`hover:text-brand-iris ${locale === 'kmb' ? 'text-brand-iris' : ''}`}>Kimbundu</button></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">{t('footer.compliance_title')}</h4>
              <div className="p-3 bg-brand-iris/5 rounded-xl border border-brand-iris/10 text-[10px] text-gray-400 flex items-start gap-2">
                <ShieldCheck className="text-brand-iris mt-0.5 shrink-0" size={16} />
                <span>{t('footer.compliance_desc')}</span>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
            <span>{t('footer.rights')}</span>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 font-bold">Angola Sandbox Environment</span>
              <BackendConnectionManager />
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
