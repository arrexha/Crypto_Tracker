import { useEffect, useState } from "react";
import { fetchCryptos } from "../api/coinGecko";
import { CryptoCard } from "../components/CryptoCard";
import { Header } from "../components/Header";
import { CryptoData } from "../types";

export const Home = () => {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCryptos();
        setCryptos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <Header />
      <div className="search-section-wrapper">
        <div className="search-section">
          <input type="text" placeholder="Search cryptos..." className="search-input" />
        </div>
      </div>
      <div className="controls">
        <div className="filter-group">
          <label>Sort by:</label>
          <select>
            <option>Rank</option>
            <option>Name</option>
            <option>Price Low</option>
            <option>Price High</option>
          </select>
        </div>
        <div className="view-toggle">
          <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")}>Grid</button>
          <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>List</button>
        </div>
      </div>
      {loading ? (
        <div className="loading">
          <div className="spinner" />
          <p>Loading...</p>
        </div>
      ) : (
        <div className={`crypto-container ${view}`}>
          {cryptos.map(crypto => <CryptoCard crypto={crypto} key={crypto.id} />)}
        </div>
      )}
    </div>
  );
};
