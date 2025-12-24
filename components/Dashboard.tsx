import React, { useState, useMemo } from 'react';
import { User, MonthlyClient, DailyCheckin, View } from '../types';
import Overview from './Overview';
import MonthlyManagement from './MonthlyManagement';
import DailyManagement from './DailyManagement';
import Payments from './Payments';
import Notifications from './Notifications';
import FinancialHistory from './FinancialHistory';
import WorkerManagement from './WorkerManagement';

interface DashboardProps {
  user: User;
  clients: MonthlyClient[];
  checkins: DailyCheckin[];
  workers: User[];
  onLogout: () => void;
  onAddClient: (client: any) => void;
  onRenewClient: (id: string) => void;
  onDeleteClient: (id: string) => void;
  onAddCheckin: (checkin: any) => void;
  onDeleteWorker: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, clients, checkins, workers, onLogout, onAddClient, onRenewClient, onDeleteClient, onAddCheckin, onDeleteWorker
}) => {
  const [activeView, setActiveView] = useState<View>(user.role === 'admin' ? 'overview' : 'payments');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const alertsCount = useMemo(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return clients.filter(c => new Date(c.expiryDate) <= nextWeek).length;
  }, [clients]);

  const NavItem: React.FC<{ view: View; label: string; icon: string; badge?: number }> = ({ view, label, icon, badge }) => (
    <button
      onClick={() => { setActiveView(view); setIsMobileMenuOpen(false); }}
      className={`relative flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all w-full text-left font-bold ${
        activeView === view 
          ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 ring-4 ring-indigo-50' 
          : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="flex-1 text-sm">{label}</span>
      {badge ? <span className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-black animate-pulse">{badge}</span> : null}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs">GM</div>
          <span className="font-black text-slate-800 tracking-tighter">GymManager</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-slate-50 rounded-xl text-slate-600"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 p-6 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="hidden md:flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 text-xl font-black">GM</div>
          <h1 className="text-xl font-black text-slate-800 tracking-tighter">GymManager</h1>
        </div>
        
        <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar">
          {user.role === 'admin' && (
            <div className="pb-4">
              <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-3">Business Intelligence</p>
              <div className="space-y-1">
                <NavItem view="overview" label="Performance" icon="📈" />
                <NavItem view="history" label="Fluxo de Caixa" icon="🏦" />
                <NavItem view="workers" label="Equipa" icon="👥" />
              </div>
            </div>
          )}
          <div className="pb-4">
            <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-3">Front Desk</p>
            <div className="space-y-1">
              <NavItem view="payments" label="Caixa / Vendas" icon="💰" />
              <NavItem view="alerts" label="Alertas" icon="🔔" badge={alertsCount} />
              <NavItem view="monthly" label="Sócios Mensais" icon="👤" />
              <NavItem view="daily" label="Check-ins" icon="☀️" />
            </div>
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100 flex items-center gap-4">
           <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-500 shadow-inner">
             {user.name.charAt(0).toUpperCase()}
           </div>
           <div className="flex-1 min-w-0">
             <p className="text-xs font-black text-slate-800 truncate">{user.name}</p>
             <button onClick={onLogout} className="text-[0.65rem] text-red-500 font-black hover:underline uppercase tracking-widest">Encerrar Sessão</button>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen no-scrollbar relative">
        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto animate-in pb-24 md:pb-12">
          {activeView === 'overview' && <Overview userRole={user.role} clients={clients} checkins={checkins} userName={user.name} />}
          {activeView === 'history' && <FinancialHistory clients={clients} checkins={checkins} />}
          {activeView === 'workers' && <WorkerManagement workers={workers} onDeleteWorker={onDeleteWorker} />}
          {activeView === 'payments' && <Payments onAddClient={onAddClient} onAddCheckin={onAddCheckin} onNavigate={setActiveView} />}
          {activeView === 'monthly' && <MonthlyManagement clients={clients} onAddClient={onAddClient} onRenewClient={onRenewClient} onDeleteClient={onDeleteClient} onNavigate={setActiveView} userRole={user.role} />}
          {activeView === 'daily' && <DailyManagement checkins={checkins} onAddCheckin={onAddCheckin} onNavigate={setActiveView} userRole={user.role} />}
          {activeView === 'alerts' && <Notifications clients={clients} onRenewClient={onRenewClient} onDeleteClient={onDeleteClient} />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;