import React, { useState, useRef, useMemo } from 'react';
import { DailyCheckin, UserRole, View } from '../types';
import { CURRENCY_FORMATTER } from '../constants';

interface DailyManagementProps {
  checkins: DailyCheckin[];
  onAddCheckin: (checkin: Omit<DailyCheckin, 'id' | 'checkinTime' | 'registeredBy'>) => void;
  onNavigate: (view: View) => void;
  userRole: UserRole;
}

const DailyManagement: React.FC<DailyManagementProps> = ({ checkins, onAddCheckin, onNavigate, userRole }) => {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    address: '', 
    contact: '', 
    amount: 500.00 
  });

  const todayStr = new Date().toLocaleDateString('pt-MZ');

  // Lógica de visualização: Filtra por hoje para trabalhadores, permite histórico para admin
  const displayCheckins = useMemo(() => {
    let list = [...checkins];
    if (!showFullHistory) {
      list = list.filter(c => new Date(c.checkinTime).toLocaleDateString('pt-MZ') === todayStr);
    }
    return list.sort((a, b) => new Date(b.checkinTime).getTime() - new Date(a.checkinTime).getTime());
  }, [checkins, todayStr, showFullHistory]);

  // Total do dia sempre atualizado (independente do filtro visual de histórico)
  const totalToday = useMemo(() => {
    return checkins
      .filter(c => new Date(c.checkinTime).toLocaleDateString('pt-MZ') === todayStr)
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [checkins, todayStr]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCheckin({ 
      name: formData.name, 
      email: formData.email, 
      address: formData.address, 
      contact: formData.contact, 
      amount: formData.amount 
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
    setFormData({ name: '', email: '', address: '', contact: '', amount: 500.00 });
    nameInputRef.current?.focus();
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">☀️ Check-in Diário</h1>
          <p className="text-slate-500">Gestão de fluxo diário. Os dados são salvos no seu navegador.</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-xl shadow-inner">💰</div>
          <div>
            <p className="text-[0.6rem] font-black text-emerald-600 uppercase tracking-widest mb-0.5">Total Arrecadado Hoje</p>
            <p className="text-xl font-black text-slate-800">{CURRENCY_FORMATTER.format(totalToday)}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Formulário de Registro */}
        <div className="xl:col-span-1 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 h-fit sticky top-8">
          {showSuccess && (
             <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-2 rounded-xl text-[0.6rem] font-black shadow-lg animate-bounce z-20 uppercase">
               ✅ Registo Guardado
             </div>
          )}
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">＋</span>
            Nova Entrada
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 tracking-widest">Nome Cliente</label>
              <input ref={nameInputRef} type="text" required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm bg-slate-50 transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Ex: João Mavila" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 tracking-widest">Valor Recebido (MT)</label>
              <input type="number" step="0.01" required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm bg-slate-50 font-black" value={formData.amount} onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})} />
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-xl shadow-lg text-sm uppercase transition-all active:scale-95">Registrar Entrada</button>
          </form>
        </div>

        {/* Tabela de Auditoria */}
        <div className="xl:col-span-3 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                {showFullHistory ? '📜 Histórico Completo' : '📑 Movimento de Hoje'}
              </h3>
              <p className="text-[0.65rem] text-slate-400 font-bold uppercase tracking-tight">
                {showFullHistory ? 'Todos os registos salvos localmente' : 'A lista limpa-se visualmente a cada novo dia'}
              </p>
            </div>

            {userRole === 'admin' && (
              <button 
                onClick={() => setShowFullHistory(!showFullHistory)}
                className={`px-4 py-2 rounded-xl text-[0.6rem] font-black uppercase tracking-widest transition-all border ${
                  showFullHistory 
                  ? 'bg-slate-800 text-white border-slate-800' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm'
                }`}
              >
                {showFullHistory ? 'Mostrar Apenas Hoje' : 'Ver Todo Histórico'}
              </button>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest">Data / Hora</th>
                  <th className="px-6 py-4 text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest">Cliente</th>
                  <th className="px-6 py-4 text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest text-center">Valor</th>
                  <th className="px-6 py-4 text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest text-right">Registado por</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayCheckins.map(checkin => (
                  <tr key={checkin.id} className={`hover:bg-slate-50/80 transition-colors ${new Date(checkin.checkinTime).toLocaleDateString('pt-MZ') !== todayStr ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                    <td className="px-6 py-5 whitespace-nowrap text-[0.6rem] font-black text-slate-400">
                      <div className="uppercase">{new Date(checkin.checkinTime).toLocaleDateString('pt-MZ')}</div>
                      <div className="text-indigo-600">{new Date(checkin.checkinTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap font-black text-slate-800 text-sm">{checkin.name || 'Anónimo'}</td>
                    <td className="px-6 py-5 whitespace-nowrap font-black text-emerald-600 text-sm text-center">{CURRENCY_FORMATTER.format(checkin.amount)}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs font-bold text-slate-600">{checkin.registeredBy || 'Sistema'}</span>
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[0.5rem] font-black text-slate-400 uppercase">
                          {checkin.registeredBy?.charAt(0) || 'S'}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {displayCheckins.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-slate-300 italic uppercase font-bold text-[0.6rem] tracking-widest">
                      Nenhuma entrada registada para este período.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
             <span className="text-[0.55rem] font-black text-slate-400 uppercase tracking-[0.2em]">🛡️ Auditoria Local Ativa - Armazenamento Interno</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyManagement;