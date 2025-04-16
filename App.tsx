import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PetListings from './pages/PetListings';
import PetDetails from './pages/PetDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DonatePet from './pages/DonatePet';
import ResetPassword from './pages/ResetPassword';
import VerifyPassword from './pages/VerifyPassword';
import About from './pages/About';

import Resources from './pages/resources';
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pets" element={<PetListings />} />
              <Route path="/pets/:id" element={<PetDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-password" element={<VerifyPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path='/donate' element={<DonatePet/>}/>
              <Route path="/about" element={<About />} />
              <Route path="/resources" element={<Resources />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
