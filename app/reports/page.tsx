'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Download, Calendar, Filter, Brain, TrendingUp, AlertTriangle, ArrowUpRight, Sparkles } from 'lucide-react';
import analyticsData from '@/mock-data/analytics.json';
import { toast } from 'sonner';
import OnTimeChart from './_components/ontime-chart';
import LaneChart from './_components/lane-chart';
import CustomerChart from './_components/customer-chart';
import StatusChart from './_components/status-chart';
import ForecastChart from './_components/forecast-chart';
import { cn } from '@/lib/utils';

const forecastInsights = [
  { label: 'Peak Month', value: 'September', change: '+34%', trend: 'up' as const, desc: 'Expected highest load volume' },
  { label: 'Avg Monthly Growth', value: '8.2%', change: '+2.1%', trend: 'up' as const, desc: 'MoM growth rate forecast' },
  { label: 'Capacity Risk', value: 'July', change: 'Medium', trend: 'warn' as const, desc: 'Potential capacity shortage' },
  { label: 'Revenue Projection', value: '$4.2M', change: '+18%', trend: 'up' as const, desc: 'Next 6 months estimated' },
];

const aiRecommendations = [
  { title: 'Add 3 vehicles before July', desc: 'Demand forecast shows 15% capacity gap in July-Aug period. Adding vehicles now ensures readiness.', impact: 'High', savings: '$45K' },
  { title: 'Pre-negotiate carrier rates for Q3', desc: 'Spot rates expected to rise 12% during peak periods. Locking rates now saves on high-demand freight.', impact: 'Medium', savings: '$28K' },
  { title: 'Hire 2 additional drivers by May', desc: 'Growing load volume requires expanded driver pool to maintain service levels.', impact: 'High', savings: '$32K' },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState('Last 30 days');
  const [mounted, setMounted] = useState(false);
  const [showForecast, setShowForecast] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-muted-foreground">Comprehensive analytics and operational insights</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowForecast(!showForecast)}
            className={cn('flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm font-medium transition',
              showForecast ? 'bg-violet-500/10 text-violet-400 border border-violet-500/30' : 'bg-card border border-border text-muted-foreground hover:text-foreground')}>
            <Brain className="w-3.5 h-3.5" /> AI Forecast
          </button>
          <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-card border border-border text-sm text-muted-foreground hover:text-foreground transition">
            <Calendar className="w-3.5 h-3.5" />{period}
          </button>
          <button onClick={() => toast.success('Report exported')} className="flex items-center gap-2 px-4 h-9 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* AI Demand Forecasting */}
      {showForecast && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-gradient-to-br from-violet-500/5 to-purple-500/5 border border-violet-500/20 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h3 className="font-semibold">AI Demand Forecasting</h3>
                <p className="text-xs text-muted-foreground">6-month load volume prediction with confidence intervals</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              {forecastInsights?.map?.((item, i) => (
                <div key={i} className="bg-card/60 border border-border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">{item?.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{item?.value}</span>
                    <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded',
                      item?.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400')}>
                      {item?.change}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{item?.desc}</p>
                </div>
              ))}
            </div>

            <ForecastChart />
          </div>

          {/* AI Recommendations */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-violet-400" /> AI Recommendations Based on Forecast
            </h3>
            <div className="space-y-3">
              {aiRecommendations?.map?.((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-accent/30 rounded-lg border border-border/50">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                    rec?.impact === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400')}>
                    {rec?.impact === 'High' ? <AlertTriangle className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium">{rec?.title}</p>
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-medium',
                        rec?.impact === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400')}>
                        {rec?.impact} Impact
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{rec?.desc}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">Est. Savings</p>
                    <p className="text-sm font-bold text-emerald-400">{rec?.savings}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-4">On-Time Delivery Rate</h3>
          <OnTimeChart data={analyticsData?.onTimeRate ?? []} />
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-4">Revenue by Lane</h3>
          <LaneChart data={analyticsData?.revenueByLane ?? []} />
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-4">Top Customers by Revenue</h3>
          <CustomerChart data={analyticsData?.topCustomers ?? []} />
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-4">Loads by Status</h3>
          <StatusChart data={analyticsData?.loadsByStatus ?? []} />
        </div>
      </div>
    </div>
  );
}
