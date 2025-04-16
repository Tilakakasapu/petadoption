import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Users, PawPrint, BarChart as ChartBar, Settings } from 'lucide-react';
import { mockPets } from '../data/mockData';
import { Pet } from '../types';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('pets');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const stats = {
    totalPets: mockPets.length,
    availablePets: mockPets.filter(p => p.status === 'available').length,
    pendingAdoptions: 3,
    completedAdoptions: 5,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 sm:px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Manage pets, users, and adoption requests</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Pet
              </button>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="mt-6 px-4 sm:px-0">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white overflow-hidden shadow-sm rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <PawPrint className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Pets</dt>
                      <dd className="text-lg font-semibold text-gray-900">{stats.totalPets}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white overflow-hidden shadow-sm rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Available Pets</dt>
                      <dd className="text-lg font-semibold text-gray-900">{stats.availablePets}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white overflow-hidden shadow-sm rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBar className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Pending Adoptions</dt>
                      <dd className="text-lg font-semibold text-gray-900">{stats.pendingAdoptions}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white overflow-hidden shadow-sm rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Settings className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Completed Adoptions</dt>
                      <dd className="text-lg font-semibold text-gray-900">{stats.completedAdoptions}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-6 px-4 sm:px-0">
          <div className="bg-white shadow-sm rounded-lg">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('pets')}
                  className={`${
                    activeTab === 'pets'
                      ? 'border-rose-500 text-rose-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                >
                  Pets
                </button>
                <button
                  onClick={() => setActiveTab('adoptions')}
                  className={`${
                    activeTab === 'adoptions'
                      ? 'border-rose-500 text-rose-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                >
                  Adoptions
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`${
                    activeTab === 'users'
                      ? 'border-rose-500 text-rose-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                >
                  Users
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`${
                    activeTab === 'settings'
                      ? 'border-rose-500 text-rose-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                >
                  Settings
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'pets' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pet
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockPets.map((pet) => (
                        <tr key={pet.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={pet.imageUrl}
                                  alt={pet.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{pet.name}</div>
                                <div className="text-sm text-gray-500">{pet.breed}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              pet.status === 'available'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {pet.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {pet.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => setSelectedPet(pet)}
                              className="text-rose-600 hover:text-rose-900 mr-4"
                            >
                              <Edit2 className="h-5 w-5" />
                            </button>
                            <button className="text-gray-400 hover:text-gray-500">
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'adoptions' && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900">Adoption Requests</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    View and manage adoption requests here
                  </p>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Manage user accounts and permissions
                  </p>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900">Admin Settings</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Configure system settings and preferences
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}