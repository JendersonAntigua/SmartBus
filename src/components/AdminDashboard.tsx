import React, { useState } from 'react';
import { Bus, AlertTriangle, Clock, CheckCircle, Info, User, LogOut, X, ArrowLeft, Plus, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Fault {
  id: string;
  type: 'Exceso de Velocidad' | 'Falla en Puertas' | 'Aire Acondicionado' | 'Limpiaparabrisas';
  busId: string;
  description: string;
  priority: 'Alta' | 'Media' | 'Baja';
  status: 'Pendiente' | 'Completada';
  date: string;
  time: string;
  details?: string;
  route?: string;
  driver?: string;
}

interface BusPerformance {
  id: string;
  route: string;
  driver: string;
  status: 'Advertencia' | 'Crítico' | 'Normal';
  efficiency: number;
  maintenance: string;
  alta: number;
  media: number;
  baja: number;
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedFault, setSelectedFault] = useState<Fault | null>(null);
  const [filterStatus, setFilterStatus] = useState<'Pendientes' | 'Alta' | 'Media' | 'Baja' | 'Completadas'>('Pendientes');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRegisterFault, setShowRegisterFault] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  });

  // Estados para registro de falla
  const [newFault, setNewFault] = useState({
    type: 'Exceso de Velocidad' as Fault['type'],
    busId: '',
    description: '',
    priority: 'Media' as Fault['priority'],
    details: '',
    route: '',
    driver: ''
  });

  const [faults, setFaults] = useState<Fault[]>([
    {
      id: 'A123456',
      type: 'Exceso de Velocidad',
      busId: 'A123456',
      description: 'Exceso de velocidad detectado',
      priority: 'Alta',
      status: 'Pendiente',
      date: '15/1/2024',
      time: '7:20:00 a. m.',
      details: 'Velocidad excesiva detectada en Av. Kennedy. Límite: 60 km/h, Velocidad registrada: 85 km/h',
      route: 'Ruta Centro - Zona Colonial',
      driver: 'Carlos Pérez'
    },
    {
      id: 'A123456-2',
      type: 'Falla en Puertas',
      busId: 'A123456',
      description: 'Falla en apertura de puerta trasera',
      priority: 'Media',
      status: 'Pendiente',
      date: '15/1/2024',
      time: '8:15:00 a. m.',
      details: 'Puerta trasera presenta dificultades para abrir completamente. Sistema hidráulico requiere revisión.',
      route: 'Ruta Centro - Zona Colonial',
      driver: 'Carlos Pérez'
    },
    {
      id: 'B789012',
      type: 'Aire Acondicionado',
      busId: 'B789012',
      description: 'Sistema de aire acondicionado no funciona',
      priority: 'Alta',
      status: 'Pendiente',
      date: '15/1/2024',
      time: '9:30:00 a. m.',
      details: 'Sistema de climatización completamente fuera de servicio. Temperatura interior excesiva.',
      route: 'Ruta Norte - Sur Expreso',
      driver: 'María González'
    },
    {
      id: 'C345678',
      type: 'Limpiaparabrisas',
      busId: 'C345678',
      description: 'Limpiaparabrisas con movimiento irregular',
      priority: 'Baja',
      status: 'Pendiente',
      date: '15/1/2024',
      time: '7:20:00 a. m.',
      details: 'Limpiaparabrisas derecho presenta movimiento entrecortado. Motor requiere lubricación. No afecta visibilidad crítica.',
      route: 'Ruta Aeropuerto Las Américas',
      driver: 'Roberto Silva'
    }
  ]);

  const [busPerformance] = useState<BusPerformance[]>([
    {
      id: 'A123456',
      route: 'Ruta Centro - Zona Colonial',
      driver: 'Carlos Rodríguez',
      status: 'Advertencia',
      efficiency: 75,
      maintenance: '9/1/2024',
      alta: 1,
      media: 1,
      baja: 0
    },
    {
      id: 'B789012',
      route: 'Ruta Centro - Zona Colonial',
      driver: 'María González',
      status: 'Crítico',
      efficiency: 45,
      maintenance: '8/1/2024',
      alta: 2,
      media: 0,
      baja: 1
    }
  ]);

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

  const getStatsCount = () => {
    const pendingFaults = faults.filter(f => f.status === 'Pendiente');
    return {
      criticas: pendingFaults.filter(f => f.priority === 'Alta').length,
      medias: pendingFaults.filter(f => f.priority === 'Media').length,
      bajas: pendingFaults.filter(f => f.priority === 'Baja').length,
      resueltas: faults.filter(f => f.status === 'Completada').length
    };
  };

  const getFilteredFaults = () => {
    if (filterStatus === 'Pendientes') {
      return faults.filter(f => f.status === 'Pendiente');
    }
    if (filterStatus === 'Completadas') {
      return faults.filter(f => f.status === 'Completada');
    }
    return faults.filter(f => f.status === 'Pendiente' && f.priority === filterStatus);
  };

  const handleResolveFault = (faultId: string) => {
    setFaults(prev => prev.map(f => 
      f.id === faultId 
        ? { ...f, status: 'Completada' as const }
        : f
    ));
    setSelectedFault(null);
  };

  const handleRegisterFault = () => {
    if (!newFault.busId.trim() || !newFault.description.trim()) {
      alert('Por favor completa los campos obligatorios (ID del Bus y Descripción)');
      return;
    }

    const now = new Date();
    const fault: Fault = {
      id: `${newFault.busId}-${Date.now()}`,
      type: newFault.type,
      busId: newFault.busId,
      description: newFault.description,
      priority: newFault.priority,
      status: 'Pendiente',
      date: now.toLocaleDateString('es-DO'),
      time: now.toLocaleTimeString('es-DO'),
      details: newFault.details || newFault.description,
      route: newFault.route || 'No especificada',
      driver: newFault.driver || 'No especificado'
    };

    setFaults(prev => [fault, ...prev]);
    
    // Limpiar formulario
    setNewFault({
      type: 'Exceso de Velocidad',
      busId: '',
      description: '',
      priority: 'Media',
      details: '',
      route: '',
      driver: ''
    });
    
    setShowRegisterFault(false);
    alert('Falla registrada exitosamente');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'text-red-600 bg-red-50 border-red-200';
      case 'Media': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Baja': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityIcon = (type: string) => {
    switch (type) {
      case 'Exceso de Velocidad': return '🚨';
      case 'Falla en Puertas': return '🚪';
      case 'Aire Acondicionado': return '❄️';
      case 'Limpiaparabrisas': return '🔧';
      default: return '⚠️';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Advertencia': return 'text-yellow-600 bg-yellow-50';
      case 'Crítico': return 'text-red-600 bg-red-50';
      case 'Normal': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const stats = getStatsCount();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 via-blue-900 to-slate-900 text-white shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Bus className="w-6 h-6 sm:w-8 sm:h-8" />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold">SMARTBUS</h1>
                <p className="text-blue-200 text-xs sm:text-sm hidden sm:block">Rastrea autobuses en tiempo real y planifica tu viaje</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1 sm:gap-2 bg-blue-700/50 hover:bg-blue-600/70 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 border border-blue-600/30 hover:border-blue-500/50 backdrop-blur-sm text-xs sm:text-sm"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-white font-bold whitespace-nowrap">
                    <span className="hidden sm:inline">Hola, </span>{user?.username}
                  </span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 min-w-[180px] sm:min-w-[200px] z-50">
                    <button
                      onClick={handleToggleDarkMode}
                      className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg transition-colors text-gray-700 dark:text-gray-300 text-sm"
                    >
                      {isDarkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
                      <span>Modo {isDarkMode ? 'Claro' : 'Oscuro'}</span>
                    </button>
                    <div className="border-t border-gray-200 dark:border-gray-600"></div>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg transition-colors text-red-600 dark:text-red-400 text-sm"
                    >
                      <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-red-600">{stats.criticas}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Críticas</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.medias}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Medias</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-blue-600">{stats.bajas}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Bajas</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-green-600">{stats.resueltas}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Resueltas</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Fallas Pendientes */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Fallas Pendientes</h2>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="Pendientes">Pendientes</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
                <option value="Completadas">Completadas</option>
              </select>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {getFilteredFaults().map((fault) => (
                <div
                  key={fault.id}
                  onClick={() => setSelectedFault(fault)}
                  className="p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                      <span className="text-lg sm:text-2xl flex-shrink-0">{getPriorityIcon(fault.type)}</span>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{fault.type}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{fault.busId}</p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{fault.description}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(fault.priority)}`}>
                        {fault.priority}
                      </span>
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mt-1 sm:mt-2 mx-auto">
                        <Info className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Registrar Fallas */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Registrar Fallas</h2>
              <button
                onClick={() => setShowRegisterFault(!showRegisterFault)}
                className="flex items-center gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-sm"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Nueva Falla</span>
                <span className="sm:hidden">Nueva</span>
              </button>
            </div>

            {showRegisterFault && (
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo de Falla *
                  </label>
                  <select
                    value={newFault.type}
                    onChange={(e) => setNewFault({...newFault, type: e.target.value as Fault['type']})}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="Exceso de Velocidad">Exceso de Velocidad</option>
                    <option value="Falla en Puertas">Falla en Puertas</option>
                    <option value="Aire Acondicionado">Aire Acondicionado</option>
                    <option value="Limpiaparabrisas">Limpiaparabrisas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ID del Bus *
                  </label>
                  <input
                    type="text"
                    value={newFault.busId}
                    onChange={(e) => setNewFault({...newFault, busId: e.target.value})}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Ej: A123456"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descripción *
                  </label>
                  <input
                    type="text"
                    value={newFault.description}
                    onChange={(e) => setNewFault({...newFault, description: e.target.value})}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Descripción breve de la falla"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Prioridad
                  </label>
                  <select
                    value={newFault.priority}
                    onChange={(e) => setNewFault({...newFault, priority: e.target.value as Fault['priority']})}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ruta
                  </label>
                  <input
                    type="text"
                    value={newFault.route}
                    onChange={(e) => setNewFault({...newFault, route: e.target.value})}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Ej: Ruta Centro - Zona Colonial"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Conductor
                  </label>
                  <input
                    type="text"
                    value={newFault.driver}
                    onChange={(e) => setNewFault({...newFault, driver: e.target.value})}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Nombre del conductor"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Detalles Técnicos
                  </label>
                  <textarea
                    value={newFault.details}
                    onChange={(e) => setNewFault({...newFault, details: e.target.value})}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    rows={2}
                    placeholder="Detalles adicionales sobre la falla"
                  />
                </div>

                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={() => setShowRegisterFault(false)}
                    className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleRegisterFault}
                    className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Registrar Falla
                  </button>
                </div>
              </div>
            )}

            {!showRegisterFault && (
              <div className="text-center py-6 sm:py-8">
                <Plus className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">Haz clic en "Nueva Falla" para registrar una falla</p>
              </div>
            )}
          </div>
        </div>

        {/* Rendimiento de Autobuses */}
        <div className="mt-4 sm:mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Rendimiento de Autobuses</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {busPerformance.map((bus) => (
              <div key={bus.id} className="p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{bus.id}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{bus.route}</p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{bus.driver}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(bus.status)}`}>
                    {bus.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                  <div className="flex gap-2 sm:gap-4">
                    <span className="text-red-600">{bus.alta} Alta</span>
                    <span className="text-yellow-600">{bus.media} Media</span>
                    <span className="text-blue-600">{bus.baja} Baja</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span>📅 Mantenimiento: {bus.maintenance}</span>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">Eficiencia</span>
                    <span className="text-gray-900 dark:text-white">{bus.efficiency}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 sm:h-2">
                    <div 
                      className={`h-1.5 sm:h-2 rounded-full ${bus.efficiency >= 70 ? 'bg-green-500' : bus.efficiency >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${bus.efficiency}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Detalle de Falla */}
      {selectedFault && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto mx-4">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Detalle de Falla</h2>
                <button 
                  onClick={() => setSelectedFault(null)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-lg sm:text-2xl">{getPriorityIcon(selectedFault.type)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{selectedFault.type}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{selectedFault.busId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Prioridad</span>
                    <div className="mt-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(selectedFault.priority)}`}>
                        {selectedFault.priority}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Estado</span>
                    <div className="mt-1 flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${selectedFault.status === 'Pendiente' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                      <span className={`text-xs sm:text-sm ${selectedFault.status === 'Pendiente' ? 'text-red-600' : 'text-green-600'}`}>
                        {selectedFault.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</span>
                  <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300">{selectedFault.description}</p>
                </div>

                <div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Detalles Técnicos</span>
                  <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300">{selectedFault.details}</p>
                </div>

                <div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Fecha y Hora</span>
                  <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300">{selectedFault.date}, {selectedFault.time}</p>
                </div>

                <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                  <button
                    onClick={() => setSelectedFault(null)}
                    className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                  >
                    Cerrar
                  </button>
                  {selectedFault.status === 'Pendiente' && (
                    <button
                      onClick={() => handleResolveFault(selectedFault.id)}
                      className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Resolver
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay para cerrar menú de usuario */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;