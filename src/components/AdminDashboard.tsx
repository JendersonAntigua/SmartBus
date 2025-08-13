import React, { useState } from 'react';
import { Bus, AlertTriangle, Clock, CheckCircle, Info, User, LogOut, X, ArrowLeft } from 'lucide-react';
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
    setFaults(prev => prev.filter(f => f.id !== faultId));
    setSelectedFault(null);
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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bus className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">SMARTBUS</h1>
                <p className="text-blue-200 text-sm">Rastrea autobuses en tiempo real y planifica tu viaje</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-green-600 px-4 py-2 rounded-lg">
                <span className="text-yellow-400 font-semibold">QR y Saldo: RD$ 0</span>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-blue-700/50 hover:bg-blue-600/70 px-3 py-2 rounded-lg transition-all duration-200 border border-blue-600/30 hover:border-blue-500/50 backdrop-blur-sm"
                >
                  <User className="w-5 h-5" />
                  <span className="text-white font-bold">Hola, {user?.username}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 min-w-[200px] z-50">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-red-600 dark:text-red-400"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-red-600">{stats.criticas}</h3>
                <p className="text-gray-600 text-sm">Críticas</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-yellow-600">{stats.medias}</h3>
                <p className="text-gray-600 text-sm">Medias</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-blue-600">{stats.bajas}</h3>
                <p className="text-gray-600 text-sm">Bajas</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-green-600">{stats.resueltas}</h3>
                <p className="text-gray-600 text-sm">Resueltas</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fallas Pendientes */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Fallas Pendientes</h2>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Pendientes">Pendientes</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
                <option value="Completadas">Completadas</option>
              </select>
            </div>

            <div className="space-y-3">
              {getFilteredFaults().map((fault) => (
                <div
                  key={fault.id}
                  onClick={() => setSelectedFault(fault)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getPriorityIcon(fault.type)}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">{fault.type}</h3>
                        <p className="text-sm text-gray-600">{fault.busId}</p>
                        <p className="text-sm text-gray-500">{fault.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(fault.priority)}`}>
                        {fault.priority}
                      </span>
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-2">
                        <Info className="w-4 h-4 text-red-600" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rendimiento de Autobuses */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento de Autobuses</h2>
            
            <div className="space-y-4">
              {busPerformance.map((bus) => (
                <div key={bus.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{bus.id}</h3>
                      <p className="text-sm text-gray-600">{bus.route}</p>
                      <p className="text-sm text-gray-500">{bus.driver}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(bus.status)}`}>
                      {bus.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex gap-4">
                      <span className="text-red-600">{bus.alta} Alta</span>
                      <span className="text-yellow-600">{bus.media} Media</span>
                      <span className="text-blue-600">{bus.baja} Baja</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span>📅 Mantenimiento: {bus.maintenance}</span>
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Eficiencia</span>
                      <span>{bus.efficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${bus.efficiency >= 70 ? 'bg-green-500' : bus.efficiency >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${bus.efficiency}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Detalle de Falla */}
      {selectedFault && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Detalle de Falla</h2>
                <button 
                  onClick={() => setSelectedFault(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">{getPriorityIcon(selectedFault.type)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedFault.type}</h3>
                    <p className="text-sm text-gray-600">{selectedFault.busId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Prioridad</span>
                    <div className="mt-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(selectedFault.priority)}`}>
                        {selectedFault.priority}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Estado</span>
                    <div className="mt-1 flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-red-600">Pendiente</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">Descripción</span>
                  <p className="mt-1 text-sm text-gray-600">{selectedFault.description}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">Detalles Técnicos</span>
                  <p className="mt-1 text-sm text-gray-600">{selectedFault.details}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">Fecha y Hora</span>
                  <p className="mt-1 text-sm text-gray-600">{selectedFault.date}, {selectedFault.time}</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setSelectedFault(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => handleResolveFault(selectedFault.id)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Resolver
                  </button>
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