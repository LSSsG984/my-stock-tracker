'use client';

// src/components/StockClient.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {StockClientProps} from "@/components/StockList";

export const StockClient: React.FC<StockClientProps> = ({ stockData }) => {
  if (!stockData) return <div>Stock not found</div>;

  // Vérifier si l'historique existe avant de créer les données du graphique
  const chartData = stockData.history ? stockData.history.timestamps.map((timestamp, index) => ({
    date: new Date(timestamp * 1000).toLocaleDateString(),
    price: stockData.history!.prices[index],
  })) : [];

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{stockData.name} ({stockData.symbol})</h2>
        <p className="text-xl">Current Price: ${stockData.price}</p>
      </div>

      {stockData.history ? (
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#2563eb" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div>Historical data not available</div>
      )}
    </div>
  );
};
