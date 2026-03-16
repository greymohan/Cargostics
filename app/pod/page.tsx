'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileCheck, Check, X, Clock, Eye, Download, Image as ImageIcon } from 'lucide-react';
import podsData from '@/mock-data/pods.json';
import type { POD } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  'Approved': 'bg-emerald-500/10 text-emerald-400',
  'Pending': 'bg-amber-500/10 text-amber-400',
  'Rejected': 'bg-red-500/10 text-red-400',
};

export default function PODPage() {
  const [pods, setPods] = useState<POD[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); setPods((podsData ?? []) as POD[]); }, []);

  const updateStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setPods(prev => (prev ?? [])?.map?.(p => p?.id === id ? { ...(p ?? {}), status } : p) as POD[]);
    toast.success(`POD ${status?.toLowerCase?.()}: ${id}`);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Proof of Delivery</h1>
        <p className="text-sm text-muted-foreground">Review and manage delivery confirmations and documentation</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Approved', count: (pods ?? [])?.filter?.(p => p?.status === 'Approved')?.length ?? 0, color: 'text-emerald-400' },
          { label: 'Pending', count: (pods ?? [])?.filter?.(p => p?.status === 'Pending')?.length ?? 0, color: 'text-amber-400' },
          { label: 'Rejected', count: (pods ?? [])?.filter?.(p => p?.status === 'Rejected')?.length ?? 0, color: 'text-red-400' },
        ]?.map?.((s, i) => (
          <div key={s?.label ?? i} className="bg-card border border-border rounded-xl p-4">
            <p className={cn('text-2xl font-bold', s?.color ?? '')}>{s?.count ?? 0}</p>
            <p className="text-xs text-muted-foreground">{s?.label ?? ''}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {(pods ?? [])?.map?.((pod, i) => (
          <motion.div key={pod?.id ?? i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/50 flex items-center justify-center shrink-0">
                  <FileCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{pod?.id ?? ''}</p>
                    <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', statusColors?.[pod?.status ?? ''] ?? '')}>
                      {pod?.status ?? ''}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Load: {pod?.loadId ?? ''}</p>
                  <p className="text-xs text-muted-foreground mt-1">Delivered: {pod?.deliveryDate ?? ''} • Recipient: {pod?.recipient ?? ''}</p>
                  <p className="text-xs text-muted-foreground">Signed by: {pod?.signedBy ?? ''}</p>
                  {pod?.notes && <p className="text-xs mt-2 bg-accent/30 p-2 rounded-lg">{pod?.notes}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {pod?.status === 'Pending' && (
                  <>
                    <button onClick={() => updateStatus(pod?.id ?? '', 'Approved')}
                      className="flex items-center gap-1.5 px-3 h-8 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-500/20 transition">
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button onClick={() => updateStatus(pod?.id ?? '', 'Rejected')}
                      className="flex items-center gap-1.5 px-3 h-8 bg-red-500/10 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/20 transition">
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </>
                )}
                <button className="p-2 rounded-lg hover:bg-accent text-muted-foreground" onClick={() => toast.info('Viewing document...')}>
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
