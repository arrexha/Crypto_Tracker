import { useNavigate, useParams } from "react-router";
import { fetchChartData, fetchCoinData } from "../api/coinGecko";
import { useEffect, useState } from "react";
import { formatMarketCap, formatPrice } from "../utils/formatter";
import { Header } from "../components/Header";
import {
  CartesianGrid,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  Tooltip,
} from "recharts";
import { CoinDetailData, ChartDataPoint } from "../types";

export const CoinDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [coin, setCoin] = useState<CoinDetailData | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadCoinData();
    loadChartData();
  }, [id]);

  const loadCoinData = async () => {
    if (!id) return;
    try {
      const data = await fetchCoinData(id);
      setCoin(data);
    } catch (err) {
      console.error("Error fetching crypto: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChartData = async () => {
    if (!id) return;
    try {
      const data = await fetchChartData(id);

      const formattedData = data.prices.map((price) => ({
        time: new Date(price[0]).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        price: price[1].toFixed(2),
      }));

      setChartData(formattedData);
    } catch (err) {
      console.error("Error fetching crypto: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header showBackButton={true} />
        <div className="min-h-96 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-700 text-lg">Loading coin data...</p>
        </div>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="min-h-screen bg-white">
        <Header showBackButton={true} />
        <div className="min-h-96 flex flex-col items-center justify-center">
          <p className="text-gray-700 text-xl mb-4">Coin not found</p>
          <button onClick={() => navigate("/home")} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">Go Back</button>
        </div>
      </div>
    );
  }

  const priceChange = coin.market_data.price_change_percentage_24h || 0;
  const isPositive = priceChange >= 0;
  return (
    <div className="min-h-screen bg-white">
      <Header showBackButton={true} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <button onClick={() => navigate("/home")} className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition">← Back to List</button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <img src={coin.image.large} alt={coin.name} className="w-16 h-16 rounded-full border-2 border-gray-300" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{coin.name}</h1>
              <p className="text-gray-600 font-semibold uppercase">{coin.symbol.toUpperCase()}</p>
            </div>
          </div>
          <span className="px-4 py-2 bg-blue-600 text-white rounded-full font-bold text-lg">Rank #{coin.market_data.market_cap_rank}</span>
        </div>

        <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">{formatPrice(coin.market_data.current_price.usd)}</h2>
            <span className={`inline-block px-4 py-2 rounded-lg font-semibold ${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isPositive ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div>
              <span className="text-gray-600 text-sm font-semibold uppercase">24h High</span>
              <p className="text-xl text-gray-800 font-bold">{formatPrice(coin.market_data.high_24h.usd)}</p>
            </div>
            <div>
              <span className="text-gray-600 text-sm font-semibold uppercase">24h Low</span>
              <p className="text-xl text-gray-800 font-bold">{formatPrice(coin.market_data.low_24h.usd)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Price Chart (7 Days)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
              <XAxis dataKey="time" stroke="#666" style={{ fontSize: "12px" }} />
              <YAxis stroke="#666" style={{ fontSize: "12px" }} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  color: "#333",
                }}
              />
              <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
            <span className="text-gray-600 text-sm font-semibold uppercase">Market Cap</span>
            <p className="text-lg text-gray-800 font-bold mt-2">${formatMarketCap(coin.market_data.market_cap.usd)}</p>
          </div>

          <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
            <span className="text-gray-600 text-sm font-semibold uppercase">Volume (24)</span>
            <p className="text-lg text-gray-800 font-bold mt-2">${formatMarketCap(coin.market_data.total_volume.usd)}</p>
          </div>

          <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
            <span className="text-gray-600 text-sm font-semibold uppercase">Circulating Supply</span>
            <p className="text-lg text-gray-800 font-bold mt-2">{coin.market_data.circulating_supply?.toLocaleString() || "N/A"}</p>
          </div>

          <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
            <span className="text-gray-600 text-sm font-semibold uppercase">Total Supply</span>
            <p className="text-lg text-gray-800 font-bold mt-2">{coin.market_data.total_supply?.toLocaleString() || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
