'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default function OnTimeChart({ data }: { data: { week: string; rate: number }[] }) {
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data ?? []} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <XAxis dataKey="week" tickLine={false} tick={{ fontSize: 10 }} axisLine={false} />
          <YAxis domain={[90, 100]} tickLine={false} tick={{ fontSize: 10 }} axisLine={false} tickFormatter={(v: number) => `${v ?? 0}%`} />
          <Tooltip contentStyle={{ fontSize: 11, backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} formatter={(v: number) => [`${v ?? 0}%`, 'On-Time']} />
          <Line type="monotone" dataKey="rate" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4, fill: '#10B981' }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
