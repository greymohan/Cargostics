'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Phone, Mail, Shield, Star, Clock, MapPin, Plus, Edit2, Trash2 } from 'lucide-react';
import driversData from '@/mock-data/drivers.json';
import type { Driver } from '@/types';
import { cn } from '@/lib/utils';
import { Modal, ConfirmDialog } from '@/components/ui/modal';
import { FormField, FormInput, FormSelect } from '@/components/ui/form-field';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  'Available': 'bg-emerald-500/10 text-emerald-400',
  'On Route': 'bg-blue-500/10 text-blue-400',
  'Off Duty': 'bg-muted text-muted-foreground',
  'On Break': 'bg-amber-500/10 text-amber-400',
};

const emptyDriver: Partial<Driver> = {
  name: '', phone: '', email: '', status: 'Available', cdlNumber: '', cdlExpiry: '', medicalExpiry: '',
  hosRemaining: '11h 00m', safetyScore: 100, loadsCompleted: 0, rating: 5.0, homeBase: '',
};

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editDriver, setEditDriver] = useState<Driver | null>(null);
  const [deleteDriver, setDeleteDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState<Partial<Driver>>(emptyDriver);

  useEffect(() => { setMounted(true); setDrivers((driversData ?? []) as Driver[]); }, []);

  const filtered = useMemo(() => {
    let result = [...(drivers ?? [])];
    if (statusFilter !== 'All') result = result.filter(d => d?.status === statusFilter);
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(d => d?.name?.toLowerCase()?.includes(s) || d?.homeBase?.toLowerCase()?.includes(s) || d?.email?.toLowerCase()?.includes(s));
    }
    return result;
  }, [drivers, search, statusFilter]);

  const updateForm = (key: string, value: string | number) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleAdd = () => { setFormData({ ...emptyDriver }); setShowAddModal(true); };
  const handleEdit = (d: Driver) => { setFormData({ ...d }); setEditDriver(d); };

  const saveDriver = () => {
    if (!formData.name || !formData.email || !formData.cdlNumber) {
      toast.error('Please fill in required fields'); return;
    }
    if (editDriver) {
      setDrivers(prev => prev.map(d => d.id === editDriver.id ? { ...d, ...formData } as Driver : d));
      toast.success(`Driver ${formData.name} updated`);
      setEditDriver(null);
    } else {
      const newDriver: Driver = {
        ...formData as Driver,
        id: `DRV-${String(drivers.length + 1).padStart(3, '0')}`,
      };
      setDrivers(prev => [newDriver, ...prev]);
      toast.success(`Driver ${formData.name} added`);
      setShowAddModal(false);
    }
  };

  const confirmDelete = () => {
    if (!deleteDriver) return;
    setDrivers(prev => prev.filter(d => d.id !== deleteDriver.id));
    toast.success(`Driver ${deleteDriver.name} removed`);
    setDeleteDriver(null);
  };

  if (!mounted) return null;

  const driverForm = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Full Name" required><FormInput value={formData.name ?? ''} onChange={e => updateForm('name', e.target.value)} placeholder="John Doe" /></FormField>
        <FormField label="Email" required><FormInput type="email" value={formData.email ?? ''} onChange={e => updateForm('email', e.target.value)} placeholder="john@cargostics.com" /></FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Phone"><FormInput value={formData.phone ?? ''} onChange={e => updateForm('phone', e.target.value)} placeholder="+61 412 345 678" /></FormField>
        <FormField label="Home Base"><FormInput value={formData.homeBase ?? ''} onChange={e => updateForm('homeBase', e.target.value)} placeholder="Sydney, NSW" /></FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="CDL Number" required><FormInput value={formData.cdlNumber ?? ''} onChange={e => updateForm('cdlNumber', e.target.value)} placeholder="CDL-XX-XXXXXX" /></FormField>
        <FormField label="CDL Expiry"><FormInput type="date" value={formData.cdlExpiry ?? ''} onChange={e => updateForm('cdlExpiry', e.target.value)} /></FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Medical Expiry"><FormInput type="date" value={formData.medicalExpiry ?? ''} onChange={e => updateForm('medicalExpiry', e.target.value)} /></FormField>
        <FormField label="Status">
          <FormSelect value={formData.status ?? 'Available'} onChange={e => updateForm('status', e.target.value)}>
            <option value="Available">Available</option><option value="On Route">On Route</option>
            <option value="Off Duty">Off Duty</option><option value="On Break">On Break</option>
          </FormSelect>
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Safety Score"><FormInput type="number" value={formData.safetyScore ?? 100} onChange={e => updateForm('safetyScore', parseInt(e.target.value))} min={0} max={100} /></FormField>
        <FormField label="Rating"><FormInput type="number" value={formData.rating ?? 5.0} onChange={e => updateForm('rating', parseFloat(e.target.value))} min={0} max={5} step={0.1} /></FormField>
      </div>
      <div className="flex gap-3 justify-end pt-4 border-t border-border">
        <button onClick={() => { setShowAddModal(false); setEditDriver(null); }} className="px-4 h-10 rounded-lg border border-border text-sm font-medium hover:bg-accent transition">Cancel</button>
        <button onClick={saveDriver} className="px-4 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">Save Driver</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Drivers</h1>
          <p className="text-sm text-muted-foreground">Manage driver profiles, compliance, and assignments</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 h-10 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition">
          <Plus className="w-4 h-4" /> Add Driver
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search drivers..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Available', 'On Route', 'Off Duty', 'On Break'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={cn('px-3 h-9 rounded-lg text-xs font-medium transition border',
                statusFilter === s ? 'bg-primary/10 text-primary border-primary/30' : 'bg-card border-border text-muted-foreground hover:text-foreground')}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((driver, i) => (
          <motion.div key={driver.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all group">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                {driver.name?.split(' ').map(n => n?.[0]).join('') ?? '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold truncate">{driver.name}</p>
                  <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0', statusColors[driver.status ?? ''] ?? '')}>{driver.status}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  <MapPin className="w-3 h-3" /><span>{driver.homeBase}</span>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
                <button onClick={() => handleEdit(driver)} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition" title="Edit">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setDeleteDriver(driver)} className="p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition" title="Delete">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1"><Star className="w-3 h-3 text-amber-400" /><span className="text-sm font-bold">{driver.rating}</span></div>
                <p className="text-[10px] text-muted-foreground">Rating</p>
              </div>
              <div className="text-center"><p className="text-sm font-bold">{driver.safetyScore}</p><p className="text-[10px] text-muted-foreground">Safety</p></div>
              <div className="text-center"><p className="text-sm font-bold">{driver.loadsCompleted}</p><p className="text-[10px] text-muted-foreground">Loads</p></div>
            </div>
            <div className="flex items-center justify-between text-xs border-t border-border/50 pt-3">
              <div className="flex items-center gap-1 text-muted-foreground"><Clock className="w-3 h-3" /><span>HOS: {driver.hosRemaining ?? 'N/A'}</span></div>
              {driver.currentLoad && <span className="text-primary text-[11px] font-medium">{driver.currentLoad}</span>}
            </div>

            {selectedDriver?.id === driver.id && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-border space-y-2">
                <div className="flex items-center gap-2 text-xs"><Phone className="w-3 h-3 text-muted-foreground" /><span>{driver.phone}</span></div>
                <div className="flex items-center gap-2 text-xs"><Mail className="w-3 h-3 text-muted-foreground" /><span>{driver.email}</span></div>
                <div className="flex items-center gap-2 text-xs"><Shield className="w-3 h-3 text-muted-foreground" /><span>CDL: {driver.cdlNumber} (Exp: {driver.cdlExpiry})</span></div>
              </motion.div>
            )}
            <button onClick={() => setSelectedDriver(selectedDriver?.id === driver.id ? null : driver)}
              className="w-full mt-3 text-xs text-primary hover:underline">
              {selectedDriver?.id === driver.id ? 'Hide Details' : 'Show Details'}
            </button>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center"><Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" /><p className="text-sm text-muted-foreground">No drivers found</p></div>
      )}

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Driver" description="Add a driver to your team" size="lg">{driverForm}</Modal>
      <Modal open={!!editDriver} onClose={() => setEditDriver(null)} title={`Edit Driver: ${editDriver?.name ?? ''}`} description="Update driver information" size="lg">{driverForm}</Modal>
      <ConfirmDialog open={!!deleteDriver} onClose={() => setDeleteDriver(null)} onConfirm={confirmDelete}
        title="Remove Driver" message={`Are you sure you want to remove ${deleteDriver?.name ?? ''} from your team? This action cannot be undone.`} confirmLabel="Remove Driver" />
    </div>
  );
}
