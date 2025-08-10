import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Bus as BusType, Route } from '../types';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  buses: BusType[];
  selectedRoute?: Route;
}

// Coordenadas simuladas para las rutas (en una implementación real vendrían de la API)
const routeCoordinates: { [key: string]: [number, number][] } = {
  'ruta1': [
    [18.4861, -69.9312], // Plaza Central
    [18.4850, -69.9320], // Av. Bolívar inicio
    [18.4820, -69.9330], // Av. Bolívar medio
    [18.4780, -69.9340], // Mercado Colonial área
    [18.4750, -69.9350], // Hacia Parque Independencia
    [18.4720, -69.9360], // Parque Independencia
    [18.4690, -69.9370], // Hacia Catedral
    [18.4660, -69.9380], // Catedral Metropolitana
  ],
  'ruta2': [
    [18.5204, -69.9540], // Plaza de la Bandera
    [18.5100, -69.9450], // Av. Kennedy
    [18.5000, -69.9400], // Hacia centro
    [18.4900, -69.9350], // Centro de los Héroes área
    [18.4800, -69.9320], // Av. Independencia
    [18.4700, -69.9300], // Hacia sur
    [18.4600, -69.9280], // Parque Mirador Sur área
    [18.4500, -69.9260], // Universidad INTEC área
    [18.4400, -69.9240]  // Megacentro área
  ],
  'ruta3': [
    [18.4614, -69.9317], // Parque Enriquillo
    [18.4650, -69.9300], // Av. Independencia
    [18.4700, -69.9280], // Centro Olímpico área
    [18.4750, -69.9260], // Plaza de la Salud
    [18.4800, -69.9240], // Terminal Sans Souci
    [18.4850, -69.9200], // Autopista Las Américas
    [18.4900, -69.9100], // Hacia aeropuerto
    [18.4950, -69.9000], // Aeropuerto Las Américas
  ],
  'ruta4': [
    [18.4204, -69.8540], // Boca Chica Centro
    [18.4300, -69.8600], // Carretera Boca Chica
    [18.4400, -69.8700], // Andrés
    [18.4500, -69.8800], // Hacia Villa Mella
    [18.4600, -69.8900], // Villa Mella área
    [18.4700, -69.9000], // Los Alcarrizos
    [18.4800, -69.9100], // Plaza de la Bandera
    [18.4850, -69.9200], // Centro de los Héroes
    [18.4750, -69.9300], // Zona Colonial
  ],
  'ruta5': [
    [18.5204, -69.9540], // Villa Mella
    [18.5100, -69.9500], // Av. Máximo Gómez inicio
    [18.5000, -69.9460], // Máximo Gómez medio
    [18.4900, -69.9420], // Centro de los Héroes
    [18.4800, -69.9380], // Av. Independencia
    [18.4750, -69.9360], // Plaza de la Cultura
    [18.4700, -69.9340], // Hacia Malecón
    [18.4680, -69.9320], // Malecón Centro
    [18.4660, -69.9300]  // Puerto de Santo Domingo
  ],
  'ruta6': [
    [18.4861, -69.9312], // Jacobo Majluta inicio
    [18.4840, -69.9300], // Jacobo Majluta este
    [18.4820, -69.9290], // Av. España conexión
    [18.4800, -69.9280], // Winston Churchill norte
    [18.4780, -69.9270], // Winston Churchill centro
    [18.4760, -69.9260], // Piantini
    [18.4740, -69.9250], // Naco
    [18.4720, -69.9240], // Bella Vista
    [18.4700, -69.9230]  // Gazcue
  ]
};
// Custom bus icon
const createBusIcon = (busId: string) => {
  return L.divIcon({
    html: `
      <div style="
        background: #2563eb;
        color: white;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 10px;
        font-weight: bold;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        border: 2px solid white;
        min-width: 60px;
      ">
        ${busId}
      </div>
    `,
    className: 'custom-bus-marker',
    iconSize: [70, 25],
    iconAnchor: [35, 12]
  });
};

// Component to handle map updates
const MapUpdater: React.FC<{ buses: BusType[] }> = ({ buses }) => {
  const map = useMap();
  
  useEffect(() => {
    if (buses.length > 0) {
      // Center map on Santo Domingo
      map.setView([18.4861, -69.9312], 12);
    }
  }, [map, buses]);

  return null;
};

const Map: React.FC<MapProps> = ({ buses, selectedRoute }) => {
  const [mapKey, setMapKey] = useState(0);

  // Santo Domingo coordinates
  const center: [number, number] = [18.4861, -69.9312];

  // Force re-render when route changes
  useEffect(() => {
    setMapKey(prev => prev + 1);
  }, [selectedRoute]);

  return (
    <div className="w-full h-64 sm:h-80 lg:h-96 relative">
      <MapContainer
        key={mapKey}
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater buses={buses} />
        
        {/* Línea de la ruta seleccionada */}
        {selectedRoute && routeCoordinates[selectedRoute.id] && (
          <Polyline
            positions={routeCoordinates[selectedRoute.id]}
            pathOptions={{
              color: selectedRoute.color,
              weight: 4,
              opacity: 0.8,
              dashArray: '10, 5'
            }}
          />
        )}
        
        {/* Bus markers */}
        {buses.map((bus) => (
          <Marker
            key={bus.id}
            position={bus.coordinates}
            icon={createBusIcon(bus.id)}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-bold text-gray-900 mb-1">Autobús {bus.id}</div>
                <div className="text-gray-600 mb-1">Próxima: {bus.nextStop}</div>
                <div className="text-blue-600 mb-1">
                  Llegada: {bus.estimatedArrival} min
                </div>
                <div className="text-gray-600 mb-1">
                  Conductor: {bus.driver}
                </div>
                <div className="text-gray-600">
                  Ocupación: {bus.occupancy}/{bus.capacity} ({Math.round((bus.occupancy / bus.capacity) * 100)}%)
                </div>
                <div className={`text-sm font-medium ${
                  bus.status === 'Disponible' ? 'text-green-600' : 
                  bus.status === 'Lleno' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  Estado: {bus.status}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map info overlay */}
      <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs text-gray-600 z-[1000]">
        🗺️ Leaflet | © OpenStreetMap contributors
      </div>
      
      {/* Live indicator */}
      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium z-[1000] flex items-center gap-1">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        En vivo
      </div>
    </div>
  );
};

export default Map;