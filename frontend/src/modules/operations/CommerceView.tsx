import React from 'react';
import { Plus } from 'lucide-react';

interface CommerceViewProps {
  userId: string;
  activeResource: string;
  setActiveResource: (r: string) => void;
  genericForm: Record<string, string>;
  setGenericForm: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  produtos: any[];
  setProdutos: React.Dispatch<React.SetStateAction<any[]>>;
  inventario: any[];
  setInventario: React.Dispatch<React.SetStateAction<any[]>>;
  compras: any[];
  setCompras: React.Dispatch<React.SetStateAction<any[]>>;
  vendas: any[];
  setVendas: React.Dispatch<React.SetStateAction<any[]>>;
  crm: any[];
  setCrm: React.Dispatch<React.SetStateAction<any[]>>;
  contasAReceber: any[];
  setContasAReceber: React.Dispatch<React.SetStateAction<any[]>>;
  contasAPagar: any[];
  setContasAPagar: React.Dispatch<React.SetStateAction<any[]>>;
  handleFormSubmit: (e: React.FormEvent) => void;
}

export default function CommerceView({
  userId, activeResource, setActiveResource,
  genericForm, setGenericForm,
  produtos, setProdutos, inventario, setInventario,
  compras, setCompras, vendas, setVendas,
  crm, setCrm, contasAReceber, setContasAReceber,
  contasAPagar, setContasAPagar, handleFormSubmit,
}: CommerceViewProps) {
  const resourceTabs = [
    { id: 'produtos', label: 'Produtos', desc: 'SKU, compras e vendas' },
    { id: 'inventario', label: 'Inventário', desc: 'Stocks e movimentos' },
    { id: 'compras', label: 'Compras PMEs', desc: 'Ciclo completo de pedidos' },
    { id: 'vendas', label: 'Vendas PMEs', desc: 'Faturação e entrega' },
    { id: 'crm', label: 'CRM', desc: 'Leads, clientes e parceiros' },
    { id: 'contasAReceber', label: 'Contas a Receber', desc: 'Faturas e parcelas' },
    { id: 'contasAPagar', label: 'Contas a Pagar', desc: 'Obrigações e prazos' },
  ];

  const getCount = () => {
    if (activeResource === 'produtos') return produtos.length;
    if (activeResource === 'inventario') return inventario.length;
    if (activeResource === 'compras') return compras.length;
    if (activeResource === 'vendas') return vendas.length;
    if (activeResource === 'crm') return crm.length;
    if (activeResource === 'contasAReceber') return contasAReceber.length;
    if (activeResource === 'contasAPagar') return contasAPagar.length;
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
              ? 'bg-[#3F83F8]/10 text-[#3F83F8] border-l-4 border-[#3F83F8]'
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
              Histórico de Registos: <span className="text-[#3F83F8]">{activeResource.toUpperCase()}</span>
            </h3>
            <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-mono rounded">
              Total: {getCount()} registos
            </span>
          </div>

          <div className="ramp-table-container p-1">
            <table className="ramp-table">
              <thead>
                <tr className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                  {activeResource === 'produtos' && (
                    <>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Código</th>
                      <th className="p-3">Categoria</th>
                      <th className="p-3">Fornecedor</th>
                      <th className="p-3 text-right">Preço Compra</th>
                      <th className="p-3 text-right">Preço Venda</th>
                      <th className="p-3 text-right">Estoque</th>
                    </>
                  )}
                  {activeResource === 'inventario' && (
                    <>
                      <th className="p-3">ID Produto</th>
                      <th className="p-3">Movimento</th>
                      <th className="p-3 text-right">Quantidade</th>
                      <th className="p-3">Data</th>
                      <th className="p-3">Responsável</th>
                    </>
                  )}
                  {activeResource === 'compras' && (
                    <>
                      <th className="p-3">ID</th>
                      <th className="p-3">Pedido</th>
                      <th className="p-3">Fornecedor</th>
                      <th className="p-3 text-right">Valor (Kz)</th>
                      <th className="p-3">Data</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3 text-right">Ações</th>
                    </>
                  )}
                  {activeResource === 'vendas' && (
                    <>
                      <th className="p-3">ID</th>
                      <th className="p-3">Orçamento</th>
                      <th className="p-3">Cliente</th>
                      <th className="p-3 text-right">Valor (Kz)</th>
                      <th className="p-3">Data</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3 text-right">Ações</th>
                    </>
                  )}
                  {activeResource === 'crm' && (
                    <>
                      <th className="p-3">Nome do Cliente</th>
                      <th className="p-3">Tipo</th>
                      <th className="p-3">Contacto</th>
                      <th className="p-3">E-mail</th>
                      <th className="p-3">Status</th>
                    </>
                  )}
                  {activeResource === 'contasAReceber' && (
                    <>
                      <th className="p-3">Fatura</th>
                      <th className="p-3">Cliente</th>
                      <th className="p-3">Parcelas</th>
                      <th className="p-3 text-right">Valor (Kz)</th>
                      <th className="p-3">Vencimento</th>
                      <th className="p-3">Estado</th>
                    </>
                  )}
                  {activeResource === 'contasAPagar' && (
                    <>
                      <th className="p-3">Fornecedor</th>
                      <th className="p-3">Despesa</th>
                      <th className="p-3">Obrigações</th>
                      <th className="p-3 text-right">Valor (Kz)</th>
                      <th className="p-3">Vencimento</th>
                      <th className="p-3">Estado</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {activeResource === 'produtos' && produtos.map(p => (
                  <tr key={p.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                    <td className="p-3 font-mono text-gray-500">{p.sku}</td>
                    <td className="p-3 font-mono font-bold text-brand-iris">{p.codigo}</td>
                    <td className="p-3">{p.categoria}</td>
                    <td className="p-3 text-gray-500">{p.fornecedor}</td>
                    <td className="p-3 text-right font-mono text-red-500">{p.precoCompra.toLocaleString()} Kz</td>
                    <td className="p-3 text-right font-mono text-green-600 font-bold">{p.precoVenda.toLocaleString()} Kz</td>
                    <td className="p-3 text-right font-mono font-black">{p.estoque} un</td>
                  </tr>
                ))}

                {activeResource === 'inventario' && inventario.map(i => (
                  <tr key={i.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                    <td className="p-3 font-mono text-gray-500">{i.produtoId}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        i.tipo === 'Entrada' ? 'bg-green-105 text-green-700' : 'bg-red-105 text-red-700'
                      }`}>{i.tipo}</span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold">{i.quantidade}</td>
                    <td className="p-3 font-mono text-gray-400">{i.data}</td>
                    <td className="p-3 text-gray-500">{i.responsavel}</td>
                  </tr>
                ))}

                {activeResource === 'compras' && compras.map(c => (
                  <tr key={c.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                    <td className="p-3 font-mono text-gray-400 text-[10px]">{c.id}</td>
                    <td className="p-3 font-bold">{c.pedido}</td>
                    <td className="p-3 font-semibold text-gray-900 dark:text-white">{c.fornecedor}</td>
                    <td className="p-3 text-right font-mono text-red-500">-{c.valor.toLocaleString()} Kz</td>
                    <td className="p-3 font-mono text-gray-400">{c.data}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-bold">{c.estado}</span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {c.estado === 'Pedido' && (
                        <button
                          onClick={() => {
                            setCompras(prev => prev.map(x => x.id === c.id ? { ...x, estado: 'Aprovação' } : x));
                            alert('Pedido de compra aprovado com sucesso!');
                          }}
                          className="text-brand-iris hover:underline cursor-pointer"
                        >Aprovar</button>
                      )}
                      {c.estado === 'Aprovação' && (
                        <button
                          onClick={() => {
                            setCompras(prev => prev.map(x => x.id === c.id ? { ...x, estado: 'Receção' } : x));
                            alert('Mercadorias dadas como recebidas em estoque!');
                          }}
                          className="text-green-600 hover:underline cursor-pointer"
                        >Receber</button>
                      )}
                    </td>
                  </tr>
                ))}

                {activeResource === 'vendas' && vendas.map(v => (
                  <tr key={v.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                    <td className="p-3 font-mono text-gray-400 text-[10px]">{v.id}</td>
                    <td className="p-3 font-bold">{v.orcamento}</td>
                    <td className="p-3 font-semibold text-gray-900 dark:text-white">{v.cliente}</td>
                    <td className="p-3 text-right font-mono text-green-600 font-bold">+{v.valor.toLocaleString()} Kz</td>
                    <td className="p-3 font-mono text-gray-400">{v.data}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-bold">{v.estado}</span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {v.estado === 'Orçamento' && (
                        <button
                          onClick={() => {
                            setVendas(prev => prev.map(x => x.id === v.id ? { ...x, estado: 'Pedido' } : x));
                            alert('Orçamento aprovado e convertido em Pedido!');
                          }}
                          className="text-brand-iris hover:underline cursor-pointer"
                        >Aprovar</button>
                      )}
                      {v.estado === 'Pedido' && (
                        <button
                          onClick={() => {
                            setVendas(prev => prev.map(x => x.id === v.id ? { ...x, estado: 'Fatura' } : x));
                            alert('Fatura emitida com sucesso!');
                          }}
                          className="text-green-600 hover:underline cursor-pointer"
                        >Faturar</button>
                      )}
                    </td>
                  </tr>
                ))}

                {activeResource === 'crm' && crm.map(cl => (
                  <tr key={cl.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                    <td className="p-3 font-bold text-gray-900 dark:text-white">{cl.nome}</td>
                    <td className="p-3 font-semibold text-brand-iris">{cl.tipo}</td>
                    <td className="p-3 font-mono">{cl.contacto}</td>
                    <td className="p-3 text-gray-500">{cl.email}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-green-105 text-green-700 rounded text-[9px] font-bold">{cl.status}</span>
                    </td>
                  </tr>
                ))}

                {activeResource === 'contasAReceber' && contasAReceber.map(cr => (
                  <tr key={cr.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                    <td className="p-3 font-bold">{cr.fatura}</td>
                    <td className="p-3 font-semibold text-gray-900 dark:text-white">{cr.cliente}</td>
                    <td className="p-3 font-mono">{cr.parcelas}</td>
                    <td className="p-3 text-right font-mono font-bold text-green-600">+{cr.valor.toLocaleString()} Kz</td>
                    <td className="p-3 font-mono text-gray-400">{cr.dataVencimento}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-bold">{cr.estado}</span>
                    </td>
                  </tr>
                ))}

                {activeResource === 'contasAPagar' && contasAPagar.map(cp => (
                  <tr key={cp.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                    <td className="p-3 font-semibold text-gray-900 dark:text-white">{cp.fornecedor}</td>
                    <td className="p-3 font-bold">{cp.despesa}</td>
                    <td className="p-3 text-gray-400">{cp.obligacoes || cp.obrigacoes}</td>
                    <td className="p-3 text-right font-mono text-red-500">-{cp.valor.toLocaleString()} Kz</td>
                    <td className="p-3 font-mono text-gray-400">{cp.dataVencimento}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-bold">{cp.estado}</span>
                    </td>
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
              <input type="text" required value={genericForm.nome || genericForm.identificacao || genericForm.produto || genericForm.pedido || genericForm.orcamento || ''} onChange={e => setGenericForm(p => ({ ...p, nome: e.target.value, identificacao: e.target.value, produto: e.target.value, pedido: e.target.value, orcamento: e.target.value }))} placeholder="Escreva a identificação" className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Quantidade / Valor</label>
              <input type="number" step="any" required value={genericForm.quantidade || genericForm.valor || genericForm.peso || ''} onChange={e => setGenericForm(p => ({ ...p, quantidade: e.target.value, valor: e.target.value, peso: e.target.value }))} placeholder="Quantidade ou valor numérico" className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Detalhes / Cliente / Fornecedor</label>
              <input type="text" value={genericForm.detalhes || genericForm.lote || genericForm.responsavel || genericForm.cliente || genericForm.fornecedor || ''} onChange={e => setGenericForm(p => ({ ...p, detalhes: e.target.value, lote: e.target.value, responsavel: e.target.value, cliente: e.target.value, fornecedor: e.target.value }))} placeholder="Cliente, Fornecedor ou Responsável" className="w-full text-xs px-3 py-2 bg-white dark:bg-[#15151C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white" />
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
