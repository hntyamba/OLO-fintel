import React from 'react';
import {
  Sprout,
  Plus,
  CloudSun,
  FileSpreadsheet,
} from 'lucide-react';

interface AgricultureViewProps {
  userId: string;
  activeResource: string;
  setActiveResource: (r: string) => void;
  genericForm: Record<string, string>;
  setGenericForm: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  talhoes: any[];
  setTalhoes: React.Dispatch<React.SetStateAction<any[]>>;
  culturas: any[];
  setCulturas: React.Dispatch<React.SetStateAction<any[]>>;
  producoes: any[];
  setProducoes: React.Dispatch<React.SetStateAction<any[]>>;
  colheitas: any[];
  setColheitas: React.Dispatch<React.SetStateAction<any[]>>;
  insumos: any[];
  setInsumos: React.Dispatch<React.SetStateAction<any[]>>;
  equipamentos: any[];
  setEquipamentos: React.Dispatch<React.SetStateAction<any[]>>;
  clima: any[];
  setClima: React.Dispatch<React.SetStateAction<any[]>>;
  handleFormSubmit: (e: React.FormEvent) => void;
}

export default function AgricultureView({
  userId, activeResource, setActiveResource,
  genericForm, setGenericForm,
  talhoes, setTalhoes, culturas, setCulturas,
  producoes, setProducoes, colheitas, setColheitas,
  insumos, setInsumos, equipamentos, setEquipamentos,
  clima, setClima, handleFormSubmit,
}: AgricultureViewProps) {
  const resourceTabs = [
    { id: 'talhoes', label: 'Talões', desc: 'Solares, solos e áreas' },
    { id: 'culturas', label: 'Culturas', desc: 'Ciclos de plantio ativos' },
    { id: 'producao', label: 'Produção', desc: 'Registos periódicos' },
    { id: 'colheitas', label: 'Colheitas', desc: 'Datas, perdas e volumes' },
    { id: 'insumos', label: 'Insumos', desc: 'Sementes, fertilizantes, etc' },
    { id: 'equipamentos', label: 'Equipamentos', desc: 'Tratores e manutenção' },
    { id: 'clima', label: 'Clima', desc: 'Temperatura e alertas' },
    { id: 'indicadores', label: 'Indicadores', desc: 'Análise de produtividade' },
  ];

  const getCount = () => {
    if (activeResource === 'talhoes') return talhoes.length;
    if (activeResource === 'culturas') return culturas.length;
    if (activeResource === 'producao') return producoes.length;
    if (activeResource === 'colheitas') return colheitas.length;
    if (activeResource === 'insumos') return insumos.length;
    if (activeResource === 'equipamentos') return equipamentos.length;
    if (activeResource === 'clima') return clima.length;
    return 0;
  };

  return (
    <>
      {/* Sidebar tabs */}
      {resourceTabs.map(item => (
        <button
          key={item.id}
          onClick={() => {
            setActiveResource(item.id);
            localStorage.setItem(`olo-fintel-lastResource-${userId}`, item.id);
          }}
          className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex flex-col gap-0.5 ${
            activeResource === item.id
              ? 'bg-brand-iris/10 text-brand-iris border-l-4 border-brand-iris'
              : 'hover:bg-gray-50 dark:hover:bg-[#1C1C24] text-gray-700 dark:text-gray-300'
          }`}
        >
          <span className="text-xs font-bold">{item.label}</span>
          <span className="text-[9px] text-gray-400 leading-none">{item.desc}</span>
        </button>
      ))}

      {/* Content panel */}
      <div className="lg:col-span-9 space-y-6">
        {/* Weather forecast card (only for CLIMA) */}
        {activeResource === 'clima' && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-brand-iris/10 border border-brand-iris/20 text-gray-800 dark:text-gray-200">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-brand-iris text-white rounded-2xl">
                  <CloudSun size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Estação Agro-Metereológica</h4>
                  <p className="text-[10px] text-gray-400">Tempo real & Correlações agroclimáticas</p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 bg-[#E3A008]/20 text-[#E3A008] text-[9px] font-bold rounded-lg border border-[#E3A008]/30">
                  ALERTA: Geada Leve Prevista
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              <div className="p-3 bg-white dark:bg-[#1A1A24] rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Temperatura</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">24.5 °C</p>
              </div>
              <div className="p-3 bg-white dark:bg-[#1A1A24] rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Precipitação</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">1.2 mm</p>
              </div>
              <div className="p-3 bg-white dark:bg-[#1A1A24] rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Humidade Ar</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">62%</p>
              </div>
              <div className="p-3 bg-white dark:bg-[#1A1A24] rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Vento</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">14.5 km/h</p>
              </div>
            </div>
            <div className="bg-white dark:bg-[#1A1A24] rounded-xl p-3 border border-gray-100 dark:border-gray-800 mt-4 flex items-center gap-2 text-xs">
              <span className="font-bold text-brand-iris">Correlação Clima-Produção:</span>
              <span className="text-gray-500">A precipitação acumulada este mês está 8% acima da média histórica, favorecendo a cultura de Milho (Talhão Alfa).</span>
            </div>
          </div>
        )}

        {/* Production Indicators tab */}
        {activeResource === 'indicadores' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white dark:bg-[#1C1C24] border border-gray-150 dark:border-gray-800 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Produtividade por Hectare</p>
                <p className="text-xl font-black text-gray-900 dark:text-white mt-1">450 kg/ha</p>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-[9px] text-green-500 font-semibold mt-1 block">▲ +12% vs ano transato</span>
              </div>

              <div className="p-4 bg-white dark:bg-[#1C1C24] border border-gray-150 dark:border-gray-800 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Produtividade por Cultura</p>
                <div className="mt-2 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Milho Branco</span>
                    <span className="font-bold text-gray-900 dark:text-white">5,000 kg</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Batata Doce</span>
                    <span className="font-bold text-gray-900 dark:text-white">3,000 kg</span>
                  </div>
                </div>
                <span className="text-[9px] text-gray-400 mt-2 block">Total acumulado: 8,000 kg colhidos</span>
              </div>

              <div className="p-4 bg-white dark:bg-[#1C1C24] border border-gray-150 dark:border-gray-800 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Produtividade por Período</p>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-gray-400 w-6">Q1:</span>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full">
                      <div className="bg-brand-iris h-full rounded-full" style={{ width: '42%' }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">4.2t</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-gray-400 w-6">Q2:</span>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full">
                      <div className="bg-brand-iris h-full rounded-full" style={{ width: '51%' }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">5.1t</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-gray-400 w-6">Q3:</span>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full">
                      <div className="bg-brand-iris h-full rounded-full" style={{ width: '68%' }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">6.8t</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-[#1C1C24] border border-gray-150 dark:border-gray-800 rounded-2xl flex flex-col md:flex-row items-center gap-4 justify-between">
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Exportar Relatório Operacional</h4>
                <p className="text-[11px] text-gray-400 mt-1">Gere um ficheiro Excel ou CSV com todo o histórico agroclimático e de produção.</p>
              </div>
              <button
                onClick={() => alert('Ficheiro baixado com sucesso no formato Excel.')}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <FileSpreadsheet size={16} />
                <span>Exportar Planilha</span>
              </button>
            </div>
          </div>
        )}

        {/* Metric Cards and Operational Workspace */}
        {activeResource !== 'indicadores' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1C1C24] border border-gray-150 dark:border-[#22222E] rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-gray-100 dark:border-[#22222E] flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                  Histórico de Registos: <span className="text-brand-iris">{activeResource.toUpperCase()}</span>
                </h3>
                <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-mono rounded">
                  Total: {getCount()} registos
                </span>
              </div>

              <div className="ramp-table-container p-1">
                <table className="ramp-table">
                  <thead>
                    <tr className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                      {activeResource === 'talhoes' && (
                        <>
                          <th className="p-3">Código</th>
                          <th className="p-3">Nome</th>
                          <th className="p-3">Área (ha)</th>
                          <th className="p-3">Solo</th>
                          <th className="p-3">GPS</th>
                          <th className="p-3">Responsável</th>
                          <th className="p-3">Estado</th>
                          <th className="p-3 text-right">Ações</th>
                        </>
                      )}
                      {activeResource === 'culturas' && (
                        <>
                          <th className="p-3">Cultura</th>
                          <th className="p-3">Variedade</th>
                          <th className="p-3">Talhão</th>
                          <th className="p-3 text-right">Quantidade (un)</th>
                          <th className="p-3">Plantio</th>
                          <th className="p-3">Colheita Prev.</th>
                          <th className="p-3">Estado</th>
                          <th className="p-3 text-right">Ações</th>
                        </>
                      )}
                      {activeResource === 'producao' && (
                        <>
                          <th className="p-3">Produto</th>
                          <th className="p-3 text-right">Quantidade</th>
                          <th className="p-3">Qualidade</th>
                          <th className="p-3">Talhão</th>
                          <th className="p-3">Responsável</th>
                          <th className="p-3">Período</th>
                        </>
                      )}
                      {activeResource === 'colheitas' && (
                        <>
                          <th className="p-3">Data</th>
                          <th className="p-3">Talhão</th>
                          <th className="p-3">Produto</th>
                          <th className="p-3 text-right">Qtd Colhida (kg)</th>
                          <th className="p-3 text-right">Perdas (kg)</th>
                          <th className="p-3">Observações</th>
                        </>
                      )}
                      {activeResource === 'insumos' && (
                        <>
                          <th className="p-3">Insumo</th>
                          <th className="p-3">Categoria</th>
                          <th className="p-3 text-right">Quantidade</th>
                          <th className="p-3">Unidade</th>
                          <th className="p-3">Movimento</th>
                        </>
                      )}
                      {activeResource === 'equipamentos' && (
                        <>
                          <th className="p-3">Equipamento</th>
                          <th className="p-3">Tipo</th>
                          <th className="p-3">Estado</th>
                          <th className="p-3 text-right">Combustível</th>
                          <th className="p-3">Próxima Manutenção</th>
                          <th className="p-3 text-right">Ações</th>
                        </>
                      )}
                      {activeResource === 'clima' && (
                        <>
                          <th className="p-3">Data</th>
                          <th className="p-3 text-right">Temperatura</th>
                          <th className="p-3 text-right">Precipitação</th>
                          <th className="p-3 text-right">Humidade</th>
                          <th className="p-3 text-right">Vento</th>
                          <th className="p-3">Alertas</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {activeResource === 'talhoes' && talhoes.map(t => (
                      <tr key={t.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                        <td className="p-3 font-mono text-gray-500 font-bold">{t.codigo}</td>
                        <td className="p-3 font-semibold text-gray-900 dark:text-white">{t.nome}</td>
                        <td className="p-3 font-mono">{t.area} ha</td>
                        <td className="p-3">{t.tipoSolo}</td>
                        <td className="p-3 text-gray-400 font-mono text-[10px]">{t.gps}</td>
                        <td className="p-3 text-gray-500">{t.responsavel}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            t.estado === 'Ativo' ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' :
                            t.estado === 'Arquivado' ? 'bg-gray-100 text-gray-500' : 'bg-amber-100 text-amber-700'
                          }`}>{t.estado}</span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              const newResp = prompt('Nome do novo responsável para o talhão:', t.responsavel);
                              if (newResp) {
                                setTalhoes(prev => prev.map(x => x.id === t.id ? { ...x, responsavel: newResp } : x));
                                alert('Responsável transferido com sucesso!');
                              }
                            }}
                            className="text-brand-iris hover:underline cursor-pointer"
                          >Transferir</button>
                          <button
                            onClick={() => {
                              setTalhoes(prev => prev.map(x => x.id === t.id ? { ...x, estado: 'Arquivado' } : x));
                              alert('Talhão arquivado com sucesso!');
                            }}
                            className="text-red-500 hover:underline cursor-pointer"
                          >Arquivar</button>
                        </td>
                      </tr>
                    ))}

                    {activeResource === 'culturas' && culturas.map(c => (
                      <tr key={c.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                        <td className="p-3 font-bold text-gray-900 dark:text-white">{c.cultura}</td>
                        <td className="p-3 text-gray-500">{c.variedade}</td>
                        <td className="p-3">{c.talhao}</td>
                        <td className="p-3 text-right font-mono">{c.quantidade.toLocaleString()}</td>
                        <td className="p-3 font-mono text-gray-400">{c.dataPlantio}</td>
                        <td className="p-3 font-mono text-gray-400">{c.dataColheitaPrevista}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 rounded text-[9px] font-bold">{c.estado}</span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setCulturas(prev => prev.map(x => x.id === c.id ? { ...x, estado: 'Ciclo Finalizado', dataColheitaPrevista: 'Colhido Hoje' } : x));
                              alert('Ciclo finalizado com sucesso!');
                            }}
                            className="text-green-600 hover:underline cursor-pointer"
                          >Finalizar Ciclo</button>
                          <button
                            onClick={() => {
                              setCulturas(prev => prev.filter(x => x.id !== c.id));
                              alert('Ciclo de plantio cancelado.');
                            }}
                            className="text-red-500 hover:underline cursor-pointer"
                          >Cancelar</button>
                        </td>
                      </tr>
                    ))}

                    {activeResource === 'producao' && producoes.map(p => (
                      <tr key={p.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                        <td className="p-3 font-semibold text-gray-900 dark:text-white">{p.produto}</td>
                        <td className="p-3 text-right font-mono font-bold">{p.quantidade}</td>
                        <td className="p-3 font-mono">{p.unidade}</td>
                        <td className="p-3">{p.qualidade}</td>
                        <td className="p-3">{p.talhao}</td>
                        <td className="p-3 text-gray-500">{p.responsavel}</td>
                        <td className="p-3 font-bold text-brand-iris">{p.periodo}</td>
                      </tr>
                    ))}

                    {activeResource === 'colheitas' && colheitas.map(col => (
                      <tr key={col.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                        <td className="p-3 font-mono text-gray-400">{col.data}</td>
                        <td className="p-3 font-semibold text-gray-900 dark:text-white">{col.talhao}</td>
                        <td className="p-3">{col.produto}</td>
                        <td className="p-3 text-right font-mono font-bold text-green-600">+{col.quantidade} kg</td>
                        <td className="p-3 text-right font-mono text-red-500">-{col.perdas} kg</td>
                        <td className="p-3 text-gray-500 italic">{col.observacoes}</td>
                      </tr>
                    ))}

                    {activeResource === 'insumos' && insumos.map(ins => (
                      <tr key={ins.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                        <td className="p-3 font-bold text-gray-900 dark:text-white">{ins.nome}</td>
                        <td className="p-3 text-gray-500">{ins.categoria}</td>
                        <td className="p-3 text-right font-mono">{ins.quantidade}</td>
                        <td className="p-3 font-mono">{ins.unidade}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            ins.movimento === 'Entrada' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>{ins.movimento}</span>
                        </td>
                      </tr>
                    ))}

                    {activeResource === 'equipamentos' && equipamentos.map(eq => (
                      <tr key={eq.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                        <td className="p-3 font-bold text-gray-900 dark:text-white">{eq.nome}</td>
                        <td className="p-3 text-gray-500">{eq.tipo}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            eq.estado === 'Operacional' ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' :
                            eq.estado === 'Avaria' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>{eq.estado}</span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="font-mono">{eq.combustivel}%</span>
                            <div className="w-12 bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                              <div className={`h-full ${eq.combustivel < 25 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${eq.combustivel}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-gray-400">{eq.proximaManutencao}</td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEquipamentos(prev => prev.map(x => x.id === eq.id ? { ...x, proximaManutencao: '2026-08-30', estado: 'Operacional' } : x));
                              alert('Manutenção agendada e registada com sucesso!');
                            }}
                            className="text-brand-iris hover:underline cursor-pointer"
                          >Manutenção</button>
                          <button
                            onClick={() => {
                              setEquipamentos(prev => prev.map(x => x.id === eq.id ? { ...x, estado: 'Avaria' } : x));
                              alert('Estado do trator alterado para AVARIA.');
                            }}
                            className="text-red-500 hover:underline cursor-pointer"
                          >Avaria</button>
                        </td>
                      </tr>
                    ))}

                    {activeResource === 'clima' && clima.map(cl => (
                      <tr key={cl.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                        <td className="p-3 font-mono text-gray-400">{cl.data}</td>
                        <td className="p-3 text-right font-mono">{cl.temperatura} °C</td>
                        <td className="p-3 text-right font-mono">{cl.precipitacao} mm</td>
                        <td className="p-3 text-right font-mono">{cl.humidade} %</td>
                        <td className="p-3 text-right font-mono">{cl.vento} km/h</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-bold">{cl.alertas}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Inline Form to Add Record */}
            <div className="p-5 bg-gray-50 dark:bg-[#1C1C24] border border-gray-150 dark:border-[#22222E] rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Plus className="text-brand-iris" size={16} />
                Registar Novo Item: {activeResource.toUpperCase()}
              </h4>

              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeResource === 'talhoes' && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nome do Talhão</label>
                      <input type="text" required value={genericForm.nome || ''} onChange={e => setGenericForm(p => ({ ...p, nome: e.target.value }))} placeholder="Ex: Talhão Gama" className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Área (ha)</label>
                      <input type="number" step="0.01" required value={genericForm.area || ''} onChange={e => setGenericForm(p => ({ ...p, area: e.target.value }))} placeholder="Ex: 5.5" className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Coordenadas GPS</label>
                      <input type="text" value={genericForm.gps || ''} onChange={e => setGenericForm(p => ({ ...p, gps: e.target.value }))} placeholder="Ex: -12.34, 13.56" className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Tipo de Solo</label>
                      <input type="text" value={genericForm.tipoSolo || ''} onChange={e => setGenericForm(p => ({ ...p, tipoSolo: e.target.value }))} placeholder="Ex: Arenoso, Calcário" className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Responsável</label>
                      <input type="text" value={genericForm.responsavel || ''} onChange={e => setGenericForm(p => ({ ...p, responsavel: e.target.value }))} placeholder="Ex: Mateus Gaspar" className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white" />
                    </div>
                  </>
                )}

                {activeResource === 'culturas' && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Cultura</label>
                      <input type="text" required value={genericForm.cultura || ''} onChange={e => setGenericForm(p => ({ ...p, cultura: e.target.value }))} placeholder="Ex: Soja, Milho" className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Variedade</label>
                      <input type="text" value={genericForm.variedade || ''} onChange={e => setGenericForm(p => ({ ...p, variedade: e.target.value }))} placeholder="Ex: Kambeta" className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Quantidade Plantada</label>
                      <input type="number" required value={genericForm.quantidade || ''} onChange={e => setGenericForm(p => ({ ...p, quantidade: e.target.value }))} placeholder="Ex: 5000" className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Data Plantio</label>
                      <input type="date" value={genericForm.dataPlantio || ''} onChange={e => setGenericForm(p => ({ ...p, dataPlantio: e.target.value }))} className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Talhão</label>
                      <input type="text" value={genericForm.talhao || ''} onChange={e => setGenericForm(p => ({ ...p, talhao: e.target.value }))} placeholder="Ex: Talhão Alfa" className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white" />
                    </div>
                  </>
                )}

                {!(activeResource === 'talhoes' || activeResource === 'culturas') && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Identificador / Nome</label>
                      <input type="text" required value={genericForm.nome || genericForm.identificacao || genericForm.produto || ''} onChange={e => setGenericForm(p => ({ ...p, nome: e.target.value, identificacao: e.target.value, produto: e.target.value }))} placeholder="Escreva a identificação" className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Quantidade / Valor / Área</label>
                      <input type="number" step="any" required value={genericForm.quantidade || genericForm.valor || ''} onChange={e => setGenericForm(p => ({ ...p, quantidade: e.target.value, valor: e.target.value }))} placeholder="Quantidade ou valor numérico" className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Detalhes Adicionais</label>
                      <input type="text" value={genericForm.detalhes || genericForm.responsavel || ''} onChange={e => setGenericForm(p => ({ ...p, detalhes: e.target.value, responsavel: e.target.value }))} placeholder="Responsável ou detalhes" className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white" />
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
        )}
      </div>
    </>
  );
}
