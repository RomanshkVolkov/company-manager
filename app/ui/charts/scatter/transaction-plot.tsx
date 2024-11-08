'use client';
import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function TransactionScatterPlot({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart>
        <CartesianGrid />
        <XAxis
          type="number"
          dataKey="totalAmount"
          name="Total Amount"
          unit="USD"
        />
        <YAxis
          type="number"
          dataKey="commission"
          name="Commission"
          unit="USD"
        />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name="Transactions" data={data} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
