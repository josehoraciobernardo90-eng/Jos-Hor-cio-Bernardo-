
import React, { useMemo } from 'react';
import { MonthlyClient } from '../types';
import { PLAN_LABELS } from '../constants';

interface NotificationsProps {
  clients: MonthlyClient[];
  onRenewClient: (id: string) => void;
  onDeleteClient: (id: string) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ clients, onRenewClient, onDeleteClient }) => {
  const alerts = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const expired: MonthlyClient[] = [];
    const expiringSoon: MonthlyClient[] = [];

    clients.forEach(client => {
      const expiry = new Date(client.expiryDate);
      if (expiry < today) {
        expired.push(client);
      } else if (expiry <= nextWeek) {
        expiringSoon.push(client);
      }
    });

    return { expired, expiringSoon };
  }, [clients]);

  const totalAlerts = alerts.expired.length + alerts.expiringSoon.length;

  const handleRenew = (id: string, name: string) => {
    if (window.confirm(`Confirmar recebimento de mensalidade e renovação para ${name}?`)) {
      onRenewClient(id);
    }
  };

  const handleDelete = (id: string, name: string) => {
    onDeleteClient(id);
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">🔔 Centro de Alertas</h1>
        <p className="text-slate-500">Controle de renovações e vencimentos críticos.</p>
      </header>

      {totalAlerts === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-slate-800">Tudo em dia!</h3>
          <p className="text-slate-500">Não há mensalidades vencidas ou próximas do vencimento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {/* CRITICAL: EXPIRED */}
          {alerts.expired.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-xs font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                Pagamentos Vencidos ({alerts.expired.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {alerts.expired.map(client => (
                  <div key={client.id} className="bg-white p-6 rounded-2xl border-2 border-red-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center text-xl font-bold">
                        {client.name.charAt(0)}
                      </div>
                      <span className="text-[0.6rem] font-black bg-red-600 text-white px-2 py-1 rounded uppercase">VENCIDO</span>
                    </div>
                    <h4 className="font-black text-slate-800 mb-1">{client.name}</h4>
                    <p className="text-xs text-slate-500 mb-4">{client.contact}</p>
                    <div className="flex items-center justify-between text-[0.7rem] mb-4 p-2 bg-red-50 rounded-lg font-bold">
                      <span className="text-red-700">Venceu em:</span>
                      <span className="text-red-900">{new Date(client.expiryDate).toLocaleDateString('pt-MZ')}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => handleRenew(client.id, client.name)}
                        className="bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-xl transition-all uppercase tracking-widest text-[0.6rem]"
                      >
                        Renovar
                      </button>
                      <button 
                        onClick={() => handleDelete(client.id, client.name)}
                        className="bg-white border border-red-200 text-red-400 hover:bg-red-50 font-black py-3 rounded-xl transition-all uppercase tracking-widest text-[0.6rem]"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* WARNING: EXPIRING SOON */}
          {alerts.expiringSoon.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                Vencendo nos Próximos 7 Dias ({alerts.expiringSoon.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {alerts.expiringSoon.map(client => (
                  <div key={client.id} className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl font-bold">
                        {client.name.charAt(0)}
                      </div>
                      <span className="text-[0.6rem] font-black bg-amber-400 text-white px-2 py-1 rounded uppercase tracking-tighter">PRÓXIMO</span>
                    </div>
                    <h4 className="font-black text-slate-800 mb-1">{client.name}</h4>
                    <p className="text-xs text-slate-500 mb-4">{client.contact}</p>
                    <div className="flex items-center justify-between text-[0.7rem] mb-4 p-2 bg-amber-50 rounded-lg font-bold">
                      <span className="text-amber-700">Vence em:</span>
                      <span className="text-amber-900">{new Date(client.expiryDate).toLocaleDateString('pt-MZ')}</span>
                    </div>
                    <button 
                      onClick={() => handleRenew(client.id, client.name)}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-3 rounded-xl transition-all uppercase tracking-widest text-xs"
                    >
                      Antecipar Renovação
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
