import { useEffect, useState } from "react";
import { fetchCryptos } from "../../api/coinGecko";
import { CryptoCard, Header, ErrorModal } from "../../components";
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
          setError(err instanceof Error ? err.message : "Failed to fetch");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const sortCryptos = (cryptos: CryptoData[]) => {
    const sorted = [...cryptos];
    sorted.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "price") {
        return b.current_price - a.current_price;
      }
      if (sortBy === "change") {
        return (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0);
      }
      return 0;
    });
    return sorted;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header showBackButton={false} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="loader" />
            <p className="text-gray-600 mt-4">Loading crypto data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header showBackButton={false} />
      <ErrorModal message={error} onClose={() => setError("")} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Cryptocurrencies</h1>
          <div className="flex gap-2">
            <button onClick={() => setSortBy("name")} className={`px-4 py-2 rounded-lg font-medium transition ${sortBy === "name" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}>Sort by Name</button>
            <button onClick={() => setSortBy("price")} className={`px-4 py-2 rounded-lg font-medium transition ${sortBy === "price" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}>Sort by Price</button>
            <button onClick={() => setSortBy("change")} className={`px-4 py-2 rounded-lg font-medium transition ${sortBy === "change" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}>Sort by Change</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortCryptos(cryptos).map((crypto) => (
            <CryptoCard key={crypto.id} crypto={crypto} />
          ))}
        </div>
      </div>
    </div>
  );
};
