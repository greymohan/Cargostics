'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Package, Search, Filter, Plus, ChevronDown, MapPin, ArrowUpDown,
  MoreHorizontal, Eye, Edit, Trash2, X, Check
} from 'lucide-react';
import loadsData from '@/mock-data/loads.json';
import type { Load } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  'In Transit': 'bg-blue-500/10 text-blue-400',
  'Assigned': 'bg-amber-500/10 text-amber-400',
  'Loading': 'bg-purple-500/10 text-purple-400',
  'Delivered': 'bg-emerald-500/10 text-emerald-400',
  'Delayed': 'bg-red-500/10 text-red-400',
  'Cancelled': 'bg-muted text-muted-foreground',
};

const priorityColors: Record<string, string> = {
  'High': 'bg-red-500/10 text-red-400',
  'Medium': 'bg-amber-500/10 text-amber-400',
  'Low': 'bg-emerald-500/10 text-emerald-400',
};

export default function OrdersPage() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState<string>('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [showModal, setShowModal] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLoads((loadsData ?? []) as Load[]);
  }, []);

  const statuses = ['All', 'In Transit', 'Assigned', 'Loading', 'Delivered', 'Delayed', 'Cancelled'];

  const filtered = useMemo(() => {
    let result = [...(loads ?? [])];
    if (statusFilter !== 'All') result = result?.filter?.(l => l?.status === statusFilter) ?? [];
    if (search) {
      const s = search?.toLowerCase?.() ?? '';
      result = result?.filter?.(l =>
        (l?.id?.toLowerCase?.() ?? '')?.includes?.(s) ||
        (l?.customer?.toLowerCase?.() ?? '')?.includes?.(s) ||
        (l?.origin?.toLowerCase?.() ?? '')?.includes?.(s) ||
        (l?.destination?.toLowerCase?.() ?? '')?.includes?.(s) ||
        (l?.driver?.toLowerCase?.() ?? '')?.includes?.(s)
      ) ?? [];
    }
    result?.sort?.((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)?.[sortField] ?? '';
      const bVal = (b as unknown as Record<string, unknown>)?.[sortField] ?? '';
      if (typeof aVal === 'number' && typeof bVal === 'number') return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      return sortDir === 'asc' ? String(aVal)?.localeCompare?.(String(bVal)) ?? 0 : String(bVal)?.localeCompare?.(String(aVal)) ?? 0;
    });
    return result;
  }, [loads, search, statusFilter, sortField, sortDir]);

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const handleDelete = (id: string) => {
    setLoads(prev => (prev ?? [])?.filter?.(l => l?.id !== id) ?? []);
    toast.success('Load deleted successfully');
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Orders / Loads</h1>
          <p className="text-sm text-muted-foreground">Manage all shipment orders and load assignments</p>
        </div>
        <button onClick={() => { setShowCreate(true); toast.info('Create load form opened'); }}
          className="flex items-center gap-2 px-4 h-10 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition">
          <Plus className="w-4 h-4" /> Create Load
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e?.target?.value ?? '')}
            placeholder="Search loads, customers, drivers..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses?.map?.((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={cn('px-3 h-9 rounded-lg text-xs font-medium transition border',
                statusFilter === s ? 'bg-primary/10 text-primary border-primary/30' : 'bg-card border-border text-muted-foreground hover:text-foreground')}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['id', 'customer', 'origin', 'destination', 'driver', 'status', 'rate', 'priority'].map(col => (
                  <th key={col} onClick={() => toggleSort(col)}
                    className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition">
                    <div className="flex items-center gap-1">
                      {col === 'id' ? 'Load ID' : col?.charAt?.(0)?.toUpperCase?.() + col?.slice?.(1)}
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {(filtered ?? [])?.map?.((load, i) => (
                <motion.tr key={load?.id ?? i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="hover:bg-accent/30 transition cursor-pointer" onClick={() => { setSelectedLoad(load); setShowModal(true); }}>
                  <td className="px-4 py-3 font-mono text-xs">{load?.id ?? ''}</td>
                  <td className="px-4 py-3 font-medium">{load?.customer ?? ''}</td>
                  <td className="px-4 py-3 text-muted-foreground">{load?.origin ?? ''}</td>
                  <td className="px-4 py-3 text-muted-foreground">{load?.destination ?? ''}</td>
                  <td className="px-4 py-3">{load?.driver ?? 'Unassigned'}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-[11px] font-medium px-2 py-0.5 rounded-full', statusColors?.[load?.status ?? ''] ?? 'bg-muted text-muted-foreground')}>
                      {load?.status ?? ''}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">${(load?.rate ?? 0)?.toLocaleString?.()}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-[11px] font-medium px-2 py-0.5 rounded-full', priorityColors?.[load?.priority ?? ''] ?? '')}>
                      {load?.priority ?? ''}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1" onClick={e => e?.stopPropagation?.()}>
                      <button onClick={() => { setSelectedLoad(load); setShowModal(true); }} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground"><Eye className="w-3.5 h-3.5" /></button>
                      <button onClick={() => toast.info('Edit mode coming soon')} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(load?.id ?? '')} className="p-1.5 rounded-md hover:bg-accent text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {(filtered?.length ?? 0) === 0 && (
          <div className="py-16 text-center">
            <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No loads found</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedLoad && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={e => e?.stopPropagation?.()}>
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">{selectedLoad?.id ?? ''}</h3>
                <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', statusColors?.[selectedLoad?.status ?? ''] ?? '')}>{selectedLoad?.status ?? ''}</span>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-accent"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                ['Customer', selectedLoad?.customer],
                ['Origin', selectedLoad?.origin],
                ['Destination', selectedLoad?.destination],
                ['Driver', selectedLoad?.driver || 'Unassigned'],
                ['Truck', selectedLoad?.truck || 'N/A'],
                ['Weight', selectedLoad?.weight],
                ['Commodity', selectedLoad?.commodity],
                ['Distance', selectedLoad?.distance],
                ['Rate', `$${(selectedLoad?.rate ?? 0)?.toLocaleString?.()}`],
                ['Margin', `${selectedLoad?.margin ?? 0}%`],
                ['Pickup', selectedLoad?.pickupDate],
                ['Delivery', selectedLoad?.deliveryDate],
              ]?.map?.(([label, value]) => (
                <div key={String(label)} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{String(label ?? '')}</span>
                  <span className="text-sm font-medium">{String(value ?? '')}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
