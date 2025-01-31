'use server';
import axios from 'axios';
import { YAHOO_BASE_URL, YAHOO_HEADERS } from '../lib/config/yahoo';

// Récupération des données d' une action
export async function getStockData(symbol: string) {
  try {
    const response = await axios.get(`${YAHOO_BASE_URL}${symbol}`, {
      headers: YAHOO_HEADERS,
      params: {
        interval: '1d',    // intervalle journalier
        range: '1mo'       // données sur un mois
      }
    });

    const stockData = response.data;
    return {
      symbol: symbol,
      price: stockData.chart.result[0].meta.regularMarketPrice,
      name: stockData.chart.result[0].meta.instrumentInfo?.shortName || symbol,
      timestamp: stockData.chart.result[0].meta.regularMarketTime,
      history: stockData.chart.result[0].indicators.quote[0]
    };
  } catch (error) {
    console.error(`Erreur lors de la récupération des données pour ${symbol}:`, error);
    throw error;
  }
}

export async function getMultipleStocks(symbols: string[]) {
  try {
    const promises = symbols.map(symbol => getStockData(symbol));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Erreur lors de la récupération multiple:', error);
    throw error;
  }
}