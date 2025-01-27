'use server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getStockData } from '@/action/yahooService';

export async function getStock(symbol : string) {

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    const stockData = await getStockData(symbol);
    await prisma.stock.upsert({
      where: { symbol: stockData.symbol },
      update: {
        price: stockData.price,
        name: stockData.name
      },
      create: {
        symbol: stockData.symbol,
        name: stockData.name,
        price: stockData.price
      }
    });

    return stockData;

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
  }
}

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