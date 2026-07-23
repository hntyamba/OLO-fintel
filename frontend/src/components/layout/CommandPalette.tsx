import React, { useEffect } from 'react';
import { Command, X, CornerDownLeft, MapPin, Camera } from 'lucide-react';

interface CommandPaletteProps {
  show: boolean;
  onClose: () => void;
  user: any;
  offlineMode: boolean;
  commandPaletteActiveOption: string | null;
  setCommandPaletteActiveOption: (val: string | null) => void;
  commandPaletteQuery: string;
  setCommandPaletteQuery: (val: string) => void;
  commandPaletteFormData: Record<string, string>;
  setCommandPaletteFormData: (val: Record<string, string>) => void;
  photoEvidence: string | null;
  setPhotoEvidence: (val: string | null) => void;
  gpsCoords: { latitude: number; longitude: number } | null;
  setGpsCoords: (val: { latitude: number; longitude: number } | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  canSwitchSectors: boolean;
}

export function CommandPalette({
  show, onClose, user, offlineMode,
  commandPaletteActiveOption, setCommandPaletteActiveOption,
  commandPaletteQuery, setCommandPaletteQuery,
  commandPaletteFormData, setCommandPaletteFormData,
  photoEvidence, setPhotoEvidence,
  gpsCoords, setGpsCoords,
  onSubmit, canSwitchSectors,
}: CommandPaletteProps) {
  useEffect(() => {
    if (!show) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-start justify-center pt-[10vh] px-4 overflow-y-auto pb-12">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-[#0D0D12] text-white border border-gray-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col my-4">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800 bg-[#12121A]">
          <Command className="text-brand-purple shrink-0 animate-pulse" size={20} />
          <input type="text" value={commandPaletteQuery} onChange={e => setCommandPaletteQuery(e.target.value)}
            placeholder={commandPaletteActiveOption ? `Configurar lancamento de ${commandPaletteActiveOption}...` : "Escreva 'colheita', 'peso', 'venda' ou 'vacina'..."}
            className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 text-sm text-gray-150 placeholder-gray-500" autoFocus />
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-gray-800 text-gray-400 font-mono px-2 py-0.5 rounded-md">ESC</span>
            <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18} /></button>
          </div>
        </div>

        <div className="px-5 py-3 bg-[#171724]/60 border-b border-gray-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${offlineMode || commandPaletteFormData.offline === 'true' ? 'bg-amber-500' : 'bg-green-500'} animate-pulse`} />
            <span className="font-semibold text-gray-300">{offlineMode || commandPaletteFormData.offline === 'true' ? 'Modo Contingencia (Offline)' : 'Ligacao Segura OLO Cloud (Online)'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => { const nextOffline = !(offlineMode || commandPaletteFormData.offline === 'true'); setCommandPaletteFormData({ ...commandPaletteFormData, offline: nextOffline ? 'true' : 'false' }); }}
              className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${offlineMode || commandPaletteFormData.offline === 'true' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-green-500/10 text-green-400 border-green-500/30'}`}>
              Simular {offlineMode || commandPaletteFormData.offline === 'true' ? 'Online' : 'Offline'}
            </button>
            <button type="button" onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (pos) => { setGpsCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }); alert(`GPS Sincronizado: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`); },
                  () => { setGpsCoords({ latitude: -14.9782, longitude: 13.4321 }); alert('GPS simulado em Luanda.'); }
                );
              } else { setGpsCoords({ latitude: -14.9782, longitude: 13.4321 }); alert('GPS simulado em Luanda.'); }
            }} className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold border border-brand-purple/30 bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 transition-all cursor-pointer">
              <MapPin size={10} /> {gpsCoords ? `${gpsCoords.latitude.toFixed(2)}, ${gpsCoords.longitude.toFixed(2)}` : 'Sincronizar GPS'}
            </button>
          </div>
        </div>

        {!commandPaletteActiveOption ? (
          <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Acoes Rapidas por Sector</p>
            {[
              { id: 'COLHEITA', label: 'Registar Colheita', desc: 'Lancamento rapido de colheita no campo', icon: '\u{1F33E}', sector: 'AGRICULTURE' },
              { id: 'INSUMO', label: 'Registar Aplicacao de Insumo', desc: 'Fertilizantes, pesticidas e sementes', icon: '\u{1F9EA}', sector: 'AGRICULTURE' },
              { id: 'PESO', label: 'Pesagem de Animal', desc: 'Registo de ganho de peso e crescimento', icon: '\u2696\uFE0F', sector: 'LIVESTOCK' },
              { id: 'VACINA', label: 'Vacinacao / Saude', desc: 'Registo sanitario do rebanho', icon: '\u{1F489}', sector: 'LIVESTOCK' },
              { id: 'VIAGEM', label: 'Iniciar Viagem de Pesca', desc: 'Lancar nova viagem de captura', icon: '\u26F5', sector: 'FISHERIES' },
              { id: 'CAPTURA', label: 'Registar Captura', desc: 'Quantidade, especie e valor da pesca', icon: '\u{1F41F}', sector: 'FISHERIES' },
              { id: 'VENDA', label: 'Registar Venda', desc: 'Lancamento de receita comercial', icon: '\u{1F4B0}', sector: 'COMMERCE' },
              { id: 'PAGAMENTO', label: 'Registar Pagamento', desc: 'Amortizacao de divida ou recebimento', icon: '\u{1F4B8}', sector: 'COMMERCE' }
            ].filter(opt => canSwitchSectors || opt.sector === user?.industry || ['VENDA', 'PAGAMENTO'].includes(opt.id))
              .filter(opt => !commandPaletteQuery || opt.label.toLowerCase().includes(commandPaletteQuery.toLowerCase()) || opt.desc.toLowerCase().includes(commandPaletteQuery.toLowerCase()))
              .map(opt => (
                <button key={opt.id} onClick={() => setCommandPaletteActiveOption(opt.id)}
                  className="w-full p-3 rounded-xl bg-[#171724] hover:bg-[#1C1C28] border border-gray-800 hover:border-brand-purple/30 transition-all flex items-center gap-3 text-left cursor-pointer group">
                  <span className="text-xl shrink-0">{opt.icon}</span>
                  <div className="min-w-0"><p className="text-xs font-bold text-gray-150 group-hover:text-brand-purple transition-colors">{opt.label}</p><p className="text-[10px] text-gray-500 mt-0.5 truncate">{opt.desc}</p></div>
                </button>
              ))
            }
          </div>
        ) : (
          <form onSubmit={onSubmit} className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-150">Configurar: <span className="text-brand-purple">{commandPaletteActiveOption}</span></h3>
              <button type="button" onClick={() => setCommandPaletteActiveOption(null)} className="text-[10px] font-bold text-gray-400 hover:text-white cursor-pointer flex items-center gap-1"><CornerDownLeft size={10} /> Voltar</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {commandPaletteActiveOption === 'COLHEITA' && (
                <>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Identificacao do Talhao</label><input type="text" required placeholder="ex: Talhao Alfa" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.talhao || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, talhao: e.target.value })} /></div>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Produto Colhido</label><input type="text" required placeholder="ex: Milho Branco" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.produto || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, produto: e.target.value })} /></div>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Quantidade Colhida (kg)</label><input type="number" required placeholder="ex: 5000" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.quantidade || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, quantidade: e.target.value })} /></div>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Perdas Estimadas (kg)</label><input type="number" step="0.1" placeholder="ex: 150" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.perdas || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, perdas: e.target.value })} /></div>
                </>
              )}
              {commandPaletteActiveOption === 'INSUMO' && (
                <>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Nome do Insumo</label><input type="text" required placeholder="ex: NPK 12-24-12" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.nome || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, nome: e.target.value })} /></div>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Categoria</label><select className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.categoria || 'Adubos'} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, categoria: e.target.value })}><option value="Adubos">Adubos / Fertilizantes</option><option value="Sementes">Sementes</option><option value="Defensivos">Defensivos Agricolas</option></select></div>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Quantidade Aplicada</label><input type="number" required placeholder="ex: 45" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.quantidade || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, quantidade: e.target.value })} /></div>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Unidade</label><select className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.unidade || 'kg'} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, unidade: e.target.value })}><option value="kg">kg</option><option value="sacos">Sacos</option><option value="litros">Litros</option></select></div>
                </>
              )}
              {commandPaletteActiveOption === 'PESO' && (
                <>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">ID do Animal</label><input type="text" required placeholder="ex: BOV-045" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.animalId || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, animalId: e.target.value })} /></div>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Peso Corporal (kg)</label><input type="number" required placeholder="ex: 420" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.peso || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, peso: e.target.value })} /></div>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Altura no Dorso (m)</label><input type="number" step="0.01" placeholder="ex: 1.35" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.altura || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, altura: e.target.value })} /></div>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Ganho Diario (kg)</label><input type="number" step="0.1" placeholder="ex: 1.2" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.ganhoDiario || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, ganhoDiario: e.target.value })} /></div>
                </>
              )}
              {commandPaletteActiveOption === 'VACINA' && (
                <>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">ID do Animal</label><input type="text" required placeholder="ex: BOV-045" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.animalId || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, animalId: e.target.value })} /></div>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Nome da Vacina</label><input type="text" required placeholder="ex: Anti-Aftosa" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.vacina || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, vacina: e.target.value })} /></div>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Medicamento</label><input type="text" placeholder="ex: Aftovax 5ml" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.medicamento || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, medicamento: e.target.value })} /></div>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Custo (Kz)</label><input type="number" placeholder="ex: 1200" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.custo || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, custo: e.target.value })} /></div>
                </>
              )}
              {commandPaletteActiveOption === 'VIAGEM' && (
                <>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Embarcacao</label><input type="text" required placeholder="ex: Estrela do Namibe" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.embarcacao || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, embarcacao: e.target.value })} /></div>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Combustivel (Litros)</label><input type="number" required placeholder="ex: 200" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.combustivel || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, combustivel: e.target.value })} /></div>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Tripulacao</label><input type="number" required placeholder="ex: 4" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.tripulacao || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, tripulacao: e.target.value })} /></div>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Destino</label><input type="text" placeholder="ex: Zona de Pesca Sul" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.destino || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, destino: e.target.value })} /></div>
                </>
              )}
              {commandPaletteActiveOption === 'CAPTURA' && (
                <>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">ID da Viagem</label><input type="text" required placeholder="ex: VIA-Estrela-01" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.viagemId || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, viagemId: e.target.value })} /></div>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Especie</label><select className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.especie || 'Carapau'} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, especie: e.target.value })}><option value="Carapau">Carapau</option><option value="Sardinha">Sardinha</option><option value="Garoupa">Garoupa</option><option value="Corvina">Corvina</option></select></div>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Quantidade (kg)</label><input type="number" required placeholder="ex: 750" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.quantidade || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, quantidade: e.target.value })} /></div>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Preco Esperado (Kz/kg)</label><input type="number" required placeholder="ex: 1200" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.preco || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, preco: e.target.value })} /></div>
                </>
              )}
              {commandPaletteActiveOption === 'VENDA' && (
                <>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Cliente</label><input type="text" required placeholder="ex: Sofia Gaspar" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.cliente || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, cliente: e.target.value })} /></div>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Produto</label><input type="text" required placeholder="ex: Arroz Agulha 1kg" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.produto || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, produto: e.target.value })} /></div>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Quantidade</label><input type="number" required placeholder="ex: 10" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.quantidade || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, quantidade: e.target.value })} /></div>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Preco Unitario (Kz)</label><input type="number" required placeholder="ex: 850" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.preco || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, preco: e.target.value })} /></div>
                  <div className="md:col-span-2 space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Venda Fiada?</label><select className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.fiado || 'nao'} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, fiado: e.target.value })}><option value="nao">Nao, pronto pagamento</option><option value="sim">Sim, faturamento a prazo (30 dias)</option></select></div>
                </>
              )}
              {commandPaletteActiveOption === 'PAGAMENTO' && (
                <>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Nome do Cliente</label><input type="text" required placeholder="ex: Sofia Gaspar" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.cliente || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, cliente: e.target.value })} /></div>
                  <div className="space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Referencia da Fatura</label><input type="text" placeholder="ex: FAT-4921" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.documento || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, documento: e.target.value })} /></div>
                  <div className="md:col-span-2 space-y-1"><label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Valor Pago (Kz)</label><input type="number" required placeholder="ex: 15000" className="w-full h-11 px-3 rounded-xl bg-gray-900 border border-gray-850 text-white text-sm focus:border-brand-purple focus:outline-none" value={commandPaletteFormData.valorPago || ''} onChange={e => setCommandPaletteFormData({ ...commandPaletteFormData, valorPago: e.target.value })} /></div>
                </>
              )}
            </div>

            <div className="p-4 bg-gray-900/50 rounded-2xl border border-gray-850 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><Camera size={14} className="text-brand-purple" /><span className="text-xs font-bold">Comprovativo Fotografico</span></div>
                {photoEvidence && <span className="text-[10px] bg-green-500/20 text-green-400 font-bold px-2 py-0.5 rounded-lg">FOTO ANEXADA</span>}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => { setPhotoEvidence("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='100' height='100' fill='%23222'/><text x='10' y='50' fill='white' font-size='10'>EVIDENCIA</text></svg>"); alert('Foto simulada capturada!'); }} className="px-3 py-2 bg-gray-850 hover:bg-gray-800 text-gray-200 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2"><Camera size={12} /> Simular Captura</button>
                {photoEvidence && <button type="button" onClick={() => setPhotoEvidence(null)} className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-xl transition-all cursor-pointer">Remover Foto</button>}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button type="submit" className="flex-1 py-3 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl font-bold transition-all text-sm shadow-md cursor-pointer">
                Homologar Registo {offlineMode || commandPaletteFormData.offline === 'true' ? 'na Cache Offline' : 'Online'}
              </button>
              <button type="button" onClick={() => { setCommandPaletteActiveOption(null); setCommandPaletteFormData({}); }} className="px-4 py-3 bg-gray-900 border border-gray-800 hover:bg-gray-850 text-gray-400 hover:text-white rounded-xl font-bold transition-all text-sm cursor-pointer">Cancelar</button>
            </div>
          </form>
        )}

        <div className="px-5 py-3 border-t border-gray-800 bg-[#0A0A0F] text-[10px] text-gray-500 flex justify-between items-center">
          <span>Prima <kbd className="font-mono bg-gray-900 px-1 py-0.5 rounded border border-gray-800">Cmd+K</kbd> a qualquer altura para fechar</span>
          <span>OLO Fintel Platform Integration &bull; Angola</span>
        </div>
      </div>
    </div>
  );
}
