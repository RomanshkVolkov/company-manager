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

type Props = {
  xAxisKey: string;
  data: any[];
  lines: { dataKey: string; stroke: string; name: string }[];
};
export default function SimpleLineChart({ xAxisKey, data, lines }: Props) {
  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart data={data}>
        <Brush />
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip formatter={(value, name) => [formatToPrice(+value), name]} />
        <Legend />
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.stroke}
            name={line.name}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
