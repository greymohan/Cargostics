'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, DollarSign, TrendingDown, TrendingUp, Fuel, Wrench, ArrowRight, Lightbulb, BarChart3, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const costBreakdown = [
  { category: 'Fuel', current: 42800, optimized: 37400, icon: Fuel, color: '#10B981' },
  { category: 'Maintenance', current: 18500, optimized: 14200, icon: Wrench, color: '#60B5FF' },
  { category: 'Tolls & Fees', current: 8200, optimized: 6100, icon: DollarSign, color: '#FF9149' },
  { category: 'Idle Time', current: 12400, optimized: 5800, icon: TrendingDown, color: '#A78BFA' },
  { category: 'Overtime', current: 9600, optimized: 6400, icon: BarChart3, color: '#F472B6' },
];

const monthlyTrend = [
  { month: 'Oct', actual: 95200, projected: 95200 },
  { month: 'Nov', actual: 91800, projected: 88400 },
  { month: 'Dec', actual: 88500, projected: 82100 },
  { month: 'Jan', actual: 92100, projected: 78500 },
  { month: 'Feb', actual: 89200, projected: 74800 },
  { month: 'Mar', actual: 91500, projected: 69900 },
];

const pieData = [
  { name: 'Fuel', value: 42800, color: '#10B981' },
  { name: 'Labor', value: 32000, color: '#60B5FF' },
  { name: 'Maintenance', value: 18500, color: '#FF9149' },
  { name: 'Insurance', value: 15200, color: '#A78BFA' },
  { name: 'Tolls & Fees', value: 8200, color: '#F472B6' },
  { name: 'Other', value: 4800, color: '#6B7280' },
];

const aiRecommendations = [
  { id: 1, title: 'Switch to Predictive Maintenance', impact: 'Save $4,300/month', effort: 'Low', category: 'Maintenance',
    description: 'AI analysis shows 23% of maintenance costs are reactive. Switching to predictive scheduling based on telemetry data can reduce breakdowns by 67%.', confidence: 94 },
  { id: 2, title: 'Optimize Fuel Purchase Timing', impact: 'Save $2,100/month', effort: 'Low', category: 'Fuel',
    description: 'Fuel price analysis reveals optimal purchasing windows. Fueling at partner stations during off-peak hours (2AM-6AM) saves an average of $0.18/gallon.', confidence: 89 },
  { id: 3, title: 'Reduce Driver Idle Time', impact: 'Save $6,600/month', effort: 'Medium', category: 'Operations',
    description: 'GPS data shows an average of 47 minutes idle time per route. Better dock scheduling and driver communication can reduce this by 53%.', confidence: 92 },
  { id: 4, title: 'Consolidate LTL Shipments', impact: 'Save $3,800/month', effort: 'Medium', category: 'Operations',
    description: 'Analysis of load patterns shows 18% of trucks run below 70% capacity. AI-powered consolidation can combine compatible loads on similar lanes.', confidence: 87 },
  { id: 5, title: 'Renegotiate Insurance Based on Safety Data', impact: 'Save $1,900/month', effort: 'High', category: 'Insurance',
    description: 'Your fleet safety score of 91.2 puts you in the top 15% nationally. This data can leverage better insurance rates with premium carriers.', confidence: 85 },
];

export default function CostAnalyzerPage() {
  const [mounted, setMounted] = useState(false);
  const [implementedRecs, setImplementedRecs] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'breakdown'>('overview');

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const totalCurrent = costBreakdown.reduce((s, c) => s + c.current, 0);
  const totalOptimized = costBreakdown.reduce((s, c) => s + c.optimized, 0);
  const totalSavings = totalCurrent - totalOptimized;
  const savingsPercent = ((totalSavings / totalCurrent) * 100).toFixed(1);

  const implementRec = (id: number) => {
    setImplementedRecs(prev => new Set([...prev, id]));
    toast.success('Recommendation queued for implementation!');
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold">AI Cost Analyzer</h1>
          <span className="text-xs bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/20">AI Powered</span>
        </div>
        <p className="text-sm text-muted-foreground">AI-driven spending analysis with actionable savings recommendations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Monthly Spend', value: `$${(totalCurrent / 1000).toFixed(1)}K`, icon: DollarSign, color: 'text-foreground', sub: 'Current period' },
          { label: 'Potential Savings', value: `$${(totalSavings / 1000).toFixed(1)}K`, icon: TrendingDown, color: 'text-emerald-400', sub: `${savingsPercent}% reduction` },
          { label: 'Annual Projection', value: `$${((totalSavings * 12) / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'text-purple-400', sub: 'Yearly savings' },
          { label: 'AI Confidence', value: '91%', icon: Brain, color: 'text-blue-400', sub: 'Avg. accuracy' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={cn('w-4 h-4', s.color)} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-card border border-border rounded-lg p-1 w-fit">
        {(['overview', 'recommendations', 'breakdown'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn('px-4 py-2 rounded-md text-sm font-medium transition capitalize',
              activeTab === tab ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground')}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-sm mb-4">Cost Trend: Actual vs AI-Optimized</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 10 }} axisLine={false} />
                  <YAxis tickLine={false} tick={{ fontSize: 10 }} axisLine={false} tickFormatter={(v: number) => `$${(v/1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ fontSize: 11, backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} formatter={(v: number) => [`$${(v/1000).toFixed(1)}K`, undefined]} />
                  <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="actual" fill="#FF9149" radius={[3, 3, 0, 0]} name="Actual Spend" />
                  <Bar dataKey="projected" fill="#10B981" radius={[3, 3, 0, 0]} name="AI Optimized" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-sm mb-4">Spend Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} innerRadius={60} dataKey="value" paddingAngle={2}>
                    {pieData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11, backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} formatter={(v: number) => [`$${(v/1000).toFixed(1)}K`, undefined]} />
                  <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-purple-400" />
              <p className="text-sm"><span className="font-semibold">5 AI recommendations</span> identified — implementing all could save <span className="text-emerald-400 font-bold">$18,700/month</span></p>
            </div>
          </div>
          {aiRecommendations.map((rec, i) => (
            <motion.div key={rec.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={cn('bg-card border rounded-xl p-5', implementedRecs.has(rec.id) ? 'border-emerald-500/30' : 'border-border')}>
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-sm">{rec.title}</h3>
                    {implementedRecs.has(rec.id) && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" />Queued</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{rec.description}</p>
                  <div className="flex flex-wrap gap-3 text-[11px]">
                    <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-medium">{rec.impact}</span>
                    <span className={cn('px-2 py-1 rounded-md font-medium', rec.effort === 'Low' ? 'bg-blue-500/10 text-blue-400' : rec.effort === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400')}>Effort: {rec.effort}</span>
                    <span className="px-2 py-1 rounded-md bg-muted text-muted-foreground">{rec.category}</span>
                    <span className="px-2 py-1 rounded-md bg-purple-500/10 text-purple-400">{rec.confidence}% confidence</span>
                  </div>
                </div>
                <button onClick={() => implementRec(rec.id)} disabled={implementedRecs.has(rec.id)}
                  className={cn('px-4 py-2 rounded-lg text-xs font-medium transition shrink-0',
                    implementedRecs.has(rec.id) ? 'bg-emerald-500/10 text-emerald-400' : 'bg-primary text-primary-foreground hover:opacity-90')}>
                  {implementedRecs.has(rec.id) ? 'Implemented ✓' : 'Implement'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'breakdown' && (
        <div className="space-y-4">
          {costBreakdown.map((item, i) => {
            const savings = item.current - item.optimized;
            const pct = ((savings / item.current) * 100).toFixed(0);
            return (
              <motion.div key={item.category} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                      <item.icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{item.category}</h3>
                      <p className="text-xs text-muted-foreground">Potential {pct}% reduction</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-400">-${(savings).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">monthly savings</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-red-400 mb-1">Current</p>
                    <p className="text-lg font-bold">${item.current.toLocaleString()}</p>
                  </div>
                  <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-emerald-400 mb-1">Optimized</p>
                    <p className="text-lg font-bold text-emerald-400">${item.optimized.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
