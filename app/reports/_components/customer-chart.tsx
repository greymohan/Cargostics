'use client';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function CustomerChart({ data }: { data: { customer: string; loads: number; revenue: number }[] }) {
  const shortData = (data ?? [])?.map?.(d => ({ ...(d ?? {}), name: d?.customer?.split?.(' ')?.[0] ?? '' })) ?? [];
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={shortData} layout="vertical" margin={{ top: 5, right: 10, left: 50, bottom: 5 }}>
          <XAxis type="number" tickLine={false} tick={{ fontSize: 10 }} axisLine={false} tickFormatter={(v: number) => `$${((v ?? 0) / 1000)?.toFixed?.(0) ?? '0'}K`} />
          <YAxis dataKey="name" type="category" tickLine={false} tick={{ fontSize: 10 }} axisLine={false} width={60} />
          <Tooltip contentStyle={{ fontSize: 11, backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} formatter={(v: number) => [`$${((v ?? 0) / 1000)?.toFixed?.(0) ?? '0'}K`, undefined]} />
          <Bar dataKey="revenue" fill="#10B981" radius={[0, 4, 4, 0]} name="Revenue" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
