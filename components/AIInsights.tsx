
import React, { useState } from 'react';
import { MonthlyClient, DailyCheckin } from '../types';
import { getGymInsights } from '../geminiService';

interface AIInsightsProps {
  clients: MonthlyClient[];
  checkins: DailyCheckin[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ clients, checkins }) => {
  const [insight, setInsight] = useState<string | null>(null);

  const generateInsights = async () => {
    const today = new Date().toISOString().split('T')[0];
    const stats = {
      totalClients: clients.length,
      activeMonthly: clients.filter(c => c.status === 'active').length,
      dailyToday: checkins.filter(c => c.checkinTime.startsWith(today)).length,
      revenueMonthly: clients.reduce((acc, c) => acc + c.amountPaid, 0),
      revenueDaily: checkins.filter(c => c.checkinTime.startsWith(today)).reduce((acc, c) => acc + c.amount, 0)
    };

    const result = await getGymInsights(stats);
    setInsight(result || "Não foi possível gerar no momento.");
  };

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">🧠 AI Business Coach</h1>
        <p className="text-slate-500">Sugestões baseadas nos seus dados.</p>
      </header>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-indigo-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
             <span className="text-9xl">💡</span>
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-indigo-900 mb-4">Análise Estratégica</h3>
            <p className="text-slate-600 mb-8">
              Clique para receber dicas de melhoria para o ginásio.
            </p>

            <button 
              onClick={generateInsights}
              className="w-full md:w-auto px-8 py-4 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95"
            >
              <span>✨ Gerar Sugestões</span>
            </button>

            {insight && (
              <div className="mt-12 p-6 bg-indigo-50 rounded-2xl border border-indigo-100 animate-fadeIn">
                <div className="flex items-center space-x-2 text-indigo-800 font-bold mb-4">
                  <span>💎</span>
                  <h4>Recomendações</h4>
                </div>
                <div className="prose prose-indigo max-w-none text-indigo-900 whitespace-pre-line leading-relaxed">
                  {insight}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
