'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package, Clock, Truck, AlertTriangle, Fuel, DollarSign,
  TrendingUp, TrendingDown, Plus, UserPlus, FileText, Bot,
  ArrowUpRight, MapPin, CheckCircle, Info
} from 'lucide-react';
import { getDashboardKPIs } from '@/lib/fake-api';
import loadsData from '@/mock-data/loads.json';
import alertsData from '@/mock-data/alerts.json';
import type { Load, Alert, DashboardKPI } from '@/types';
import { DashboardCharts } from './_components/dashboard-charts';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const iconMap: Record<string, React.ElementType> = {
  'package': Package, 'clock': Clock, 'truck': Truck,
  'alert-triangle': AlertTriangle, 'fuel': Fuel, 'dollar-sign': DollarSign,
};

export default function DashboardPage() {
  const [kpis, setKpis] = useState<DashboardKPI[]>([]);
  const [loads] = useState<Load[]>((loadsData ?? []) as Load[]);
  const [alerts] = useState<Alert[]>((alertsData ?? []) as Alert[]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setKpis(getDashboardKPIs());
  }, []);

  if (!mounted) return null;

  const todayDispatches = (loads ?? [])?.filter?.(l => ['In Transit', 'Assigned', 'Loading']?.includes?.(l?.status ?? '')) ?? [];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Real-time overview of your logistics operations</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {(kpis ?? [])?.map?.((kpi, i) => {
          const Icon = iconMap?.[kpi?.icon ?? ''] ?? Package;
          return (
            <motion.div
              key={kpi?.label ?? i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-xl p-4 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold">{kpi?.value ?? '—'}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{kpi?.label ?? ''}</p>
              <div className={cn('flex items-center gap-1 mt-2 text-xs font-medium',
                kpi?.changeType === 'positive' ? 'text-emerald-500' :
                kpi?.changeType === 'negative' ? 'text-red-400' : 'text-muted-foreground'
              )}>
                {kpi?.changeType === 'positive' ? <TrendingUp className="w-3 h-3" /> :
                 kpi?.changeType === 'negative' ? <TrendingDown className="w-3 h-3" /> : null}
                {kpi?.change ?? ''}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <DashboardCharts />

      {/* Bottom section: Dispatches + Alerts + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today's Dispatch */}
        <div className="lg:col-span-1 bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-sm">Today&apos;s Dispatch</h3>
            <Link href="/orders" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-border/50 max-h-[340px] overflow-y-auto">
            {(todayDispatches ?? [])?.slice?.(0, 6)?.map?.((load) => (
              <div key={load?.id} className="p-3 hover:bg-accent/30 transition cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-muted-foreground">{load?.id ?? ''}</span>
                  <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full',
                    load?.status === 'In Transit' ? 'bg-blue-500/10 text-blue-400' :
                    load?.status === 'Assigned' ? 'bg-amber-500/10 text-amber-400' :
                    load?.status === 'Loading' ? 'bg-purple-500/10 text-purple-400' :
                    'bg-muted text-muted-foreground'
                  )}>
                    {load?.status ?? ''}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="truncate">{load?.origin ?? ''} → {load?.destination ?? ''}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">{load?.driver ?? 'Unassigned'}</p>
              </div>
            )) ?? []}
          </div>
        </div>

        {/* Alerts */}
        <div className="lg:col-span-1 bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-sm">Alerts & Exceptions</h3>
            <span className="text-xs text-red-400 font-medium">{(alerts ?? [])?.filter?.(a => a?.type === 'critical')?.length ?? 0} critical</span>
          </div>
          <div className="divide-y divide-border/50 max-h-[340px] overflow-y-auto">
            {(alerts ?? [])?.map?.((alert) => (
              <div key={alert?.id} className="p-3 hover:bg-accent/30 transition cursor-pointer">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    {alert?.type === 'critical' ? <AlertTriangle className="w-4 h-4 text-red-400" /> :
                     alert?.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-400" /> :
                     <Info className="w-4 h-4 text-blue-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{alert?.title ?? ''}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{alert?.message ?? ''}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{alert?.time ?? ''}</p>
                  </div>
                  {alert?.actionable && (
                    <button className="text-[10px] text-primary border border-primary/30 rounded px-2 py-1 hover:bg-primary/10 transition shrink-0">Action</button>
                  )}
                </div>
              </div>
            )) ?? []}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1 bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Plus, label: 'Create Load', href: '/orders', color: 'bg-blue-500/10 text-blue-400' },
              { icon: UserPlus, label: 'Assign Driver', href: '/dispatch', color: 'bg-emerald-500/10 text-emerald-400' },
              { icon: FileText, label: 'New Invoice', href: '/billing', color: 'bg-amber-500/10 text-amber-400' },
              { icon: Bot, label: 'AI Plan Route', href: '/ai-assistant', color: 'bg-purple-500/10 text-purple-400' },
            ]?.map?.((action) => (
              <Link key={action?.label} href={action?.href ?? '#'}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-accent/30 hover:bg-accent/60 border border-border/50 transition-all hover:shadow-md group">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', action?.color ?? '')}>
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-center">{action?.label ?? ''}</span>
                <ArrowUpRight className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
