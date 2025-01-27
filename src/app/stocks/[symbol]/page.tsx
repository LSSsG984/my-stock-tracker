'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  history: {
    timestamps: number[];
    prices: number[];
  };
}

export default function StockPage({ params }: { params: { symbol: string } }) {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await fetch(`/api/stocks?symbol=${params.symbol}`);
        const data = await response.json();
        setStockData(data);
      } catch (error) {
        console.error('Error fetching stock:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [params.symbol]);

  if (loading) return <div>Loading...</div>;
  if (!stockData) return <div>Stock not found</div>;

  const chartData = stockData.history.timestamps.map((timestamp, index) => ({
    date: new Date(timestamp * 1000).toLocaleDateString(),
    price: stockData.history.prices[index],
  }));

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{stockData.name} ({stockData.symbol})</h1>
      <p className="text-2xl mb-8">Current Price: ${stockData.price}</p>

      <div className="mb-8">
        <LineChart width={800} height={400} data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
        </LineChart>
      </div>
    </div>
  );
}