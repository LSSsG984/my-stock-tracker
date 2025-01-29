

export interface StockHistory {
    timestamps: number[];
    prices: number[];
}

export interface StockData {
    symbol: string;
    price: number;
    name: string;
    history?: StockHistory;
}

export interface StockClientProps {
    stockData: StockData | null;
    symbol: string;
}

