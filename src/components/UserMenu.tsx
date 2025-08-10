import React, { useState } from 'react';
import { User, Moon, Sun, MessageSquare, LogOut, X, ArrowLeft, Send, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Complaint {
  id: string;
  type: 'queja' | 'sugerencia';
  message: string;
  date: string;
  status: 'pendiente' | 'revisado';
}

const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });
  const [currentView, setCurrentView] = useState<'menu' | 'complaints' | 'view-complaints'>('menu');
  const [complaintType, setComplaintType] = useState<'queja' | 'sugerencia'>('queja');
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

  // Resetear vista al menú principal cuando se abra o cierre el modal
  React.useEffect(() => {
    if (isOpen) {
      setCurrentView('menu');
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

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
        {/* Modo Claro/Oscuro */}
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

        {/* Buzón de Quejas y Sugerencias */}
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

        {/* Cerrar Sesión */}
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
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="queja"
                checked={complaintType === 'queja'}
                onChange={() => setComplaintType('queja')}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Queja</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="sugerencia"
                checked={complaintType === 'sugerencia'}
               onChange={(e) => setComplaintType(e.target.value as 'queja' | 'sugerencia')}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Sugerencia</span>
            </label>
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
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            placeholder={`Escribe tu ${complaintType} aquí...`}
          />
        </div>

        {/* Botones */}
        <div className="space-y-3">
          <button
            onClick={handleSubmitComplaint}
            disabled={!complaintMessage.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {complaintType === 'queja' ? 'Enviar Queja' : 'Enviar Sugerencia'}
          </button>

          <button
            onClick={() => setCurrentView('view-complaints')}
            className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Ver mis quejas y sugerencias
          </button>
        </div>
      </div>
    </div>
  );

  const renderViewComplaints = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentView('complaints')} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mis Quejas y Sugerencias</h2>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {complaints.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">No tienes quejas o sugerencias enviadas</p>
        ) : (
          complaints.map((complaint) => (
            <div key={complaint.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    complaint.type === 'queja' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {complaint.type === 'queja' ? 'Queja' : 'Sugerencia'}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    complaint.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {complaint.status === 'pendiente' ? 'Pendiente' : 'Revisado'}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{complaint.date}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{complaint.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 sm:p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto mx-4">
        {currentView === 'menu' && renderMenu()}
        {currentView === 'complaints' && renderComplaints()}
        {currentView === 'view-complaints' && renderViewComplaints()}
      </div>
    </div>
  );
};

export default UserMenu;