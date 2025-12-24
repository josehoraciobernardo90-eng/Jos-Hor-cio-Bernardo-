import React, { useState, useRef, useEffect } from 'react';
import { MonthlyClient, DailyCheckin, MembershipType, View } from '../types';
import { PLAN_MONTHS } from '../constants';

interface PaymentsProps {
  onAddClient: (client: Omit<MonthlyClient, 'id' | 'status' | 'registeredBy'>) => void;
  onAddCheckin: (checkin: Omit<DailyCheckin, 'id' | 'checkinTime' | 'registeredBy'>) => void;
  onNavigate: (view: View) => void;
}

type PaymentMode = 'mensal' | 'diario';

const Payments: React.FC<PaymentsProps> = ({ onAddClient, onAddCheckin, onNavigate }) => {
  const [mode, setMode] = useState<PaymentMode>('mensal');
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastModeRegistered, setLastModeRegistered] = useState<PaymentMode | null>(null);
  const [contactError, setContactError] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    contact: '',
    amount: 0,
    startDate: new Date().toISOString().split('T')[0],
    plan: MembershipType.MONTHLY,
  });

  useEffect(() => {
    nameInputRef.current?.focus();
    if (mode === 'diario') {
      setFormData(prev => ({ ...prev, amount: 500.00 }));
    } else {
      setFormData(prev => ({ ...prev, amount: 0 }));
    }
  }, [mode]);

  const validateMozNumber = (num: string) => {
    const mozRegex = /^8[2-7]\d{7}$/;
    return mozRegex.test(num);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactError('');

    if (formData.contact && !validateMozNumber(formData.contact)) {
      setContactError('Número inválido. Use 9 dígitos (8x).');
      return;
    }

    const fullContact = formData.contact ? `+258${formData.contact}` : '';

    if (mode === 'mensal') {
      const start = new Date(formData.startDate);
      const months = PLAN_MONTHS[formData.plan];
      const expiry = new Date(start);
      expiry.setMonth(start.getMonth() + months);

      onAddClient({
        name: formData.name,
        email: formData.email,
        address: formData.address,
        contact: fullContact,
        amountPaid: formData.amount,
        startDate: formData.startDate,
        expiryDate: expiry.toISOString().split('T')[0],
        plan: formData.plan,
      });
    } else {
      onAddCheckin({
        name: formData.name,
        email: '',
        address: formData.address,
        contact: fullContact,
        amount: formData.amount,
      });
    }

    setLastModeRegistered(mode);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);

    setFormData({
      name: '',
      email: '',
      address: '',
      contact: '',
      amount: mode === 'diario' ? 500 : 0,
      startDate: new Date().toISOString().split('T')[0],
      plan: MembershipType.MONTHLY,
    });
    
    nameInputRef.current?.focus();
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 9);
    setFormData({...formData, contact: val});
    if (val.length > 0 && !/^8[2-7]/.test(val)) {
      setContactError('Prefixos válidos: 82-87');
    } else {
      setContactError('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in">
      <header className="text-center md:text-left mb-4">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">💰 Balcão de Pagamentos</h1>
        <p className="text-slate-500 font-medium mt-1">Registo rápido de entradas e mensalidades.</p>
      </header>

      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        {showSuccess && (
          <div className="absolute top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg animate-bounce z-10 text-[0.65rem] font-black uppercase">
            ✅ Registo Confirmado
          </div>
        )}

        <div className="flex justify-center mb-10">
          <div className="bg-slate-100 p-1.5 rounded-2xl flex w-full max-w-sm">
            <button
              type="button"
              onClick={() => setMode('mensal')}
              className={`flex-1 py-3 rounded-xl font-black text-[0.65rem] uppercase tracking-widest transition-all ${
                mode === 'mensal' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sócios Mensais
            </button>
            <button
              type="button"
              onClick={() => setMode('diario')}
              className={`flex-1 py-3 rounded-xl font-black text-[0.65rem] uppercase tracking-widest transition-all ${
                mode === 'diario' 
                  ? 'bg-white text-emerald-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Diário / Visitante
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-[0.6rem] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
              <input 
                ref={nameInputRef}
                type="text" 
                required
                placeholder="Ex: João Mavila"
                className="w-full px-5 py-4 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all text-sm font-bold bg-slate-50/50"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[0.6rem] font-black text-slate-400 uppercase tracking-widest ml-1">Contacto (Moçambique)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs border-r border-slate-200 pr-3">+258</span>
                <input 
                  type="tel" 
                  required
                  placeholder="84 000 0000"
                  className={`w-full pl-20 pr-4 py-4 border rounded-2xl outline-none focus:ring-4 transition-all text-sm font-black bg-slate-50/50 ${
                    contactError ? 'border-red-400 focus:ring-red-50' : 'border-slate-200 focus:ring-indigo-50 focus:border-indigo-600'
                  }`}
                  value={formData.contact}
                  onChange={handleContactChange}
                />
              </div>
              {contactError && <p className="text-[0.6rem] text-red-500 font-bold mt-1 uppercase italic tracking-tighter">{contactError}</p>}
            </div>
          </div>

          {mode === 'mensal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in">
              <div className="space-y-1.5">
                <label className="block text-[0.6rem] font-black text-slate-400 uppercase tracking-widest ml-1">Início da Validade</label>
                <input 
                  type="date" 
                  required
                  className="w-full px-5 py-4 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-bold bg-slate-50/50"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[0.6rem] font-black text-slate-400 uppercase tracking-widest ml-1">Modalidade de Plano</label>
                <select 
                  className="w-full px-5 py-4 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 text-sm font-black bg-slate-50/50 h-[58px]"
                  value={formData.plan}
                  onChange={(e) => setFormData({...formData, plan: e.target.value as MembershipType})}
                >
                  <option value={MembershipType.MONTHLY}>Mensal (1 Mês)</option>
                  <option value={MembershipType.QUARTERLY}>Trimestral (3 Meses)</option>
                  <option value={MembershipType.ANNUAL}>Anual (12 Meses)</option>
                </select>
              </div>
            </div>
          )}

          <div className="pt-4">
             <div className="space-y-1.5">
              <label className="block text-[0.6rem] font-black text-slate-400 uppercase tracking-widest ml-1 text-center">Valor Total Recebido (MZN)</label>
              <input 
                type="number" 
                required
                className={`w-full px-6 py-5 border-2 rounded-[2rem] outline-none focus:ring-8 transition-all text-3xl font-black text-center ${
                  mode === 'mensal' ? 'border-indigo-100 focus:ring-indigo-50 focus:border-indigo-600' : 'border-emerald-100 focus:ring-emerald-50 focus:border-emerald-600'
                }`}
                value={formData.amount || ''}
                onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={`w-full py-5 rounded-[2rem] font-black text-lg transition-all shadow-2xl active:scale-[0.98] mt-6 tracking-[0.1em] uppercase ${
              mode === 'mensal' 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
            }`}
          >
            {mode === 'mensal' ? 'Registar Sócio' : 'Registar Entrada'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payments;