import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User, Transaction } from '../types';
import { users } from '../data/mockData';

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

  useEffect(() => {
    const savedUser = localStorage.getItem('smartbus_user');
    const savedBalance = localStorage.getItem('smartbus_balance');
    const savedTransactions = localStorage.getItem('smartbus_transactions');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedBalance) {
      setBalance(parseFloat(savedBalance));
    }
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const foundUser = users.find(
      u => u.username.trim() === username.trim() && u.password.trim() === password.trim()
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('smartbus_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setBalance(0);
    setTransactions([]);
    localStorage.removeItem('smartbus_user');
    localStorage.removeItem('smartbus_balance');
    localStorage.removeItem('smartbus_transactions');
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