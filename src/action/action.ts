'use server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getStockData } from '@/action/yahooService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symbol, threshold, userId } = body;

    const stock = await prisma.stock.findUnique({
      where: { symbol }
    });

    if (!stock) {
      return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
    }

    const alert = await prisma.alert.create({
      data: {
        threshold,
        userId,
        stockId: stock.id
      }
    });

    return NextResponse.json(alert);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
    return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 });
  }
}




export async function fetchStockData(symbol: string) {
  try {
    console.log(`Starting fetchStockData for symbol: ${symbol}`);

    // Nettoyer le symbole
    const cleanSymbol = symbol.trim().toUpperCase();

    // Ajouter .PA pour les actions françaises si nécessaire
    const formattedSymbol = cleanSymbol.includes('.') ? cleanSymbol : cleanSymbol;

    console.log(`Formatted symbol: ${formattedSymbol}`);

    const data = await getStockData(formattedSymbol);

    if (!data) {
      console.log('No data returned from getStockData');
      return null;
    }

    console.log('Data successfully fetched:', data);
    return data;

  } catch (error) {
    console.error('Error in fetchStockData:', error);
    throw error;
  }
}