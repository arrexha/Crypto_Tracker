import { useEffect, useState } from "react";
import { fetchCryptos } from "../api/coinGecko";
import { CryptoCard } from "../components/CryptoCard";
import { Header } from "../components/Header";
import { CryptoData } from "../types";

export const Home = () => {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rank");

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

  const filteredCryptos = cryptos
    .filter(crypto => 
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return a.current_price - b.current_price;
        case "price-high":
          return b.current_price - a.current_price;
        case "rank":
        default:
          return a.market_cap_rank - b.market_cap_rank;
      }
    });

  return (
    <div className="app">
      <Header />
      <div className="search-section-wrapper">
        <div className="search-section">
          <input 
            type="text" 
            placeholder="Search cryptos..." 
            className="search-input" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="controls">
        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="rank">Rank</option>
            <option value="name">Name</option>
            <option value="price-low">Price Low</option>
            <option value="price-high">Price High</option>
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
          {filteredCryptos.map(crypto => <CryptoCard crypto={crypto} key={crypto.id} />)}
        </div>
      )}
    </div>
  );
};
