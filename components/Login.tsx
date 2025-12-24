
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (passcode: string, name?: string) => Promise<User | null>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [passcode, setPasscode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError('Por favor, informe o seu nome.');
      return;
    }

    if (passcode.length < 4) {
      setError('Informe o código de 4 dígitos.');
      return;
    }

    const user = await onLogin(passcode, name.trim());
    if (!user) {
      setError('Dados inválidos. Verifique o nome e o código.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-700 animate-fadeIn">
        <div className="bg-gradient-to-br from-slate-800 to-black p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="grid grid-cols-4 gap-4 rotate-12 scale-150">
                {[...Array(16)].map((_, i) => <span key={i} className="text-white text-4xl">💪</span>)}
             </div>
          </div>
          <div className="relative z-10">
            <div className="text-5xl mb-4">💪</div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">GymManager</h1>
            <p className="text-slate-400 font-medium tracking-wide uppercase text-[0.65rem] font-bold">Acesso Restrito</p>
          </div>
        </div>
        
        <div className="p-8 md:p-10">
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label className="block text-[0.6rem] font-black text-slate-400 uppercase mb-2 tracking-widest">Seu Nome</label>
              <input 
                type="text"
                required
                className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300"
                placeholder="Ex: João Mavila"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[0.6rem] font-black text-slate-400 uppercase mb-2 tracking-widest text-center">Código de Acesso</label>
              <input 
                type="password" 
                required
                maxLength={4}
                className={`w-full text-center text-4xl tracking-[0.5rem] font-black px-4 py-5 border-2 rounded-2xl focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none bg-slate-50 ${
                  error ? 'border-red-500 bg-red-50' : 'border-slate-100'
                }`}
                placeholder="••••"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
              />
              {error && <p className="mt-4 text-xs text-red-600 font-black text-center uppercase tracking-tight">{error}</p>}
            </div>
            
            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] text-lg uppercase tracking-wider flex items-center justify-center gap-2"
            >
              Entrar Agora
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-[0.65rem] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
              Utilize seu nome e o código de acesso fornecido pela administração para entrar.<br/>
              <span className="text-indigo-400 opacity-60">Sessão protegida por criptografia local.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
