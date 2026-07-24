/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.js';
import { getApiUrl } from '../lib/api';
import { 
  User, 
  Building, 
  MapPin, 
  Lock, 
  Check, 
  AlertTriangle, 
  TrendingUp, 
  Award,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Building2,
  Briefcase
} from 'lucide-react';

interface UserProfileModuleProps {
  onBack: () => void;
}

export default function UserProfileModule({ onBack }: UserProfileModuleProps) {
  const { user, refreshUser } = useAuth();
  
  if (!user) return null;

  const getFallbackName = (u: any) => {
    if (u?.name && u.name !== 'Utilizador' && u.name.trim() !== '') return u.name;
    if (u?.email && u.email.includes('@')) {
      const uPart = u.email.split('@')[0];
      if (uPart === 'owner') return 'Mateus Gaspar';
      if (uPart === 'superadmin') return 'Carlos Manuel';
      if (uPart === 'analyst') return 'Sofia Antunes';
      if (uPart === 'consultant') return 'Adilson Neto';
      return uPart.replace(/[._]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
    }
    return 'Mateus Gaspar';
  };

  // Form states
  const [name, setName] = useState(getFallbackName(user));
  const [email, setEmail] = useState(user?.email || 'owner@olofintel.ao');
  const [password, setPassword] = useState('');
  const [province, setProvince] = useState(user?.province || 'Huíla');
  
  // Organization / Enterprise states
  const [organizationName, setOrganizationName] = useState(user?.organizationName || 'Cooperativa Agrícola Humpata');
  const [industry, setIndustry] = useState(user?.industry || 'AGRICULTURE');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Keep state in sync whenever user updates from server or login context
  useEffect(() => {
    if (user) {
      setName(getFallbackName(user));
      setEmail(user.email || 'owner@olofintel.ao');
      setProvince(user.province || 'Huíla');
      setOrganizationName(user.organizationName || 'Cooperativa Agrícola Humpata');
      setIndustry(user.industry || 'AGRICULTURE');
    }
  }, [user]);

  // Angola Provinces List
  const provinces = [
    'Luanda', 'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Quando Cubango', 
    'Cuanza Norte', 'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla', 'Lunda Norte', 
    'Lunda Sul', 'Malanje', 'Moxico', 'Namibe', 'Uíge', 'Zaire'
  ];

  // Industry sectors
  const sectors = [
    { value: 'AGRICULTURE', label: '🌾 Agricultura' },
    { value: 'LIVESTOCK', label: '🐂 Pecuária' },
    { value: 'FISHERIES', label: '🐟 Pesca' },
    { value: 'COMMERCE', label: '🏪 Comércio Geral' },
    { value: 'TRANSPORT', label: '🚚 Transporte & Logística' }
  ];

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch(getApiUrl('/api/auth/profile/update'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name,
          email,
          password: password || undefined,
          province,
          organizationName,
          industry,
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || errData.message || 'Erro ao atualizar o perfil.');
      }

      await refreshUser();
      setSuccessMsg('Perfil e dados de Identidade Económica atualizados com sucesso!');
      setPassword('');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro de ligação ao servidor.');
    } finally {
      setSaving(false);
    }
  };

  const isCoopRole = ['OWNER', 'MANAGER', 'FINANCIAL_OFFICER'].includes(user.role);

  const sectorLabels: Record<string, string> = {
    AGRICULTURE: '🌾 Sector Agrícola',
    LIVESTOCK: '🐂 Sector Pecuário',
    FISHERIES: '🐟 Sector de Pescas',
    COMMERCE: '🏪 Sector Comercial',
    TRANSPORT: '🚚 Transporte & Logística'
  };

  return (
    <div className="space-y-6">
      
      {/* Top action bar - Ramp styled density */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#2A2A35] pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-all flex items-center justify-center cursor-pointer"
            title="Voltar"
          >
            <ChevronLeft size={16} />
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Meu Perfil de Utilizador</h2>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-mono flex items-center gap-2 mt-0.5">
              <span>ID: {user.id}</span>
              {user.organizationId && <span>• ORG ID: {user.organizationId}</span>}
            </p>
          </div>
        </div>

        {/* Back button label */}
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 dark:border-gray-750 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 transition-all cursor-pointer"
        >
          Voltar ao Painel
        </button>
      </div>

      {/* Profile Overview Header Card - Brex high contrast & massive numbers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-enterprise">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-brand-iris/15 text-brand-iris font-bold text-xl flex items-center justify-center border border-brand-iris/20 shrink-0">
              {(name || email || 'MG').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">{name || user?.name || getFallbackName(user)}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-brand-iris/15 text-brand-iris border border-brand-iris/20">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{email || user.email}</p>
              
              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                {user.organizationName && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-[#252530] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 flex items-center gap-1.5">
                    <Building2 size={13} className="text-brand-purple" />
                    {user.organizationName}
                  </span>
                )}
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-[#252530] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 flex items-center gap-1.5">
                  <Briefcase size={13} className="text-brand-iris" />
                  {sectorLabels[user.industry || 'AGRICULTURE'] || user.industry}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-[#252530] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 flex items-center gap-1.5">
                  <MapPin size={13} className="text-emerald-500" />
                  {user.province || 'Luanda'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Economic Identity Gauge / Score - Brex Style */}
        <div className="bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-xl p-5 flex items-center justify-between gap-4 shadow-enterprise">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0 border border-brand-purple/20">
              <Award size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Elegibilidade de Crédito</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-gray-900 dark:text-white font-mono">{user.fundingScore || 72}</span>
                <span className="text-xs text-gray-400 font-bold">/100</span>
              </div>
              <p className="text-[10px] text-brand-purple font-mono font-bold uppercase tracking-wider mt-0.5">
                Maturidade: {user.maturity || 'INTERMEDIATE'}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck size={12} /> KYC Ativo
            </span>
          </div>
        </div>
      </div>

      {/* Success/Error Alerts */}
      {successMsg && (
        <div className="p-3.5 bg-green-500/5 border border-green-500/10 text-green-600 dark:text-green-400 rounded-xl text-xs font-semibold flex items-start gap-2 animate-fade-in">
          <Check size={16} className="shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-red-500/5 border border-red-500/10 text-red-500 rounded-xl text-xs font-semibold flex items-start gap-2 animate-fade-in">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Update Form layout */}
      <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Personal details card - Mercury border, Ramp density */}
        <div className="bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-xl p-5 space-y-4 shadow-enterprise">
          <div className="border-b border-gray-150 dark:border-gray-800 pb-2">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <User size={16} className="text-brand-iris" />
              Informações Pessoais
            </h4>
            <p className="text-[10px] text-gray-400 mt-1">Gerencie os seus dados de contacto e credenciais de login.</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nome Completo</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Mateus Gaspar"
                  className="w-full pl-3 pr-3 py-2 text-xs font-semibold rounded-lg border border-gray-250 dark:border-gray-750 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-iris placeholder-gray-400 dark:placeholder-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Email Corporativo</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Ex: owner@olofintel.ao"
                className="w-full pl-3 pr-3 py-2 text-xs font-semibold rounded-lg border border-gray-250 dark:border-gray-750 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-iris placeholder-gray-400 dark:placeholder-gray-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Província</label>
              <select
                value={province}
                onChange={e => setProvince(e.target.value)}
                className="w-full pl-2 pr-3 py-2 text-xs font-semibold rounded-lg border border-gray-250 dark:border-gray-750 bg-white dark:bg-[#1A1A21] text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-iris"
              >
                {provinces.map(prov => (
                  <option key={prov} value={prov} className="dark:bg-[#13131A]">{prov}</option>
                ))}
              </select>
            </div>

            <div className="pt-2 border-t border-gray-150 dark:border-gray-800">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Lock size={11} /> Nova Senha (Opcional)
              </label>
              <input
                type="password"
                placeholder="Introduza uma nova senha para atualizar"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-3 pr-3 py-2 text-xs font-semibold rounded-lg border border-gray-250 dark:border-gray-750 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-iris placeholder-gray-400 dark:placeholder-gray-600"
              />
              <p className="text-[9px] text-gray-400 mt-1">Deixe em branco se deseja manter a senha atual.</p>
            </div>
          </div>
        </div>

        {/* Enterprise Context Section - AgriWebb earthy gradient, Brex parameters */}
        <div className="bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-xl p-5 space-y-4 shadow-enterprise">
          <div className="border-b border-gray-150 dark:border-gray-800 pb-2">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Building size={16} className="text-brand-purple" />
              Identidade Organizacional & Sector
            </h4>
            <p className="text-[10px] text-gray-400 mt-1">Dados de enquadramento da organização, cooperativa ou instituição no ecossistema.</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nome da Organização / Empresa</label>
              <input
                type="text"
                required
                value={organizationName}
                onChange={e => setOrganizationName(e.target.value)}
                placeholder="Ex: Cooperativa Agropecuária do Dombe Grande"
                className="w-full pl-3 pr-3 py-2 text-xs font-semibold rounded-lg border border-gray-250 dark:border-gray-750 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-purple placeholder-gray-400 dark:placeholder-gray-600"
              />
              <p className="text-[9px] text-gray-400 mt-1">Nome registado na Certidão Comercial ou NIF oficial.</p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sector Produtivo Principal</label>
              <select
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                className="w-full pl-2 pr-3 py-2 text-xs font-semibold rounded-lg border border-gray-250 dark:border-gray-750 bg-white dark:bg-[#1A1A21] text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-purple"
              >
                {sectors.map(sec => (
                  <option key={sec.value} value={sec.value} className="dark:bg-[#13131A]">{sec.label}</option>
                ))}
              </select>
              <p className="text-[9px] text-gray-400 mt-1">Determina as análises setoriais específicas e relatórios de risco.</p>
            </div>

            {/* Status and Rating overview */}
            <div className="bg-gray-50 dark:bg-black/15 p-3 rounded-lg border border-gray-150 dark:border-gray-850/50 space-y-2 mt-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-semibold">Papel do Utilizador</span>
                <span className="font-mono font-bold text-brand-iris uppercase px-2 py-0.5 rounded bg-brand-iris/10">{user.role}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-semibold">Maturidade Operacional</span>
                <span className="font-mono font-bold text-brand-purple uppercase">{user.maturity || 'INTERMEDIATE'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-semibold">Estado do KYC no Ecossistema</span>
                <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse" /> Ativo & Regularizado
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions Footer - Brex AccentFilled button with Iris background */}
        <div className="lg:col-span-2 pt-2 flex items-center justify-end gap-3 border-t border-gray-250 dark:border-gray-800">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-850 transition-all cursor-pointer"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={saving}
            className="brex-primary-btn px-5 py-2"
          >
            {saving ? (
              <>
                <span className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full inline-block mr-2" />
                A Guardar...
              </>
            ) : (
              'Guardar Alterações'
            )}
          </button>
        </div>

      </form>
      
    </div>
  );
}
