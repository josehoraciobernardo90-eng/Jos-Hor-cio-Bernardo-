import React, { useMemo, useState } from 'react';
import { MonthlyClient, DailyCheckin } from '../types';
import { CURRENCY_FORMATTER } from '../constants';

interface FinancialHistoryProps {
  clients: MonthlyClient[];
  checkins: DailyCheckin[];
}

const FinancialHistory: React.FC<FinancialHistoryProps> = ({ clients, checkins }) => {
  const [filter, setFilter] = useState('');

  const history = useMemo(() => {
    const unified = [
      ...clients.map(c => ({
        id: c.id,
        date: c.startDate,
        name: c.name,
        type: 'Mensalidade',
        amount: c.amountPaid,
        by: c.registeredBy
      })),
      ...checkins.map(c => ({
        id: c.id,
        date: c.checkinTime.split('T')[0],
        name: c.name || 'Anónimo',
        type: 'Check-in Diário',
        amount: c.amount,
        by: c.registeredBy
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return unified.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase()) || 
      item.type.toLowerCase().includes(filter.toLowerCase())
    );
  }, [clients, checkins, filter]);

  const total = useMemo(() => history.reduce((acc, curr) => acc + curr.amount, 0), [history]);

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-800">🏦 Fluxo de Caixa</h1>
          <p className="text-slate-500">Histórico completo de transações locais.</p>
        </div>
        <div className="text-right">
          <p className="text-[0.6rem] font-black text-slate-400 uppercase">Volume Total Gerado</p>
          <p className="text-3xl font-black text-emerald-600">{CURRENCY_FORMATTER.format(total)}</p>
        </div>
      </header>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <input 
            type="text" 
            placeholder="Pesquisar por cliente ou tipo..."
            className="w-full max-w-md px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4">Data</th>
                <th className="px-8 py-4">Cliente</th>
                <th className="px-8 py-4">Tipo</th>
                <th className="px-8 py-4 text-center">Valor</th>
                <th className="px-8 py-4 text-right">Auditor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {history.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-all">
                  <td className="px-8 py-4 font-bold text-slate-400">{new Date(item.date).toLocaleDateString('pt-MZ')}</td>
                  <td className="px-8 py-4 font-black text-slate-800">{item.name}</td>
                  <td className="px-8 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[0.65rem] font-black uppercase ${
                      item.type === 'Mensalidade' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>{item.type}</span>
                  </td>
                  <td className="px-8 py-4 text-center font-black text-slate-700">{CURRENCY_FORMATTER.format(item.amount)}</td>
                  <td className="px-8 py-4 text-right">
                    <span className="text-xs font-bold text-slate-400">{item.by || 'Sistema'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialHistory;