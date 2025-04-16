export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  breed: string;
  age: number;
  location: string;
  description: string;
  imageUrl: string;
  status: 'available' | 'pending' | 'adopted';
  health: {
    vaccinated: boolean;
    neutered: boolean;
    microchipped: boolean;
  };
  characteristics: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  favorites: string[];
  adoptionRequests: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}