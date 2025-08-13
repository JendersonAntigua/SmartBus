import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Login />;
  }
  
  // Si el usuario es Admin, mostrar vista de administrador
  if (user?.username === 'Admin') {
    return <AdminDashboard />;
  }
  
  // Para usuarios normales, mostrar dashboard regular
  return <Dashboard />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
