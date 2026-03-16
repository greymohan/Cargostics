'use client';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';

const forecastData = [
  { month: 'Oct', actual: 1820, forecast: null, lower: null, upper: null },
  { month: 'Nov', actual: 1950, forecast: null, lower: null, upper: null },
  { month: 'Dec', actual: 2240, forecast: null, lower: null, upper: null },
  { month: 'Jan', actual: 2100, forecast: null, lower: null, upper: null },
  { month: 'Feb', actual: 2380, forecast: null, lower: null, upper: null },
  { month: 'Mar', actual: 2520, forecast: 2520, lower: 2520, upper: 2520 },
  { month: 'Apr', actual: null, forecast: 2680, lower: 2480, upper: 2880 },
  { month: 'May', actual: null, forecast: 2820, lower: 2550, upper: 3090 },
  { month: 'Jun', actual: null, forecast: 3050, lower: 2700, upper: 3400 },
  { month: 'Jul', actual: null, forecast: 2890, lower: 2500, upper: 3280 },
  { month: 'Aug', actual: null, forecast: 3200, lower: 2780, upper: 3620 },
  { month: 'Sep', actual: null, forecast: 3380, lower: 2900, upper: 3860 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-xs">
      <p className="font-medium mb-1.5">{label}</p>
      {payload?.map?.((p: any, i: number) => {
        if (p?.dataKey === 'lower' || p?.dataKey === 'upper') return null;
        return (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p?.color ?? '#888' }} />
            <span className="text-muted-foreground">{p?.dataKey === 'actual' ? 'Actual' : 'Forecast'}:</span>
            <span className="font-medium">{(p?.value ?? 0)?.toLocaleString?.()} loads</span>
          </div>
        );
      })}
    </div>
  );
};

export default function ForecastChart() {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 10 }} axisLine={false} />
          <YAxis tickLine={false} tick={{ fontSize: 10 }} axisLine={false} tickFormatter={(v: number) => `${((v ?? 0) / 1000).toFixed(1)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x="Mar" stroke="hsl(var(--border))" strokeDasharray="4 4" label={{ value: 'Today', position: 'top', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
          <Area type="monotone" dataKey="upper" stroke="none" fill="#8B5CF6" fillOpacity={0.08} />
          <Area type="monotone" dataKey="lower" stroke="none" fill="hsl(var(--background))" fillOpacity={1} />
          <Area type="monotone" dataKey="forecast" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="6 3" fill="url(#forecastGrad)" dot={{ r: 3, fill: '#8B5CF6' }} />
          <Area type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={2.5} fill="url(#actualGrad)" dot={{ r: 4, fill: '#10B981' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
