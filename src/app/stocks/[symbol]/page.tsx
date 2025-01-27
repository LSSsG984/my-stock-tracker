import UI from '@/components/ui'
import {getStock} from "@/action/action";



interface StockData {
  symbol: string;
  name: string;
  price: number;
  history: {
    timestamps: number[];
    prices: number[];
  };
}

export default async function StockPage({ params }: { params: { symbol: string } }) {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      if (params.symbol) {
        try {
          const response = await fetch(`/api/stocks?symbol=${params.symbol}`);
          const data = await response.json();
          setStockData(data);
        } catch (error) {
          console.error('Error fetching stock:', error);
        } finally {
          setLoading(false);
        }
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

  return (<UI data={await getStock(params.symbol
  )}/>);
}