import React, { useEffect, useState } from 'react';
import { Bell, Clock, Heart, LogOut, Settings, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:5000';

interface Pet {
  _id: string;
  name: string;
  breed: string;
  age: number;
  photo: {
    data: string;
    contentType: string;
  };
}

interface AdoptionRequest {
  _id: string;
  petId: Pet;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, refreshUserData } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adoptionRequests, setAdoptionRequests] = useState<AdoptionRequest[]>([]);
  const [favorites, setFavorites] = useState<Pet[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch user data
        await refreshUserData();

        // Fetch adoption requests
        const requestsResponse = await axios.get('/api/pets/user/adoption-requests');
        if (requestsResponse.data.success === false) {
          throw new Error(requestsResponse.data.error || 'Failed to fetch adoption requests');
        }
        setAdoptionRequests(requestsResponse.data.adoptionRequests || []);

        // Fetch favorites
        const favoritesResponse = await axios.get('/api/pets/user/favorites');
        if (favoritesResponse.data.success === false) {
          throw new Error(favoritesResponse.data.error || 'Failed to fetch favorites');
        }
        setFavorites(favoritesResponse.data.favorites || []);

      } catch (err) {
        console.error('Error loading dashboard data:', err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || 'Failed to load dashboard data');
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, refreshUserData]);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to sign out');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (!user || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Error Message */}
        {error && (
          <div className="px-4 py-3 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
                <p className="mt-1 text-sm text-gray-500">Manage your adoption requests and favorites</p>
              </div>
              <button className="p-2 rounded-full text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="mt-6 px-4 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Adoption Requests */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Adoption Requests</h2>
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {adoptionRequests.map((request) => (
                    <div
                      key={request._id}
                      className="flex items-center p-4 bg-gray-50 rounded-lg"
                    >
                      {request.petId && (
                        <>
                          <img
                            src={request.petId.photo.data}
                            alt={request.petId.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <div className="ml-4 flex-1">
                            <h3 className="text-sm font-medium text-gray-900">{request.petId.name}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </>
                      )}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  ))}
                  {!adoptionRequests.length && (
                    <p className="text-sm text-gray-500 text-center py-4">No adoption requests found</p>
                  )}
                </div>
              </div>
            </div>

            {/* Favorites */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Favorites</h2>
                  <Heart className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {favorites.map((pet) => (
                    <div
                      key={pet._id}
                      className="flex items-center p-4 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={pet.photo.data}
                        alt={pet.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{pet.name}</h3>
                        <p className="text-sm text-gray-500">
                          {pet.breed} • {pet.age} years old
                        </p>
                      </div>
                      <Link 
                        to={`/pets/${pet._id}`}
                        className="px-3 py-1 text-sm font-medium text-rose-600 hover:text-rose-700 hover:underline"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                  {!favorites.length && (
                    <p className="text-sm text-gray-500 text-center py-4">No favorites found</p>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Section */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-rose-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="pt-4 space-y-2">
                    <button className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                      <span className="flex items-center">
                        <Settings className="h-5 w-5 mr-3 text-gray-400" />
                        Account Settings
                      </span>
                    </button>
                    <button 
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-between px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <span className="flex items-center">
                        <LogOut className="h-5 w-5 mr-3" />
                        Sign Out
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;