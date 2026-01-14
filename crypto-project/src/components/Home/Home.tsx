import { useEffect, useState } from "react";
import { fetchCryptos } from "../../api/coinGecko";
import { CryptoCard, Header, ErrorModal } from "../index";
import { CryptoData } from "../../types";

export const Home = () => {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await fetchCryptos();
        if (isMounted) {
          setCryptos(data);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load cryptos");
          console.error(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    load();
    const interval = setInterval(load, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const filteredCryptos = cryptos
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return a.current_price - b.current_price;
        case "price-high":
          return b.current_price - a.current_price;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="min-h-screen bg-white">
      <ErrorModal message={error} onClose={() => setError("")} />
      <Header />
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading cryptocurrencies...</p>
          </div>
        </div>
      ) : cryptos.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center min-h-96">
          <div className="text-center">
            <p className="text-gray-600 font-medium">No cryptocurrencies available</p>
          </div>
        </div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <label className="text-gray-700 font-medium">Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="name">Name</option>
                <option value="price-low">Price Low</option>
                <option value="price-high">Price High</option>
              </select>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredCryptos.map(crypto => <CryptoCard crypto={crypto} key={crypto.id} />)}
          </div>
        </>
      )}
    </div>
  );
};
