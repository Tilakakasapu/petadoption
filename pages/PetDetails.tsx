import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Share2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { Card, Button, CircularProgress } from '@mui/material';

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
  photo?: {
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

export default function PetDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user, refreshUserData } = useAuthStore();
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adoptionStatus, setAdoptionStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        setLoading(true);
        const response = await axios.get<{ success: boolean; pet: Pet }>(`/api/pets/${id}`);
        if (response.data.success) {
          setPet(response.data.pet);
          setAdoptionStatus(response.data.pet.status);
        } else {
          throw new Error('Failed to fetch pet details');
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching pet details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  const handleAdoptClick = async () => {
    if (!isAuthenticated) {
      return navigate('/login', { state: { from: `/pets/${id}`, message: 'Please log in to adopt a pet' } });
    }

    try {
      const response = await axios.post(`/api/pets/${id}/adopt`);
      if (response.data.success) {
        await refreshUserData();
        setPet(prev => prev ? { ...prev, status: 'adopted' } : null);
        setAdoptionStatus('adopted');
        alert('Pet adopted successfully!');
      } else {
        throw new Error(response.data.error || 'Failed to adopt pet');
      }
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        alert(err.response.data.error);
      } else {
        alert('Failed to submit adoption request. Please try again.');
      }
    }
  };

  const handleFavoriteClick = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!isAuthenticated) {
      return navigate('/login', { state: { from: `/pets/${id}`, message: 'Please log in to add pets to favorites' } });
    }
    try {
      const response = await axios.post(`/api/pets/${id}/favorite`);
      if (response.data.success) {
        await refreshUserData();
        alert('Favorite status updated successfully!');
      } else {
        throw new Error('Failed to update favorite status');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update favorite. Please try again.');
    }
  };

  const handleShareClick = async () => {
    if (!pet) return;

    const shareData = {
      title: `Check out ${pet.name}!`,
      text: `Meet ${pet.name}, a ${pet.age} year old ${pet.breed} ${pet.type} available for adoption!`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const isFavorite = () => {
    return user?.favorites?.some((fav) => (typeof fav === 'string' ? fav === id : fav._id === id)) || false;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-600">{error}</p>
        <Button onClick={() => navigate(-1)} startIcon={<ArrowLeft />}>
          Back
        </Button>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Pet not found</p>
        <Button onClick={() => navigate(-1)} startIcon={<ArrowLeft />}>
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Button startIcon={<ArrowLeft />} onClick={() => navigate(-1)}>
        Back
      </Button>
      {pet && (
        <Card className="my-4 p-4 shadow-lg rounded-lg">
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-1/3">
              <img
                src={pet.photo?.data || '/default-pet-image.jpg'}
                alt={pet.name}
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/default-pet-image.jpg';
                }}
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={handleFavoriteClick}
                  className={`p-2 rounded-full shadow-md transition-colors ${
                    isFavorite()
                      ? 'bg-rose-100 text-rose-600'
                      : 'bg-white text-gray-400 hover:bg-rose-50'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isFavorite() ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShareClick}
                  className="p-2 rounded-full shadow-md bg-white text-gray-400 hover:bg-rose-50"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="md:ml-6 flex-1">
              <h2 className="text-3xl font-bold mb-2">{pet.name}</h2>
              <p className="text-gray-600 mb-2">{pet.type} - {pet.breed}</p>
              <p className="text-gray-600 mb-2">Age: {pet.age} years</p>
              <p className="text-gray-600 mb-2">Location: {pet.location}</p>
              <p className="text-gray-600 mb-4">{pet.description}</p>
              <p className="text-gray-600 mb-4">Characteristics: {pet.characteristics.join(', ')}</p>
              <p className="text-gray-600 mb-4">Status: {pet.status}</p>
              <p className="text-gray-600 mb-4">
                Health: Vaccinated - {pet.health.vaccinated ? 'Yes' : 'No'}, 
                Neutered - {pet.health.neutered ? 'Yes' : 'No'}, 
                Microchipped - {pet.health.microchipped ? 'Yes' : 'No'}
              </p>
              {pet.status === 'adopted' ? (
                <div className="mt-4 px-6 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed text-center">
                  This Pet Has Been Adopted
                </div>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAdoptClick}
                  className="mt-4 w-full"
                  sx={{
                    backgroundColor: '#e11d48',
                    '&:hover': {
                      backgroundColor: '#be123c',
                    },
                  }}
                >
                  Adopt Now
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}