'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Warehouse as WarehouseIcon, MapPin, Users, Activity, Search, Plus, Edit2, Trash2 } from 'lucide-react';
import warehousesData from '@/mock-data/warehouses.json';
import type { Warehouse } from '@/types';
import { cn } from '@/lib/utils';
import { Modal, ConfirmDialog } from '@/components/ui/modal';
import { FormField, FormInput, FormSelect } from '@/components/ui/form-field';
import { toast } from 'sonner';

const emptyWarehouse: Partial<Warehouse> = {
  name: '', location: '', address: '', capacity: 50000, utilization: 0,
  docks: 10, docksAvailable: 10, manager: '', type: 'Distribution', status: 'Active',
};

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editWarehouse, setEditWarehouse] = useState<Warehouse | null>(null);
  const [deleteWarehouse, setDeleteWarehouse] = useState<Warehouse | null>(null);
  const [formData, setFormData] = useState<Partial<Warehouse>>(emptyWarehouse);

  useEffect(() => { setMounted(true); setWarehouses((warehousesData ?? []) as Warehouse[]); }, []);

  const filtered = useMemo(() => {
    if (!search) return warehouses;
    const s = search.toLowerCase();
    return warehouses.filter(w =>
      w?.name?.toLowerCase()?.includes(s) || w?.location?.toLowerCase()?.includes(s) || w?.manager?.toLowerCase()?.includes(s)
    );
  }, [warehouses, search]);

  const updateForm = (key: string, value: string | number) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleAdd = () => { setFormData({ ...emptyWarehouse }); setShowAddModal(true); };
  const handleEdit = (w: Warehouse) => { setFormData({ ...w }); setEditWarehouse(w); };

  const saveWarehouse = () => {
    if (!formData.name || !formData.location || !formData.address) {
      toast.error('Please fill in required fields'); return;
    }
    if (editWarehouse) {
      setWarehouses(prev => prev.map(w => w.id === editWarehouse.id ? { ...w, ...formData } as Warehouse : w));
      toast.success(`${formData.name} updated`);
      setEditWarehouse(null);
    } else {
      const newWarehouse: Warehouse = {
        ...formData as Warehouse,
        id: `WH-${String(warehouses.length + 1).padStart(3, '0')}`,
      };
      setWarehouses(prev => [newWarehouse, ...prev]);
      toast.success(`${formData.name} added`);
      setShowAddModal(false);
    }
  };

  const confirmDelete = () => {
    if (!deleteWarehouse) return;
    setWarehouses(prev => prev.filter(w => w.id !== deleteWarehouse.id));
    toast.success(`${deleteWarehouse.name} removed`);
    setDeleteWarehouse(null);
  };

  if (!mounted) return null;

  const stats = {
    total: warehouses.length,
    active: warehouses.filter(w => w.status === 'Active').length,
    totalCapacity: warehouses.reduce((sum, w) => sum + (w.capacity ?? 0), 0),
    avgUtilization: Math.round(warehouses.reduce((sum, w) => sum + (w.utilization ?? 0), 0) / (warehouses.length || 1)),
  };

  const warehouseForm = (
    <div className="space-y-4">
      <FormField label="Warehouse Name" required><FormInput value={formData.name ?? ''} onChange={e => updateForm('name', e.target.value)} placeholder="Dallas Hub Central" /></FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Location" required><FormInput value={formData.location ?? ''} onChange={e => updateForm('location', e.target.value)} placeholder="Dallas, TX" /></FormField>
        <FormField label="Manager"><FormInput value={formData.manager ?? ''} onChange={e => updateForm('manager', e.target.value)} placeholder="John Doe" /></FormField>
      </div>
      <FormField label="Address" required><FormInput value={formData.address ?? ''} onChange={e => updateForm('address', e.target.value)} placeholder="4521 Logistics Blvd, Dallas, TX 75201" /></FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Type">
          <FormSelect value={formData.type ?? 'Distribution'} onChange={e => updateForm('type', e.target.value)}>
            <option value="Distribution">Distribution</option><option value="Cross-Dock">Cross-Dock</option>
            <option value="Cold Storage">Cold Storage</option><option value="Fulfillment">Fulfillment</option>
          </FormSelect>
        </FormField>
        <FormField label="Status">
          <FormSelect value={formData.status ?? 'Active'} onChange={e => updateForm('status', e.target.value)}>
            <option value="Active">Active</option><option value="Maintenance">Maintenance</option><option value="Closed">Closed</option>
          </FormSelect>
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Capacity (sq ft)"><FormInput type="number" value={formData.capacity ?? 50000} onChange={e => updateForm('capacity', parseInt(e.target.value))} /></FormField>
        <FormField label="Utilization %"><FormInput type="number" value={formData.utilization ?? 0} onChange={e => updateForm('utilization', parseInt(e.target.value))} min={0} max={100} /></FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Total Docks"><FormInput type="number" value={formData.docks ?? 10} onChange={e => updateForm('docks', parseInt(e.target.value))} /></FormField>
        <FormField label="Available Docks"><FormInput type="number" value={formData.docksAvailable ?? 10} onChange={e => updateForm('docksAvailable', parseInt(e.target.value))} /></FormField>
      </div>
      <div className="flex gap-3 justify-end pt-4 border-t border-border">
        <button onClick={() => { setShowAddModal(false); setEditWarehouse(null); }} className="px-4 h-10 rounded-lg border border-border text-sm font-medium hover:bg-accent transition">Cancel</button>
        <button onClick={saveWarehouse} className="px-4 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">Save Warehouse</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Warehouses & Hubs</h1>
          <p className="text-sm text-muted-foreground">Monitor capacity, utilization, and dock schedules across locations</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 h-10 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition">
          <Plus className="w-4 h-4" /> Add Warehouse
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Locations', value: stats.total, icon: WarehouseIcon, color: 'text-foreground' },
          { label: 'Active', value: stats.active, icon: Activity, color: 'text-emerald-400' },
          { label: 'Total Capacity', value: `${(stats.totalCapacity / 1000).toFixed(0)}K sq ft`, icon: MapPin, color: 'text-blue-400' },
          { label: 'Avg Utilization', value: `${stats.avgUtilization}%`, icon: Activity, color: 'text-amber-400' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={cn('w-4 h-4', s.color)} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search warehouses..."
          className="w-full h-10 pl-10 pr-4 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((wh, i) => (
          <motion.div key={wh.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <WarehouseIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{wh.name}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" /><span>{wh.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full',
                  wh.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' :
                  wh.status === 'Maintenance' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-red-500/10 text-red-400')}>
                  {wh.status}
                </span>
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity ml-1">
                  <button onClick={() => handleEdit(wh)} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition" title="Edit">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteWarehouse(wh)} className="p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Capacity Utilization</span>
                <span className="font-medium">{wh.utilization}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${wh.utilization}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                  className={cn('h-full rounded-full', (wh.utilization ?? 0) >= 90 ? 'bg-red-400' : (wh.utilization ?? 0) >= 70 ? 'bg-amber-400' : 'bg-emerald-400')} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-accent/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Total Capacity</p>
                <p className="text-sm font-bold">{((wh.capacity ?? 0) / 1000).toFixed(0)}K sq ft</p>
              </div>
              <div className="bg-accent/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Docks</p>
                <p className="text-sm font-bold">{wh.docksAvailable}/{wh.docks} available</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50">
              <Users className="w-3 h-3" /><span>Manager: {wh.manager}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Activity className="w-3 h-3" /><span>Type: {wh.type}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center"><WarehouseIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" /><p className="text-sm text-muted-foreground">No warehouses found</p></div>
      )}

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Warehouse" description="Add a warehouse or hub to your network" size="lg">{warehouseForm}</Modal>
      <Modal open={!!editWarehouse} onClose={() => setEditWarehouse(null)} title={`Edit: ${editWarehouse?.name ?? ''}`} description="Update warehouse details" size="lg">{warehouseForm}</Modal>
      <ConfirmDialog open={!!deleteWarehouse} onClose={() => setDeleteWarehouse(null)} onConfirm={confirmDelete}
        title="Remove Warehouse" message={`Are you sure you want to remove ${deleteWarehouse?.name ?? ''}? This action cannot be undone.`} confirmLabel="Remove Warehouse" />
    </div>
  );
}
