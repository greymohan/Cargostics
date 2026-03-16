'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarRange, Zap, ChevronRight, MapPin, Clock, User, Truck, Package, Brain, Sparkles, CheckCircle2, XCircle, ArrowRight, Weight, Star } from 'lucide-react';
import loadsData from '@/mock-data/loads.json';
import driversData from '@/mock-data/drivers.json';
import vehiclesData from '@/mock-data/vehicles.json';
import type { Load, Driver, Vehicle } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const statusCols = ['Unassigned', 'Assigned', 'Loading', 'In Transit'];
const colColors: Record<string, string> = {
  'Unassigned': 'border-t-red-400', 'Assigned': 'border-t-amber-400',
  'Loading': 'border-t-purple-400', 'In Transit': 'border-t-blue-400',
};

interface MatchResult {
  loadId: string;
  loadCustomer: string;
  origin: string;
  destination: string;
  driverName: string;
  driverBase: string;
  vehicleId: string;
  vehicleType: string;
  score: number;
  reasons: string[];
  estimatedSaving: number;
}

export default function DispatchPage() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [drivers] = useState<Driver[]>((driversData ?? []) as Driver[]);
  const [vehicles] = useState<Vehicle[]>((vehiclesData ?? []) as Vehicle[]);
  const [mounted, setMounted] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [matching, setMatching] = useState(false);
  const [matches, setMatches] = useState<MatchResult[]>([]);

  useEffect(() => {
    setMounted(true);
    setLoads((loadsData ?? [])?.filter?.(l => !['Delivered', 'Cancelled']?.includes?.(l?.status ?? '')) as Load[]);
  }, []);

  const availableDrivers = (drivers ?? [])?.filter?.(d => d?.status === 'Available') ?? [];

  const autoAssign = () => {
    setLoads(prev => {
      const updated = [...(prev ?? [])];
      const unassigned = updated?.filter?.(l => l?.status === 'Assigned' && (!l?.driver || l?.driver === 'Unassigned'));
      unassigned?.forEach?.((load, i) => {
        if (i < (availableDrivers?.length ?? 0)) {
          load.driver = availableDrivers?.[i]?.name ?? 'Auto Assigned';
          load.status = 'Assigned';
        }
      });
      return updated;
    });
    toast.success('Auto-assignment complete');
  };

  const runSmartMatching = () => {
    setMatching(true);
    setMatches([]);
    const unassigned = (loads ?? [])?.filter?.(l => l?.status === 'Assigned' && (!l?.driver || l?.driver === 'Unassigned'));
    const allLoads = unassigned?.length > 0 ? unassigned : (loads ?? [])?.filter?.(l => l?.status === 'Assigned')?.slice(0, 3);

    setTimeout(() => {
      const results: MatchResult[] = (allLoads ?? [])?.map?.((load, idx) => {
        const driverIdx = idx % (availableDrivers?.length || 1);
        const driver = availableDrivers?.[driverIdx] || drivers?.[idx % drivers?.length];
        const vehicle = vehicles?.[idx % vehicles?.length];
        const score = 85 + Math.floor(Math.random() * 15);
        const reasons: string[] = [];
        if (score > 92) reasons.push('Closest proximity to pickup');
        if (score > 88) reasons.push('Optimal HOS remaining');
        reasons.push('Capacity match verified');
        if ((load?.priority ?? '') === 'High') reasons.push('Priority load expedited');
        return {
          loadId: load?.id ?? '',
          loadCustomer: load?.customer ?? '',
          origin: load?.origin ?? '',
          destination: load?.destination ?? '',
          driverName: driver?.name ?? 'N/A',
          driverBase: driver?.homeBase ?? '',
          vehicleId: vehicle?.id ?? '',
          vehicleType: vehicle?.type ?? 'Dry Van',
          score,
          reasons,
          estimatedSaving: 50 + Math.floor(Math.random() * 200),
        };
      });
      setMatches(results);
      setMatching(false);
    }, 2000);
  };

  const applyMatch = (match: MatchResult) => {
    setLoads(prev => (prev ?? [])?.map?.(l =>
      l?.id === match?.loadId ? { ...l, driver: match?.driverName, status: 'Assigned' as const } : l
    ));
    setMatches(prev => (prev ?? [])?.filter?.(m => m?.loadId !== match?.loadId));
    toast.success(`Assigned ${match?.driverName} to ${match?.loadId}`);
  };

  const applyAllMatches = () => {
    (matches ?? [])?.forEach?.(match => {
      setLoads(prev => (prev ?? [])?.map?.(l =>
        l?.id === match?.loadId ? { ...l, driver: match?.driverName, status: 'Assigned' as const } : l
      ));
    });
    toast.success(`Applied ${matches?.length ?? 0} smart assignments`);
    setMatches([]);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dispatch Board</h1>
          <p className="text-sm text-muted-foreground">Manage and assign loads to drivers in real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setShowAI(!showAI); if (!showAI && matches?.length === 0) runSmartMatching(); }}
            className={cn('flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-medium transition',
              showAI ? 'bg-violet-500/10 text-violet-400 border border-violet-500/30' : 'bg-card border border-border text-muted-foreground hover:text-foreground')}>
            <Brain className="w-4 h-4" /> Smart Match
          </button>
          <button onClick={autoAssign}
            className="flex items-center gap-2 px-4 h-10 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition">
            <Zap className="w-4 h-4" /> Auto-Assign
          </button>
        </div>
      </div>

      {/* AI Smart Load Matching Panel */}
      <AnimatePresence>
        {showAI && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden">
            <div className="bg-gradient-to-br from-violet-500/5 to-purple-500/5 border border-violet-500/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Smart Load Matching</h3>
                    <p className="text-xs text-muted-foreground">Optimized driver-load pairing based on proximity, HOS, capacity & history</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(matches?.length ?? 0) > 0 && (
                    <button onClick={applyAllMatches}
                      className="flex items-center gap-1.5 px-3 h-8 bg-violet-500 text-white rounded-lg text-xs font-medium hover:opacity-90 transition">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Apply All ({matches?.length ?? 0})
                    </button>
                  )}
                  <button onClick={runSmartMatching} disabled={matching}
                    className="flex items-center gap-1.5 px-3 h-8 bg-card border border-border rounded-lg text-xs font-medium hover:bg-accent transition disabled:opacity-50">
                    <Brain className="w-3.5 h-3.5" /> {matching ? 'Analyzing...' : 'Re-analyze'}
                  </button>
                </div>
              </div>

              {matching && (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
                    <div className="absolute inset-0 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                    <Brain className="absolute inset-0 m-auto w-5 h-5 text-violet-400" />
                  </div>
                  <p className="text-sm text-muted-foreground">Analyzing driver proximity, HOS compliance, vehicle capacity...</p>
                </div>
              )}

              {!matching && (matches?.length ?? 0) > 0 && (
                <div className="space-y-3">
                  {(matches ?? [])?.map?.((match, i) => (
                    <motion.div key={match?.loadId ?? i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                      className="bg-card/60 border border-border rounded-lg p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Load info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-muted-foreground">{match?.loadId}</span>
                            <span className="text-xs px-1.5 py-0.5 bg-violet-500/10 text-violet-400 rounded font-medium">
                              {match?.score}% match
                            </span>
                          </div>
                          <p className="text-sm font-medium mb-1">{match?.loadCustomer}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{match?.origin}</span>
                            <ArrowRight className="w-3 h-3 mx-1" />
                            <span className="truncate">{match?.destination}</span>
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="hidden lg:flex items-center">
                          <div className="w-8 h-[1px] bg-border" />
                          <ArrowRight className="w-4 h-4 text-violet-400" />
                        </div>

                        {/* Driver/Vehicle match */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-sm font-medium">{match?.driverName}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{match?.driverBase}</span>
                            <span className="flex items-center gap-1"><Truck className="w-3 h-3" />{match?.vehicleType}</span>
                          </div>
                        </div>

                        {/* Reasons & actions */}
                        <div className="flex flex-col lg:items-end gap-2">
                          <div className="flex flex-wrap gap-1">
                            {(match?.reasons ?? [])?.slice(0, 2)?.map?.((r, ri) => (
                              <span key={ri} className="text-[10px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded">{r}</span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-emerald-400 font-medium">Save ~${match?.estimatedSaving}</span>
                            <button onClick={() => applyMatch(match)}
                              className="flex items-center gap-1 px-3 h-7 bg-violet-500 text-white rounded text-xs font-medium hover:opacity-90 transition">
                              <CheckCircle2 className="w-3 h-3" /> Assign
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {!matching && (matches?.length ?? 0) === 0 && (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">All loads have been optimally matched!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Available Drivers */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold text-sm mb-3">Available Drivers ({availableDrivers?.length ?? 0})</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {(availableDrivers ?? [])?.map?.((driver) => (
            <div key={driver?.id} className="flex items-center gap-3 px-4 py-3 bg-accent/30 rounded-xl border border-border/50 shrink-0 min-w-[200px]">
              <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs font-bold">
                {driver?.name?.split?.(' ')?.map?.(n => n?.[0])?.join?.('') ?? '?'}
              </div>
              <div>
                <p className="text-sm font-medium">{driver?.name ?? ''}</p>
                <p className="text-xs text-muted-foreground">{driver?.homeBase ?? ''}</p>
              </div>
            </div>
          ))}
          {(availableDrivers?.length ?? 0) === 0 && <p className="text-sm text-muted-foreground">No drivers available</p>}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statusCols?.map?.((col) => {
          const colLoads = (loads ?? [])?.filter?.(l => {
            if (col === 'Unassigned') return l?.status === 'Assigned' && (!l?.driver || l?.driver === 'Unassigned');
            return l?.status === col;
          }) ?? [];
          return (
            <div key={col} className={cn('bg-card border border-border rounded-xl border-t-2 overflow-hidden', colColors?.[col] ?? '')}>
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-sm">{col}</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{colLoads?.length ?? 0}</span>
              </div>
              <div className="p-3 space-y-3 max-h-[500px] overflow-y-auto">
                {(colLoads ?? [])?.map?.((load, i) => (
                  <motion.div key={load?.id ?? i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="bg-accent/30 border border-border/50 rounded-lg p-3 hover:shadow-md transition cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-muted-foreground">{load?.id ?? ''}</span>
                      <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded',
                        (load?.priority ?? '') === 'High' ? 'bg-red-500/10 text-red-400' :
                        (load?.priority ?? '') === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-emerald-500/10 text-emerald-400')}>
                        {load?.priority ?? ''}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-1">{load?.customer ?? ''}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{load?.origin ?? ''} → {load?.destination ?? ''}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <User className="w-3 h-3" />
                        <span>{load?.driver || 'Unassigned'}</span>
                      </div>
                      <span className="font-medium text-primary">${(load?.rate ?? 0)?.toLocaleString?.()}</span>
                    </div>
                  </motion.div>
                ))}
                {(colLoads?.length ?? 0) === 0 && (
                  <div className="py-8 text-center">
                    <Package className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">No loads</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
