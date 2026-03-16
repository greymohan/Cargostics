'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Route, Zap, DollarSign, Clock, Fuel, TrendingDown, MapPin, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const routeOptimizations = [
  {
    id: 'OPT-001', loadId: 'LD-2024-001845', origin: 'Sydney, NSW', destination: 'Brisbane, QLD',
    currentRoute: { distance: '920 km', time: '10h 30m', fuel: '$285', tolls: '$42' },
    optimizedRoute: { distance: '880 km', time: '9h 45m', fuel: '$248', tolls: '$18' },
    savings: { distance: '40 km', time: '45 min', fuel: '$37', total: '$61' },
    confidence: 96, reason: 'Avoids Pacific Highway construction and uses New England Hwy alt route via Tamworth',
  },
  {
    id: 'OPT-002', loadId: 'LD-2024-001847', origin: 'Melbourne, VIC', destination: 'Canberra, ACT',
    currentRoute: { distance: '660 km', time: '7h 15m', fuel: '$154', tolls: '$0' },
    optimizedRoute: { distance: '640 km', time: '6h 40m', fuel: '$135', tolls: '$0' },
    savings: { distance: '20 km', time: '35 min', fuel: '$19', total: '$19' },
    confidence: 91, reason: 'Bypasses Albury congestion via bypass road, faster during peak hours',
  },
  {
    id: 'OPT-003', loadId: 'LD-2024-001849', origin: 'Perth, WA', destination: 'Adelaide, SA',
    currentRoute: { distance: '2,695 km', time: '28h 20m', fuel: '$1,245', tolls: '$0' },
    optimizedRoute: { distance: '2,650 km', time: '27h 10m', fuel: '$1,192', tolls: '$0' },
    savings: { distance: '45 km', time: '1h 10m', fuel: '$53', total: '$53' },
    confidence: 88, reason: 'Optimizes fuel stops along Eyre Highway and avoids forecasted crosswinds',
  },
  {
    id: 'OPT-004', loadId: 'LD-2024-001851', origin: 'Hobart, TAS', destination: 'Launceston, TAS',
    currentRoute: { distance: '200 km', time: '2h 30m', fuel: '$110', tolls: '$0' },
    optimizedRoute: { distance: '198 km', time: '2h 15m', fuel: '$98', tolls: '$0' },
    savings: { distance: '2 km', time: '15 min', fuel: '$12', total: '$12' },
    confidence: 94, reason: 'Avoids roadworks on Midland Highway near Oatlands, uses local bypass',
  },
];

const weeklyStats = [
  { label: 'Routes Optimized', value: '47', icon: Route, color: 'text-primary' },
  { label: 'Total Fuel Saved', value: '$2,840', icon: Fuel, color: 'text-emerald-400' },
  { label: 'Time Saved', value: '18.5 hrs', icon: Clock, color: 'text-blue-400' },
  { label: 'Cost Reduction', value: '12.4%', icon: TrendingDown, color: 'text-purple-400' },
];

export default function RouteOptimizerPage() {
  const [mounted, setMounted] = useState(false);
  const [optimizing, setOptimizing] = useState<string | null>(null);
  const [applied, setApplied] = useState<Set<string>>(new Set());

  useEffect(() => { setMounted(true); }, []);

  const applyOptimization = async (id: string) => {
    setOptimizing(id);
    await new Promise(r => setTimeout(r, 1500));
    setApplied(prev => new Set([...prev, id]));
    setOptimizing(null);
    toast.success('Route optimized! Driver has been notified with updated navigation.');
  };

  const applyAll = async () => {
    for (const opt of routeOptimizations) {
      if (!applied.has(opt.id)) {
        setOptimizing(opt.id);
        await new Promise(r => setTimeout(r, 600));
        setApplied(prev => new Set([...prev, opt.id]));
        setOptimizing(null);
      }
    }
    toast.success('All routes optimized! Drivers notified.');
  };

  if (!mounted) return null;

  const totalSavings = routeOptimizations.reduce((sum, o) => sum + parseInt(o.savings.total.replace('$', '')), 0);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold">AI Route Optimizer</h1>
            <span className="text-xs bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/20">AI Powered</span>
          </div>
          <p className="text-sm text-muted-foreground">AI analyzes traffic, weather, and road conditions to find the most cost-efficient routes</p>
        </div>
        <button onClick={applyAll} className="flex items-center gap-2 px-4 h-10 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition">
          <Zap className="w-4 h-4" /> Optimize All Routes
        </button>
      </div>

      {/* Weekly Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {weeklyStats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={cn('w-4 h-4', s.color)} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1">This week</p>
          </motion.div>
        ))}
      </div>

      {/* Savings Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold">Potential Savings Available: <span className="text-emerald-400">${totalSavings}</span></p>
            <p className="text-xs text-muted-foreground">{routeOptimizations.length} active routes can be optimized right now</p>
          </div>
        </div>
      </div>

      {/* Route Cards */}
      <div className="space-y-4">
        {routeOptimizations.map((opt, i) => {
          const isApplied = applied.has(opt.id);
          const isOptimizing = optimizing === opt.id;
          return (
            <motion.div key={opt.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={cn('bg-card border rounded-xl p-5 transition-all', isApplied ? 'border-emerald-500/30' : 'border-border')}>
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-muted-foreground">{opt.loadId}</span>
                    {isApplied && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" />Applied</span>}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{opt.origin}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <span>{opt.destination}</span>
                  </div>
                  <div className="mt-3 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">{opt.reason}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:w-[420px] shrink-0">
                  <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3">
                    <p className="text-[10px] text-red-400 font-medium mb-1">Current Route</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between"><span className="text-muted-foreground">Distance</span><span>{opt.currentRoute.distance}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span>{opt.currentRoute.time}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Fuel</span><span>{opt.currentRoute.fuel}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Tolls</span><span>{opt.currentRoute.tolls}</span></div>
                    </div>
                  </div>
                  <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
                    <p className="text-[10px] text-emerald-400 font-medium mb-1">Optimized Route</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between"><span className="text-muted-foreground">Distance</span><span className="text-emerald-400">{opt.optimizedRoute.distance}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="text-emerald-400">{opt.optimizedRoute.time}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Fuel</span><span className="text-emerald-400">{opt.optimizedRoute.fuel}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Tolls</span><span className="text-emerald-400">{opt.optimizedRoute.tolls}</span></div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-[140px] shrink-0 flex flex-col items-center gap-2">
                  <div className="text-center">
                    <p className="text-lg font-bold text-emerald-400">-{opt.savings.total}</p>
                    <p className="text-[10px] text-muted-foreground">Save {opt.savings.time}</p>
                  </div>
                  <div className="text-[10px] text-purple-400">{opt.confidence}% confidence</div>
                  <button
                    onClick={() => applyOptimization(opt.id)}
                    disabled={isApplied || isOptimizing}
                    className={cn('w-full px-3 py-2 rounded-lg text-xs font-medium transition',
                      isApplied ? 'bg-emerald-500/10 text-emerald-400 cursor-default' :
                      'bg-primary text-primary-foreground hover:opacity-90')}
                  >
                    {isOptimizing ? (
                      <div className="flex items-center justify-center gap-1"><div className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /><span>Optimizing</span></div>
                    ) : isApplied ? 'Applied ✓' : 'Apply Route'}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
