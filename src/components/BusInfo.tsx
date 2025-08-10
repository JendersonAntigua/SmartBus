import React from 'react';
import { Clock, User, Users } from 'lucide-react';
import { Bus } from '../types';

interface BusInfoProps {
  bus: Bus;
}

const BusInfo: React.FC<BusInfoProps> = ({ bus }) => {
  const occupancyPercentage = Math.round((bus.occupancy / bus.capacity) * 100);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponible': return 'text-green-600';
      case 'Lleno': return 'text-red-600';
      case 'Fuera de Servicio': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'Disponible': return 'bg-green-100';
      case 'Lleno': return 'bg-red-100';
      case 'Fuera de Servicio': return 'bg-gray-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-bold text-lg text-gray-900 dark:text-white">{bus.id}</h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            <strong>Próxima:</strong> {bus.nextStop}
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {bus.driver}
          </p>
        </div>
        <div className="text-right">
          <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm font-medium mb-1">
            {bus.estimatedArrival} min
          </div>
          <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusBgColor(bus.status)} ${getStatusColor(bus.status)}`}>
            {bus.status}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-gray-600 dark:text-gray-300">{bus.occupancy}/{bus.capacity}</span>
        </div>
        <div className="text-gray-600 dark:text-gray-300">
          Ocupación
        </div>
        <div className="text-gray-900 dark:text-white font-medium">
          {occupancyPercentage}%
        </div>
      </div>

      <div className="mt-2">
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all ${
              occupancyPercentage > 80 ? 'bg-red-500' : 
              occupancyPercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${occupancyPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BusInfo;