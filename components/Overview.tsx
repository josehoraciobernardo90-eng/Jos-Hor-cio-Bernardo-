import React, { useMemo, useState, useEffect } from 'react';
import { MonthlyClient, DailyCheckin, UserRole } from '../types';
import { CURRENCY_FORMATTER } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getGymInsights } from '../geminiService';

interface OverviewProps {
  clients: MonthlyClient[];
  checkins: DailyCheckin[];
  userName: string;
  userRole: UserRole;
}

const Overview: React.FC<OverviewProps> = ({ clients, checkins, userName, userRole }) => {
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const revenueMonthly = clients.reduce((acc, c) => acc + c.amountPaid, 0);
    const revenueDaily = checkins.reduce((acc, c) => acc + c.amount, 0);
    const dailyToday = checkins.filter(c => c.checkinTime.startsWith(today)).reduce((acc, c) => acc + c.amount, 0);
    
    return {
      activeClients: clients.filter(c => c.status === 'active').length,
      totalRevenue: revenueMonthly + revenueDaily,
      todayRevenue: dailyToday,
      checkinsCount: checkins.filter(c => c.checkinTime.startsWith(today)).length
    };
  }, [clients, checkins]);

  useEffect(() => {
    const loadAi = async () => {
      setIsAiLoading(true);
      const tip = await getGymInsights({
        totalClients: clients.length,
        activeMonthly: stats.activeClients,
        dailyToday: stats.checkinsCount,
        revenueMonthly: stats.totalRevenue,
        revenueDaily: stats.todayRevenue
      });
      setAiTip(tip);
      setIsAiLoading(false);
    };
    if (userRole === 'admin') loadAi();
  }, [userRole]);

  if (userRole !== 'admin') return <div className="p-20 text-center font-bold text-slate-400">Restrito ao Administrador</div>;

  const chartData = [
    { name: 'Mensalidades', value: clients.reduce((acc, c) => acc + c.amountPaid, 0), color: '#4f46e5' },
    { name: 'Diários', value: checkins.reduce((acc, c) => acc + c.amount, 0), color: '#10b981' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Bem-vindo, {userName} 👋</h1>
          <p className="text-slate-500 font-medium">Relatórios estratégicos consolidados (Offline).</p>
        </div>
        <div className="bg-slate-100 text-slate-600 px-4 py-2 rounded-2xl text-[0.65rem] font-black uppercase tracking-widest border border-slate-200 flex items-center gap-2">
          <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
          Armazenamento Local Ativo
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Caixa Total Local" value={CURRENCY_FORMATTER.format(stats.totalRevenue)} icon="💰" color="bg-indigo-600" />
        <StatCard label="Entradas Hoje" value={CURRENCY_FORMATTER.format(stats.todayRevenue)} icon="📅" color="bg-emerald-600" />
        <StatCard label="Sócios Ativos" value={stats.activeClients} icon="👤" color="bg-amber-600" />
        <StatCard label="Check-ins Hoje" value={stats.checkinsCount} icon="☀️" color="bg-slate-800" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="font-black text-slate-800 mb-8 uppercase text-xs tracking-widest text-slate-400">Distribuição de Receita</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold', fontSize: 10}} />
                <YAxis hide />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={60}>
                  {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">✨</span>
                <h3 className="font-black text-xs uppercase tracking-widest text-indigo-300">Dicas da IA Business</h3>
              </div>
              {isAiLoading ? (
                <div className="space-y-3">
                  <div className="h-2 w-full bg-white/10 rounded animate-pulse"></div>
                  <div className="h-2 w-2/3 bg-white/10 rounded animate-pulse"></div>
                  <div className="h-2 w-1/2 bg-white/10 rounded animate-pulse"></div>
                </div>
              ) : (
                <p className="text-sm font-medium leading-relaxed text-indigo-50/80 italic">
                  {aiTip || "Gerando insights para o seu ginásio..."}
                </p>
              )}
           </div>
           <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none">
             <span className="text-9xl">💪</span>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }: any) => (
  <div className={`${color} p-6 rounded-[2.2rem] text-white shadow-lg border border-white/10`}>
    <div className="flex items-center gap-2 mb-2 opacity-80">
      <span className="text-lg">{icon}</span>
      <p className="text-[0.6rem] font-black uppercase tracking-widest">{label}</p>
    </div>
    <h4 className="text-2xl font-black">{value}</h4>
  </div>
);

export default Overview;