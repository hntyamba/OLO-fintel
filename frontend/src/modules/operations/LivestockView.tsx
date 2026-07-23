import React from 'react';
import { Plus } from 'lucide-react';

interface LivestockViewProps {
  userId: string;
  activeResource: string;
  setActiveResource: (r: string) => void;
  genericForm: Record<string, string>;
  setGenericForm: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  rebanho: any[];
  setRebanho: React.Dispatch<React.SetStateAction<any[]>>;
  reproducao: any[];
  setReproducao: React.Dispatch<React.SetStateAction<any[]>>;
  saudeAnimal: any[];
  setSaudeAnimal: React.Dispatch<React.SetStateAction<any[]>>;
  alimentacao: any[];
  setAlimentacao: React.Dispatch<React.SetStateAction<any[]>>;
  crescimento: any[];
  setCrescimento: React.Dispatch<React.SetStateAction<any[]>>;
  producaoAnimal: any[];
  setProducaoAnimal: React.Dispatch<React.SetStateAction<any[]>>;
  comercializacaoPecuaria: any[];
  setComercializacaoPecuaria: React.Dispatch<React.SetStateAction<any[]>>;
  handleFormSubmit: (e: React.FormEvent) => void;
}

export default function LivestockView({
  userId, activeResource, setActiveResource,
  genericForm, setGenericForm,
  rebanho, setRebanho, reproducao, setReproducao,
  saudeAnimal, setSaudeAnimal, alimentacao, setAlimentacao,
  crescimento, setCrescimento, producaoAnimal, setProducaoAnimal,
  comercializacaoPecuaria, setComercializacaoPecuaria, handleFormSubmit,
}: LivestockViewProps) {
  const resourceTabs = [
    { id: 'rebanho', label: 'Rebanho', desc: 'Gado, raças e lotes' },
    { id: 'reproducao', label: 'Reprodução', desc: 'Inseminação e partos' },
    { id: 'saude', label: 'Saúde Animal', desc: 'Tratamentos e vacinação' },
    { id: 'alimentacao', label: 'Alimentação', desc: 'Consumo diário e custos' },
    { id: 'crescimento', label: 'Crescimento', desc: 'Controlo de peso regular' },
    { id: 'producaoAnimal', label: 'Produção Animal', desc: 'Leite, carne e ovos' },
    { id: 'comercializacaoPecuaria', label: 'Comercialização', desc: 'Contratos e vendas' },
  ];

  const getCount = () => {
    if (activeResource === 'rebanho') return rebanho.length;
    if (activeResource === 'reproducao') return reproducao.length;
    if (activeResource === 'saude') return saudeAnimal.length;
    if (activeResource === 'alimentacao') return alimentacao.length;
    if (activeResource === 'crescimento') return crescimento.length;
    if (activeResource === 'producaoAnimal') return producaoAnimal.length;
    if (activeResource === 'comercializacaoPecuaria') return comercializacaoPecuaria.length;
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
              ? 'bg-[#E3A008]/10 text-[#E3A008] border-l-4 border-[#E3A008]'
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
              Histórico de Registos: <span className="text-[#E3A008]">{activeResource.toUpperCase()}</span>
            </h3>
            <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-mono rounded">
              Total: {getCount()} registos
            </span>
          </div>

          <div className="ramp-table-container p-1">
            <table className="ramp-table">
              <thead>
                <tr className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                  {activeResource === 'rebanho' && (
                    <>
                      <th className="p-3">Identificação</th>
                      <th className="p-3">Raça</th>
                      <th className="p-3">Sexo</th>
                      <th className="p-3">Data Nasc.</th>
                      <th className="p-3 text-right">Peso (kg)</th>
                      <th className="p-3">Lote</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3 text-right">Ações</th>
                    </>
                  )}
                  {activeResource === 'reproducao' && (
                    <>
                      <th className="p-3">Tipo</th>
                      <th className="p-3">Vaca ID</th>
                      <th className="p-3">Touro ID</th>
                      <th className="p-3">Data</th>
                      <th className="p-3">Resultado</th>
                      <th className="p-3">Estado</th>
                    </>
                  )}
                  {activeResource === 'saude' && (
                    <>
                      <th className="p-3">ID Animal</th>
                      <th className="p-3">Tipo</th>
                      <th className="p-3">Descrição</th>
                      <th className="p-3">Medicamento</th>
                      <th className="p-3 text-right">Custo (Kz)</th>
                      <th className="p-3">Data</th>
                    </>
                  )}
                  {activeResource === 'alimentacao' && (
                    <>
                      <th className="p-3">Lote</th>
                      <th className="p-3">Tipo Alimentação</th>
                      <th className="p-3 text-right">Consumo Diário (kg)</th>
                      <th className="p-3 text-right">Custo Diário (Kz)</th>
                    </>
                  )}
                  {activeResource === 'crescimento' && (
                    <>
                      <th className="p-3">ID Animal</th>
                      <th className="p-3 text-right">Peso (kg)</th>
                      <th className="p-3 text-right">Altura (cm)</th>
                      <th className="p-3 text-right">Ganho Diário</th>
                      <th className="p-3">Data Registo</th>
                    </>
                  )}
                  {activeResource === 'producaoAnimal' && (
                    <>
                      <th className="p-3">Produto</th>
                      <th className="p-3 text-right">Quantidade</th>
                      <th className="p-3">Unidade</th>
                      <th className="p-3">Responsável</th>
                      <th className="p-3">Data</th>
                    </>
                  )}
                  {activeResource === 'comercializacaoPecuaria' && (
                    <>
                      <th className="p-3">Tipo</th>
                      <th className="p-3">Cliente</th>
                      <th className="p-3">Descrição</th>
                      <th className="p-3 text-right">Valor (Kz)</th>
                      <th className="p-3">Data</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {activeResource === 'rebanho' && rebanho.map(g => (
                  <tr key={g.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                    <td className="p-3 font-mono text-brand-iris font-bold">{g.identificacao}</td>
                    <td className="p-3 font-semibold text-gray-900 dark:text-white">{g.raca}</td>
                    <td className="p-3">{g.sexo}</td>
                    <td className="p-3 font-mono text-gray-400">{g.dataNascimento}</td>
                    <td className="p-3 text-right font-mono font-bold">{g.peso} kg</td>
                    <td className="p-3 text-gray-500">{g.lote}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[9px] font-bold">{g.estado}</span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          const newLote = prompt('Escreva o novo lote para este gado:', g.lote);
                          if (newLote) {
                            setRebanho(prev => prev.map(x => x.id === g.id ? { ...x, lote: newLote } : x));
                            alert('Gado transferido para o novo lote!');
                          }
                        }}
                        className="text-brand-iris hover:underline cursor-pointer"
                      >Transferir Lote</button>
                    </td>
                  </tr>
                ))}

                {activeResource === 'reproducao' && reproducao.map(rep => (
                  <tr key={rep.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                    <td className="p-3 font-bold">{rep.tipo}</td>
                    <td className="p-3 font-mono text-gray-500">{rep.vacaId}</td>
                    <td className="p-3 font-mono text-gray-500">{rep.touroId}</td>
                    <td className="p-3 font-mono text-gray-400">{rep.data}</td>
                    <td className="p-3 font-bold text-green-600">{rep.resultado}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-brand-iris/10 text-brand-iris rounded text-[9px] font-bold">{rep.estado}</span>
                    </td>
                  </tr>
                ))}

                {activeResource === 'saude' && saudeAnimal.map(s => (
                  <tr key={s.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                    <td className="p-3 font-mono text-gray-500">{s.animalId}</td>
                    <td className="p-3 font-bold">{s.tipo}</td>
                    <td className="p-3 text-gray-500">{s.descricao}</td>
                    <td className="p-3">{s.medicamento}</td>
                    <td className="p-3 text-right font-mono text-red-500">-{s.custo.toLocaleString()} Kz</td>
                    <td className="p-3 font-mono text-gray-400">{s.data}</td>
                  </tr>
                ))}

                {activeResource === 'alimentacao' && alimentacao.map(a => (
                  <tr key={a.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                    <td className="p-3 font-bold">{a.lote}</td>
                    <td className="p-3">{a.tipo}</td>
                    <td className="p-3 text-right font-mono font-bold">{a.consumoDiario} kg</td>
                    <td className="p-3 text-right font-mono text-amber-600">{a.custo.toLocaleString()} Kz</td>
                  </tr>
                ))}

                {activeResource === 'crescimento' && crescimento.map(cr => (
                  <tr key={cr.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                    <td className="p-3 font-mono">{cr.animalId}</td>
                    <td className="p-3 text-right font-mono font-bold">{cr.peso} kg</td>
                    <td className="p-3 text-right font-mono">{cr.altura} cm</td>
                    <td className="p-3 text-right text-green-500 font-bold font-mono">+{cr.ganhoDiario} kg/dia</td>
                    <td className="p-3 font-mono text-gray-400">{cr.data}</td>
                  </tr>
                ))}

                {activeResource === 'producaoAnimal' && producaoAnimal.map(pa => (
                  <tr key={pa.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                    <td className="p-3 font-bold">{pa.produto}</td>
                    <td className="p-3 text-right font-mono font-bold">+{pa.quantidade}</td>
                    <td className="p-3">{pa.unidade}</td>
                    <td className="p-3 text-gray-500">{pa.responsavel}</td>
                    <td className="p-3 font-mono text-gray-400">{pa.data}</td>
                  </tr>
                ))}

                {activeResource === 'comercializacaoPecuaria' && comercializacaoPecuaria.map(cp => (
                  <tr key={cp.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                    <td className="p-3 font-bold text-amber-600">{cp.tipo}</td>
                    <td className="p-3 font-semibold text-gray-900 dark:text-white">{cp.cliente}</td>
                    <td className="p-3 text-gray-400">{cp.descricao}</td>
                    <td className="p-3 text-right font-mono font-bold text-green-600">+{cp.valor.toLocaleString()} Kz</td>
                    <td className="p-3 font-mono text-gray-400">{cp.data}</td>
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
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Identificador / Nome</label>
              <input type="text" required value={genericForm.nome || genericForm.identificacao || ''} onChange={e => setGenericForm(p => ({ ...p, nome: e.target.value, identificacao: e.target.value }))} placeholder="Escreva a identificação" className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Quantidade / Peso / Valor</label>
              <input type="number" step="any" required value={genericForm.quantidade || genericForm.valor || genericForm.peso || ''} onChange={e => setGenericForm(p => ({ ...p, quantidade: e.target.value, valor: e.target.value, peso: e.target.value }))} placeholder="Quantidade ou valor numérico" className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Detalhes / Lote / Responsável</label>
              <input type="text" value={genericForm.detalhes || genericForm.lote || genericForm.responsavel || genericForm.cliente || ''} onChange={e => setGenericForm(p => ({ ...p, detalhes: e.target.value, lote: e.target.value, responsavel: e.target.value, cliente: e.target.value }))} placeholder="Lote, Cliente ou Responsável" className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white" />
            </div>
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
