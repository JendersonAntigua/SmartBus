import React, { useState } from 'react';
import { User, Moon, Sun, MessageSquare, LogOut, X, ArrowLeft, Send, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

type ComplaintType = 'queja' | 'sugerencia';

interface Complaint {
  id: string;
  type: ComplaintType;
  message: string;
  date: string;
  status: 'pendiente' | 'revisado';
}

const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  });
  const [currentView, setCurrentView] = useState<'menu' | 'complaints' | 'view-complaints'>('menu');
  const [complaintType, setComplaintType] = useState<ComplaintType>('queja');
  const [complaintMessage, setComplaintMessage] = useState('');
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: '1',
      type: 'queja',
      message: 'El autobús llegó 15 minutos tarde en la ruta Centro - Zona Colonial',
      date: '2024-01-15',
      status: 'revisado'
    },
    {
      id: '2',
      type: 'sugerencia',
      message: 'Sería útil tener más información sobre los horarios en tiempo real',
      date: '2024-01-10',
      status: 'pendiente'
    }
  ]);

  React.useEffect(() => {
    if (isOpen) setCurrentView('menu');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark:bg-gray-900');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark:bg-gray-900');
      localStorage.setItem('darkMode', 'false');
    }
  };

  const handleSubmitComplaint = () => {
    if (complaintMessage.trim()) {
      const newComplaint: Complaint = {
        id: Date.now().toString(),
        type: complaintType,
        message: complaintMessage,
        date: new Date().toISOString().split('T')[0],
        status: 'pendiente'
      };
      setComplaints([newComplaint, ...complaints]);
      setComplaintMessage('');
      alert(`${complaintType === 'queja' ? 'Queja' : 'Sugerencia'} enviada exitosamente`);
      setCurrentView('menu');
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComplaintType(e.target.value as ComplaintType);
  };

  const renderMenu = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Hola, {user?.username}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Configuración de usuario</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleToggleDarkMode}
          className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-600" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Modo {isDarkMode ? 'Claro' : 'Oscuro'}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Cambiar apariencia</div>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5 ${isDarkMode ? 'translate-x-6 ml-1' : 'translate-x-1'}`} />
            </div>
          </div>
        </button>

        <button
          onClick={() => setCurrentView('complaints')}
          className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Buzón de Quejas y Sugerencias</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Envía tu opinión</div>
            </div>
          </div>
        </button>

        <button
          onClick={logout}
          className="w-full p-4 border border-red-200 dark:border-red-800 rounded-lg hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="font-medium text-red-900 dark:text-red-300">Cerrar Sesión</div>
              <div className="text-sm text-red-600 dark:text-red-400">Salir de la aplicación</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  const renderComplaints = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentView('menu')} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Buzón de Quejas y Sugerencias</h2>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Tipo de mensaje */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo de mensaje
          </label>

          <div className="flex gap-6 items-center">
            <div className="flex items-center">
              <input
                id="radio-queja"
                type="radio"
                name="tipo"
                value="queja"
                checked={complaintType === 'queja'}
                onChange={handleTypeChange}
                className="mr-2"
              />
              <label htmlFor="radio-queja" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                Queja
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="radio-sugerencia"
                type="radio"
                name="tipo"
                value="sugerencia"
                checked={complaintType === 'sugerencia'}
                onChange={handleTypeChange}
                className="mr-2"
              />
              <label htmlFor="radio-sugerencia" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                Sugerencia
              </label>
            </div>
          </div>
        </div>

        {/* Mensaje */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tu {complaintType}
          </label>
          <textarea
            value={complaintMessage}
            onChange={(e) => setComplaintMessage(e.target.value)}
