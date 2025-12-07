'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: '1月', sales: 4000, revenue: 2400 },
  { name: '2月', sales: 3000, revenue: 1398 },
  { name: '3月', sales: 2000, revenue: 9800 },
  { name: '4月', sales: 2780, revenue: 3908 },
  { name: '5月', sales: 1890, revenue: 4800 },
  { name: '6月', sales: 2390, revenue: 3800 },
  { name: '7月', sales: 3490, revenue: 4300 },
  { name: '8月', sales: 4200, revenue: 5100 },
  { name: '9月', sales: 3800, revenue: 4600 },
  { name: '10月', sales: 4500, revenue: 5200 },
  { name: '11月', sales: 5200, revenue: 6100 },
  { name: '12月', sales: 6100, revenue: 7000 },
];

export function SalesChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: '#6B7280' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6B7280' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Line
            type="monotone"
            dataKey="sales"
            name="销量"
            stroke="#22C55E"
            strokeWidth={2}
            dot={{ fill: '#22C55E', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            name="收入"
            stroke="#8B5CF6"
            strokeWidth={2}
            dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

