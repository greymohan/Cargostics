'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function FleetChart({ data }: { data: { day: string; active: number; idle: number; maintenance: number }[] }) {
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data ?? []} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <XAxis dataKey="day" tickLine={false} tick={{ fontSize: 10 }} axisLine={false} />
          <YAxis tickLine={false} tick={{ fontSize: 10 }} axisLine={false} />
          <Tooltip contentStyle={{ fontSize: 11, backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
          <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="active" fill="#10B981" radius={[3, 3, 0, 0]} name="Active" />
          <Bar dataKey="idle" fill="#60B5FF" radius={[3, 3, 0, 0]} name="Idle" />
          <Bar dataKey="maintenance" fill="#FF9149" radius={[3, 3, 0, 0]} name="Maintenance" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
