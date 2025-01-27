'use server';
import axios from 'axios';
import prisma from '../lib/db/prisma';

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