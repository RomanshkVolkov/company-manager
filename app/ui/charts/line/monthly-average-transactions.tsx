'use client';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from 'recharts';

export default function MonthlyAverageTransactionsLineChart({
  data,
}: {
  data: any[];
}) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="averageAmount" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}
