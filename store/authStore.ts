import { create } from 'zustand';
import axios, { AxiosError } from 'axios';

// Configure axios defaults
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
  status: 'available' | 'pending' | 'adopted';
  health: {
    vaccinated: boolean;
    neutered: boolean;
    microchipped: boolean;
  };
  characteristics: string[];
}

interface AdoptionRequest {
  _id: string;
  petId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  favorites: Pet[];
  adoptionRequests: AdoptionRequest[];
}

interface AuthErrorResponse {
  success: false;
  error: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      console.log('Attempting login with:', { 
        email, 
        emailLength: email.length,
        passwordLength: password.length 
      });
      
      const response = await axios.post('/api/auth/login', 
        { 
          email: email.trim().toLowerCase(), 
          password: password.trim() 
        },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log('Login response:', {
        success: response.data.success,
        user: response.data.user ? 'User data received' : 'No user data'
      });

      if (!response.data.success) {
        console.error('Login failed:', response.data.error);
        throw new Error(response.data.error || 'Login failed');
      }

      set({
        user: response.data.user,
        isAuthenticated: true,
        error: null
      });
    } catch (err: any) {
      console.error('Detailed login error:', {
        errorName: err.name,
        errorMessage: err.message,
        isAxiosError: axios.isAxiosError(err),
        responseStatus: err.response?.status,
        responseData: err.response?.data
      });
      
      let errorMessage = 'An unexpected error occurred';
      
      if (axios.isAxiosError(err)) {
        // Handle Axios-specific errors
        if (err.response) {
          // The request was made and the server responded with a status code
          errorMessage = err.response.data?.error || 
                         err.response.data?.message || 
                         `Login failed with status ${err.response.status}`;
        } else if (err.request) {
          // The request was made but no response was received
          errorMessage = 'No response received from server';
        } else {
          // Something happened in setting up the request
          errorMessage = 'Error setting up login request';
        }
      } else if (err instanceof Error) {
        // Handle other types of errors
        errorMessage = err.message;
      }

      // Update store state
      set({ 
        error: errorMessage,
        isAuthenticated: false,
        user: null,
        isLoading: false
      });

      // Re-throw to allow component to handle if needed
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post<{ success: true; user: User } | AuthErrorResponse>('/api/auth/register', { name, email, password });
      
      if ('success' in response.data && response.data.success === false) {
        throw new Error(response.data.error || 'Registration failed');
      }

      if ('user' in response.data) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          error: null
        });
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<AuthErrorResponse>;
        set({ error: axiosError.response?.data?.error || 'Registration failed. Please try again.' });
      } else {
        set({ error: 'An unexpected error occurred' });
      }
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post<{ success: true } | AuthErrorResponse>('/api/auth/logout');
      
      if ('success' in response.data && response.data.success === false) {
        throw new Error(response.data.error || 'Logout failed');
      }

      set({
        user: null,
        isAuthenticated: false,
        error: null
      });
    } catch (err) {
      console.error('Logout error:', err);
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<AuthErrorResponse>;
        set({ error: axiosError.response?.data?.error || 'Logout failed. Please try again.' });
      } else {
        set({ error: 'An unexpected error occurred' });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  refreshUserData: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get<{ success: true; user: User } | AuthErrorResponse>('/api/auth/me');
      
      if ('success' in response.data && response.data.success === false) {
        throw new Error(response.data.error || 'Failed to fetch user data');
      }

      if ('user' in response.data) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          error: null
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          error: null
        });
      }
    } catch (err) {
      console.error('Error refreshing user data:', err);
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<AuthErrorResponse>;
        if (axiosError.response?.status === 401) {
          set({
            user: null,
            isAuthenticated: false,
            error: null
          });
        } else {
          set({ error: axiosError.response?.data?.error || 'Failed to refresh user data' });
        }
      } else {
        set({ error: 'An unexpected error occurred' });
      }
    } finally {
      set({ isLoading: false });
    }
  }
}));

export { useAuthStore };
export type { User, Pet, AdoptionRequest, AuthErrorResponse };