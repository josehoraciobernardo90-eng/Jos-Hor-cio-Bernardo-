
import React from 'react';
import { User } from '../types';

interface WorkerManagementProps {
  workers: User[];
  onDeleteWorker: (id: string) => void;
}

const WorkerManagement: React.FC<WorkerManagementProps> = ({ workers, onDeleteWorker }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h1 className="text-3xl font-black text-slate-800">👥 Minha Equipa</h1>
        <p className="text-slate-500">Gestão de acesso e colaboradores autorizados.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workers.map(worker => (
          <div key={worker.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center text-center relative group">
            <button 
              onClick={() => onDeleteWorker(worker.id)}
              className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Remover
            </button>
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl mb-4 font-black text-slate-400 uppercase">
              {worker.name.charAt(0)}
            </div>
            <h3 className="font-black text-slate-800 text-lg">{worker.name}</h3>
            <p className="text-xs text-slate-400 font-bold uppercase mb-4 tracking-tighter">{worker.email}</p>
            <div className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[0.65rem] font-black uppercase">
              Colaborador Ativo
            </div>
          </div>
        ))}
        <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center hover:border-indigo-400 transition-colors cursor-pointer group">
           <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">➕</span>
           <p className="text-sm font-bold text-slate-400">Novo Colaborador</p>
           <p className="text-[0.6rem] text-slate-300 font-bold uppercase mt-1">Regista-se ao entrar no login</p>
        </div>
      </div>
    </div>
  );
};

export default WorkerManagement;
