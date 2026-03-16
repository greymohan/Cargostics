'use client';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#10B981', '#60B5FF', '#FF9149', '#A19AD3', '#FF6363', '#80D8C3'];

export default function StatusChart({ data }: { data: { status: string; count: number }[] }) {
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data ?? []} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} strokeWidth={0}>
            {(data ?? [])?.map?.((_, i) => (
              <Cell key={`cell-${i}`} fill={COLORS?.[i % (COLORS?.length ?? 1)] ?? '#ccc'} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ fontSize: 11, backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
          <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
