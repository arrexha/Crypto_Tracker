import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { CryptoCard } from "../components/CryptoCard";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useFavorites } from "../context/FavoritesContext";
import { fetchCryptos } from "../api/coinGecko";
import { CryptoData } from "../types";

type ViewMode = "grid" | "list";

const FavoritesContent = () => {
  const { favorites, isLoading: favoritesLoading } = useFavorites();
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  useEffect(() => {
    loadCryptoData();
  }, [favorites]);

  const loadCryptoData = async () => {
    if (favorites.length === 0) {
      setCryptoData([]);
      setIsLoading(false);
      return;
    }

    try {
      const allCryptos = await fetchCryptos();
      const favoriteCryptoIds = favorites.map(fav => fav.crypto_id);
      const favoriteCryptos = allCryptos.filter(crypto => 
        favoriteCryptoIds.includes(crypto.id)
      );
      setCryptoData(favoriteCryptos);
    } catch (error) {
      console.error('Error loading crypto data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (favoritesLoading || isLoading) {
    return (
      <div className="app">
        <Header />
        <div className="loading">
          <div className="spinner" />
          <p>Loading favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />

      <div className="favorites-page">
        <div className="favorites-header">
          <h2>⭐ My Favorites</h2>
          <p className="favorites-count">
            {favorites.length} {favorites.length === 1 ? 'cryptocurrency' : 'cryptocurrencies'}
          </p>
        </div>

        {cryptoData.length === 0 ? (
          <div className="no-favorites">
            <p>No favorite crypto saved</p>
          </div>
        ) : (
          <>
            <div className="controls">
              <div className="filter-group">
                <span className="favorites-showing">Showing {cryptoData.length} favorite{cryptoData.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="view-toggle">
                <button
                  className={viewMode === "grid" ? "active" : ""}
                  onClick={() => setViewMode("grid")}
                >
                  Grid
                </button>
                <button
                  className={viewMode === "list" ? "active" : ""}
                  onClick={() => setViewMode("list")}
                >
                  List
                </button>
              </div>
            </div>
            
            <div className={`crypto-container ${viewMode}`}>
              {cryptoData.map((crypto) => (
                <CryptoCard crypto={crypto} key={crypto.id} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const Favorites = () => {
  return (
    <ProtectedRoute>
      <FavoritesContent />
    </ProtectedRoute>
  );
};
