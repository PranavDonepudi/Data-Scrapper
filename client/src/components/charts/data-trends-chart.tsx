import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { date: '2024-01-01', records: 1200 },
  { date: '2024-01-02', records: 1450 },
  { date: '2024-01-03', records: 1380 },
  { date: '2024-01-04', records: 1620 },
  { date: '2024-01-05', records: 1890 },
  { date: '2024-01-06', records: 2100 },
  { date: '2024-01-07', records: 2340 },
];

export function DataTrendsChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value: number) => [value, "Records"]}
          />
          <Line 
            type="monotone" 
            dataKey="records" 
            stroke="hsl(207, 90%, 54%)" 
            strokeWidth={2}
            dot={{ fill: "hsl(207, 90%, 54%)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
