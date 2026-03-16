'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, Fuel, TrendingUp, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import loadsData from '@/mock-data/loads.json';
import type { Load } from '@/types';
import { cn } from '@/lib/utils';

const routeStats = [
  { label: 'Active Routes', value: '24', icon: Navigation, change: '+3 today', color: 'text-blue-400' },
  { label: 'Avg Transit Time', value: '18.5h', icon: Clock, change: '-1.2h vs last week', color: 'text-emerald-400' },
  { label: 'Fuel Efficiency', value: '6.8 MPG', icon: Fuel, change: '+0.3 MPG', color: 'text-amber-400' },
  { label: 'On-Time Rate', value: '94.2%', icon: TrendingUp, change: '-1.2% this week', color: 'text-primary' },
];

const routePoints = [
  { id: 'R1', load: 'LD-2024-001845', from: 'Dallas, TX', to: 'Memphis, TN', status: 'on-time', progress: 65, driver: 'Mike Rodriguez', eta: '14:30 EST' },
  { id: 'R2', load: 'LD-2024-001848', from: 'Houston, TX', to: 'Phoenix, AZ', status: 'on-time', progress: 42, driver: 'Anna Bell', eta: '08:00 MST' },
  { id: 'R3', load: 'LD-2024-001849', from: 'Los Angeles, CA', to: 'Denver, CO', status: 'delayed', progress: 78, driver: 'Tom Hardy', eta: '22:00 MST' },
  { id: 'R4', load: 'LD-2024-001851', from: 'Seattle, WA', to: 'Portland, OR', status: 'on-time', progress: 85, driver: 'David Lee', eta: '11:00 PST' },
  { id: 'R5', load: 'LD-2024-001853', from: 'Kansas City, MO', to: 'St. Louis, MO', status: 'on-time', progress: 55, driver: 'Pedro Garcia', eta: '15:45 CST' },
];

export default function RoutesPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Routes & Tracking</h1>
        <p className="text-sm text-muted-foreground">Real-time tracking of all active routes and shipments</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {routeStats?.map?.((s, i) => (
          <motion.div key={s?.label ?? i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={cn('w-4 h-4', s?.color ?? '')} />
              <span className="text-xs text-muted-foreground">{s?.label ?? ''}</span>
            </div>
            <p className="text-2xl font-bold">{s?.value ?? ''}</p>
            <p className="text-xs text-muted-foreground mt-1">{s?.change ?? ''}</p>
          </motion.div>
        ))}
      </div>

      {/* Map placeholder */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-sm">Live Operations Map</h3>
        </div>
        <div className="relative h-[300px] bg-gradient-to-br from-accent/50 to-muted/30 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-primary/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Interactive map visualization</p>
            <p className="text-xs text-muted-foreground mt-1">Showing {routePoints?.length ?? 0} active routes</p>
          </div>
          {/* Animated dots representing vehicles */}
          {routePoints?.map?.((r, i) => (
            <motion.div key={r?.id ?? i}
              className={cn('absolute w-3 h-3 rounded-full', r?.status === 'delayed' ? 'bg-red-400' : 'bg-emerald-400')}
              style={{ left: `${20 + i * 15}%`, top: `${30 + (i % 3) * 20}%` }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* Active Routes List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-sm">Active Routes</h3>
        </div>
        <div className="divide-y divide-border/50">
          {routePoints?.map?.((route, i) => (
            <motion.div key={route?.id ?? i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="p-4 hover:bg-accent/30 transition cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', route?.status === 'delayed' ? 'bg-red-500/10' : 'bg-emerald-500/10')}>
                    {route?.status === 'delayed' ? <AlertTriangle className="w-4 h-4 text-red-400" /> : <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{route?.load ?? ''}</p>
                    <p className="text-xs text-muted-foreground">{route?.driver ?? ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">ETA</p>
                  <p className="text-sm font-medium">{route?.eta ?? ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <MapPin className="w-3 h-3" />
                <span>{route?.from ?? ''}</span>
                <span>→</span>
                <span>{route?.to ?? ''}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${route?.progress ?? 0}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={cn('h-full rounded-full', route?.status === 'delayed' ? 'bg-red-400' : 'bg-emerald-400')}
                  />
                </div>
                <span className="text-xs font-medium">{route?.progress ?? 0}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
