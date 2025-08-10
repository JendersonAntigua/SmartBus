import { Route, Bus, User } from '../types';

// Datos de usuarios (basado en tu base de datos Excel)
export let users: User[] = [
  { username: 'Julissa', password: '12345' },
  { username: 'Admin', password: '12345' }
];

// Función para agregar un nuevo usuario
export const addUser = (newUser: User) => {
  users.push(newUser);
};

// Función para verificar si un usuario ya existe
export const userExists = (username: string): boolean => {
  return users.some(user => user.username.toLowerCase() === username.toLowerCase());
};

// Datos de rutas basadas en tu app móvil
export const routes: Route[] = [
  {
    id: 'ruta1',
    name: 'Ruta Centro - Zona Colonial',
    description: 'Conexión del centro financiero a la Zona Colonial histórica',
    frequency: 'Cada 15-20 minutos',
    schedule: '6:00 AM - 10:00 PM',
    stops: [
      'Plaza Central',
      'Avenida Bolívar', 
      'Mercado Colonial',
      'Parque Independencia',
      'Catedral Metropolitana'
    ],
    estimatedTime: '25-35 minutos',
    nextArrival: 3,
    activeBuses: 4,
    color: '#3B82F6',
    busCount: 4,
    stopCount: 5,
    availableSeats: 47,
    buses: [
      {
        id: 'A123456',
        location: 'Malecón Centro',
        occupancy: '15/40',
        arrivalTime: 3
      },
      {
        id: 'B789012',
        location: 'Alcázar de Colón',
        occupancy: '8/40',
        arrivalTime: 7
      },
      {
        id: 'A456789',
        location: 'Plaza Central',
        occupancy: '8/40',
        arrivalTime: 12
      },
      {
        id: 'B234567',
        location: 'Parque Independencia',
        occupancy: '38/40',
        arrivalTime: 15
      }
    ]
  },
  {
    id: 'ruta2',
    name: 'Ruta Norte - Sur Expreso',
    description: 'Recorrido completo de norte a sur del Distrito Nacional',
    frequency: 'Cada 20-25 minutos',
    schedule: '5:30 AM - 11:00 PM',
    stops: [
      'Plaza de la Bandera',
      'Centro de los Héroes',
      'Parque Mirador Sur',
      'Universidad INTEC',
      'Megacentro'
    ],
    estimatedTime: '40-50 minutos',
    nextArrival: 5,
    activeBuses: 4,
    color: '#10B981',
    busCount: 4,
    stopCount: 5,
    availableSeats: 55,
    buses: [
      {
        id: 'C345678',
        location: 'Centro de los Héroes',
        occupancy: '22/45',
        arrivalTime: 5
      },
      {
        id: 'D901234',
        location: 'Naco',
        occupancy: '3/45',
        arrivalTime: 2
      },
      {
        id: 'C567890',
        location: 'Plaza de la Bandera',
        occupancy: '12/45',
        arrivalTime: 9
      },
      {
        id: 'D123456',
        location: 'Parque Mirador Sur',
        occupancy: '35/45',
        arrivalTime: 14
      }
    ]
  },
  {
    id: 'ruta3',
    name: 'Ruta Aeropuerto Las Américas',
    description: 'Servicio directo al Aeropuerto Internacional Las Américas',
    frequency: 'Cada 30 minutos',
    schedule: '5:00 AM - 12:00 AM',
    stops: [
      'Parque Enriquillo',
      'Centro Olímpico',
      'Plaza de la Salud',
      'Terminal Sans Souci',
      'Aeropuerto Las Américas'
    ],
    estimatedTime: '45-60 minutos',
    nextArrival: 4,
    activeBuses: 3,
    color: '#F59E0B',
    busCount: 3,
    stopCount: 5,
    availableSeats: 41,
    buses: [
      {
        id: 'E567890',
        location: 'Zona Universitaria',
        occupancy: '28/35',
        arrivalTime: 4
      },
      {
        id: 'E789123',
        location: 'Terminal Sans Souci',
        occupancy: '5/35',
        arrivalTime: 18
      },
      {
        id: 'E345678',
        location: 'Aeropuerto Las Américas',
        occupancy: '31/35',
        arrivalTime: 25
      }
    ]
  },
  {
    id: 'ruta4',
    name: 'Ruta Boca Chica - Plaza de la Bandera',
    description: 'Conexión desde la costa hasta el centro de la capital',
    frequency: 'Cada 25-30 minutos',
    schedule: '6:00 AM - 9:00 PM',
    stops: [
      'Boca Chica Centro',
      'Andrés',
      'Villa Mella',
      'Los Alcarrizos',
      'Plaza de la Bandera',
      'Centro de los Héroes',
      'Zona Colonial'
    ],
    estimatedTime: '50-65 minutos',
    nextArrival: 7,
    activeBuses: 3,
    color: '#8B5CF6',
    busCount: 3,
    stopCount: 7,
    availableSeats: 62,
    buses: [
      {
        id: 'F234567',
        location: 'Autopista San Isidro',
        occupancy: '18/42',
        arrivalTime: 6
      },
      {
        id: 'F456789',
        location: 'Villa Mella',
        occupancy: '39/42',
        arrivalTime: 11
      },
      {
        id: 'F678901',
        location: 'Boca Chica Centro',
        occupancy: '7/42',
        arrivalTime: 20
      }
    ]
  },
  {
    id: 'ruta5',
    name: 'Ruta Villa Mella - Máximo Gómez - Malecón',
    description: 'Desde Villa Mella por Máximo Gómez hasta el Malecón',
    frequency: 'Cada 20 minutos',
    schedule: '5:45 AM - 10:30 PM',
    stops: [
      'Villa Mella',
      'Máximo Gómez',
      'Centro de los Héroes',
      'Avenida Independencia',
      'Plaza de la Cultura',
      'Malecón Centro',
      'Puerto de Santo Domingo'
    ],
    estimatedTime: '35-45 minutos',
    nextArrival: 2,
    activeBuses: 3,
    color: '#EF4444',
    busCount: 3,
    stopCount: 7,
    availableSeats: 49,
    buses: [
      {
        id: 'G890123',
        location: 'Máximo Gómez - Tiradentes',
        occupancy: '12/45',
        arrivalTime: 3
      },
      {
        id: 'G123456',
        location: 'Centro de los Héroes',
        occupancy: '33/45',
        arrivalTime: 8
      },
      {
        id: 'G456789',
        location: 'Malecón Centro',
        occupancy: '41/45',
        arrivalTime: 16
      }
    ]
  },
  {
    id: 'ruta6',
    name: 'Ruta Jacobo Majluta - Winston Churchill',
    description: 'Conexión este-oeste por importantes avenidas',
    frequency: 'Cada 18-22 minutos',
    schedule: '6:15 AM - 9:45 PM',
    stops: [
      'Jacobo Majluta',
      'Avenida España',
      'Winston Churchill',
      'Piantini',
      'Naco',
      'Bella Vista',
      'Gazcue'
    ],
    estimatedTime: '30-40 minutos',
    nextArrival: 5,
    activeBuses: 3,
    color: '#F97316',
    busCount: 3,
    stopCount: 7,
    availableSeats: 44,
    buses: [
      {
        id: 'H456789',
        location: 'Plaza de la Salud',
        occupancy: '25/40',
        arrivalTime: 5
      },
      {
        id: 'H789012',
        location: 'Winston Churchill',
        occupancy: '15/40',
        arrivalTime: 10
      },
      {
        id: 'H234567',
        location: 'Jacobo Majluta',
        occupancy: '36/40',
        arrivalTime: 13
      }
    ]
  }
];

// Datos de autobuses en tiempo real
export const buses: Bus[] = [
  // Ruta 1: Centro - Zona Colonial (4 buses)
  {
    id: 'C345678',
    routeId: 'ruta2',
    nextStop: 'Centro de los Héroes',
    estimatedArrival: 6,
    coordinates: [18.4861, -69.9312],
    driver: 'José Martínez',
    capacity: 45,
    occupancy: 27,
    status: 'Disponible'
  },
  {
    id: 'D901234',
    routeId: 'ruta2',
    nextStop: 'Naco',
    estimatedArrival: 3,
    coordinates: [18.4765, -69.9293],
    driver: 'Ana López',
    capacity: 45,
    occupancy: 41,
    status: 'Lleno'
  },
  {
    id: 'A123456',
    routeId: 'ruta1',
    nextStop: 'Malecón Centro',
    estimatedArrival: 4,
    coordinates: [18.4861, -69.9312],
    driver: 'Carlos Pérez',
    capacity: 40,
    occupancy: 15,
    status: 'Disponible'
  },
  {
    id: 'B789012',
    routeId: 'ruta1',
    nextStop: 'Alcázar de Colón',
    estimatedArrival: 7,
    coordinates: [18.4765, -69.9293],
    driver: 'María González',
    capacity: 40,
    occupancy: 32,
    status: 'Disponible'
  },
  {
    id: 'A456789',
    routeId: 'ruta1',
    nextStop: 'Plaza Central',
    estimatedArrival: 12,
    coordinates: [18.4820, -69.9330],
    driver: 'Luis Rodríguez',
    capacity: 40,
    occupancy: 8,
    status: 'Disponible'
  },
  {
    id: 'B234567',
    routeId: 'ruta1',
    nextStop: 'Parque Independencia',
    estimatedArrival: 15,
    coordinates: [18.4720, -69.9360],
    driver: 'Ana Martínez',
    capacity: 40,
    occupancy: 38,
    status: 'Lleno'
  },

  // Ruta 2: Norte - Sur Expreso (4 buses)
  {
    id: 'C567890',
    routeId: 'ruta2',
    nextStop: 'Plaza de la Bandera',
    estimatedArrival: 9,
    coordinates: [18.5100, -69.9450],
    driver: 'Pedro Jiménez',
    capacity: 45,
    occupancy: 12,
    status: 'Disponible'
  },
  {
    id: 'D123456',
    routeId: 'ruta2',
    nextStop: 'Parque Mirador Sur',
    estimatedArrival: 14,
    coordinates: [18.4600, -69.9280],
    driver: 'Carmen Vásquez',
    capacity: 45,
    occupancy: 35,
    status: 'Disponible'
  },

  // Ruta 3: Aeropuerto Las Américas (3 buses)
  {
    id: 'E567890',
    routeId: 'ruta3',
    nextStop: 'Zona Universitaria',
    estimatedArrival: 4,
    coordinates: [18.4800, -69.9240],
    driver: 'Roberto Silva',
    capacity: 35,
    occupancy: 28,
    status: 'Disponible'
  },
  {
    id: 'E789123',
    routeId: 'ruta3',
    nextStop: 'Terminal Sans Souci',
    estimatedArrival: 18,
    coordinates: [18.4850, -69.9200],
    driver: 'Sofía Herrera',
    capacity: 35,
    occupancy: 5,
    status: 'Disponible'
  },
  {
    id: 'E345678',
    routeId: 'ruta3',
    nextStop: 'Aeropuerto Las Américas',
    estimatedArrival: 25,
    coordinates: [18.4950, -69.9000],
    driver: 'Miguel Torres',
    capacity: 35,
    occupancy: 31,
    status: 'Lleno'
  },

  // Ruta 4: Boca Chica - Plaza de la Bandera (3 buses)
  {
    id: 'F234567',
    routeId: 'ruta4',
    nextStop: 'Autopista San Isidro',
    estimatedArrival: 6,
    coordinates: [18.4500, -69.8800],
    driver: 'Ramón Castillo',
    capacity: 42,
    occupancy: 18,
    status: 'Disponible'
  },
  {
    id: 'F456789',
    routeId: 'ruta4',
    nextStop: 'Villa Mella',
    estimatedArrival: 11,
    coordinates: [18.4600, -69.8900],
    driver: 'Isabel Morales',
    capacity: 42,
    occupancy: 39,
    status: 'Lleno'
  },
  {
    id: 'F678901',
    routeId: 'ruta4',
    nextStop: 'Boca Chica Centro',
    estimatedArrival: 20,
    coordinates: [18.4204, -69.8540],
    driver: 'Julio Fernández',
    capacity: 42,
    occupancy: 7,
    status: 'Disponible'
  },

  // Ruta 5: Villa Mella - Máximo Gómez - Malecón (3 buses)
  {
    id: 'G890123',
    routeId: 'ruta5',
    nextStop: 'Máximo Gómez - Tiradentes',
    estimatedArrival: 3,
    coordinates: [18.5000, -69.9460],
    driver: 'Patricia Núñez',
    capacity: 45,
    occupancy: 12,
    status: 'Disponible'
  },
  {
    id: 'G123456',
    routeId: 'ruta5',
    nextStop: 'Centro de los Héroes',
    estimatedArrival: 8,
    coordinates: [18.4900, -69.9420],
    driver: 'Eduardo Ramírez',
    capacity: 45,
    occupancy: 33,
    status: 'Disponible'
  },
  {
    id: 'G456789',
    routeId: 'ruta5',
    nextStop: 'Malecón Centro',
    estimatedArrival: 16,
    coordinates: [18.4680, -69.9320],
    driver: 'Lucía Peña',
    capacity: 45,
    occupancy: 41,
    status: 'Lleno'
  },

  // Ruta 6: Jacobo Majluta - Winston Churchill (3 buses)
  {
    id: 'H456789',
    routeId: 'ruta6',
    nextStop: 'Plaza de la Salud',
    estimatedArrival: 5,
    coordinates: [18.4780, -69.9270],
    driver: 'Francisco Díaz',
    capacity: 40,
    occupancy: 25,
    status: 'Disponible'
  },
  {
    id: 'H789012',
    routeId: 'ruta6',
    nextStop: 'Winston Churchill',
    estimatedArrival: 10,
    coordinates: [18.4800, -69.9280],
    driver: 'Gabriela Ruiz',
    capacity: 40,
    occupancy: 15,
    status: 'Disponible'
  },
  {
    id: 'H234567',
    routeId: 'ruta6',
    nextStop: 'Jacobo Majluta',
    estimatedArrival: 13,
    coordinates: [18.4861, -69.9312],
    driver: 'Andrés Medina',
    capacity: 40,
    occupancy: 36,
    status: 'Disponible'
  }
];
