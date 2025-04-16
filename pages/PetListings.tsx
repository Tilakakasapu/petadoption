import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Search, Filter, Share2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:5000';

interface Pet {
  _id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  location: string;
  description: string;
  photo: {
    data: string;
    contentType: string;
  };
  status: 'available' | 'adopted' | 'pending';
  health: {
    vaccinated: boolean;
    neutered: boolean;
    microchipped: boolean;
  };
  characteristics: string[];
}

export default function PetListings() {
  const navigate = useNavigate();
  const { isAuthenticated, user, refreshUserData } = useAuthStore();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchPets = async () => {
      try {
        console.log('Fetching pets...');
        const response = await axios.get('/api/pets');
        console.log('Pets response:', response.data);
        
        if (!response.data || response.data.success === false) {
          throw new Error(response.data?.error || 'Failed to fetch pets');
        }
        
        setPets(Array.isArray(response.data.pets) ? response.data.pets : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching pets:', err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || 'Failed to connect to the server. Please try again.');
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const handleFavoriteClick = async (petId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: '/pets',
          message: 'Please log in to add pets to favorites'
        }
      });
      return;
    }

    try {
      const response = await axios.post(`/api/pets/${petId}/favorite`);
      if (response.data.success === false) {
        throw new Error(response.data.error || 'Failed to update favorite');
      }
      await refreshUserData();
      setError(null);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to update favorite. Please try again.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const handleShareClick = async (pet: Pet, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const shareData = {
      title: `Check out ${pet.name}!`,
      text: `Meet ${pet.name}, a ${pet.age} year old ${pet.breed} ${pet.type} available for adoption!`,
      url: `${window.location.origin}/pets/${pet._id}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support Web Share API
        alert('Copy this link to share: ' + shareData.url);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const isFavorite = (petId: string) => {
    if (!user?.favorites) return false;
    return Array.isArray(user.favorites) && user.favorites.some(favorite => 
      typeof favorite === 'string' ? favorite === petId : favorite._id === petId
    );
  };

  const filteredPets = pets.filter(pet => {
    const matchesSearch = (pet.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (pet.breed?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (pet.type?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || (pet.type?.toLowerCase() || '') === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl text-red-600"
        >
          {error}
        </motion.div>
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
        >
          Try Again
        </motion.button>
      </div>
    );
  }

  if (!Array.isArray(pets) || pets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl text-gray-600"
        >
          No pets available at the moment
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Available Pets</h1>
          <p className="mt-2 text-gray-600">Find your perfect companion</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1 bg-white rounded-md shadow-sm p-4">
            <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, breed, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 focus:border-rose-500 focus:ring-rose-500"
            />
          </div>

          <div className="sm:w-48 bg-white rounded-md shadow-sm p-4">
            <div className="relative">
              <Filter className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 w-full rounded-md border-gray-300 focus:border-rose-500 focus:ring-rose-500"
              >
                <option value="all">All Types</option>
                <option value="dog">Dogs</option>
                <option value="cat">Cats</option>
                <option value="bird">Birds</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3"
        >
          {filteredPets.map((pet) => (
            <motion.div
              key={pet._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate(`/pets/${pet._id}`)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48">
                <img
                  src={pet.photo?.data || '/default-pet-image.jpg'}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/default-pet-image.jpg';
                  }}
                />
                <button
                  onClick={(e) => handleFavoriteClick(pet._id, e)}
                  className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-colors ${
                    isFavorite(pet._id)
                      ? 'bg-rose-100 text-rose-600'
                      : 'bg-white text-gray-400 hover:bg-rose-50'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isFavorite(pet._id) ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={(e) => handleShareClick(pet, e)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors absolute top-2 right-12"
                  title="Share"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
                <p className="text-sm text-gray-600">{pet.breed}</p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span>{pet.age} years old</span>
                  <span className="mx-2">•</span>
                  <span>{pet.location}</span>
                </div>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    pet.status === 'available' ? 'bg-green-100 text-green-800' :
                    pet.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {pet.status}
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/pets/${pet._id}`)}
                  className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}