/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
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
      owner: 'owner@olofintel.ao',
      superadmin: 'superadmin@olofintel.ao',
      analyst: 'analyst@olofintel.ao',
      consultant: 'consultant@olofintel.ao'
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
      companyName: organizationName || 'Cooperativa OLO',
      organizationName: organizationName || 'Cooperativa OLO'
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

  const inputStyle = `w-full h-11 px-4 rounded-xl border bg-white dark:bg-[#1A1A21] border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-brand-iris transition-all`;

  return (
    <div className="max-w-md w-full mx-auto px-6 py-12 flex flex-col justify-center min-h-[80vh]">
      
      {view === 'login' ? (
        <div className="bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('auth.login_title')}</h2>
            <p className="text-xs text-gray-400 mt-1.5">{t('auth.login_subtitle')}</p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-red-500 text-xs font-semibold">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">{t('auth.email_label')}</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="exemplo@olofintel.ao" 
                  className={`${inputStyle} pl-11`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">{t('auth.password_label')}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className={`${inputStyle} pl-11`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-brand-iris hover:bg-brand-iris-hover text-white font-bold rounded-xl transition-all shadow-md shadow-brand-iris/25"
            >
              {loading ? t('auth.authenticating') : t('auth.login_btn')}
            </button>
          </form>

          {/* QUICK-ACCESS DEMO ACCOUNTS FOR TESTERS & LISPA JURY */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-5 space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase text-center">{t('auth.quick_profiles')}</p>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleQuickLogin('owner')}
                className="py-2.5 px-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-brand-iris text-left text-xs font-semibold cursor-pointer text-gray-900 dark:text-white bg-white dark:bg-[#1A1A21]"
              >
                🌾 Cooperativa (Owner)
              </button>
              <button 
                onClick={() => handleQuickLogin('superadmin')}
                className="py-2.5 px-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-brand-purple text-left text-xs font-semibold cursor-pointer text-gray-900 dark:text-white bg-white dark:bg-[#1A1A21]"
              >
                👑 Super Admin
              </button>
              <button 
                onClick={() => handleQuickLogin('analyst')}
                className="py-2.5 px-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 text-left text-xs font-semibold cursor-pointer text-gray-900 dark:text-white bg-white dark:bg-[#1A1A21]"
              >
                📊 Analista Bancário
              </button>
              <button 
                onClick={() => handleQuickLogin('consultant')}
                className="py-2.5 px-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-amber-500 text-left text-xs font-semibold cursor-pointer text-gray-900 dark:text-white bg-white dark:bg-[#1A1A21]"
              >
                🤝 Consultor (Mentor)
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center font-mono">{t('auth.password_tip')}</p>
          </div>

          <div className="text-center text-xs">
            <span className="text-gray-400">{t('auth.no_account')}</span>{' '}
            <button onClick={() => onNavigate('register')} className="text-brand-iris font-bold hover:underline">
              {t('auth.register_here')}
            </button>
          </div>
        </div>
      ) : (
        /* REGISTER PROGRESSIVE FLOW */
        <div className="bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('auth.register_title')}</h2>
            <p className="text-xs text-gray-400 mt-1.5">{t('auth.register_subtitle')}</p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-red-500 text-xs font-semibold">
              ⚠️ {error}
            </div>
          )}

          {/* Stepper Indicator */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map(s => (
              <div 
                key={s} 
                className={`h-1.5 rounded-full transition-all ${
                  regStep === s ? 'w-8 bg-brand-iris' : 'w-2 bg-gray-200 dark:bg-gray-800'
                }`}
              />
            ))}
          </div>

          {/* REG STEP 1: CREDENTIALS */}
          {regStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">{t('auth.full_name')}</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="ex: Mateus Gaspar" 
                  className={inputStyle}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">{t('auth.email_label')}</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="exemplo@olofintel.ao" 
                  className={inputStyle}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">{t('auth.password_access')}</label>
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
                className="w-full h-11 bg-brand-iris hover:bg-brand-iris-hover text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                {t('auth.continue')}
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* REG STEP 2: BRING YOUR CHAOS (DRAG & DROP SIMULATOR) */}
          {regStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <FileSpreadsheet className="text-brand-purple" size={18} />
                {t('auth.bring_chaos')}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {t('auth.bring_chaos_desc')}
              </p>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-brand-iris bg-brand-iris/10' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-brand-iris hover:bg-brand-iris/5'
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
                <FileUp className="text-brand-purple mb-2" size={32} />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{t('auth.drag_files')}</span>
                <span className="text-[10px] text-gray-400 mt-1">{t('auth.accept_formats')}</span>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-3 px-4 py-2 bg-brand-iris hover:bg-brand-iris-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  Procurar Ficheiros no Computador
                </button>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-1.5 max-h-24 overflow-y-auto">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{t('auth.detected_files')}</p>
                  {uploadedFiles.map((fn, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800 text-xs border border-transparent hover:border-brand-iris/20">
                      <span className="truncate font-mono text-gray-600 dark:text-gray-300">{fn}</span>
                      <CheckCircle size={14} className="text-green-500 shrink-0" />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setRegStep(1)}
                  className="flex-1 h-11 border border-gray-300 dark:border-gray-700 rounded-xl font-semibold text-xs text-gray-500 flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft size={14} />
                  {t('auth.back')}
                </button>
                <button
                  onClick={() => setRegStep(3)}
                  className="flex-1 h-11 bg-brand-iris hover:bg-brand-iris-hover text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
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
                <label className="text-xs font-bold text-gray-400 uppercase">{t('auth.org_name')}</label>
                <input 
                  type="text" 
                  value={organizationName}
                  onChange={e => setOrganizationName(e.target.value)}
                  placeholder="ex: Cooperativa Agrícola Humpata" 
                  className={inputStyle}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">{t('auth.sector')}</label>
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
                  <label className="text-xs font-bold text-gray-400 uppercase">{t('auth.province')}</label>
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

              <div className="flex gap-4 pt-3">
                <button
                  onClick={() => setRegStep(2)}
                  className="flex-1 h-11 border border-gray-300 dark:border-gray-700 rounded-xl font-semibold text-xs text-gray-500 flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft size={14} />
                  {t('auth.back')}
                </button>
                <button
                  onClick={handleRegisterSubmit}
                  disabled={loading}
                  className="flex-1 h-11 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
                >
                  {loading ? t('auth.registering') : t('auth.finish_register')}
                  <CheckCircle size={14} />
                </button>
              </div>
            </div>
          )}

          <div className="text-center text-xs">
            <span className="text-gray-400">{t('auth.have_account')}</span>{' '}
            <button onClick={() => onNavigate('login')} className="text-brand-iris font-bold hover:underline">
              {t('auth.do_login')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
