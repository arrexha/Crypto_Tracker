import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Favorite } from '../types';
import { favoritesApi } from '../api/backend';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: Favorite[];
  isFavorite: (cryptoId: string) => boolean;
  addFavorite: (cryptoId: string) => Promise<void>;
  removeFavorite: (cryptoId: string) => Promise<void>;
  isLoading: boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token) {
      refreshFavorites();
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated, token]);

  const refreshFavorites = async () => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const data = await favoritesApi.getFavorites(token);
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFavorite = (cryptoId: string): boolean => {
    return favorites.some(fav => fav.crypto_id === cryptoId);
  };

  const addFavorite = async (cryptoId: string) => {
    if (!token) throw new Error('Not authenticated');
    
    try {
      await favoritesApi.addFavorite(token, cryptoId);
      await refreshFavorites();
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  };

  const removeFavorite = async (cryptoId: string) => {
    if (!token) throw new Error('Not authenticated');
    
    try {
      await favoritesApi.removeFavoriteByCryptoId(token, cryptoId);
      await refreshFavorites();
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  };

  const value = {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    isLoading,
    refreshFavorites,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};
