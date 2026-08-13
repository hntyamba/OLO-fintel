/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

  // Smooth scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

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
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        <p className="text-sm font-semibold text-gray-400 font-mono">Iniciando MiraWelch OS...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0E0E12] text-gray-900 dark:text-white transition-colors duration-200">
      
      {/* PUBLIC NAVBAR (Rendered when not on dashboard) */}
      {currentPage !== 'dashboard' && (
        <nav className="sticky top-0 z-50 bg-white/90 dark:bg-[#09090B]/90 border-b border-slate-200/80 dark:border-zinc-800/80 backdrop-blur-md px-6 py-3.5 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button 
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-900 dark:bg-emerald-500 text-white flex items-center justify-center font-extrabold text-xs tracking-wider shadow-sm transition-transform group-hover:scale-105">
                MW
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm leading-none text-slate-900 dark:text-zinc-100">MiraWelch</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Plataforma de Crescimento • Cooperativas & PMEs</span>
              </div>
            </button>

            {/* Desktop Nav Items */}
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold">
              <button 
                onClick={() => setCurrentPage('home')}
                className={`px-3 py-1.5 rounded-lg transition-all ${currentPage === 'home' ? 'bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-white font-bold' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'}`}
              >
                {t('nav.home')}
              </button>
              
              <button 
                onClick={() => setCurrentPage('survey')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${currentPage === 'survey' ? 'bg-brand-iris/10 text-brand-iris border border-brand-iris/20 font-bold' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'}`}
              >
                <span>{t('nav.survey')}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-iris animate-pulse" />
              </button>

              <div className="h-4 w-px bg-slate-200 dark:bg-zinc-800 mx-1" />

              <button 
                onClick={() => setCurrentPage('login')}
                className="px-3.5 py-1.5 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer font-medium"
              >
                {t('nav.login')}
              </button>

              <button 
                onClick={() => setCurrentPage('register')}
                className="btn-primary"
              >
                {t('nav.register')}
              </button>

              {/* Theme toggle in header */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all text-slate-500 ml-1 cursor-pointer"
                title="Mudar Tema"
              >
                {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
              </button>

              <BackendConnectionManager />
            </div>

            {/* Mobile menu toggle */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-500"
              >
                {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pt-3 border-t border-slate-200 dark:border-zinc-800 flex flex-col gap-2 text-xs font-semibold">
              <button 
                onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }}
                className="text-left py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                {t('nav.home')}
              </button>
              <button 
                onClick={() => { setCurrentPage('survey'); setMobileMenuOpen(false); }}
                className="text-left py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-brand-iris"
              >
                {t('nav.survey')}
              </button>
              <div className="h-px bg-slate-200 dark:bg-zinc-800 my-1" />
              <button 
                onClick={() => { setCurrentPage('login'); setMobileMenuOpen(false); }}
                className="text-left py-2 px-3 rounded-lg border border-slate-200 dark:border-zinc-800"
              >
                {t('nav.login')}
              </button>
              <button 
                onClick={() => { setCurrentPage('register'); setMobileMenuOpen(false); }}
                className="py-2.5 px-3 bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 rounded-lg font-bold text-center"
              >
                {t('nav.register')}
              </button>
            </div>
          )}
        </nav>
      )}

      {/* CORE SCREENS ROUTING */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
            className="flex-1 flex flex-col w-full"
          >
            {currentPage === 'home' && <LandingPage onNavigate={setCurrentPage} />}
            {currentPage === 'survey' && <SurveyPage onNavigate={setCurrentPage} />}
            {currentPage === 'login' && <AuthPages view="login" onNavigate={setCurrentPage} />}
            {currentPage === 'register' && <AuthPages view="register" onNavigate={setCurrentPage} />}
            {currentPage === 'dashboard' && <Dashboards />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* PUBLIC FOOTER (Only when not on dashboard) */}
      {currentPage !== 'dashboard' && (
        <footer className="bg-white dark:bg-[#1A1A21] border-t border-gray-200 dark:border-[#2A2A35] py-12 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="px-2.5 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  MW
                </div>
                <span className="font-bold text-base text-gray-900 dark:text-white">MiraWelch Inc.</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Raízes Fortes. Dados Reais. Futuro Próspero.
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
