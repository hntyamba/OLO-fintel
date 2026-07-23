/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
  ChevronLeft
} from 'lucide-react';

interface UserProfileModuleProps {
  onBack: () => void;
}

export default function UserProfileModule({ onBack }: UserProfileModuleProps) {
  const { user, refreshUser } = useAuth();
  
  if (!user) return null;

  // Form states
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [province, setProvince] = useState(user.province || 'Luanda');
  
  // Organization / Enterprise states
  const [organizationName, setOrganizationName] = useState(user.organizationName || '');
  const [industry, setIndustry] = useState(user.industry || 'AGRICULTURE');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Angola Provinces List
  const provinces = [
    'Luanda', 'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango', 
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
          organizationName: ['OWNER', 'MANAGER', 'FINANCIAL_OFFICER'].includes(user.role) ? organizationName : undefined,
          industry: ['OWNER', 'MANAGER', 'FINANCIAL_OFFICER'].includes(user.role) ? industry : undefined,
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erro ao atualizar o perfil.');
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
            <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Meu Perfil</h2>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
              UTILIZADOR ID: {user.id}
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
              {user.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">{user.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="ramp-status-badge bg-brand-iris/10 text-brand-iris">
                  <span className="ramp-status-dot bg-brand-iris" />
                  {user.role}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1 font-semibold">
                  <MapPin size={12} /> {user.province || 'Não especificada'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Economic Identity Gauge / Score - Brex Style */}
        {isCoopRole && (
          <div className="bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-xl p-5 flex items-center gap-4 shadow-enterprise">
            <div className="w-12 h-12 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
              <Award size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Score de Financiamento</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="brex-metric-val">{user.fundingScore}</span>
                <span className="text-xs text-gray-400 font-bold">/100</span>
              </div>
              <p className="text-[10px] text-brand-purple font-mono font-bold uppercase tracking-wider mt-1">
                Nível: {user.maturity}
              </p>
            </div>
          </div>
        )}
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
                  className="w-full pl-3 pr-3 py-2 text-xs font-semibold rounded-lg border border-gray-250 dark:border-gray-750 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-iris"
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
                className="w-full pl-3 pr-3 py-2 text-xs font-semibold rounded-lg border border-gray-250 dark:border-gray-750 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-iris"
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
        {isCoopRole ? (
          <div className="agriwebb-card space-y-4">
            <div className="border-b border-gray-150 dark:border-gray-800 pb-2">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Building size={16} className="text-brand-purple" />
                Identidade da Cooperativa / Empresa
              </h4>
              <p className="text-[10px] text-gray-400 mt-1">Os dados que definem o perfil produtivo e as metas de crédito.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nome da Organização</label>
                <input
                  type="text"
                  required
                  value={organizationName}
                  onChange={e => setOrganizationName(e.target.value)}
                  className="w-full pl-3 pr-3 py-2 text-xs font-semibold rounded-lg border border-gray-250 dark:border-gray-750 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-purple"
                />
                <p className="text-[9px] text-gray-400 mt-1">Nome registado na Certidão Comercial ou NIF oficial.</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sector Produtivo Principal</label>
                <select
                  value={industry}
                  onChange={e => setIndustry(e.target.value as any)}
                  className="w-full pl-2 pr-3 py-2 text-xs font-semibold rounded-lg border border-gray-250 dark:border-gray-750 bg-white dark:bg-[#1A1A21] text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-purple"
                >
                  {sectors.map(sec => (
                    <option key={sec.value} value={sec.value} className="dark:bg-[#13131A]">{sec.label}</option>
                  ))}
                </select>
                <p className="text-[9px] text-gray-400 mt-1">Determina as análises setoriais específicas da OLO IA.</p>
              </div>

              {/* Status and Rating overview */}
              <div className="bg-gray-50 dark:bg-black/15 p-3 rounded-lg border border-gray-150 dark:border-gray-850/50 space-y-2 mt-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-semibold">Maturidade do Negócio</span>
                  <span className="font-mono font-bold text-brand-purple uppercase">{user.maturity}</span>
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
        ) : (
          /* Non-cooperative roles read-only info card */
          <div className="bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-xl p-5 space-y-4 shadow-enterprise">
            <div className="border-b border-gray-150 dark:border-gray-800 pb-2">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={16} className="text-brand-purple" />
                Papel no Ecossistema OLO
              </h4>
              <p className="text-[10px] text-gray-400 mt-1">Como administrador ou validador, os seus dados impactam a governança de crédito.</p>
            </div>

            <div className="bg-gray-50 dark:bg-black/10 p-4 rounded-xl border border-gray-150 dark:border-gray-850 space-y-3 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              <p>
                Como <strong className="text-gray-900 dark:text-white font-bold">{user.role}</strong>, tem permissões estritas para aceder à plataforma OLO Fintel de acordo com as políticas de conformidade locais.
              </p>
              <p>
                As províncias e informações preenchidas ajudam a desenhar relatórios agregados de produção agrícola e fluxo financeiro nacional em Angola, que são revistos semanalmente pelo Júri LISPA e bancos parceiros.
              </p>
            </div>
          </div>
        )}

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
