/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './AuthContext.js';
import { safeStorage } from '../lib/api';
import { useTheme } from './ThemeContext.js';
import { useLanguage } from './LanguageContext.js';
import { 
  Building2, 
  Briefcase, 
  Mail, 
  Lock, 
  FileUp, 
  FileSpreadsheet, 
  CheckCircle, 
  ShieldAlert, 
  ArrowRight, 
  ArrowLeft,
  Users
} from 'lucide-react';

interface AuthPagesProps {
  view: 'login' | 'register';
  onNavigate: (page: 'home' | 'survey' | 'login' | 'register' | 'dashboard') => void;
}

export default function AuthPages({ view, onNavigate }: AuthPagesProps) {
  const { login, register } = useAuth();
  const { isDark } = useTheme();
  const { t } = useLanguage();

  // Common state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Register specific steps
  const [regStep, setRegStep] = useState(1);
  const [role, setRole] = useState('OWNER');
  const [industry, setIndustry] = useState('AGRICULTURE');
  const [province, setProvince] = useState('Huíla');
  const [organizationName, setOrganizationName] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Quick login helper
  const handleQuickLogin = async (roleType: 'owner' | 'superadmin' | 'analyst' | 'consultant') => {
    setLoading(true);
    const emailMap = {
      owner: 'owner@mirawelch.ao',
      superadmin: 'superadmin@mirawelch.ao',
      analyst: 'analyst@mirawelch.ao',
      consultant: 'consultant@mirawelch.ao'
    };
    const targetEmail = emailMap[roleType];
    const res = await login(targetEmail, 'password');
    setLoading(false);
    if (res.success) {
      onNavigate('dashboard');
    } else {
      setError(res.error || t('auth.error_login'));
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(t('auth.required_fields'));
      return;
    }
    setLoading(true);
    setError(null);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      onNavigate('dashboard');
    } else {
      setError(res.error || t('auth.invalid_credentials'));
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag-and-drop & Computer File Selection
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files) as File[];
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files.map(f => f.name)]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      setUploadedFiles(prev => [...prev, ...files.map(f => f.name)]);
    }
  };

  const handleRegisterSubmit = async () => {
    if (role === 'OWNER' && !organizationName) {
      setError(t('auth.org_required'));
      return;
    }

    setLoading(true);
    setError(null);
    
    const chosenSector = industry || 'AGRICULTURE';
    safeStorage.setItem('olo_fintel_last_selected_sector', chosenSector);

    const payload = {
      name,
      email,
      password,
      role: role || 'OWNER',
      industry: chosenSector,
      sector: chosenSector,
      province: province || 'Luanda',
      companyName: organizationName || 'Cooperativa MiraWelch',
      organizationName: organizationName || 'Cooperativa MiraWelch'
    };

    const res = await register(payload);
    setLoading(false);
    if (res.success) {
      onNavigate('dashboard');
    } else {
      setError(res.error || t('auth.error_register'));
    }
  };

  const provinces = ['Luanda', 'Huíla', 'Benguela', 'Bengo', 'Bié', 'Lunda Norte', 'Lunda Sul', 'Huambo', 'Cabinda', 'Cuanza Sul', 'Namibe', 'Uíge', 'Malanje', 'Zaire', 'Moxico Leste', 'Moxico', 'Cuanza Norte', 'Cuando', 'Cubango', 'Cunene', 'Icolo e Bengo'];

  const inputStyle = `w-full h-10 px-3.5 rounded-lg border bg-white dark:bg-zinc-900 border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 outline-none focus:border-slate-500 text-xs transition-all`;

  return (
    <div className="max-w-md w-full mx-auto px-6 py-12 flex flex-col justify-center min-h-[80vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -10 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="w-full"
        >
          {view === 'login' ? (
        <div className="fintel-card space-y-6 text-left">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100">{t('auth.login_title')}</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">{t('auth.login_subtitle')}</p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 rounded-lg text-rose-600 dark:text-rose-400 text-xs font-semibold">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">{t('auth.email_label')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="exemplo@mirawelch.ao" 
                  className={`${inputStyle} pl-9`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">{t('auth.password_label')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className={`${inputStyle} pl-9`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary h-10 text-xs cursor-pointer"
            >
              {loading ? t('auth.authenticating') : t('auth.login_btn')}
            </button>
          </form>

          {/* QUICK-ACCESS DEMO ACCOUNTS FOR TESTERS & LISPA JURY */}
          <div className="border-t border-slate-200 dark:border-zinc-800 pt-4 space-y-2.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase text-center font-mono">{t('auth.quick_profiles')}</p>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleQuickLogin('owner')}
                className="py-2 px-2.5 rounded-md border border-slate-200 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-600 text-left text-[11px] font-semibold cursor-pointer text-slate-800 dark:text-zinc-200 bg-slate-50 dark:bg-zinc-900 transition-all"
              >
                🌾 Cooperativa (Owner)
              </button>
              <button 
                onClick={() => handleQuickLogin('superadmin')}
                className="py-2 px-2.5 rounded-md border border-slate-200 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-600 text-left text-[11px] font-semibold cursor-pointer text-slate-800 dark:text-zinc-200 bg-slate-50 dark:bg-zinc-900 transition-all"
              >
                👑 Super Admin
              </button>
              <button 
                onClick={() => handleQuickLogin('analyst')}
                className="py-2 px-2.5 rounded-md border border-slate-200 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-600 text-left text-[11px] font-semibold cursor-pointer text-slate-800 dark:text-zinc-200 bg-slate-50 dark:bg-zinc-900 transition-all"
              >
                📊 Analista Bancário
              </button>
              <button 
                onClick={() => handleQuickLogin('consultant')}
                className="py-2 px-2.5 rounded-md border border-slate-200 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-600 text-left text-[11px] font-semibold cursor-pointer text-slate-800 dark:text-zinc-200 bg-slate-50 dark:bg-zinc-900 transition-all"
              >
                🤝 Consultor (Mentor)
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center font-mono">{t('auth.password_tip')}</p>
          </div>

          <div className="text-center text-xs pt-1">
            <span className="text-slate-500 dark:text-zinc-400">{t('auth.no_account')}</span>{' '}
            <button onClick={() => onNavigate('register')} className="text-slate-900 dark:text-zinc-100 font-bold hover:underline cursor-pointer">
              {t('auth.register_here')}
            </button>
          </div>
        </div>
      ) : (
        /* REGISTER PROGRESSIVE FLOW */
        <div className="fintel-card space-y-6 text-left">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100">{t('auth.register_title')}</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">{t('auth.register_subtitle')}</p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-red-500 text-xs font-semibold">
              ⚠️ {error}
            </div>
          )}

          {/* Stepper Indicator */}
          <div className="flex justify-center gap-1.5">
            {[1, 2, 3].map(s => (
              <div 
                key={s} 
                className={`h-1 rounded-full transition-all ${
                  regStep === s ? 'w-6 bg-slate-800 dark:bg-zinc-200' : 'w-2 bg-slate-200 dark:bg-zinc-800'
                }`}
              />
            ))}
          </div>

          {/* REG STEP 1: CREDENTIALS */}
          {regStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">{t('auth.full_name')}</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="ex: Mateus Gaspar" 
                  className={inputStyle}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">{t('auth.email_label')}</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="exemplo@mirawelch.ao" 
                  className={inputStyle}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">{t('auth.password_access')}</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className={inputStyle}
                />
              </div>

              <button
                onClick={() => {
                  if (!name || !email || !password) {
                    setError(t('auth.required_step1'));
                    return;
                  }
                  setError(null);
                  setRegStep(2);
                }}
                className="w-full btn-primary h-10 text-xs cursor-pointer flex items-center justify-center gap-2"
              >
                {t('auth.continue')}
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* REG STEP 2: BRING YOUR CHAOS (DRAG & DROP SIMULATOR) */}
          {regStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                <FileSpreadsheet className="text-slate-600 dark:text-zinc-400" size={16} />
                {t('auth.bring_chaos')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                {t('auth.bring_chaos_desc')}
              </p>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-5 border border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-slate-500 bg-slate-100 dark:bg-zinc-800' 
                    : 'border-slate-300 dark:border-zinc-700 hover:border-slate-400 bg-slate-50/50 dark:bg-zinc-900/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.xlsx,.xls,.docx,.doc,.png,.jpg,.jpeg"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <FileUp className="text-slate-500 dark:text-zinc-400 mb-1.5" size={24} />
                <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">{t('auth.drag_files')}</span>
                <span className="text-[10px] text-slate-400 mt-0.5">{t('auth.accept_formats')}</span>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-3 btn-secondary text-xs py-1.5 px-3 cursor-pointer"
                >
                  Procurar Ficheiros
                </button>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-1.5 max-h-24 overflow-y-auto">
                  <p className="text-[10px] font-bold text-slate-400 uppercase font-mono">{t('auth.detected_files')}</p>
                  {uploadedFiles.map((fn, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-100 dark:bg-zinc-800 text-xs">
                      <span className="truncate font-mono text-slate-700 dark:text-zinc-300">{fn}</span>
                      <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setRegStep(1)}
                  className="flex-1 btn-secondary h-10 text-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft size={14} />
                  {t('auth.back')}
                </button>
                <button
                  onClick={() => setRegStep(3)}
                  className="flex-1 btn-primary h-10 text-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {t('auth.continue')}
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* REG STEP 3: COOPERATIVE SECTOR DETAILS */}
          {regStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">{t('auth.org_name')}</label>
                <input 
                  type="text" 
                  value={organizationName}
                  onChange={e => setOrganizationName(e.target.value)}
                  placeholder="ex: Cooperativa Agrícola Humpata" 
                  className={inputStyle}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">{t('auth.sector')}</label>
                  <select
                    value={industry}
                    onChange={e => setIndustry(e.target.value)}
                    className={inputStyle}
                  >
                    <option value="AGRICULTURE">🌾 {t('survey.sector.agriculture')}</option>
                    <option value="LIVESTOCK">🐄 {t('survey.sector.livestock')}</option>
                    <option value="FISHERIES">⚓ {t('survey.sector.fisheries')}</option>
                    <option value="COMMERCE">👜 {t('survey.sector.commerce')}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">{t('auth.province')}</label>
                  <select
                    value={province}
                    onChange={e => setProvince(e.target.value)}
                    className={inputStyle}
                  >
                    {provinces.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setRegStep(2)}
                  className="flex-1 btn-secondary h-10 text-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft size={14} />
                  {t('auth.back')}
                </button>
                <button
                  onClick={handleRegisterSubmit}
                  disabled={loading}
                  className="flex-1 btn-primary h-10 text-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {loading ? t('auth.registering') : t('auth.finish_register')}
                  <CheckCircle size={14} />
                </button>
              </div>
            </div>
          )}

          <div className="text-center text-xs pt-1">
            <span className="text-slate-500 dark:text-zinc-400">{t('auth.have_account')}</span>{' '}
            <button onClick={() => onNavigate('login')} className="text-slate-900 dark:text-zinc-100 font-bold hover:underline cursor-pointer">
              {t('auth.do_login')}
            </button>
          </div>
        </div>
      )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
