import { AuthResponse, LoginCredentials, RegisterCredentials, Favorite } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const authApi = {
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return response.json();
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },
};

export const favoritesApi = {
  getFavorites: async (token: string): Promise<Favorite[]> => {
    const response = await fetch(`${API_URL}/api/favorites`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch favorites');
    }

    return response.json();
  },

  addFavorite: async (token: string, cryptoId: string): Promise<Favorite> => {
    const response = await fetch(`${API_URL}/api/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ crypto_id: cryptoId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add favorite');
    }

    return response.json();
  },

  removeFavorite: async (token: string, favoriteId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/api/favorites/${favoriteId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to remove favorite');
    }
  },

  removeFavoriteByCryptoId: async (token: string, cryptoId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/api/favorites/crypto/${cryptoId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to remove favorite');
    }
  },
};
