import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User, Transaction } from '../types';
import { users } from '../data/mockData';

// Constante para el timeout de sesión (20 minutos en milisegundos)
const SESSION_TIMEOUT = 20 * 60 * 1000; // 20 minutos

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  useEffect(() => {
    const savedUser = localStorage.getItem('smartbus_user');
    const savedBalance = localStorage.getItem('smartbus_balance');
    const savedTransactions = localStorage.getItem('smartbus_transactions');
    const savedLastActivity = localStorage.getItem('smartbus_last_activity');
    
    if (savedUser && savedLastActivity) {
      const lastActivityTime = parseInt(savedLastActivity);
      const currentTime = Date.now();
      
      // Verificar si han pasado más de 20 minutos desde la última actividad
      if (currentTime - lastActivityTime < SESSION_TIMEOUT) {
        setUser(JSON.parse(savedUser));
        setLastActivity(currentTime);
        localStorage.setItem('smartbus_last_activity', currentTime.toString());
      } else {
        // Sesión expirada, limpiar datos de usuario pero mantener credenciales
        localStorage.removeItem('smartbus_user');
        localStorage.removeItem('smartbus_balance');
        localStorage.removeItem('smartbus_transactions');
        localStorage.removeItem('smartbus_last_activity');
      }
    }
    
    if (savedBalance) {
      setBalance(parseFloat(savedBalance));
    }
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  // Efecto para verificar el timeout de sesión periódicamente
  useEffect(() => {
    if (!user) return;

    const checkSessionTimeout = () => {
      const currentTime = Date.now();
      if (currentTime - lastActivity > SESSION_TIMEOUT) {
        // Sesión expirada
        logout();
        alert('Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente.');
      }
    };

    // Verificar cada minuto
    const interval = setInterval(checkSessionTimeout, 60000);

    return () => clearInterval(interval);
  }, [user, lastActivity]);

  // Efecto para actualizar la última actividad en eventos del usuario
  useEffect(() => {
    if (!user) return;

    const updateActivity = () => {
      const currentTime = Date.now();
      setLastActivity(currentTime);
      localStorage.setItem('smartbus_last_activity', currentTime.toString());
    };

    // Eventos que indican actividad del usuario
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [user]);

  const login = async (username: string, password: string): Promise<boolean> => {
    const foundUser = users.find(
      u => u.username.trim() === username.trim() && u.password.trim() === password.trim()
    );

    if (foundUser) {
      const currentTime = Date.now();
      setUser(foundUser);
      setLastActivity(currentTime);
      localStorage.setItem('smartbus_user', JSON.stringify(foundUser));
      localStorage.setItem('smartbus_last_activity', currentTime.toString());
      
      // Guardar credenciales para recordar (solo username, no password por seguridad)
      localStorage.setItem('smartbus_remembered_username', username);
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setBalance(0);
    setTransactions([]);
    setLastActivity(Date.now());
    localStorage.removeItem('smartbus_user');
    localStorage.removeItem('smartbus_balance');
    localStorage.removeItem('smartbus_transactions');
    localStorage.removeItem('smartbus_last_activity');
    // No remover las credenciales recordadas para que el usuario no tenga que escribirlas de nuevo
  };

  const addTransaction = (amount: number, method: 'mobile' | 'paypal', currency: 'RD$' | 'USD') => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount,
      method,
      currency,
      date: new Date().toISOString(),
      status: 'completed'
    };
    
    const newBalance = balance + amount;
    const newTransactions = [newTransaction, ...transactions];
    
    setBalance(newBalance);
    setTransactions(newTransactions);
    
    localStorage.setItem('smartbus_balance', newBalance.toString());
    localStorage.setItem('smartbus_transactions', JSON.stringify(newTransactions));
    
    // Actualizar última actividad
    const currentTime = Date.now();
    setLastActivity(currentTime);
    localStorage.setItem('smartbus_last_activity', currentTime.toString());
  };

  const value: AuthContextType = {
    user,
    balance,
    transactions,
    login,
    logout,
    addTransaction,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};