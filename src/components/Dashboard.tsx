import React, { useState } from 'react';
import { Bus, MapPin, Clock, Users, Route as RouteIcon, User, CreditCard, QrCode, X, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { routes, buses, userBalance } from '../data/mockData';
import Map from './Map';
import RouteCard from './RouteCard';
import BusInfo from './BusInfo';
import RechargeModal from './RechargeModal';
import UserMenu from './UserMenu';
import { Route } from '../types';

const Dashboard: React.FC = () => {
  const { user, balance } = useAuth();
  const [selectedRoute, setSelectedRoute] = useState<string>('ruta2');
  const [expandedRoute, setExpandedRoute] = useState<string | null>(null);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [selectedRouteForRecharge, setSelectedRouteForRecharge] = useState<Route | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isBalanceHistoryOpen, setIsBalanceHistoryOpen] = useState(false);
  const [isQRCodeViewOpen, setIsQRCodeViewOpen] = useState(false);

  const selectedRouteData = routes.find(r => r.id === selectedRoute);
  const routeBuses = buses.filter(bus => bus.routeId === selectedRoute);

  const totalActiveBuses = routes.reduce((sum, route) => sum + route.activeBuses, 0);
  const totalRoutes = routes.length;

  // Función para hacer scroll al mapa
  const scrollToMap = () => {
    const mapSection = document.getElementById('map-section');
    if (mapSection) {
      mapSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  // Función para seleccionar ruta y hacer scroll
  const handleRouteSelection = (routeId: string) => {
    setSelectedRoute(routeId);
    // Pequeño delay para asegurar que el estado se actualice antes del scroll
    setTimeout(() => {
      scrollToMap();
    }, 100);
  };

  const handleSelectRouteForRecharge = (route: Route) => {
    setSelectedRouteForRecharge(route);
    setIsRechargeModalOpen(true);
  };
  const handleToggleExpand = (routeId: string) => {
    setExpandedRoute(expandedRoute === routeId ? null : routeId);
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-gray-800 dark:to-gray-900 text-white shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Bus className="w-6 h-6 sm:w-8 sm:h-8" />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold">SMARTBUS</h1>
                <p className="text-blue-200 text-xs sm:text-sm hidden sm:block">Rastrea autobuses en tiempo real y planifica tu viaje</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 flex-shrink-0">
              {/* Saldo */}
              <button
                onClick={() => setIsBalanceHistoryOpen(true)}
                className="flex items-center gap-1 sm:gap-2 bg-green-600 hover:bg-green-700 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm"
              >
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                <span className="text-yellow-400 font-semibold whitespace-nowrap">
                  <span className="hidden sm:inline">QR y Saldo: </span>RD$ {balance}
                </span>
              </button>
              
              {/* Usuario */}
              <div className="flex items-center">
                <button
                  onClick={() => setIsUserMenuOpen(true)}
                  className="flex items-center gap-1 sm:gap-2 bg-blue-700/50 hover:bg-blue-600/70 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 border border-blue-600/30 hover:border-blue-500/50 backdrop-blur-sm text-xs sm:text-sm"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-white font-bold whitespace-nowrap">
                    <span className="hidden sm:inline">Hola, </span>{user?.username}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Layout de ancho completo */}
          <div className="space-y-6">
            {/* Panel de Rutas - Ancho completo */}
            <div className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <RouteIcon className="w-6 h-6 text-blue-600" />
                Rutas Disponibles
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {routes.map((route) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  isSelected={selectedRoute === route.id}
                  isExpanded={expandedRoute === route.id}
                  onClick={() => handleRouteSelection(route.id)}
                  onToggleExpand={() => handleToggleExpand(route.id)}
                  onSelectRoute={handleSelectRouteForRecharge}
                />
              ))}
            </div>

            {/* Botón de Recarga */}
            <button
                onClick={() => setIsRechargeModalOpen(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mt-4"
              >
                <QrCode className="w-5 h-5" />
                Recargar Saldo
              </button>
              <p className="text-center text-gray-500 text-sm mt-2">
                Recarga y obtén un código QR para el autobús
              </p>
            </div>

            {/* Panel del Mapa y Detalles - Ancho completo */}
            <div id="map-section" className="w-full scroll-mt-4">
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Estadísticas */}
                <div className="xl:col-span-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Bus className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{totalActiveBuses}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Buses</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <RouteIcon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedRouteData?.stopCount || 0}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Libres</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedRouteData?.stopCount || 0}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Paradas</p>
              </div>
            </div>
                </div>

                <div className="xl:col-span-3">
            {/* Título del Mapa */}
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              Mapa en Vivo - {selectedRouteData?.name || 'Selecciona una ruta'}
            </h2>

            {/* Mapa */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
              <Map buses={routeBuses} selectedRoute={selectedRouteData} />
            </div>
                </div>

                <div className="xl:col-span-1">
            {/* Información de Autobuses */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-fit">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Bus className="w-5 h-5 text-blue-600" />
                Autobuses en Ruta
              </h3>
              
              <div className="space-y-4">
                {routeBuses.map((bus) => (
                  <BusInfo key={bus.id} bus={bus} />
                ))}
                
                {routeBuses.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No hay autobuses activos en esta ruta
                  </p>
                )}
              </div>
            </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Modal de Recarga */}
        <RechargeModal
          isOpen={isRechargeModalOpen}
          onClose={() => setIsRechargeModalOpen(false)}
          selectedRoute={selectedRouteForRecharge}
        />
        
        {/* Menú de Usuario */}
        <UserMenu
          isOpen={isUserMenuOpen}
          onClose={() => setIsUserMenuOpen(false)}
        />
        
        {/* Historial de Saldo */}
        <BalanceHistory
          isOpen={isBalanceHistoryOpen}
          onClose={() => setIsBalanceHistoryOpen(false)}
          onOpenQRCode={() => setIsQRCodeViewOpen(true)}
        />
        
        {/* Vista de Código QR */}
        <QRCodeView
          isOpen={isQRCodeViewOpen}
          onClose={() => setIsQRCodeViewOpen(false)}
        />
      </div>
    </div>
  );
};

// Componente para el historial de saldo
const BalanceHistory: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onOpenQRCode: () => void; 
}> = ({ isOpen, onClose, onOpenQRCode }) => {
  const { balance, transactions } = useAuth();

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('es-DO'),
      time: date.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getMethodName = (method: string) => {
    return method === 'mobile' ? 'Pago Móvil RD' : 'PayPal';
  };

  const getMethodColor = (method: string) => {
    return method === 'mobile' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Historial de Saldo</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Saldo Actual */}
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-2xl font-bold text-blue-900 dark:text-blue-100">RD$ {balance}</span>
            </div>
            <p className="text-center text-blue-700 dark:text-blue-300 text-sm mt-1">Saldo Actual</p>
            
            {/* Botón Ver mi código QR */}
            <button
              onClick={onOpenQRCode}
              className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              Ver mi código QR
            </button>
          </div>
          {/* Lista de Transacciones */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Historial de Recargas</h3>
            
            {transactions.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No tienes recargas registradas</p>
            ) : (
              transactions.map((transaction) => {
                const { date, time } = formatDate(transaction.date);
                return (
                  <div key={transaction.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(transaction.method)}`}>
                          {getMethodName(transaction.method)}
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          Completado
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">+RD$ {transaction.amount}</div>
                        {transaction.currency === 'USD' && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            (USD ${(transaction.amount * 0.017).toFixed(2)})
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                      <span>{date}</span>
                      <span>{time}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para la vista del código QR
const QRCodeView: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { balance } = useAuth();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Regresar</span>
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Código QR o mensaje de sin saldo */}
          <div className="text-center mb-6">
            {balance > 0 ? (
              <div className="bg-white p-4 rounded-lg shadow-md inline-block mb-4">
                <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Código QR</p>
                    <p className="text-xs text-gray-400">SMARTBUS-2024</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg border border-red-200 dark:border-red-800 mb-4">
                <div className="text-center">
                  <QrCode className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <p className="text-red-700 dark:text-red-300 font-medium mb-2">
                    No puedes visualizar tu código porque no tienes saldo.
                  </p>
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    Dirigete a "Recargar Saldo".
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Instrucciones */}
          {balance > 0 ? (
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Instrucciones de uso:</h3>
              <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>1. Muestra este código QR al conductor</li>
                <li>2. El conductor escaneará el código</li>
                <li>3. Confirma tu destino</li>
                <li>4. Se descontará automáticamente el pasaje</li>
              </ol>
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Si tienes saldo disponible, dirigete a "QR y Saldo". De lo contrario recarga para visualizar el código QR.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;