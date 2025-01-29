'use server';
import axios from 'axios';
import prisma from '../lib/db/prisma';
import yahooFinance from 'yahoo-finance2';

export async function fetchStockPrice(symbol: string) {
  const apiKey = process.env.YAHOO_FINANCE_API_KEY;
  const url = `https://yfapi.net/v6/finance/quote?symbols=${symbol}`;
  
  try {
    const response = await axios.get(url, {
      headers: {
        'x-api-key': apiKey
      }
    });
    
    const stockData = response.data.quoteResponse.result[0];
    
    return {
      symbol: stockData.symbol,
      name: stockData.shortName,
      price: stockData.regularMarketPrice
    };
  } catch (error) {
    console.error('Error fetching stock price', error);
    throw error;
  }
}

export async function saveStock(stockData: {
  symbol: string, 
  name: string, 
  price: number
}) {
  return prisma.stock.upsert({
    where: { symbol: stockData.symbol },
    update: { 
      price: stockData.price,
      name: stockData.name
    },
    create: stockData
  });
}


interface StockData {
  symbol: string;
  name: string;
  price: number;
  history?: {
    timestamps: number[];
    prices: number[];
  };
}

export async function getStockData(symbol: string): Promise<StockData | null> {
  try {
    console.log(`Fetching data for symbol: ${symbol}`);

    // Vérifier que le symbole n'est pas vide
    if (!symbol) {
      console.error('Symbol is empty');
      return null;
    }

    // Récupérer les données de base
    console.log('Fetching quote data...');
    const quote = await yahooFinance.quote(symbol);

    if (!quote) {
      console.error('No quote data found');
      return null;
    }

    console.log('Quote data received:', quote);

    // Récupérer l'historique
    console.log('Fetching historical data...');
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const history = await yahooFinance.historical(symbol, {
      period1: startDate,
      period2: endDate,
      interval: '1d'
    });

    console.log(`Historical data received: ${history.length} entries`);

    // Construire l'objet de retour
    const stockData: StockData = {
      symbol: quote.symbol,
      name: quote.shortName || quote.longName || symbol,
      price: quote.regularMarketPrice ?? 0,
      history: history.length > 0 ? {
        timestamps: history.map(h => new Date(h.date).getTime() / 1000),
        prices: history.map(h => h.close)
      } : undefined
    };

    console.log('Processed stock data:', stockData);
    return stockData;

  } catch (error) {
    console.error('Error in getStockData:', error);
    throw error;
  }
}