'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Receipt, Search, DollarSign, Clock, AlertTriangle, CheckCircle, Plus, Download, ArrowUpDown } from 'lucide-react';
import invoicesData from '@/mock-data/invoices.json';
import type { Invoice } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  'Paid': 'bg-emerald-500/10 text-emerald-400',
  'Pending': 'bg-amber-500/10 text-amber-400',
  'Overdue': 'bg-red-500/10 text-red-400',
  'Disputed': 'bg-purple-500/10 text-purple-400',
};

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); setInvoices((invoicesData ?? []) as Invoice[]); }, []);

  const filtered = useMemo(() => {
    let result = [...(invoices ?? [])];
    if (statusFilter !== 'All') result = result?.filter?.(i => i?.status === statusFilter) ?? [];
    if (search) {
      const s = search?.toLowerCase?.() ?? '';
      result = result?.filter?.(i => (i?.id?.toLowerCase?.() ?? '')?.includes?.(s) || (i?.customer?.toLowerCase?.() ?? '')?.includes?.(s)) ?? [];
    }
    return result;
  }, [invoices, search, statusFilter]);

  const totals = {
    total: (invoices ?? [])?.reduce?.((a, i) => a + (i?.amount ?? 0), 0) ?? 0,
    paid: (invoices ?? [])?.filter?.(i => i?.status === 'Paid')?.reduce?.((a, i) => a + (i?.amount ?? 0), 0) ?? 0,
    pending: (invoices ?? [])?.filter?.(i => i?.status === 'Pending')?.reduce?.((a, i) => a + (i?.amount ?? 0), 0) ?? 0,
    overdue: (invoices ?? [])?.filter?.(i => i?.status === 'Overdue')?.reduce?.((a, i) => a + (i?.amount ?? 0), 0) ?? 0,
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Billing & Invoices</h1>
          <p className="text-sm text-muted-foreground">Manage invoices, payments, and financial records</p>
        </div>
        <button onClick={() => toast.info('Invoice creation form opening...')}
          className="flex items-center gap-2 px-4 h-10 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition">
          <Plus className="w-4 h-4" /> Generate Invoice
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Invoiced', value: `$${((totals?.total ?? 0) / 1000)?.toFixed?.(1) ?? '0'}K`, icon: DollarSign, color: 'text-foreground' },
          { label: 'Paid', value: `$${((totals?.paid ?? 0) / 1000)?.toFixed?.(1) ?? '0'}K`, icon: CheckCircle, color: 'text-emerald-400' },
          { label: 'Pending', value: `$${((totals?.pending ?? 0) / 1000)?.toFixed?.(1) ?? '0'}K`, icon: Clock, color: 'text-amber-400' },
          { label: 'Overdue', value: `$${((totals?.overdue ?? 0) / 1000)?.toFixed?.(1) ?? '0'}K`, icon: AlertTriangle, color: 'text-red-400' },
        ]?.map?.((s, i) => (
          <motion.div key={s?.label ?? i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={cn('w-4 h-4', s?.color ?? '')} />
              <span className="text-xs text-muted-foreground">{s?.label ?? ''}</span>
            </div>
            <p className="text-2xl font-bold">{s?.value ?? ''}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e?.target?.value ?? '')} placeholder="Search invoices..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Paid', 'Pending', 'Overdue', 'Disputed']?.map?.((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={cn('px-3 h-9 rounded-lg text-xs font-medium transition border',
                statusFilter === s ? 'bg-primary/10 text-primary border-primary/30' : 'bg-card border-border text-muted-foreground hover:text-foreground')}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Invoice', 'Load', 'Customer', 'Amount', 'Status', 'Issue Date', 'Due Date']?.map?.(col => (
                  <th key={col} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{col}</th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {(filtered ?? [])?.map?.((inv, i) => (
                <motion.tr key={inv?.id ?? i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="hover:bg-accent/30 transition">
                  <td className="px-4 py-3 font-mono text-xs font-medium">{inv?.id ?? ''}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{inv?.loadId ?? ''}</td>
                  <td className="px-4 py-3 font-medium">{inv?.customer ?? ''}</td>
                  <td className="px-4 py-3 font-bold">${(inv?.amount ?? 0)?.toLocaleString?.()}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-[11px] font-medium px-2 py-0.5 rounded-full', statusColors?.[inv?.status ?? ''] ?? '')}>{inv?.status ?? ''}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{inv?.issueDate ?? ''}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{inv?.dueDate ?? ''}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => toast.info('Downloading invoice...')} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {(filtered?.length ?? 0) === 0 && (
          <div className="py-16 text-center">
            <Receipt className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No invoices found</p>
          </div>
        )}
      </div>
    </div>
  );
}
