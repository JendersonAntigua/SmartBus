import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Bus, Users, Clock } from 'lucide-react';
import { Route } from '../types';

interface RouteCardProps {
  route: Route;
  isSelected: boolean;
  isExpanded: boolean;
  onClick: () => void;
  onToggleExpand: () => void;
  onSelectRoute: (route: Route) => void;
}

const RouteCard: React.FC<RouteCardProps> = ({ route, isSelected, isExpanded, onClick, onToggleExpand, onSelectRoute }) => {

  const handleCardClick = () => {
    onToggleExpand();
  };


  const handleSelectRouteButton = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };
  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg border-2 cursor-pointer transition-all ${
        isExpanded ? 'shadow-lg border-blue-400' : 'shadow-md hover:shadow-lg'
      } ${
        isSelected && !isExpanded ? 'border-blue-500 ring-2 ring-blue-200' : 
        isExpanded ? 'border-blue-400' : 'border-gray-200'
      }`}
    >
      <div className="p-4" onClick={handleCardClick}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div 
              className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
              style={{ backgroundColor: route.color }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight mb-1">
                {route.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-xs leading-tight">
                {route.description}
              </p>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 ml-2 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`} />
        </div>
        
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-600 dark:text-gray-300">
            {route.busCount} buses
          </span>
          <span className="text-gray-600 dark:text-gray-300">
            {route.stopCount} paradas
          </span>
        </div>
      </div>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-1">
                <Bus className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">{route.busCount}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Buses</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-1">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">{route.availableSeats}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Libres</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-1">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">{route.nextArrival} min</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Próximo</div>
            </div>
          </div>

          {/* Lista de Autobuses */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Autobuses:</h4>
            <div className="space-y-2">
              {route.buses.map((bus) => (
                <div key={bus.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="text-lg">🚌</div>
                    <div>
                      <div className="font-medium text-sm text-gray-900 dark:text-white">{bus.id}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">{bus.location}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{bus.occupancy}</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">{bus.arrivalTime} min</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botón Seleccionar Ruta */}
          <button
            onClick={handleSelectRouteButton}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors mb-4"
          >
            Seleccionar Ruta
          </button>
        </div>
      )}
    </div>
  );
};

export default RouteCard;