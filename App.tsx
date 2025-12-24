import React, { useState, useEffect } from 'react';
import { User, MonthlyClient, DailyCheckin } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { PLAN_MONTHS } from './constants';

const App: React.FC = () => {
  const [workers, setWorkers] = useState<User[]>(() => {
    const saved = localStorage.getItem('gym_workers');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('gym_manager_user');
    const loginDate = localStorage.getItem('gym_manager_login_date');
    const today = new Date().toISOString().split('T')[0];
    if (saved && loginDate !== today) {
      localStorage.removeItem('gym_manager_user');
      localStorage.removeItem('gym_manager_login_date');
      return null;
    }
    return saved ? JSON.parse(saved) : null;
  });

  const [clients, setClients] = useState<MonthlyClient[]>(() => {
    const saved = localStorage.getItem('gym_clients');
    return saved ? JSON.parse(saved) : [];
  });

  const [checkins, setCheckins] = useState<DailyCheckin[]>(() => {
    const saved = localStorage.getItem('gym_checkins');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('gym_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('gym_checkins', JSON.stringify(checkins));
  }, [checkins]);

  useEffect(() => {
    localStorage.setItem('gym_workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    if (currentUser) {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem('gym_manager_user', JSON.stringify(currentUser));
      localStorage.setItem('gym_manager_login_date', today);
    }
  }, [currentUser]);

  const handleLogin = async (passcode: string, name?: string): Promise<User | null> => {
    if (passcode === '2222') {
      const admin = { id: 'admin-master', name: 'Gerente Geral', email: 'admin@gym.com', role: 'admin' as const, passcode: '2222' };
      setCurrentUser(admin);
      return admin;
    }

    if (passcode === '0000' && name) {
      const trimmed = name.trim();
      const existingWorker = workers.find(w => w.name.toLowerCase() === trimmed.toLowerCase());
      
      if (existingWorker) {
        setCurrentUser(existingWorker);
        return existingWorker;
      }

      // Create new worker if not found
      const newUser: User = { 
        id: crypto.randomUUID(),
        name: trimmed, 
        email: `${trimmed.toLowerCase().replace(/\s+/g, '')}@gym.com`, 
        passcode: '0000', 
        role: 'worker' as const 
      };
      setWorkers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      return newUser;
    }
    return null;
  };

  const addClient = (data: any) => {
    const newClient: MonthlyClient = {
      ...data,
      id: crypto.randomUUID(),
      status: 'active',
      registeredBy: currentUser?.name || 'Sistema'
    };
    setClients(prev => [newClient, ...prev]);
  };

  const renewClient = (id: string) => {
    setClients(prev => prev.map(c => {
      if (c.id === id) {
        const start = new Date();
        const expiry = new Date(c.expiryDate);
        const base = expiry < start ? start : expiry;
        base.setMonth(base.getMonth() + (PLAN_MONTHS[c.plan] || 1));
        return {
          ...c,
          startDate: start.toISOString().split('T')[0],
          expiryDate: base.toISOString().split('T')[0],
          status: 'active'
        };
      }
      return c;
    }));
  };

  const deleteClient = (id: string) => {
    if (confirm("Apagar cliente?")) {
      setClients(prev => prev.filter(c => c.id !== id));
    }
  };

  const addCheckin = (data: any) => {
    const newCheckin: DailyCheckin = {
      ...data,
      id: crypto.randomUUID(),
      checkinTime: new Date().toISOString(),
      registeredBy: currentUser?.name || 'Sistema'
    };
    setCheckins(prev => [newCheckin, ...prev]);
  };

  const deleteWorker = (id: string) => {
    if (confirm("Remover acesso deste trabalhador?")) {
      setWorkers(prev => prev.filter(w => w.id !== id));
    }
  };

  if (!currentUser) return <Login onLogin={handleLogin} />;

  return (
    <div className="relative">
      <Dashboard 
        user={currentUser}
        clients={clients}
        checkins={checkins}
        workers={workers}
        onLogout={() => setCurrentUser(null)}
        onAddClient={addClient}
        onRenewClient={renewClient}
        onDeleteClient={deleteClient}
        onAddCheckin={addCheckin}
        onDeleteWorker={deleteWorker}
      />
    </div>
  );
};

export default App;