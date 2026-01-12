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
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-center mb-6">
          <input 
            type="text" 
            placeholder="Search cryptos..." 
            className="w-full md:w-96 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium">Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="rank">Rank</option>
            <option value="name">Name</option>
            <option value="price-low">Price Low</option>
            <option value="price-high">Price High</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button className={`px-4 py-2 rounded-lg font-medium transition ${view === "grid" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 border border-gray-300"}`} onClick={() => setView("grid")}>Grid</button>
          <button className={`px-4 py-2 rounded-lg font-medium transition ${view === "list" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 border border-gray-300"}`} onClick={() => setView("list")}>List</button>
        </div>
      </div>
      {loading ? (
        <div className="min-h-96 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-700 text-lg">Loading...</p>
        </div>
      ) : (
        <div className={`max-w-7xl mx-auto px-4 py-6 ${view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6" : "space-y-4"}`}>
          {filteredCryptos.map(crypto => <CryptoCard crypto={crypto} key={crypto.id} />)}
        </div>
      )}
    </div>
  );
};
