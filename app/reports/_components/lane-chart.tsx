'use client';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function LaneChart({ data }: { data: { lane: string; revenue: number; loads: number }[] }) {
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data ?? []} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <XAxis dataKey="lane" tickLine={false} tick={{ fontSize: 10 }} axisLine={false} />
          <YAxis tickLine={false} tick={{ fontSize: 10 }} axisLine={false} tickFormatter={(v: number) => `$${((v ?? 0) / 1000)?.toFixed?.(0) ?? '0'}K`} />
          <Tooltip contentStyle={{ fontSize: 11, backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} formatter={(v: number) => [`$${((v ?? 0) / 1000)?.toFixed?.(0) ?? '0'}K`, undefined]} />
          <Bar dataKey="revenue" fill="#60B5FF" radius={[4, 4, 0, 0]} name="Revenue" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
