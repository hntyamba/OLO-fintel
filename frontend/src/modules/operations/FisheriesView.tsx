import React from 'react';
import { Plus } from 'lucide-react';

interface FisheriesViewProps {
  userId: string;
  activeResource: string;
  setActiveResource: (r: string) => void;
  genericForm: Record<string, string>;
  setGenericForm: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  embarcoes: any[];
  setEmbarcoes: React.Dispatch<React.SetStateAction<any[]>>;
  viagens: any[];
  setViagens: React.Dispatch<React.SetStateAction<any[]>>;
  capturas: any[];
  setCapturas: React.Dispatch<React.SetStateAction<any[]>>;
  custosPesca: any[];
  setCustosPesca: React.Dispatch<React.SetStateAction<any[]>>;
  manutencaoPesca: any[];
  setManutencaoPesca: React.Dispatch<React.SetStateAction<any[]>>;
  comercializacaoPesca: any[];
  setComercializacaoPesca: React.Dispatch<React.SetStateAction<any[]>>;
  handleFormSubmit: (e: React.FormEvent) => void;
}

export default function FisheriesView({
  userId, activeResource, setActiveResource,
  genericForm, setGenericForm,
  embarcoes, setEmbarcoes, viagens, setViagens,
  capturas, setCapturas, custosPesca, setCustosPesca,
  manutencaoPesca, setManutencaoPesca,
  comercializacaoPesca, setComercializacaoPesca, handleFormSubmit,
}: FisheriesViewProps) {
  const resourceTabs = [
    { id: 'embarcacoes', label: 'Embarcações', desc: 'Motores, frotas e estados' },
    { id: 'viagens', label: 'Viagens', desc: 'Controlo de tripulação/saídas' },
    { id: 'capturas', label: 'Capturas', desc: 'Espécies e quantidades' },
    { id: 'custosPesca', label: 'Custos Operacionais', desc: 'Combustível, gelo e taxas' },
    { id: 'manutencaoPesca', label: 'Manutenção', desc: 'Inspeções e peças' },
    { id: 'comercializacaoPesca', label: 'Comercialização', desc: 'Mercados e compradores' },
  ];

  const getCount = () => {
    if (activeResource === 'embarcacoes') return embarcoes.length;
    if (activeResource === 'viagens') return viagens.length;
    if (activeResource === 'capturas') return capturas.length;
    if (activeResource === 'custosPesca') return custosPesca.length;
    if (activeResource === 'manutencaoPesca') return manutencaoPesca.length;
    if (activeResource === 'comercializacaoPesca') return comercializacaoPesca.length;
    return 0;
  };

  return (
    <>
      {resourceTabs.map(item => (
        <button
          key={item.id}
          onClick={() => {
            setActiveResource(item.id);
            localStorage.setItem(`olo-fintel-lastResource-${userId}`, item.id);
          }}
          className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex flex-col gap-0.5 ${
            activeResource === item.id
              ? 'bg-[#0E9F6E]/10 text-[#0E9F6E] border-l-4 border-[#0E9F6E]'
              : 'hover:bg-gray-50 dark:hover:bg-[#1C1C24] text-gray-700 dark:text-gray-300'
          }`}
        >
          <span className="text-xs font-bold">{item.label}</span>
          <span className="text-[9px] text-gray-400 leading-none">{item.desc}</span>
        </button>
      ))}

      <div className="lg:col-span-9 space-y-6">
        <div className="bg-white dark:bg-[#1C1C24] border border-gray-150 dark:border-[#22222E] rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-[#22222E] flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              Histórico de Registos: <span className="text-[#0E9F6E]">{activeResource.toUpperCase()}</span>
            </h3>
            <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-mono rounded">
              Total: {getCount()} registos
            </span>
          </div>

          <div className="ramp-table-container p-1">
            <table className="ramp-table">
              <thead>
                <tr className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                  {activeResource === 'embarcacoes' && (
                    <>
                      <th className="p-3">Embarcação</th>
                      <th className="p-3">Matrícula</th>
                      <th className="p-3 text-right">Capacidade (ton)</th>
                      <th className="p-3">Motor</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3 text-right">Ações</th>
                    </>
                  )}
                  {activeResource === 'viagens' && (
                    <>
                      <th className="p-3">Embarcação</th>
                      <th className="p-3">Saída</th>
                      <th className="p-3">Chegada</th>
                      <th className="p-3 text-right">Tripulação</th>
                      <th className="p-3 text-right">Combustível (L)</th>
                      <th className="p-3">Zona Pesca</th>
                    </>
                  )}
                  {activeResource === 'capturas' && (
                    <>
                      <th className="p-3">ID Viagem</th>
                      <th className="p-3">Espécie</th>
                      <th className="p-3 text-right">Caixas</th>
                      <th className="p-3 text-right">Peso (kg)</th>
                      <th className="p-3 text-right">Valor Previsto (Kz)</th>
                      <th className="p-3">Qualidade</th>
                    </>
                  )}
                  {activeResource === 'custosPesca' && (
                    <>
                      <th className="p-3">ID Viagem</th>
                      <th className="p-3 text-right">Combustível (Kz)</th>
                      <th className="p-3 text-right">Gelo (Kz)</th>
                      <th className="p-3 text-right">Alimentação (Kz)</th>
                      <th className="p-3 text-right">Manutenção (Kz)</th>
                      <th className="p-3 text-right">Taxas (Kz)</th>
                    </>
                  )}
                  {activeResource === 'manutencaoPesca' && (
                    <>
                      <th className="p-3">Embarcação</th>
                      <th className="p-3">Tipo Manutenção</th>
                      <th className="p-3">Descrição</th>
                      <th className="p-3 text-right">Custo (Kz)</th>
                      <th className="p-3">Data</th>
                    </>
                  )}
                  {activeResource === 'comercializacaoPesca' && (
                    <>
                      <th className="p-3">Lote</th>
                      <th className="p-3">Mercado</th>
                      <th className="p-3">Comprador</th>
                      <th className="p-3 text-right">Qtd (kg)</th>
                      <th className="p-3 text-right">Valor Total (Kz)</th>
                      <th className="p-3">Contrato</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {activeResource === 'embarcacoes' && embarcoes.map(e => (
                  <tr key={e.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                    <td className="p-3 font-bold text-gray-900 dark:text-white">{e.nome}</td>
                    <td className="p-3 font-mono text-gray-500">{e.matricula}</td>
                    <td className="p-3 text-right font-mono">{e.capacidade} t</td>
                    <td className="p-3 text-gray-400">{e.motor}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[9px] font-bold">{e.estado}</span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setEmbarcoes(prev => prev.map(x => x.id === e.id ? { ...x, estado: 'Manutenção' } : x));
                          alert('Barco enviado para MANUTENÇÃO no estaleiro.');
                        }}
                        className="text-brand-iris hover:underline cursor-pointer text-[10px] font-bold"
                      >Manutenção</button>
                    </td>
                  </tr>
                ))}

                {activeResource === 'viagens' && viagens.map(v => (
                  <tr key={v.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                    <td className="p-3 font-bold">{v.embarcacao}</td>
                    <td className="p-3 font-mono text-gray-400">{v.dataSaida}</td>
                    <td className="p-3 font-mono text-gray-400">{v.dataChegada}</td>
                    <td className="p-3 text-right font-mono">{v.tripulacao} marinheiros</td>
                    <td className="p-3 text-right font-mono">{v.combustivel} L</td>
                    <td className="p-3 text-brand-iris font-semibold">{v.zonaPesca}</td>
                  </tr>
                ))}

                {activeResource === 'capturas' && capturas.map(cap => (
                  <tr key={cap.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                    <td className="p-3 font-mono text-gray-500">{cap.viagemId}</td>
                    <td className="p-3 font-bold text-gray-900 dark:text-white">{cap.especie}</td>
                    <td className="p-3 text-right font-mono">{cap.quantidade} caixas</td>
                    <td className="p-3 text-right font-mono font-bold text-green-600">+{cap.peso} kg</td>
                    <td className="p-3 text-right font-mono font-black">{cap.valor.toLocaleString()} Kz</td>
                    <td className="p-3 font-semibold text-brand-iris">{cap.qualidade}</td>
                  </tr>
                ))}

                {activeResource === 'custosPesca' && custosPesca.map(cust => (
                  <tr key={cust.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                    <td className="p-3 font-mono text-gray-500">{cust.viagemId}</td>
                    <td className="p-3 text-right font-mono text-red-500">{cust.combustivel.toLocaleString()} Kz</td>
                    <td className="p-3 text-right font-mono text-red-500">{cust.gelo.toLocaleString()} Kz</td>
                    <td className="p-3 text-right font-mono text-red-500">{cust.alimentacao.toLocaleString()} Kz</td>
                    <td className="p-3 text-right font-mono text-red-500">{cust.manutencao.toLocaleString()} Kz</td>
                    <td className="p-3 text-right font-mono text-red-500">{cust.taxas.toLocaleString()} Kz</td>
                  </tr>
                ))}

                {activeResource === 'manutencaoPesca' && manutencaoPesca.map(m => (
                  <tr key={m.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                    <td className="p-3 font-bold">{m.embarcacao}</td>
                    <td className="p-3 text-brand-iris font-semibold">{m.tipo}</td>
                    <td className="p-3 text-gray-500">{m.descricao}</td>
                    <td className="p-3 text-right font-mono text-red-500">-{m.custo.toLocaleString()} Kz</td>
                    <td className="p-3 font-mono text-gray-400">{m.data}</td>
                  </tr>
                ))}

                {activeResource === 'comercializacaoPesca' && comercializacaoPesca.map(cp => (
                  <tr key={cp.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                    <td className="p-3 font-mono text-gray-500">{cp.lote}</td>
                    <td className="p-3 font-bold">{cp.mercado}</td>
                    <td className="p-3 font-semibold text-gray-900 dark:text-white">{cp.comprador}</td>
                    <td className="p-3 text-right font-mono">{cp.quantidade} kg</td>
                    <td className="p-3 text-right font-mono text-green-600 font-bold">+{cp.valor.toLocaleString()} Kz</td>
                    <td className="p-3 text-brand-iris font-bold">{cp.contrato}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-5 bg-gray-50 dark:bg-[#1C1C24] border border-gray-150 dark:border-[#22222E] rounded-2xl">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Plus className="text-brand-iris" size={16} />
            Registar Novo Item: {activeResource.toUpperCase()}
          </h4>
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeResource === 'embarcacoes' && (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nome da Embarcação</label>
                  <input type="text" required value={genericForm.nome || ''} onChange={e => setGenericForm(p => ({ ...p, nome: e.target.value }))} placeholder="Ex: Estrela do Namibe" className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Matrícula da Embarcação</label>
                  <input type="text" required value={genericForm.matricula || ''} onChange={e => setGenericForm(p => ({ ...p, matricula: e.target.value }))} placeholder="Ex: NAM-2024-A" className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Capacidade (Toneladas)</label>
                  <input type="number" step="0.1" required value={genericForm.capacidade || ''} onChange={e => setGenericForm(p => ({ ...p, capacidade: e.target.value }))} placeholder="Ex: 15" className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Marca do Motor</label>
                  <select required value={genericForm.motorBrand || 'Yamaha'} onChange={e => setGenericForm(p => ({ ...p, motorBrand: e.target.value }))} className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white">
                    <option value="Yamaha">Yamaha</option>
                    <option value="Suzuki">Suzuki</option>
                    <option value="Honda">Honda</option>
                    <option value="Mercury">Mercury</option>
                    <option value="Volvo Penta">Volvo Penta</option>
                    <option value="Tohatsu">Tohatsu</option>
                    <option value="Yanmar">Yanmar</option>
                    <option value="Outra">Outra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Potência do Motor (HP) / Detalhes</label>
                  <input type="text" required value={genericForm.motorHP || ''} onChange={e => setGenericForm(p => ({ ...p, motorHP: e.target.value }))} placeholder="Ex: 250HP" className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white" />
                </div>
              </>
            )}

            {activeResource !== 'embarcacoes' && (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Identificador / Nome</label>
                  <input type="text" required value={genericForm.nome || genericForm.identificacao || ''} onChange={e => setGenericForm(p => ({ ...p, nome: e.target.value, identificacao: e.target.value }))} placeholder="Escreva a identificação" className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Quantidade / Valor / Peso</label>
                  <input type="number" step="any" required value={genericForm.quantidade || genericForm.valor || genericForm.peso || ''} onChange={e => setGenericForm(p => ({ ...p, quantidade: e.target.value, valor: e.target.value, peso: e.target.value }))} placeholder="Quantidade ou valor numérico" className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Detalhes / Zona / Comprador</label>
                  <input type="text" value={genericForm.detalhes || genericForm.zonaPesca || genericForm.comprador || ''} onChange={e => setGenericForm(p => ({ ...p, detalhes: e.target.value, zonaPesca: e.target.value, comprador: e.target.value }))} placeholder="Zona de pesca ou comprador" className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white" />
                </div>
              </>
            )}

            <div className="md:col-span-3 flex justify-end">
              <button type="submit" className="px-5 py-2 bg-brand-iris hover:bg-brand-iris-dark text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow cursor-pointer">
                <Plus size={16} />
                <span>Adicionar Registo</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
