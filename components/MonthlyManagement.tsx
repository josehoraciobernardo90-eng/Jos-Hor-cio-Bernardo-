
import React, { useState, useRef, useMemo } from 'react';
import { MonthlyClient, MembershipType, UserRole, View } from '../types';
import { PLAN_LABELS, CURRENCY_FORMATTER, PLAN_MONTHS } from '../constants';

interface MonthlyManagementProps {
  clients: MonthlyClient[];
  onAddClient: (client: any) => void;
  onRenewClient: (id: string) => void;
  onDeleteClient: (id: string) => void;
  onNavigate: (view: View) => void;
  userRole: UserRole;
}

const MonthlyManagement: React.FC<MonthlyManagementProps> = ({ clients, onAddClient, onRenewClient, onDeleteClient, onNavigate, userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', address: '', contact: '',
    startDate: new Date().toISOString().split('T')[0],
    plan: MembershipType.MONTHLY, amountPaid: 0
  });

  const filteredClients = useMemo(() => 
    clients.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.contact.includes(searchTerm)
    ).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()),
    [clients, searchTerm]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const months = PLAN_MONTHS[formData.plan];
    const start = new Date(formData.startDate);
    const expiry = new Date(start);
    expiry.setMonth(start.getMonth() + months);

    onAddClient({
      ...formData,
      contact: formData.contact.startsWith('+') ? formData.contact : `+258${formData.contact}`,
      expiryDate: expiry.toISOString().split('T')[0]
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setFormData({ ...formData, name: '', email: '', contact: '', amountPaid: 0 });
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">👤 Mensalistas</h1>
          <p className="text-slate-500">Base de dados central de sócios.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <input 
            type="text" 
            placeholder="Procurar cliente..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm h-fit">
          <h3 className="text-lg font-black text-slate-800 mb-6">Novo Registo</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
             <input type="text" placeholder="Nome Completo" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
             <input type="tel" placeholder="Contacto (8x)" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
             <div className="grid grid-cols-2 gap-2">
                <select className="px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" value={formData.plan} onChange={e => setFormData({...formData, plan: e.target.value as MembershipType})}>
                  <option value="1m">Mensal</option>
                  <option value="3m">Trimestral</option>
                  <option value="anual">Anual</option>
                </select>
                <input type="number" placeholder="Valor MT" required className="px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black" value={formData.amountPaid || ''} onChange={e => setFormData({...formData, amountPaid: parseFloat(e.target.value)})} />
             </div>
             <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl shadow-lg shadow-indigo-100 uppercase text-xs">Registar</button>
          </form>
        </div>

        <div className="lg:col-span-3 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 text-[0.6rem] font-black text-slate-400 uppercase tracking-widest">
                 <tr>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Expira</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 text-sm">
                 {filteredClients.map(c => {
                   const expired = new Date(c.expiryDate) < new Date();
                   return (
                     <tr key={c.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <p className="font-black text-slate-800">{c.name}</p>
                          <p className="text-[0.65rem] font-bold text-slate-400">{c.contact}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-lg text-[0.6rem] font-black uppercase ${expired ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                            {expired ? 'Vencido' : 'Ativo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-500">{new Date(c.expiryDate).toLocaleDateString('pt-MZ')}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                           <button onClick={() => onRenewClient(c.id)} className="text-indigo-600 font-black text-[0.65rem] hover:underline uppercase">Renovar</button>
                           {userRole === 'admin' && <button onClick={() => onDeleteClient(c.id)} className="text-red-400 font-black text-[0.65rem] hover:underline uppercase">Apagar</button>}
                        </td>
                     </tr>
                   )
                 })}
               </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyManagement;
