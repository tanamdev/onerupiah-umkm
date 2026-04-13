"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface ChartData {
  date: string
  amount: number
}

interface TransactionsChartProps {
  data: ChartData[]
}

export function TransactionsChart({ data }: TransactionsChartProps) {
  return (
    <Card className="bg-white border-gray-100 shadow-sm col-span-full">
      <CardHeader>
        <CardTitle className="text-lg">Revenue Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={(value) => `Rp ${(value / 1000)}k`}
                dx={-10}
              />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Revenue']}
                labelStyle={{ color: '#374151', fontWeight: 600, marginBottom: '4px' }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#4f46e5" // indigo-600
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
