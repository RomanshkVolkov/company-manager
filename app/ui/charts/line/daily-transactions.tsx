'use client';
import React from 'react';
import { formatToPrice } from '../../../lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from 'recharts';

export default function DailyTransactionsLineChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart data={data}>
        <Brush />
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value, name) => [formatToPrice(+value), name]} />
        <Legend />
        <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Ventas" />
        <Line
          type="monotone"
          dataKey="commission"
          stroke="#82ca9d"
          name="Comisión"
        />
        <Line
          type="monotone"
          dataKey="totalDeposits"
          stroke="#ff7300"
          name="Retiros"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
