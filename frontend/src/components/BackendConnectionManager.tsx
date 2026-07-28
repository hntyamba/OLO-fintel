import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, WifiOff, Settings, Check, RefreshCw, X, HelpCircle, HardDrive } from 'lucide-react';
import { checkServerHealth, getApiUrl } from '../lib/api.js';

interface BackendConnectionManagerProps {
  className?: string;
  isFloating?: boolean;
}

export default function BackendConnectionManager({ className, isFloating = false }: BackendConnectionManagerProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; latency?: number; msg?: string } | null>(null);
  const [isServerOnline, setIsServerOnline] = useState(false);
  const [currentUrlUsed, setCurrentUrlUsed] = useState('');

  // Loaded configuration on mount
  useEffect(() => {
    const savedUrl = localStorage.getItem('olo_fintel_custom_api_url') || '';
    setCustomUrl(savedUrl);
    
    // Evaluate actual URL used currently
    const activeUrl = getApiUrl('/');
    setCurrentUrlUsed(activeUrl.replace(/\/$/, ''));

    // Check actual server connection on startup
    checkServerHealth().then((status) => {
      setIsServerOnline(status);
    });

    // Periodic check every 15 seconds
    const interval = setInterval(() => {
      checkServerHealth().then((status) => {
        setIsServerOnline(status);
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleTestAndSave = async () => {
    setIsTesting(true);
    setTestResult(null);
    const start = performance.now();
    
    const targetUrl = customUrl.trim().replace(/\/$/, '');
    
    try {
      // Direct health-check probe
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const probeUrl = targetUrl ? `${targetUrl}/api/health` : '/api/health';
      const fallbackUrl = targetUrl ? `${targetUrl}/health` : '/health';
      
      let res;
      try {
        res = await fetch(probeUrl, { signal: controller.signal });
      } catch {
        res = await fetch(fallbackUrl, { signal: controller.signal });
      }
      
      clearTimeout(timeoutId);
      const end = performance.now();

      if (res && res.ok) {
        const latency = Math.round(end - start);
        // Save to localStorage
        if (targetUrl) {
          localStorage.setItem('olo_fintel_custom_api_url', targetUrl);
        } else {
          localStorage.removeItem('olo_fintel_custom_api_url');
        }
        
        setIsServerOnline(true);
        setTestResult({
          success: true,
          latency,
          msg: 'Ligação bem-sucedida! O seu frontend está agora conectado ao backend no Render.'
        });
        
        setTimeout(() => {
          window.location.reload(); // Refresh to apply new API base URL across contexts
        }, 1500);
      } else {
        setTestResult({
          success: false,
          msg: `Servidor respondeu com código ${res?.status || 'desconhecido'}. Verifique se ativou o CORS no Render!`
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        msg: `Falha na ligação. O servidor está offline ou bloqueou a requisição devido a CORS. Erro: ${err.message || 'NetworkError'}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('olo_fintel_custom_api_url');
    setCustomUrl('');
    setTestResult({
      success: true,
      msg: 'Restaurado para a URL padrão. A atualizar a página...'
    });
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <>
      {/* Non-floating Connectivity Badge */}
      <div className={isFloating ? "fixed bottom-4 right-4 sm:right-6 z-[999]" : (className || "inline-flex items-center")}>
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-semibold font-mono transition-all duration-200 cursor-pointer ${
            isServerOnline 
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/15 animate-pulse'
          }`}
          title="Configurar Conexão do Backend API"
        >
          {isServerOnline ? (
            <Wifi size={13} className="text-emerald-500 animate-pulse shrink-0" />
          ) : (
            <WifiOff size={13} className="text-amber-500 shrink-0" />
          )}
          <span className="truncate">
            API: {isServerOnline ? 'Conectado' : 'Offline'}
          </span>
          <Settings size={11} className="text-gray-400 ml-0.5 hover:text-gray-700 dark:hover:text-white transition-colors shrink-0" />
        </button>
      </div>

      {/* Modal Settings Panel via React Portal (attaches to document.body) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="w-full max-w-md my-auto bg-white dark:bg-[#15151D] border border-gray-200 dark:border-[#2C2C3A] rounded-2xl p-6 shadow-2xl text-gray-900 dark:text-white max-h-[90vh] overflow-y-auto shrink-0 relative"
              >
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Settings size={18} className="text-brand-iris" />
                    <h3 className="font-bold text-lg">Configurar Conexão do Backend</h3>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Active Server Badge info */}
                  <div className="p-3 bg-gray-50 dark:bg-[#1B1B25] rounded-xl border border-gray-200 dark:border-gray-800 text-xs flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Servidor Ativo</span>
                      <span className={`px-2 py-0.5 rounded font-bold font-mono text-[9px] ${
                        isServerOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {isServerOnline ? 'ONLINE' : 'MOCK / OFFLINE'}
                      </span>
                    </div>
                    <div className="font-mono text-gray-500 break-all select-all dark:text-gray-300">
                      {currentUrlUsed || '(Relativo - Servidor Local)'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      URL da API do Backend (Ex: Render)
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="https://sua-app.onrender.com"
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1B1B25] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-brand-iris font-mono text-sm"
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2">
                      Se estiver a hospedar o backend no Render, insira a URL acima para o seu frontend Vercel conseguir fazer as requisições reais.
                    </p>
                  </div>

                  {/* Test status block */}
                  {testResult && (
                    <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                      testResult.success 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}>
                      <div className="font-bold flex items-center gap-1.5 mb-1">
                        {testResult.success ? <Check size={14} /> : <X size={14} />}
                        {testResult.success ? 'Conexão Estabelecida!' : 'Erro na Conexão'}
                        {testResult.latency && <span className="text-[10px] font-mono font-normal text-emerald-500 ml-auto">Latency: {testResult.latency}ms</span>}
                      </div>
                      <div>{testResult.msg}</div>
                    </div>
                  )}

                  {/* FAQ section */}
                  <div className="p-3 bg-brand-iris/5 rounded-xl border border-brand-iris/10 text-xs text-gray-400 space-y-1.5 leading-normal">
                    <div className="flex items-center gap-1 font-semibold text-brand-iris text-[11px]">
                      <HelpCircle size={12} />
                      <span>Dica sobre CORS no NestJS</span>
                    </div>
                    <p>
                      Para permitir que o frontend da Vercel comunique com o Render, verifique se ativou o CORS no backend (ficheiro <code className="font-mono bg-black/20 px-1 py-0.5 rounded text-white text-[10px]">main.ts</code>):
                    </p>
                    <pre className="text-[9px] bg-black/35 font-mono p-1.5 rounded text-white overflow-x-auto max-h-20">
                      {`app.enableCors({
  origin: '*',
  credentials: true
});`}
                    </pre>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handleReset}
                      type="button"
                      className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold text-xs transition-all cursor-pointer"
                    >
                      Restaurar Padrão
                    </button>
                    <button
                      onClick={handleTestAndSave}
                      disabled={isTesting}
                      type="button"
                      className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-iris hover:bg-brand-iris-hover text-white rounded-xl font-bold text-xs shadow-lg shadow-brand-iris/15 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isTesting && <RefreshCw size={12} className="animate-spin" />}
                      <span>{isTesting ? 'A testar...' : 'Testar & Guardar'}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
