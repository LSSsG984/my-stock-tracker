import { getStockData } from "@/action/stockService";
import { StockClient } from '@/components/StockClient';


// Composant serveur
export default async function StockPage({ params }: { params: { symbol: string } }) {
  const stockData = await getStockData(params.symbol);

  return <StockClient stockData={stockData} symbol={params.symbol}></StockClient>;
}
