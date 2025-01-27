'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';


const UI = ({data}) => {

    return (<div className="p-8">
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
    </div>)
}

export default UI;

