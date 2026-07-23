/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Briefcase, 
  Wrench, 
  Layers, 
  Calendar, 
  Activity, 
  Check, 
  X, 
  Plus, 
  Trash2, 
  FileText, 
  AlertTriangle,
  Clock, 
  TrendingDown, 
  ShieldCheck, 
  Camera, 
  DollarSign, 
  Percent, 
  ChevronRight, 
  Flame, 
  MapPin, 
  Building 
} from 'lucide-react';

interface SupportCostsPageProps {
  userId: string;
  userRole: string;
  userIndustry?: string | null;
  key?: string;
}

export function SupportCostsPage({ userId, userRole, userIndustry = null }: SupportCostsPageProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rh' | 'maquinas' | 'utilitarios'>('dashboard');

  // --- INITIAL DATA SEEDING & LOCALSTORAGE ---
  // 1. Recursos Humanos (RH) State
  const [funcionarios, setFuncionarios] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-erp-rh-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'emp-1', name: 'Sebastião Neto', role: 'PRODUCAO', contract_type: 'EFECTIVO', base_salary: 180000, food_allowance: 30000, transport_allowance: 25000, insurance: 15000, allocated_center: 't-1', bi: '00452391LA043', admit_date: '2024-02-10', contact: '+244 923 451 002', present: true, epi_expiry: '2026-08-15' },
      { id: 'emp-2', name: 'Zola Pascoal', role: 'SAFRISTA', contract_type: 'TEMPORARIO', base_salary: 85000, food_allowance: 15000, transport_allowance: 10000, insurance: 5000, allocated_center: 't-1', bi: '00781291HU091', admit_date: '2026-05-01', contact: '+244 931 002 991', present: true, epi_expiry: '2026-07-28' },
      { id: 'emp-3', name: 'Maria Chilombo', role: 'ADMIN', contract_type: 'EFECTIVO', base_salary: 250000, food_allowance: 40000, transport_allowance: 30000, insurance: 20000, allocated_center: 'OVERHEAD', bi: '00125692HU124', admit_date: '2023-11-15', contact: '+244 912 774 125', present: true, epi_expiry: '2026-12-01' },
      { id: 'emp-4', name: 'Tome Gaspar', role: 'MOTORISTA', contract_type: 'EFECTIVO', base_salary: 140000, food_allowance: 25000, transport_allowance: 25000, insurance: 12000, allocated_center: 'emb-1', bi: '00812591NA412', admit_date: '2025-01-20', contact: '+244 945 112 004', present: true, epi_expiry: '2026-07-22' }
    ];
  });

  // 2. Máquinas e Ativos State
  const [maquinas, setMaquinas] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-erp-maquinas-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'mac-1', name: 'Trator Massey Ferguson 275', brand: 'Massey Ferguson', model: '275 Standard', year: 2020, hours_worked: 1450, fuel_liters: 125, purchase_val: 8500000, useful_years: 10, current_odometer: 1450, allocated_center: 't-1' },
      { id: 'mac-2', name: 'Gerador Perkins 45kVA', brand: 'Perkins', model: 'Silent 45', year: 2022, hours_worked: 890, fuel_liters: 95, purchase_val: 4500000, useful_years: 8, current_odometer: 890, allocated_center: 'OVERHEAD' },
      { id: 'mac-3', name: 'Câmara de Conservação Frio', brand: 'Carrier', model: 'Chiller 200', year: 2021, hours_worked: 4200, fuel_liters: 0, purchase_val: 12000000, useful_years: 12, current_odometer: 4200, allocated_center: 'emb-1' }
    ];
  });

  // Logs de manutenção de máquinas
  const [maquinasLogs, setMaquinasLogs] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-erp-maquinas-logs-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'mlog-1', machine_id: 'mac-1', hours_worked: 120, fuel_liters: 80, maintenance_cost: 150000, maintenance_type: 'PREVENTIVA', allocated_center: 't-1', date: '2026-07-02' },
      { id: 'mlog-2', machine_id: 'mac-2', hours_worked: 45, fuel_liters: 120, maintenance_cost: 250000, maintenance_type: 'CORRETIVA', allocated_center: 'OVERHEAD', date: '2026-07-14' }
    ];
  });

  // 3. Serviços Públicos e Impostos State
  const [faturas, setFaturas] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-erp-faturas-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'fat-1', utility_type: 'ENERGIA', reference_month: '2026-07', total_amount: 145000, due_date: '2026-07-25', allocated: true, allocation_percentage: [{ center_id: 't-1', percentage: 50 }, { center_id: 't-2', percentage: 30 }, { center_id: 'OVERHEAD', percentage: 20 }] },
      { id: 'fat-2', utility_type: 'AGUA', reference_month: '2026-07', total_amount: 35000, due_date: '2026-07-22', allocated: true, allocation_percentage: [{ center_id: 't-1', percentage: 60 }, { center_id: 't-2', percentage: 40 }] },
      { id: 'fat-3', utility_type: 'INTERNET', reference_month: '2026-07', total_amount: 45000, due_date: '2026-07-30', allocated: true, allocation_percentage: [{ center_id: 'OVERHEAD', percentage: 100 }] },
      { id: 'fat-4', utility_type: 'RENDA', reference_month: '2026-07', total_amount: 250000, due_date: '2026-08-05', allocated: false, allocation_percentage: [] }
    ];
  });

  // Outros impostos, taxas e licenças
  const [impostosLicencas, setImpostosLicencas] = useState<any[]>(() => {
    const saved = localStorage.getItem(`olo-fintel-erp-impostos-${userId}`);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { id: 'imp-1', name: 'IUT - Imposto Único sobre o Património', due_date: '2026-07-30', amount: 120000, status: 'Pendente', entity: 'AGT - Administração Geral Tributária' },
      { id: 'imp-2', name: 'Alvará Comercial Anual', due_date: '2026-08-15', amount: 85000, status: 'Agendado', entity: 'Ministério do Comércio e Indústria' },
      { id: 'imp-3', name: 'Licença de Pesca Costeira', due_date: '2026-08-20', amount: 450000, status: 'Pendente', entity: 'Ministério das Pescas e Recursos Marinhos' }
    ];
  });

  // Persist states automatically
  useEffect(() => {
    localStorage.setItem(`olo-fintel-erp-rh-${userId}`, JSON.stringify(funcionarios));
  }, [funcionarios, userId]);

  useEffect(() => {
    localStorage.setItem(`olo-fintel-erp-maquinas-${userId}`, JSON.stringify(maquinas));
  }, [maquinas, userId]);

  useEffect(() => {
    localStorage.setItem(`olo-fintel-erp-maquinas-logs-${userId}`, JSON.stringify(maquinasLogs));
  }, [maquinasLogs, userId]);

  useEffect(() => {
    localStorage.setItem(`olo-fintel-erp-faturas-${userId}`, JSON.stringify(faturas));
  }, [faturas, userId]);

  useEffect(() => {
    localStorage.setItem(`olo-fintel-erp-impostos-${userId}`, JSON.stringify(impostosLicencas));
  }, [impostosLicencas, userId]);

  // Cost Centers Lookup
  const costCenters = [
    { id: 't-1', label: 'Talhão Alfa (Milho)' },
    { id: 't-2', label: 'Talhão Beta (Batata)' },
    { id: 'reb-1', label: 'Lote Engorda A (Pecuária)' },
    { id: 'emb-1', label: 'Estrela do Namibe (Pesca)' },
    { id: 'OVERHEAD', label: 'Despesas Administrativas (Escritório)' }
  ];

  // Dynamically filter cost centers based on user industry
  const filteredCostCenters = costCenters.filter(cc => {
    if (!userIndustry || ['SUPER_ADMIN', 'ANALYST', 'CONSULTANT'].includes(userRole)) return true;
    if (cc.id === 'OVERHEAD') return true;
    if (userIndustry === 'AGRICULTURE') return cc.id === 't-1' || cc.id === 't-2';
    if (userIndustry === 'LIVESTOCK') return cc.id === 'reb-1';
    if (userIndustry === 'FISHERIES') return cc.id === 'emb-1';
    return false; // Other industries only have administrative overhead
  });

  const getFaturaAllocatedPortion = (f: any) => {
    if (!f.allocation_percentage) return 0;
    const activeAllocPercent = f.allocation_percentage
      .filter((a: any) => filteredCostCenters.some(cc => cc.id === a.center_id))
      .reduce((sum: number, a: any) => sum + Number(a.percentage || 0), 0);
    return Number(f.total_amount) * (activeAllocPercent / 100);
  };

  const filteredFuncionarios = funcionarios.filter(f => 
    filteredCostCenters.some(cc => cc.id === f.allocated_center)
  );

  const filteredMaquinas = maquinas.filter(m => 
    filteredCostCenters.some(cc => cc.id === m.allocated_center)
  );

  const filteredMaquinasLogs = maquinasLogs.filter(l => 
    filteredCostCenters.some(cc => cc.id === l.allocated_center)
  );

  const filteredFaturas = faturas.filter(f => {
    if (!f.allocation_percentage || f.allocation_percentage.length === 0) return true;
    return f.allocation_percentage.some((a: any) => filteredCostCenters.some(cc => cc.id === a.center_id));
  });

  const getCenterLabel = (id: string) => {
    const cc = costCenters.find(c => c.id === id);
    return cc ? cc.label : 'Conta Geral Administrativa';
  };

  // --- COMPONENT STATE FOR FORMS ---
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [workerForm, setWorkerForm] = useState({
    name: '',
    role: 'PRODUCAO',
    contract_type: 'EFECTIVO',
    base_salary: '',
    food_allowance: '',
    transport_allowance: '',
    insurance: '',
    allocated_center: 't-1',
    bi: '',
    admit_date: new Date().toISOString().split('T')[0],
    contact: ''
  });

  const [showAddMachine, setShowAddMachine] = useState(false);
  const [machineForm, setMachineForm] = useState({
    name: '',
    brand: '',
    model: '',
    year: '2024',
    purchase_val: '',
    useful_years: '10',
    allocated_center: 't-1'
  });

  const [showLogMachineUse, setShowLogMachineUse] = useState(false);
  const [machineLogForm, setMachineLogForm] = useState({
    machine_id: maquinas[0]?.id || '',
    hours_worked: '',
    fuel_liters: '',
    maintenance_cost: '',
    maintenance_type: 'PREVENTIVA',
    allocated_center: 't-1'
  });

  const [showAddBill, setShowAddBill] = useState(false);
  const [billForm, setBillForm] = useState({
    utility_type: 'ENERGIA',
    reference_month: '2026-07',
    total_amount: '',
    due_date: new Date().toISOString().split('T')[0],
    allocation: [] as { center_id: string; percentage: number }[]
  });

  const [showAddTax, setShowAddTax] = useState(false);
  const [taxForm, setTaxForm] = useState({
    name: '',
    due_date: new Date().toISOString().split('T')[0],
    amount: '',
    entity: ''
  });

  // Simulated Camera evidence for receipt photography
  const [receiptPhoto, setReceiptPhoto] = useState<string | null>(null);

  // Helper calculating total salary cost for employee
  const getEmployeeTotalCost = (emp: any) => {
    return Number(emp.base_salary || 0) + 
           Number(emp.food_allowance || 0) + 
           Number(emp.transport_allowance || 0) + 
           Number(emp.insurance || 0);
  };

  // --- CALCULATION LOGIC FOR THE DASHBOARD ---
  // Total overhead revenues and margins (Filtered by active sector)
  const totalRHOverhead = filteredFuncionarios.reduce((sum, f) => sum + getEmployeeTotalCost(f), 0);
  const totalMaintenanceOverhead = filteredMaquinasLogs.reduce((sum, l) => sum + Number(l.maintenance_cost || 0), 0);
  
  // Calculate machine depreciation
  const getMachineAnnualDepreciation = (mac: any) => {
    const ageInYears = Math.max(1, new Date().getFullYear() - mac.year);
    const annualDepreciation = Number(mac.purchase_val) / Number(mac.useful_years);
    const accumulated = Math.min(Number(mac.purchase_val), annualDepreciation * ageInYears);
    const percent = Math.min(100, Math.round((accumulated / Number(mac.purchase_val)) * 100));
    const currentVal = Math.max(0, Number(mac.purchase_val) - accumulated);
    return { annualDepreciation, accumulated, percent, currentVal };
  };

  const totalDepreciationOverhead = filteredMaquinas.reduce((sum, m) => {
    const { annualDepreciation } = getMachineAnnualDepreciation(m);
    return sum + (annualDepreciation / 12); // monthly depreciation
  }, 0);

  const totalBillsOverhead = filteredFaturas.reduce((sum, f) => sum + getFaturaAllocatedPortion(f), 0);
  const totalOverheadCosts = totalRHOverhead + totalMaintenanceOverhead + totalDepreciationOverhead + totalBillsOverhead;

  // Let's assume a total revenue benchmark based on active sector to keep it accurate
  const mockTotalRevenue = userIndustry === 'AGRICULTURE' ? 2150000 : userIndustry === 'LIVESTOCK' ? 1350000 : userIndustry === 'FISHERIES' ? 850000 : 3500000;
  const overheadPercentage = mockTotalRevenue > 0 ? (totalOverheadCosts / mockTotalRevenue) * 100 : 0;

  // Grouped Costs per Cost Center (Allocated Margins)
  const getCenterAllocatedCosts = (centerId: string) => {
    // 1. Employee costs allocated
    const rhCost = filteredFuncionarios
      .filter(f => f.allocated_center === centerId)
      .reduce((sum, f) => sum + getEmployeeTotalCost(f), 0);

    // 2. Machine maintenance & depreciation allocated
    const maintenanceCost = filteredMaquinasLogs
      .filter(l => l.allocated_center === centerId)
      .reduce((sum, l) => sum + Number(l.maintenance_cost || 0), 0);

    const machineDepreciationCost = filteredMaquinas
      .filter(m => m.allocated_center === centerId)
      .reduce((sum, m) => {
        const { annualDepreciation } = getMachineAnnualDepreciation(m);
        return sum + (annualDepreciation / 12);
      }, 0);

    // 3. Bills rateio allocated
    const billsCost = faturas.reduce((sum, f) => {
      if (!f.allocated || !f.allocation_percentage) return sum;
      const alloc = f.allocation_percentage.find((a: any) => a.center_id === centerId);
      if (alloc) {
        return sum + (Number(f.total_amount) * (alloc.percentage / 100));
      }
      return sum;
    }, 0);

    return {
      rhCost,
      machineCost: maintenanceCost + machineDepreciationCost,
      billsCost,
      total: rhCost + maintenanceCost + machineDepreciationCost + billsCost
    };
  };

  // Simulated activity margins (Unique Cost Center view)
  const centersWithMargins = [
    { id: 't-1', name: 'Talhão Alfa (Colheita de Milho)', faturado: 1200000, custosDiretos: 420000 },
    { id: 't-2', name: 'Talhão Beta (Produção Batata)', faturado: 950000, custosDiretos: 250000 },
    { id: 'reb-1', name: 'Lote Engorda A (Pecuária)', faturado: 1350000, custosDiretos: 320000 },
    { id: 'emb-1', name: 'Estrela do Namibe (Pesca)', faturado: 850000, custosDiretos: 180000 }
  ];

  const filteredCentersWithMargins = centersWithMargins.filter(c => 
    filteredCostCenters.some(cc => cc.id === c.id)
  );

  // Calendar timeline list
  const upcomingPaymentsTimeline = [
    ...faturas.map(f => ({
      date: f.due_date,
      title: `Fatura de ${f.utility_type} (${f.reference_month})`,
      amount: getFaturaAllocatedPortion(f),
      type: 'Utility',
      color: 'text-sky-400 bg-sky-400/10'
    })).filter(f => f.amount > 0),
    ...impostosLicencas.map(i => ({
      date: i.due_date,
      title: `${i.name} - ${i.entity}`,
      amount: i.amount,
      type: 'Tax',
      color: 'text-amber-400 bg-amber-400/10'
    })),
    {
      date: '2026-07-30',
      title: 'Folha de Pagamento Completa (RH)',
      amount: totalRHOverhead,
      type: 'RH',
      color: 'text-brand-purple bg-brand-purple/10'
    }
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // --- ACTIONS ---
  const handleAddWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newWorker = {
      id: `emp-${Date.now()}`,
      name: workerForm.name,
      role: workerForm.role,
      contract_type: workerForm.contract_type,
      base_salary: Number(workerForm.base_salary || 0),
      food_allowance: Number(workerForm.food_allowance || 0),
      transport_allowance: Number(workerForm.transport_allowance || 0),
      insurance: Number(workerForm.insurance || 0),
      allocated_center: workerForm.allocated_center,
      bi: workerForm.bi,
      admit_date: workerForm.admit_date,
      contact: workerForm.contact,
      present: true,
      epi_expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days window
    };
    setFuncionarios([...funcionarios, newWorker]);
    setShowAddWorker(false);
    setWorkerForm({
      name: '',
      role: 'PRODUCAO',
      contract_type: 'EFECTIVO',
      base_salary: '',
      food_allowance: '',
      transport_allowance: '',
      insurance: '',
      allocated_center: 't-1',
      bi: '',
      admit_date: new Date().toISOString().split('T')[0],
      contact: ''
    });
  };

  const handleDeleteWorker = (id: string) => {
    if (confirm('Deseja realmente remover este colaborador da folha ativa?')) {
      setFuncionarios(funcionarios.filter(f => f.id !== id));
    }
  };

  const handleTogglePonto = (id: string) => {
    setFuncionarios(funcionarios.map(f => f.id === id ? { ...f, present: !f.present } : f));
  };

  const handleMarkAllPonto = (present: boolean) => {
    setFuncionarios(funcionarios.map(f => ({ ...f, present })));
  };

  const handleDistributeEPI = (id: string) => {
    const nextDistDate = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 6 months standard
    setFuncionarios(funcionarios.map(f => f.id === id ? { ...f, epi_expiry: nextDistDate } : f));
    alert('EPI Homologado! Registada entrega física de botas, capacete e luvas. Próxima distribuição agendada para 180 dias.');
  };

  const handleAddMachineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMachine = {
      id: `mac-${Date.now()}`,
      name: machineForm.name,
      brand: machineForm.brand,
      model: machineForm.model,
      year: Number(machineForm.year || new Date().getFullYear()),
      hours_worked: 0,
      fuel_liters: 0,
      purchase_val: Number(machineForm.purchase_val || 0),
      useful_years: Number(machineForm.useful_years || 10),
      current_odometer: 0,
      allocated_center: machineForm.allocated_center
    };
    setMaquinas([...maquinas, newMachine]);
    setShowAddMachine(false);
    setMachineForm({
      name: '',
      brand: '',
      model: '',
      year: '2024',
      purchase_val: '',
      useful_years: '10',
      allocated_center: 't-1'
    });
  };

  const handleLogMachineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog = {
      id: `mlog-${Date.now()}`,
      machine_id: machineLogForm.machine_id,
      hours_worked: Number(machineLogForm.hours_worked || 0),
      fuel_liters: Number(machineLogForm.fuel_liters || 0),
      maintenance_cost: Number(machineLogForm.maintenance_cost || 0),
      maintenance_type: machineLogForm.maintenance_type,
      allocated_center: machineLogForm.allocated_center,
      date: new Date().toISOString().split('T')[0]
    };

    // Update machine state hours and fuel
    setMaquinas(maquinas.map(m => m.id === machineLogForm.machine_id ? {
      ...m,
      hours_worked: Number(m.hours_worked) + Number(machineLogForm.hours_worked || 0),
      current_odometer: Number(m.current_odometer) + Number(machineLogForm.hours_worked || 0),
      fuel_liters: Number(machineLogForm.fuel_liters || 0)
    } : m));

    setMaquinasLogs([...maquinasLogs, newLog]);
    setShowLogMachineUse(false);
    setMachineLogForm({
      machine_id: maquinas[0]?.id || '',
      hours_worked: '',
      fuel_liters: '',
      maintenance_cost: '',
      maintenance_type: 'PREVENTIVA',
      allocated_center: 't-1'
    });
  };

  const handleAddBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process allocation percentages
    const allocationTotal = billForm.allocation.reduce((sum, item) => sum + item.percentage, 0);
    const finalAlloc = allocationTotal === 100 
      ? billForm.allocation 
      : [{ center_id: 'OVERHEAD', percentage: 100 }]; // defaults 100% administrative if invalid

    const newBill = {
      id: `fat-${Date.now()}`,
      utility_type: billForm.utility_type,
      reference_month: billForm.reference_month,
      total_amount: Number(billForm.total_amount || 0),
      due_date: billForm.due_date,
      allocated: true,
      allocation_percentage: finalAlloc
    };

    setFaturas([...faturas, newBill]);
    setShowAddBill(false);
    setReceiptPhoto(null);
    setBillForm({
      utility_type: 'ENERGIA',
      reference_month: '2026-07',
      total_amount: '',
      due_date: new Date().toISOString().split('T')[0],
      allocation: []
    });
  };

  const handleAddTaxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTax = {
      id: `imp-${Date.now()}`,
      name: taxForm.name,
      due_date: taxForm.due_date,
      amount: Number(taxForm.amount || 0),
      status: 'Pendente',
      entity: taxForm.entity
    };
    setImpostosLicencas([...impostosLicencas, newTax]);
    setShowAddTax(false);
    setTaxForm({
      name: '',
      due_date: new Date().toISOString().split('T')[0],
      amount: '',
      entity: ''
    });
  };

  const handlePhotoUploadSim = () => {
    setReceiptPhoto("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23111'/><text x='10' y='50' fill='%23a855f7' font-size='8'>COMPROVATIVO OLO ERP</text></svg>");
    alert('Fotografia do comprovativo fiscal capturada via câmara do telemóvel e indexada ao registo da fatura!');
  };

  // Determine whether any EPI has expired/within 30 days
  const getEpiAlertWorkers = () => {
    const today = new Date();
    const limitDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return funcionarios.filter(f => {
      const exp = new Date(f.epi_expiry);
      return exp <= limitDate;
    });
  };

  const epiAlerts = getEpiAlertWorkers();

  return (
    <div className="space-y-6">
      
      {/* 1. SECTOR HEADER & NAVIGATION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-purple bg-brand-purple/10 px-2.5 py-1 rounded-full">OLO ERP OPERACIONAL</span>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">Angola</span>
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <Briefcase className="text-brand-purple shrink-0 animate-pulse" size={22} />
            Gestão de Custos de Suporte & Overheads
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Controle exaustivo de Recursos Humanos, Ativos Fixos, Depreciação de Equipamentos e Rateios de Serviços Públicos.
          </p>
        </div>

        {/* Tab triggers */}
        <div className="grid grid-cols-2 lg:flex lg:flex-row items-center gap-1.5 p-1.5 bg-gray-50 dark:bg-gray-900/60 rounded-2xl border border-gray-150 dark:border-gray-800 shrink-0 w-full lg:w-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Layers },
            { id: 'rh', label: 'Recursos Humanos', icon: Users },
            { id: 'maquinas', label: 'Frota & Ativos', icon: Wrench },
            { id: 'utilitarios', label: 'Overheads & Taxas', icon: Building }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 lg:py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer w-full lg:w-auto ${
                activeTab === t.id 
                  ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20' 
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <t.icon size={13} className="shrink-0" />
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. DYNAMIC CONTENT VIEWS */}
      <AnimatePresence mode="wait">
        
        {/* TAB A: OVERHEADS ERP DASHBOARD */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* KPI METRICS AND WARNING BANNERS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              <div className="p-5 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Overhead Mensal Real</span>
                  <div className="p-1.5 bg-brand-purple/10 text-brand-purple rounded-lg"><Activity size={14} /></div>
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  {totalOverheadCosts.toLocaleString('pt-PT', { minimumFractionDigits: 0 })} Kz
                </h3>
                <p className="text-[10px] text-gray-400 mt-1">Soma de RH, Manutenção, Depreciação e Contas</p>
                <div className="absolute bottom-0 inset-x-0 h-1 bg-brand-purple" />
              </div>

              <div className="p-5 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">% de Overhead / Receita</span>
                  <div className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg"><Percent size={14} /></div>
                </div>
                <h3 className={`text-xl font-black ${overheadPercentage > 40 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {overheadPercentage.toFixed(1)}%
                </h3>
                <p className="text-[10px] text-gray-400 mt-1">Limite crítico do negócio: 40% máximo</p>
                <div className={`absolute bottom-0 inset-x-0 h-1 ${overheadPercentage > 40 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              </div>

              <div className="p-5 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Folha de Salários (RH)</span>
                  <div className="p-1.5 bg-sky-500/10 text-sky-500 rounded-lg"><Users size={14} /></div>
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  {totalRHOverhead.toLocaleString('pt-PT')} Kz
                </h3>
                <p className="text-[10px] text-gray-400 mt-1">Mão de obra fixa e safristas temporários</p>
                <div className="absolute bottom-0 inset-x-0 h-1 bg-sky-500" />
              </div>

              <div className="p-5 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Ativos & Máquinas</span>
                  <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg"><Wrench size={14} /></div>
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  {totalMaintenanceOverhead.toLocaleString('pt-PT')} Kz
                </h3>
                <p className="text-[10px] text-gray-400 mt-1">Custo acumulado de manutenção corretiva</p>
                <div className="absolute bottom-0 inset-x-0 h-1 bg-amber-500" />
              </div>
            </div>

            {/* RED ALERTS BLOCK */}
            {overheadPercentage > 40 && (
              <div className="p-4 bg-rose-500/15 border border-rose-500/30 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="text-rose-500 shrink-0 mt-0.5 animate-bounce" size={20} />
                <div>
                  <h4 className="font-extrabold text-sm text-rose-500">Risco Crítico de Fluxo de Caixa detetado!</h4>
                  <p className="text-xs text-rose-400/90 leading-relaxed mt-0.5">
                    A sua percentagem de overhead fixo atingiu <strong className="font-bold">{overheadPercentage.toFixed(1)}%</strong> da receita total. Recomenda-se reduzir despesas administrativas do escritório ou otimizar a rota e horários das máquinas de campo para evitar prejuízo este mês.
                  </p>
                </div>
              </div>
            )}

            {/* Alert on utility spike */}
            <div className="p-4 bg-amber-500/15 border border-amber-500/30 rounded-2xl flex items-start gap-3">
              <Flame className="text-amber-500 shrink-0 mt-0.5 animate-pulse" size={20} />
              <div>
                <h4 className="font-extrabold text-sm text-amber-500">Alerta de Consumo: Despesa de Luz e Geradores!</h4>
                <p className="text-xs text-amber-400/90 leading-relaxed mt-0.5">
                  Atenção: A sua conta de Luz (ENERGIA) aumentou 31% este mês na Huíla. Verifique o consumo de combustível e possíveis fugas ou paragens desnecessárias do gerador Perkins 45kVA.
                </p>
              </div>
            </div>

            {/* EPI Alerts section */}
            {epiAlerts.length > 0 && (
              <div className="p-4 bg-sky-500/15 border border-sky-500/30 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="text-sky-400 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-extrabold text-sm text-sky-400">Segurança no Trabalho (EPI) - Alerta de Entrega!</h4>
                  <p className="text-xs text-sky-300 leading-relaxed mt-0.5">
                    Há {epiAlerts.length} colaboradores com distribuição de Equipamentos de Proteção Individual prestes a expirar (dentro de 30 dias). Por favor, garanta a entrega de novas botas e capacetes.
                  </p>
                </div>
              </div>
            )}

            {/* TWO-COLUMN GRID: MARGINS PER ACTIVITY & TIMELINE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: MARGEM TOTALMENTE ALOCADA POR ATIVIDADE */}
              <div className="lg:col-span-8 p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl shadow-sm">
                <h3 className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Layers className="text-brand-purple" size={16} />
                  Centro de Custo Único (Margem Real Completamente Alocada)
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                  Cálculo rigoroso de rentabilidade: Faturação menos Custos Diretos menos Overheads (Mão-de-Obra + Luz + Depreciação do Trator) distribuídos.
                </p>

                <div className="space-y-4">
                  {filteredCentersWithMargins.map(item => {
                    const allocs = getCenterAllocatedCosts(item.id);
                    const totalCostAlloc = item.custosDiretos + allocs.total;
                    const realProfit = item.faturado - totalCostAlloc;
                    const marginPercent = item.faturado > 0 ? (realProfit / item.faturado) * 100 : 0;

                    return (
                      <div key={item.id} className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 space-y-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">{item.name}</h4>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md self-start md:self-auto ${
                            marginPercent > 30 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            Margem Líquida Real: {marginPercent.toFixed(1)}%
                          </span>
                        </div>

                        {/* Cost allocations breakdown bars */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-gray-400 text-[10px] block uppercase">Faturação</span>
                            <span className="font-bold text-gray-900 dark:text-white">{item.faturado.toLocaleString()} Kz</span>
                          </div>
                          <div>
                            <span className="text-rose-400 text-[10px] block uppercase">Custos Diretos (Insumo)</span>
                            <span className="font-bold text-rose-500">-{item.custosDiretos.toLocaleString()} Kz</span>
                          </div>
                          <div>
                            <span className="text-amber-500 text-[10px] block uppercase">Overhead Alocado</span>
                            <span className="font-bold text-amber-500">-{Math.round(allocs.total).toLocaleString()} Kz</span>
                          </div>
                          <div>
                            <span className="text-emerald-500 text-[10px] block uppercase">Lucro Líquido Real</span>
                            <span className="font-extrabold text-emerald-500">{realProfit.toLocaleString()} Kz</span>
                          </div>
                        </div>

                        {/* Graphical Allocation Bar */}
                        <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full overflow-hidden flex">
                          <div 
                            title="Custos Diretos"
                            style={{ width: `${(item.custosDiretos / item.faturado) * 100}%` }}
                            className="bg-rose-500 h-full"
                          />
                          <div 
                            title="Overheads Rateados"
                            style={{ width: `${(allocs.total / item.faturado) * 100}%` }}
                            className="bg-amber-500 h-full"
                          />
                          <div 
                            title="Margem Real"
                            style={{ width: `${Math.max(0, (realProfit / item.faturado) * 100)}%` }}
                            className="bg-emerald-500 h-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: TIMELINE DE VENCIMENTOS (CALENDÁRIO DE 30 DIAS) */}
              <div className="lg:col-span-4 p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl shadow-sm space-y-4">
                <h3 className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="text-brand-purple" size={16} />
                  Calendário de Vencimentos (Próximos 30 dias)
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Timeline de despesas fixas para evitar multas pesadas e coimas das entidades públicas.
                </p>

                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {upcomingPaymentsTimeline.map((item, idx) => (
                    <div key={idx} className="flex gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-all">
                      <div className={`p-2 rounded-xl shrink-0 flex flex-col items-center justify-center font-bold text-xs h-12 w-12 ${item.color}`}>
                        <span>{item.date.split('-')[2]}</span>
                        <span className="text-[9px] uppercase font-light">{item.date.split('-')[1]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">{item.title}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">Vence a {item.date}</p>
                        <p className="font-black text-xs text-gray-900 dark:text-gray-100 mt-1">
                          {item.amount.toLocaleString()} Kz
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* SUMMARY OVERHEAD CHARTS IN GRID */}
            <div className="p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl shadow-sm">
              <h3 className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Análise Proporcional de Despesas Indiretas de Suporte (Overheads)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-400 font-bold block uppercase mb-1">Mão de Obra Fixa vs Temporária</span>
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden flex mt-2">
                    <div style={{ width: '70%' }} className="bg-brand-purple h-full" title="Efetivos: 70%" />
                    <div style={{ width: '30%' }} className="bg-amber-400 h-full" title="Safristas: 30%" />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 mt-2">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-brand-purple" /> Efetivos (70%)</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" /> Sazonais (30%)</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-400 font-bold block uppercase mb-1">Manutenção de Frota</span>
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden flex mt-2">
                    <div style={{ width: '60%' }} className="bg-emerald-500 h-full" title="Preventiva: 60%" />
                    <div style={{ width: '40%' }} className="bg-rose-500 h-full" title="Corretiva: 40%" />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 mt-2">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Preventiva (60%)</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> Corretiva (40%)</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-400 font-bold block uppercase mb-1">Composição das Faturas Fixas</span>
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden flex mt-2">
                    <div style={{ width: '45%' }} className="bg-sky-400 h-full" title="Energia: 45%" />
                    <div style={{ width: '25%' }} className="bg-blue-500 h-full" title="Água: 25%" />
                    <div style={{ width: '30%' }} className="bg-amber-500 h-full" title="Outros: 30%" />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 mt-2">
                    <span className="flex items-center gap-1 bg-sky-400/5 px-1 rounded text-sky-400">Energia (45%)</span>
                    <span className="flex items-center gap-1 bg-blue-500/5 px-1 rounded text-blue-400">Água (25%)</span>
                    <span className="flex items-center gap-1 bg-amber-500/5 px-1 rounded text-amber-500 font-bold">Renda/Net (30%)</span>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB B: RECURSOS HUMANOS */}
        {activeTab === 'rh' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Action Header and Add Worker button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-[#1A1A21]/60 border border-gray-200 dark:border-[#2A2A35] rounded-2xl">
              <div>
                <h3 className="font-extrabold text-sm text-gray-900 dark:text-white uppercase tracking-wider">Pessoal Integrado (Folha de Pagamento)</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Registo de contratos, diárias em campo e segurança do trabalho (EPI).</p>
              </div>
              <button
                onClick={() => setShowAddWorker(true)}
                className="px-4 py-2 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto shadow-sm"
              >
                <Plus size={14} />
                <span>Contratar Colaborador</span>
              </button>
            </div>

            {/* ADD WORKER COLLAPSIBLE FORM */}
            {showAddWorker && (
              <form onSubmit={handleAddWorkerSubmit} className="p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">Novo Ficha de Admissão de Colaborador</h4>
                  <button type="button" onClick={() => setShowAddWorker(false)} className="text-gray-400 hover:text-white"><X size={16} /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Nome Completo</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: João Gaspar Simão"
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={workerForm.name}
                      onChange={e => setWorkerForm({ ...workerForm, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Documento BI / NIF</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: 00984511HU045"
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={workerForm.bi}
                      onChange={e => setWorkerForm({ ...workerForm, bi: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Contacto Móvel</label>
                    <input
                      type="text"
                      placeholder="ex: +244 923 000 111"
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={workerForm.contact}
                      onChange={e => setWorkerForm({ ...workerForm, contact: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Cargo / Função</label>
                    <select
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={workerForm.role}
                      onChange={e => setWorkerForm({ ...workerForm, role: e.target.value })}
                    >
                      <option value="PRODUCAO">Produção / Campo</option>
                      <option value="SAFRISTA">Safrista / Temporário</option>
                      <option value="ADMIN">Administração / Escritório</option>
                      <option value="SEGURANCA">Segurança</option>
                      <option value="MOTORISTA">Motorista / Operador de Máquinas</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Tipo de Contrato</label>
                    <select
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={workerForm.contract_type}
                      onChange={e => setWorkerForm({ ...workerForm, contract_type: e.target.value })}
                    >
                      <option value="EFECTIVO">Efectivo (Mensal)</option>
                      <option value="TEMPORARIO">Temporário (Safrista/Diária)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Alocação de Mão-de-Obra (Obrigatório)</label>
                    <select
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={workerForm.allocated_center}
                      onChange={e => setWorkerForm({ ...workerForm, allocated_center: e.target.value })}
                    >
                      {filteredCostCenters.map(cc => (
                        <option key={cc.id} value={cc.id}>{cc.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Salário Base (Kz)</label>
                    <input
                      type="number"
                      required
                      placeholder="ex: 150000"
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={workerForm.base_salary}
                      onChange={e => setWorkerForm({ ...workerForm, base_salary: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Subsídio de Alimentação (Kz)</label>
                    <input
                      type="number"
                      placeholder="ex: 20000"
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={workerForm.food_allowance}
                      onChange={e => setWorkerForm({ ...workerForm, food_allowance: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Subsídio de Transporte (Kz)</label>
                    <input
                      type="number"
                      placeholder="ex: 15000"
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={workerForm.transport_allowance}
                      onChange={e => setWorkerForm({ ...workerForm, transport_allowance: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Seguro de Saúde/Acidentes (Kz)</label>
                    <input
                      type="number"
                      placeholder="ex: 10000"
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={workerForm.insurance}
                      onChange={e => setWorkerForm({ ...workerForm, insurance: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Data de Admissão</label>
                    <input
                      type="date"
                      required
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={workerForm.admit_date}
                      onChange={e => setWorkerForm({ ...workerForm, admit_date: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-brand-purple hover:bg-brand-purple/95 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Homologar Ficha de Admissão
                </button>
              </form>
            )}

            {/* QUICK DAILY ATTENDANCE CHECKLIST FOR MOBILE */}
            <div className="p-5 bg-[#0F0F14] border border-gray-800 rounded-3xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Clock className="text-brand-purple" size={16} />
                    Registo Rápido de Ponto / Presenças (Mobile Campo)
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    O gestor no terreno pode marcar quem trabalhou hoje com botões grandes de toque rápido.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleMarkAllPonto(true)}
                    className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-xl text-[10px] font-bold transition-all cursor-pointer border border-emerald-500/20"
                  >
                    ✅ Marcar Todos Presentes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkAllPonto(false)}
                    className="px-3 py-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-xl text-[10px] font-bold transition-all cursor-pointer border border-rose-500/20"
                  >
                    ❌ Marcar Todos Faltaram
                  </button>
                </div>
              </div>

              {/* Attendance quick grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredFuncionarios.map(f => (
                  <div key={f.id} className="flex items-center justify-between p-3.5 bg-gray-900 border border-gray-850 rounded-2xl">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-white truncate">{f.name}</span>
                        <span className="text-[8px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase">{f.contract_type}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5 truncate">{f.role} • Alocado a: <strong className="text-brand-purple">{getCenterLabel(f.allocated_center)}</strong></p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTogglePonto(f.id)}
                      className={`h-10 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                        f.present 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {f.present ? '✅ Presente' : '❌ Falta'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* FULL EMPLOYEES DIRECTORY AND SALARY BREAKDOWN TABLE */}
            <div className="bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">Folha Ativa de Recursos Humanos & EPIs</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/60 text-gray-400 uppercase text-[9px] font-bold">
                      <th className="p-4">Colaborador</th>
                      <th className="p-4">Alocação Operacional</th>
                      <th className="p-4">Remuneração Base</th>
                      <th className="p-4">Subsídios / Seguro</th>
                      <th className="p-4">Custo Total (Kz)</th>
                      <th className="p-4">Segurança (EPI)</th>
                      <th className="p-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredFuncionarios.map(f => {
                      const totalCost = getEmployeeTotalCost(f);
                      const isEpiClose = new Date(f.epi_expiry) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

                      return (
                        <tr key={f.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/10">
                          <td className="p-4">
                            <p className="font-extrabold text-gray-900 dark:text-white">{f.name}</p>
                            <span className="text-[10px] text-gray-400 block font-mono">BI: {f.bi} • Admitido em {f.admit_date}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-xs bg-brand-purple/10 text-brand-purple px-2 py-0.5 rounded font-bold">{getCenterLabel(f.allocated_center)}</span>
                            <span className="text-[10px] text-gray-400 block mt-1">{f.role}</span>
                          </td>
                          <td className="p-4 font-bold text-gray-900 dark:text-white">
                            {f.base_salary.toLocaleString()} Kz
                          </td>
                          <td className="p-4 text-gray-500 dark:text-gray-400">
                            <p>Alim: +{f.food_allowance.toLocaleString()} Kz</p>
                            <p className="text-[10px]">Transp: +{f.transport_allowance.toLocaleString()} Kz</p>
                          </td>
                          <td className="p-4 font-black text-brand-purple">
                            {totalCost.toLocaleString()} Kz
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-1.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded self-start ${
                                isEpiClose ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-400'
                              }`}>
                                Validade EPI: {f.epi_expiry}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDistributeEPI(f.id)}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-brand-purple hover:text-white text-gray-500 text-[10px] rounded transition-all cursor-pointer self-start font-bold"
                              >
                                Homologar Nova Entrega
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDeleteWorker(f.id)}
                              className="p-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all cursor-pointer"
                              title="Remover Colaborador"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* KPI INDICATOR BAR */}
            <div className="p-5 bg-brand-purple/5 border border-brand-purple/20 rounded-3xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-purple/10 text-brand-purple rounded-2xl"><Activity size={18} /></div>
                <div>
                  <h4 className="text-xs font-black uppercase text-gray-400">Indicador KPI Operacional:</h4>
                  <p className="text-sm font-black text-gray-900 dark:text-white">Custo de Mão-de-Obra por Unidade Produzida: <span className="text-brand-purple">210 Kz / kg</span></p>
                </div>
              </div>
              <span className="text-xs text-gray-400 font-bold hidden md:block">OLO Fintel Agro ERP benchmark</span>
            </div>

          </motion.div>
        )}

        {/* TAB C: MÁQUINAS E EQUIPAMENTOS */}
        {activeTab === 'maquinas' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Action Header bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-[#1A1A21]/60 border border-gray-200 dark:border-[#2A2A35] rounded-2xl">
              <div>
                <h3 className="font-extrabold text-sm text-gray-900 dark:text-white uppercase tracking-wider">Frota de Máquinas, Geradores & Equipamentos</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Acompanhamento de horas trabalhadas, consumo de combustível e depreciação linear de ativos.</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setShowLogMachineUse(true)}
                  className="px-3 py-2 bg-[#0F0F14] hover:bg-gray-800 text-white border border-gray-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Activity size={14} />
                  <span>Registar Horas / Consumo</span>
                </button>
                <button
                  onClick={() => setShowAddMachine(true)}
                  className="px-4 py-2 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus size={14} />
                  <span>Novo Ativo</span>
                </button>
              </div>
            </div>

            {/* ADD MACHINE FORM */}
            {showAddMachine && (
              <form onSubmit={handleAddMachineSubmit} className="p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">Cadastrar Novo Equipamento / Ativo Fixo</h4>
                  <button type="button" onClick={() => setShowAddMachine(false)} className="text-gray-400 hover:text-white"><X size={16} /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Nome / Identificação</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Trator Valtra A990"
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={machineForm.name}
                      onChange={e => setMachineForm({ ...machineForm, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Marca</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Valtra"
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={machineForm.brand}
                      onChange={e => setMachineForm({ ...machineForm, brand: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Modelo</label>
                    <input
                      type="text"
                      placeholder="ex: A990 Geração 4"
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={machineForm.model}
                      onChange={e => setMachineForm({ ...machineForm, model: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Ano de Fabrico</label>
                    <input
                      type="number"
                      required
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={machineForm.year}
                      onChange={e => setMachineForm({ ...machineForm, year: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Valor de Compra (Kz)</label>
                    <input
                      type="number"
                      required
                      placeholder="ex: 9500000"
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={machineForm.purchase_val}
                      onChange={e => setMachineForm({ ...machineForm, purchase_val: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Vida Útil Estimada (Anos)</label>
                    <input
                      type="number"
                      required
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={machineForm.useful_years}
                      onChange={e => setMachineForm({ ...machineForm, useful_years: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1 md:col-span-3">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Centro de Custo de Alocação de Máquina (Obrigatório)</label>
                    <select
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={machineForm.allocated_center}
                      onChange={e => setMachineForm({ ...machineForm, allocated_center: e.target.value })}
                    >
                      {filteredCostCenters.map(cc => (
                        <option key={cc.id} value={cc.id}>{cc.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-brand-purple hover:bg-brand-purple/95 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Registar Equipamento
                </button>
              </form>
            )}

            {/* LOG MACHINE USAGE FORM (LARGE NUMERIC FOR MOBILE FIELD) */}
            {showLogMachineUse && (
              <form onSubmit={handleLogMachineSubmit} className="p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">Lançar Horas Trabalhadas e Manutenção de Máquina</h4>
                  <button type="button" onClick={() => setShowLogMachineUse(false)} className="text-gray-400 hover:text-white"><X size={16} /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Selecionar Equipamento</label>
                    <select
                      className="w-full h-11 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={machineLogForm.machine_id}
                      onChange={e => setMachineLogForm({ ...machineLogForm, machine_id: e.target.value })}
                    >
                      {filteredMaquinas.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Alocação de Trabalho (Centro de Custo)</label>
                    <select
                      className="w-full h-11 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={machineLogForm.allocated_center}
                      onChange={e => setMachineLogForm({ ...machineLogForm, allocated_center: e.target.value })}
                    >
                      {filteredCostCenters.map(cc => (
                        <option key={cc.id} value={cc.id}>{cc.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* MOBILE-STYLE LARGE MOTOR HOUR INPUT */}
                  <div className="space-y-1 md:col-span-2 p-4 bg-gray-900 rounded-2xl border border-gray-850">
                    <label className="text-xs font-extrabold uppercase text-gray-300 tracking-wider block text-center mb-2">Horas Trabalhadas do Motor (Odómetro)</label>
                    <input
                      type="number"
                      required
                      placeholder="Introduza horas, ex: 15"
                      className="w-full h-16 rounded-xl bg-black border border-gray-800 text-brand-purple text-center text-3xl font-black focus:border-brand-purple focus:outline-none"
                      value={machineLogForm.hours_worked}
                      onChange={e => setMachineLogForm({ ...machineLogForm, hours_worked: e.target.value })}
                    />
                    <p className="text-[10px] text-gray-400 text-center mt-1">Insira as horas acumuladas desta atividade para calibrar o desgaste.</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Gasóleo / Combustível Abastecido (Litros)</label>
                    <input
                      type="number"
                      placeholder="ex: 60"
                      className="w-full h-11 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={machineLogForm.fuel_liters}
                      onChange={e => setMachineLogForm({ ...machineLogForm, fuel_liters: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Custo de Manutenção / Oficina (Se houver - Kz)</label>
                    <input
                      type="number"
                      placeholder="ex: 120000"
                      className="w-full h-11 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={machineLogForm.maintenance_cost}
                      onChange={e => setMachineLogForm({ ...machineLogForm, maintenance_cost: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Classificação da Manutenção</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-300">
                        <input
                          type="radio"
                          name="maintType"
                          checked={machineLogForm.maintenance_type === 'PREVENTIVA'}
                          onChange={() => setMachineLogForm({ ...machineLogForm, maintenance_type: 'PREVENTIVA' })}
                        />
                        <span>Preventiva (Revisão programada / Óleos)</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-300">
                        <input
                          type="radio"
                          name="maintType"
                          checked={machineLogForm.maintenance_type === 'CORRETIVA'}
                          onChange={() => setMachineLogForm({ ...machineLogForm, maintenance_type: 'CORRETIVA' })}
                        />
                        <span className="text-rose-500">Corretiva (Avaria / Quebra no campo)</span>
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-brand-purple hover:bg-brand-purple/95 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Homologar Registo de Trabalho
                </button>
              </form>
            )}

            {/* DIRECTORY OF ATIVOS WITH AUTO-DEPRECIATION INFO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredMaquinas.map(m => {
                const { annualDepreciation, accumulated, percent, currentVal } = getMachineAnnualDepreciation(m);
                const isOverhead = m.allocated_center === 'OVERHEAD';

                return (
                  <div key={m.id} className="p-5 bg-white dark:bg-[#1A1A24] border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] bg-brand-purple/10 text-brand-purple px-2 py-0.5 rounded font-bold uppercase">{m.brand}</span>
                        <span className="text-xs font-bold text-gray-400">Fabricado: {m.year}</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-gray-900 dark:text-white mt-1.5">{m.name}</h4>
                      <p className="text-[10px] text-gray-400">Modelo: {m.model}</p>
                    </div>

                    <div className="space-y-2 text-xs border-t border-b border-gray-100 dark:border-gray-800/80 py-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Horas Acumuladas</span>
                        <span className="font-bold text-gray-900 dark:text-white">{m.hours_worked}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Alocação de Custo</span>
                        <span className="font-extrabold text-brand-purple">{getCenterLabel(m.allocated_center)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Valor de Aquisição</span>
                        <span className="font-bold text-gray-900 dark:text-white">{m.purchase_val.toLocaleString()} Kz</span>
                      </div>
                    </div>

                    {/* DEPRECIATION PROGRESS BAR AND REAL VALUE */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-400 font-bold uppercase">Depreciação Linear ({percent}%)</span>
                        <span className="text-gray-500 font-bold">-{annualDepreciation.toLocaleString()} Kz / Ano</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div style={{ width: `${percent}%` }} className="bg-amber-500 h-full" />
                      </div>
                      <div className="flex justify-between text-xs pt-1">
                        <span className="text-gray-400 font-semibold">Valor Corrente Atual:</span>
                        <span className="font-black text-emerald-500">{currentVal.toLocaleString()} Kz</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* KPI INDICATOR BAR */}
            <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-3xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-2xl"><Wrench size={18} /></div>
                <div>
                  <h4 className="text-xs font-black uppercase text-gray-400">Indicador KPI de Ativos:</h4>
                  <p className="text-sm font-black text-gray-900 dark:text-white">Custo de Operação por Hora/Máquina: <span className="text-amber-500">1.850 Kz / Hora</span></p>
                </div>
              </div>
              <span className="text-xs text-gray-400 font-bold hidden md:block">Abastecimento + Oficina + Depreciação / Horas</span>
            </div>

          </motion.div>
        )}

        {/* TAB D: SERVIÇOS PÚBLICOS E TAXAS */}
        {activeTab === 'utilitarios' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Action Header bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-[#1A1A21]/60 border border-gray-200 dark:border-[#2A2A35] rounded-2xl">
              <div>
                <h3 className="font-extrabold text-sm text-gray-900 dark:text-white uppercase tracking-wider">Faturas Fixas & Licenças (Overheads)</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Lançamento de faturas mensais, rateio por percentagem nos centros produtivos e controlo fiscal.</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setShowAddTax(true)}
                  className="px-3 py-2 bg-[#0F0F14] hover:bg-gray-800 text-white border border-gray-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Calendar size={14} />
                  <span>Novo Imposto / Licença</span>
                </button>
                <button
                  onClick={() => setShowAddBill(true)}
                  className="px-4 py-2 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus size={14} />
                  <span>Registar Fatura</span>
                </button>
              </div>
            </div>

            {/* ADD TAX FORM */}
            {showAddTax && (
              <form onSubmit={handleAddTaxSubmit} className="p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">Registar Obrigação Fiscal, Licença ou Seguro</h4>
                  <button type="button" onClick={() => setShowAddTax(false)} className="text-gray-400 hover:text-white"><X size={16} /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Nome da Licença / Alvará / Imposto</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Licença Sanitária de Venda"
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={taxForm.name}
                      onChange={e => setTaxForm({ ...taxForm, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Entidade Pública Destinatária</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: ANIES - Autoridade de Inspeção"
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={taxForm.entity}
                      onChange={e => setTaxForm({ ...taxForm, entity: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Valor Total da Taxa (Kz)</label>
                    <input
                      type="number"
                      required
                      placeholder="ex: 120000"
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={taxForm.amount}
                      onChange={e => setTaxForm({ ...taxForm, amount: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Data Limite de Pagamento</label>
                    <input
                      type="date"
                      required
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={taxForm.due_date}
                      onChange={e => setTaxForm({ ...taxForm, due_date: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-brand-purple hover:bg-brand-purple/95 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Homologar Obrigação Fiscal
                </button>
              </form>
            )}

            {/* ADD BILL FORM WITH INTEGRATED PHOTO CAPTURE AND RATEIO SLIDERS */}
            {showAddBill && (
              <form onSubmit={handleAddBillSubmit} className="p-6 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">Lançar Fatura Mensal de Serviços Públicos</h4>
                  <button type="button" onClick={() => setShowAddBill(false)} className="text-gray-400 hover:text-white"><X size={16} /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Tipo de Serviço</label>
                    <select
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={billForm.utility_type}
                      onChange={e => setBillForm({ ...billForm, utility_type: e.target.value })}
                    >
                      <option value="ENERGIA">⚡ Energia / Eletricidade (ENDE)</option>
                      <option value="AGUA">💧 Água Canalizada / Poço (EPAS)</option>
                      <option value="INTERNET">🌐 Internet & Telecomunicações (Unitel)</option>
                      <option value="RENDA">🏠 Renda de Instalações / Armazém</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Mês de Referência</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: 2026-07"
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={billForm.reference_month}
                      onChange={e => setBillForm({ ...billForm, reference_month: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Data de Vencimento</label>
                    <input
                      type="date"
                      required
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={billForm.due_date}
                      onChange={e => setBillForm({ ...billForm, due_date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1 md:col-span-3">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Valor Total da Fatura (Kz)</label>
                    <input
                      type="number"
                      required
                      placeholder="ex: 85000"
                      className="w-full h-11 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs focus:border-brand-purple focus:outline-none"
                      value={billForm.total_amount}
                      onChange={e => setBillForm({ ...billForm, total_amount: e.target.value })}
                    />
                  </div>
                </div>

                {/* RATEIO DE PERCENTAGEM OBRIGATÓRIO (SLIDERS) */}
                <div className="p-4 bg-gray-900/55 border border-gray-800 rounded-2xl space-y-3">
                  <h5 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Percent size={13} className="text-brand-purple" />
                    Rateio Obrigatório da Despesa por Centro de Custo
                  </h5>
                  <p className="text-[10px] text-gray-400">
                    Indique a percentagem de uso para cada talhão/embarcação. O total deve somar exactamente 100%.
                  </p>

                  <div className="space-y-3">
                    {filteredCostCenters.map(cc => {
                      const currentVal = billForm.allocation.find(item => item.center_id === cc.id)?.percentage || 0;
                      return (
                        <div key={cc.id} className="flex items-center gap-4 text-xs">
                          <span className="w-1/3 text-gray-300 font-bold truncate">{cc.label}</span>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            value={currentVal}
                            onChange={e => {
                              const nextPercent = Number(e.target.value);
                              const rest = billForm.allocation.filter(item => item.center_id !== cc.id);
                              setBillForm({
                                ...billForm,
                                allocation: [...rest, { center_id: cc.id, percentage: nextPercent }]
                              });
                            }}
                            className="flex-1 accent-brand-purple"
                          />
                          <span className="w-12 text-right font-black text-brand-purple">{currentVal}%</span>
                        </div>
                      );
                    })}

                    <div className="flex justify-between items-center pt-2 text-xs border-t border-gray-800 font-bold">
                      <span className="text-gray-400">Total Distribuído:</span>
                      <span className={`text-sm ${
                        billForm.allocation.reduce((sum, item) => sum + item.percentage, 0) === 100 
                          ? 'text-emerald-400' 
                          : 'text-amber-500'
                      }`}>
                        {billForm.allocation.reduce((sum, item) => sum + item.percentage, 0)}% (Deve ser 100%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* SIMULATED EVIDENCE CAMERA */}
                <div className="p-4 bg-gray-950 rounded-2xl border border-gray-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-white flex items-center gap-1.5"><Camera size={13} /> Fotografia Comprovativo Fiscal</span>
                    {receiptPhoto && <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded font-bold">INDEXADO</span>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handlePhotoUploadSim}
                      className="px-3 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Camera size={12} />
                      Tirar Foto à Fatura / Recibo
                    </button>
                    {receiptPhoto && (
                      <button
                        type="button"
                        onClick={() => setReceiptPhoto(null)}
                        className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Remover Anexo
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-brand-purple hover:bg-brand-purple/95 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Homologar Fatura e Rateios
                </button>
              </form>
            )}

            {/* BILLS DIRECTORY GRID */}
            <div className="bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-[#2A2A35] rounded-3xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">Lançamentos de Serviços Públicos do Mês</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/60 text-gray-400 uppercase text-[9px] font-bold">
                      <th className="p-4">Serviço Público</th>
                      <th className="p-4">Mês de Ref.</th>
                      <th className="p-4">Valor Total</th>
                      <th className="p-4">Data Vencimento</th>
                      <th className="p-4">Distribuição de Rateio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredFaturas.map(f => (
                      <tr key={f.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/10">
                        <td className="p-4 font-black text-gray-900 dark:text-white">
                          {f.utility_type}
                        </td>
                        <td className="p-4 text-gray-500 font-mono">{f.reference_month}</td>
                        <td className="p-4 font-bold text-gray-900 dark:text-white">{f.total_amount.toLocaleString()} Kz</td>
                        <td className="p-4 text-gray-400 font-mono">{f.due_date}</td>
                        <td className="p-4">
                          {f.allocated ? (
                            <div className="flex flex-wrap gap-1.5">
                              {f.allocation_percentage.map((alloc: any, i: number) => (
                                <span key={i} className="text-[10px] bg-brand-purple/10 text-brand-purple px-1.5 py-0.5 rounded font-bold">
                                  {getCenterLabel(alloc.center_id).split(' ')[0]}: {alloc.percentage}%
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[10px] bg-rose-500/10 text-rose-500 px-1.5 py-0.5 rounded font-bold">Rateio Pendente</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
