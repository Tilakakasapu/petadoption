import { Pet } from '../types';

export const mockPets: Pet[] = [
  {
    id: '1',
    name: 'Luna',
    type: 'dog',
    breed: 'Golden Retriever',
    age: 2,
    location: 'San Francisco, CA',
    description: 'Luna is a friendly and energetic Golden Retriever who loves to play fetch and go on long walks.',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80',
    status: 'available',
    health: {
      vaccinated: true,
      neutered: true,
      microchipped: true,
    },
    characteristics: ['Friendly', 'Energetic', 'Good with kids'],
  },
  {
    id: '2',
    name: 'Oliver',
    type: 'cat',
    breed: 'British Shorthair',
    age: 1,
    location: 'New York, NY',
    description: 'Oliver is a calm and affectionate British Shorthair who enjoys lounging in sunny spots.',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80',
    status: 'available',
    health: {
      vaccinated: true,
      neutered: true,
      microchipped: true,
    },
    characteristics: ['Calm', 'Affectionate', 'Indoor only'],
  },
];