import React, { useState, useEffect } from 'react';
import { AppData } from './types';
import { syncFromDrive } from './services/driveService';
import { DashboardStats } from './components/DashboardStats';
import { 
  MobileClientCard, 
  MobilePolicyCard, 
  MobileClaimCard, 
  MobileFinanceCard 
} from './components/MobileComponents';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  AlertCircle, 
  Wallet, 
  RefreshCw,
  Search,
  Database,
  CloudLightning
} from 'lucide-react';

// Views Enum
type ViewState = 'dashboard' | 'clients' | 'policies' | 'claims' | 'finance';

const App: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewState>('dashboard');
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const driveData = await syncFromDrive();
      setData(driveData);
      setLastSync(new Date());
    } catch (error) {
      console.error("Erro ao sincronizar", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Tela de Carregamento / Sync ---
  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <CloudLightning className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Sincronizando...</h1>
        <p className="text-slate-500 text-sm mb-8">
          Buscando o arquivo mais recente no Google Drive da corretora.
        </p>
        <div className="w-full max-w-xs bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div className="h-full bg-blue-600 animate-[loading_1.5s_ease-in-out_infinite] w-1/2"></div>
        </div>
        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
    );
  }

  // --- Componentes de Navegação Mobile ---
  const NavButton = ({ target, icon: Icon, label }: { target: ViewState; icon: any; label: string }) => (
    <button 
      onClick={() => setView(target)}
      className={`flex flex-col items-center justify-center w-full py-2 transition-colors ${
        view === target ? 'text-blue-600' : 'text-slate-400'
      }`}
    >
      <Icon className={`w-6 h-6 mb-1 ${view === target ? 'fill-current opacity-20' : ''}`} strokeWidth={view === target ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      {/* --- Mobile Header --- */}
      <header className="bg-white px-4 py-3 border-b border-slate-100 sticky top-0 z-10 safe-top">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-xl font-bold text-slate-800">SegurManager</h1>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Database className="w-3 h-3" />
              <span>Drive: {data.filename}</span>
            </div>
          </div>
          <button 
            onClick={loadData}
            className="p-2 bg-slate-50 rounded-full text-slate-600 active:bg-slate-200 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        
        {/* Barra de Busca Global (Visual) */}
        {view !== 'dashboard' && (
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={`Buscar em ${view}...`}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        )}
      </header>

      {/* --- Main Content Area --- */}
      <main className="flex-1 p-4 overflow-y-auto">
        {/* Dashboard View */}
        {view === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
              <p className="text-blue-100 text-sm mb-1">Bem vindo de volta,</p>
              <h2 className="text-2xl font-bold">Administrador</h2>
              <p className="text-xs text-blue-200 mt-4">
                Última sincronização: {lastSync?.toLocaleTimeString()}
              </p>
            </div>
            
            {/* Stats Compactados para Mobile */}
            <DashboardStats data={data} />
            
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-slate-700">Sinistros Recentes</h3>
                <button onClick={() => setView('claims')} className="text-xs text-blue-600 font-medium">Ver todos</button>
              </div>
              {data.sinistros.slice(0, 3).map(sin => (
                <MobileClaimCard key={sin.id} sinistro={sin} />
              ))}
            </div>
          </div>
        )}

        {/* Clients View */}
        {view === 'clients' && (
          <div className="space-y-1">
             <p className="text-xs text-slate-400 mb-2 uppercase font-bold tracking-wider">{data.clientes.length} Clientes encontrados</p>
            {data.clientes.map(cliente => (
              <MobileClientCard key={cliente.id} cliente={cliente} />
            ))}
          </div>
        )}

        {/* Policies View */}
        {view === 'policies' && (
          <div className="space-y-1">
            <p className="text-xs text-slate-400 mb-2 uppercase font-bold tracking-wider">{data.seguros.length} Apólices</p>
            {data.seguros.map(seguro => {
              const cliente = data.clientes.find(c => c.id === seguro.clienteId);
              return (
                <MobilePolicyCard key={seguro.codseguro} seguro={seguro} nomeCliente={cliente?.nome || 'N/A'} />
              );
            })}
          </div>
        )}

        {/* Claims View */}
        {view === 'claims' && (
          <div className="space-y-1">
            {data.sinistros.map(sinistro => (
              <MobileClaimCard key={sinistro.id} sinistro={sinistro} />
            ))}
          </div>
        )}

        {/* Finance View */}
        {view === 'finance' && (
          <div className="space-y-1">
            {data.producao.map(prod => (
              <MobileFinanceCard key={prod.id} producao={prod} />
            ))}
          </div>
        )}
      </main>

      {/* --- Bottom Navigation Bar --- */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around items-center px-2 py-1 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] safe-bottom z-50">
        <NavButton target="dashboard" icon={LayoutDashboard} label="Início" />
        <NavButton target="policies" icon={Shield} label="Apólices" />
        <NavButton target="claims" icon={AlertCircle} label="Sinistros" />
        <NavButton target="finance" icon={Wallet} label="Finan" />
        <NavButton target="clients" icon={Users} label="Clientes" />
      </nav>
    </div>
  );
};

export default App;