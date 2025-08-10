export interface User {
  username: string;
  password: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}

export interface RouteInfo {
  id: string;
  location: string;
  occupancy: string;
  arrivalTime: number;
}

export interface Route {
  id: string;
  name: string;
  description: string;
  frequency: string;
  schedule: string;
  stops: string[];
  estimatedTime: string;
  nextArrival: number;
  activeBuses: number;
  color: string;
  busCount: number;
  stopCount: number;
  availableSeats: number;
  buses: RouteInfo[];
}

export interface Bus {
  id: string;
  routeId: string;
  nextStop: string;
  estimatedArrival: number;
  coordinates: [number, number];
  driver: string;
  capacity: number;
  occupancy: number;
  status: 'Disponible' | 'Lleno' | 'Fuera de Servicio';
}

export interface Transaction {
  id: string;
  amount: number;
  method: 'mobile' | 'paypal';
  currency: 'RD$' | 'USD';
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface AuthContextType {
  user: User | null;
  balance: number;
  transactions: Transaction[];
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addTransaction: (amount: number, method: 'mobile' | 'paypal', currency: 'RD$' | 'USD') => void;
  isAuthenticated: boolean;
}