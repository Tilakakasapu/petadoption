import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { UploadCloud, PawPrint } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:5000';

interface IHealth {
  vaccinated: boolean;
  neutered: boolean;
  microchipped: boolean;
}

interface IFormData {
  name: string;
  type: string;
  breed: string;
  photo: File | null;
  age: string;
  location: string;
  description: string;
  status: 'available' | 'adopted' | 'pending';
  health: IHealth;
  characteristics: string;
}

const DonatePet: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [formData, setFormData] = useState<IFormData>({
    name: '',
    type: '',
    breed: '',
    photo: null,
    age: '',
    location: '',
    description: '',
    status: 'available',
    health: {
      vaccinated: false,
      neutered: false,
      microchipped: false,
    },
    characteristics: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/donate-pet', message: 'Please log in to donate a pet' } });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHealthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      health: { ...prev.health, [name]: checked },
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, photo: file }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('breed', formData.breed);
      formDataToSend.append('age', formData.age);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('health', JSON.stringify(formData.health));
      formDataToSend.append('characteristics', formData.characteristics);
      
      // Append the photo file
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      const response = await axios.post('/api/pets', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        alert('Pet successfully donated! Thank you for your contribution.');
        navigate('/pets');
      } else {
        throw new Error(response.data.error || 'Failed to donate pet');
      }
      
    } catch (err) {
      console.error('Error donating pet:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to donate pet. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-4">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-blue-900 mb-4 flex items-center justify-center gap-2">
          <PawPrint className="w-10 h-10 text-blue-500" /> Donate a Furry Friend
        </h1>
        <p className="text-gray-700 max-w-3xl mx-auto">
          Help us find a loving home for pets in need. Fill out the form below to donate a pet to our adoption center. Your contribution will bring joy to a future pet family!
        </p>
      </header>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-white p-10 rounded-2xl shadow-xl">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pet Name */}
          <div>
            <label className="block text-gray-800 font-medium mb-2">
              Pet Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter pet name"
            />
          </div>

          {/* Animal Type */}
          <div>
            <label className="block text-gray-800 font-medium mb-2">
              Animal Type <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an animal type</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Breed */}
          <div>
            <label className="block text-gray-800 font-medium mb-2">
              Breed <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter breed"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-gray-800 font-medium mb-2">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="0"
              max="30"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter age in years"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-800 font-medium mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter location"
            />
          </div>

          {/* Description */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-800 font-medium mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the pet's personality, habits, and any special needs"
            />
          </div>

          {/* Pet Photo */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-800 font-medium mb-2">Pet Photo</label>
            <div className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
              <label className="cursor-pointer text-center">
                <UploadCloud className="w-10 h-10 text-blue-500 mb-3 mx-auto" />
                <span className="text-gray-600 block">
                  {formData.photo ? formData.photo.name : 'Click to upload a photo'}
                </span>
                <input
                  type="file"
                  name="photo"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Health Information */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-gray-800 font-medium mb-4">Health Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="vaccinated"
                  checked={formData.health.vaccinated}
                  onChange={handleHealthChange}
                  className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Vaccinated</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="neutered"
                  checked={formData.health.neutered}
                  onChange={handleHealthChange}
                  className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Neutered</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="microchipped"
                  checked={formData.health.microchipped}
                  onChange={handleHealthChange}
                  className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Microchipped</span>
              </label>
            </div>
          </div>

          {/* Characteristics */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-800 font-medium mb-2">
              Characteristics <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="characteristics"
              value={formData.characteristics}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter characteristics (comma-separated, e.g.: friendly, playful, quiet)"
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-lg text-white font-medium text-lg transition-colors ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Donate Pet'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonatePet;
