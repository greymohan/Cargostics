'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function RevenueChart({ data }: { data: { month: string; revenue: number; cost: number; profit: number }[] }) {
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data ?? []} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60B5FF" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#60B5FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 10 }} axisLine={false} />
          <YAxis tickLine={false} tick={{ fontSize: 10 }} axisLine={false} tickFormatter={(v: number) => `$${(v / 1000)?.toFixed?.(0) ?? '0'}K`} />
          <Tooltip contentStyle={{ fontSize: 11, backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} formatter={(v: number) => [`$${((v ?? 0) / 1000)?.toFixed?.(0) ?? '0'}K`, undefined]} />
          <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
          <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="url(#revGrad)" strokeWidth={2} name="Revenue" />
          <Area type="monotone" dataKey="profit" stroke="#60B5FF" fill="url(#profGrad)" strokeWidth={2} name="Profit" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
