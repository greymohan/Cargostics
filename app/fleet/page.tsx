'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Truck, Search, MapPin, Wrench, CheckCircle, XCircle, Activity, Plus, Edit2, Trash2, AlertTriangle, Brain, TrendingUp } from 'lucide-react';
import vehiclesData from '@/mock-data/vehicles.json';
import type { Vehicle } from '@/types';
import { cn } from '@/lib/utils';
import { Modal, ConfirmDialog } from '@/components/ui/modal';
import { FormField, FormInput, FormSelect } from '@/components/ui/form-field';
import { toast } from 'sonner';

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
  'Available': { color: 'bg-emerald-500/10 text-emerald-400', icon: CheckCircle },
  'In Transit': { color: 'bg-blue-500/10 text-blue-400', icon: Activity },
  'Maintenance': { color: 'bg-amber-500/10 text-amber-400', icon: Wrench },
  'Out of Service': { color: 'bg-red-500/10 text-red-400', icon: XCircle },
};

const emptyVehicle: Partial<Vehicle> = {
  unit: '', type: 'Semi Truck', make: '', model: '', year: 2026, status: 'Available',
  mileage: 0, healthScore: 100, nextMaintenance: '', fuelType: 'Diesel', licensePlate: '', location: '',
};

// Predictive maintenance AI mock data
const maintenancePredictions = [
  { vehicleId: 'VH-005', unit: 'TRK-1007', issue: 'Brake pad wear detected', severity: 'High', predictedDate: 'Mar 20, 2026', savings: '$2,400', confidence: 94 },
  { vehicleId: 'VH-004', unit: 'TRK-1033', issue: 'Transmission fluid degradation', severity: 'Medium', predictedDate: 'Mar 28, 2026', savings: '$1,800', confidence: 87 },
  { vehicleId: 'VH-002', unit: 'TRK-1015', issue: 'Tire tread approaching minimum', severity: 'Medium', predictedDate: 'Apr 5, 2026', savings: '$950', confidence: 91 },
  { vehicleId: 'VH-008', unit: 'TRK-1044', issue: 'Engine coolant system anomaly', severity: 'High', predictedDate: 'Mar 18, 2026', savings: '$3,200', confidence: 96 },
];

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [mounted, setMounted] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [deleteVehicle, setDeleteVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<Partial<Vehicle>>(emptyVehicle);
  const [showPredictive, setShowPredictive] = useState(false);

  useEffect(() => { setMounted(true); setVehicles((vehiclesData ?? []) as Vehicle[]); }, []);

  const filtered = useMemo(() => {
    let result = [...(vehicles ?? [])];
    if (statusFilter !== 'All') result = result.filter(v => v?.status === statusFilter);
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(v =>
        v?.unit?.toLowerCase()?.includes(s) || v?.make?.toLowerCase()?.includes(s) ||
        v?.model?.toLowerCase()?.includes(s) || v?.location?.toLowerCase()?.includes(s)
      );
    }
    return result;
  }, [vehicles, search, statusFilter]);

  const stats = {
    total: vehicles?.length ?? 0,
    available: vehicles.filter(v => v?.status === 'Available').length,
    inTransit: vehicles.filter(v => v?.status === 'In Transit').length,
    maintenance: vehicles.filter(v => v?.status === 'Maintenance').length,
  };

  const updateForm = (key: string, value: string | number) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleAdd = () => { setFormData({ ...emptyVehicle }); setShowAddModal(true); };
  const handleEdit = (v: Vehicle) => { setFormData({ ...v }); setEditVehicle(v); };
  const handleDelete = (v: Vehicle) => { setDeleteVehicle(v); };

  const saveVehicle = () => {
    if (!formData.unit || !formData.make || !formData.model) {
      toast.error('Please fill in required fields'); return;
    }
    if (editVehicle) {
      setVehicles(prev => prev.map(v => v.id === editVehicle.id ? { ...v, ...formData } as Vehicle : v));
      toast.success(`Vehicle ${formData.unit} updated successfully`);
      setEditVehicle(null);
    } else {
      const newVehicle: Vehicle = {
        ...formData as Vehicle,
        id: `VH-${String(vehicles.length + 1).padStart(3, '0')}`,
      };
      setVehicles(prev => [newVehicle, ...prev]);
      toast.success(`Vehicle ${formData.unit} added to fleet`);
      setShowAddModal(false);
    }
  };

  const confirmDelete = () => {
    if (!deleteVehicle) return;
    setVehicles(prev => prev.filter(v => v.id !== deleteVehicle.id));
    toast.success(`Vehicle ${deleteVehicle.unit} removed from fleet`);
    setDeleteVehicle(null);
  };

  if (!mounted) return null;

  const vehicleForm = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Unit ID" required><FormInput value={formData.unit ?? ''} onChange={e => updateForm('unit', e.target.value)} placeholder="TRK-XXXX" /></FormField>
        <FormField label="Type" required>
          <FormSelect value={formData.type ?? ''} onChange={e => updateForm('type', e.target.value)}>
            <option value="Semi Truck">Semi Truck</option><option value="Box Truck">Box Truck</option>
            <option value="Flatbed">Flatbed</option><option value="Reefer">Reefer</option>
          </FormSelect>
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Make" required><FormInput value={formData.make ?? ''} onChange={e => updateForm('make', e.target.value)} placeholder="Freightliner" /></FormField>
        <FormField label="Model" required><FormInput value={formData.model ?? ''} onChange={e => updateForm('model', e.target.value)} placeholder="Cascadia" /></FormField>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <FormField label="Year"><FormInput type="number" value={formData.year ?? 2026} onChange={e => updateForm('year', parseInt(e.target.value))} /></FormField>
        <FormField label="Mileage"><FormInput type="number" value={formData.mileage ?? 0} onChange={e => updateForm('mileage', parseInt(e.target.value))} /></FormField>
        <FormField label="Health Score"><FormInput type="number" value={formData.healthScore ?? 100} onChange={e => updateForm('healthScore', parseInt(e.target.value))} min={0} max={100} /></FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Status">
          <FormSelect value={formData.status ?? 'Available'} onChange={e => updateForm('status', e.target.value)}>
            <option value="Available">Available</option><option value="In Transit">In Transit</option>
            <option value="Maintenance">Maintenance</option><option value="Out of Service">Out of Service</option>
          </FormSelect>
        </FormField>
        <FormField label="Fuel Type">
          <FormSelect value={formData.fuelType ?? 'Diesel'} onChange={e => updateForm('fuelType', e.target.value)}>
            <option value="Diesel">Diesel</option><option value="Electric">Electric</option><option value="CNG">CNG</option>
          </FormSelect>
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="License Plate"><FormInput value={formData.licensePlate ?? ''} onChange={e => updateForm('licensePlate', e.target.value)} placeholder="XX-XXXX-XX" /></FormField>
        <FormField label="Next Maintenance"><FormInput type="date" value={formData.nextMaintenance ?? ''} onChange={e => updateForm('nextMaintenance', e.target.value)} /></FormField>
      </div>
      <FormField label="Location"><FormInput value={formData.location ?? ''} onChange={e => updateForm('location', e.target.value)} placeholder="Dallas Hub" /></FormField>
      <div className="flex gap-3 justify-end pt-4 border-t border-border">
        <button onClick={() => { setShowAddModal(false); setEditVehicle(null); }} className="px-4 h-10 rounded-lg border border-border text-sm font-medium hover:bg-accent transition">Cancel</button>
        <button onClick={saveVehicle} className="px-4 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">Save Vehicle</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Fleet Management</h1>
          <p className="text-sm text-muted-foreground">Monitor and manage all vehicles in your fleet</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowPredictive(!showPredictive)}
            className={cn('flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-medium transition border',
              showPredictive ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' : 'border-border text-muted-foreground hover:text-foreground hover:bg-accent')}>
            <Brain className="w-4 h-4" /> AI Maintenance
          </button>
          <button onClick={handleAdd} className="flex items-center gap-2 px-4 h-10 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition">
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>
        </div>
      </div>

      {/* Predictive Maintenance Panel */}
      {showPredictive && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
          className="bg-gradient-to-r from-purple-500/5 via-purple-500/10 to-blue-500/5 border border-purple-500/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold">AI Predictive Maintenance</h3>
            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">4 predictions</span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">AI has analyzed telemetry data and predicts these maintenance needs. Addressing them early can save an estimated <span className="text-emerald-400 font-semibold">$8,350</span> in emergency repair costs.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {maintenancePredictions.map((p, i) => (
              <div key={i} className="bg-card/80 border border-border/50 rounded-lg p-3 flex items-start gap-3">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                  p.severity === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400')}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{p.unit}</span>
                    <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium',
                      p.severity === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400')}>{p.severity}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.issue}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px]">
                    <span className="text-muted-foreground">By {p.predictedDate}</span>
                    <span className="text-emerald-400">Save {p.savings}</span>
                    <span className="text-purple-400">{p.confidence}% confidence</span>
                  </div>
                </div>
                <button onClick={() => toast.success(`Maintenance scheduled for ${p.unit}`)}
                  className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition shrink-0">Schedule</button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Vehicles', value: stats.total, icon: Truck, color: 'text-foreground' },
          { label: 'Available', value: stats.available, icon: CheckCircle, color: 'text-emerald-400' },
          { label: 'In Transit', value: stats.inTransit, icon: Activity, color: 'text-blue-400' },
          { label: 'In Maintenance', value: stats.maintenance, icon: Wrench, color: 'text-amber-400' },
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by unit, make, model..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Available', 'In Transit', 'Maintenance', 'Out of Service'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={cn('px-3 h-9 rounded-lg text-xs font-medium transition border',
                statusFilter === s ? 'bg-primary/10 text-primary border-primary/30' : 'bg-card border-border text-muted-foreground hover:text-foreground')}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((vehicle, i) => {
          const cfg = statusConfig[vehicle?.status ?? ''] ?? { color: 'bg-muted text-muted-foreground', icon: Truck };
          return (
            <motion.div key={vehicle.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  <span className="font-bold">{vehicle.unit}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={cn('text-[11px] font-medium px-2 py-0.5 rounded-full', cfg.color)}>{vehicle.status}</span>
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity ml-1">
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(vehicle); }} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition" title="Edit">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(vehicle); }} className="p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{vehicle.year} {vehicle.make} {vehicle.model}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Type</span><span className="font-medium">{vehicle.type}</span></div>
                <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Mileage</span><span className="font-medium">{(vehicle.mileage ?? 0).toLocaleString()} mi</span></div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Health Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className={cn('h-full rounded-full', (vehicle.healthScore ?? 0) >= 80 ? 'bg-emerald-400' : (vehicle.healthScore ?? 0) >= 60 ? 'bg-amber-400' : 'bg-red-400')}
                        style={{ width: `${vehicle.healthScore ?? 0}%` }} />
                    </div>
                    <span className="font-medium">{vehicle.healthScore}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1"><MapPin className="w-3 h-3" /><span className="truncate">{vehicle.location}</span></div>
              </div>
            </motion.div>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div className="py-16 text-center"><Truck className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" /><p className="text-sm text-muted-foreground">No vehicles found</p></div>
      )}

      {/* Add Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Vehicle" description="Add a vehicle to your fleet" size="lg">
        {vehicleForm}
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editVehicle} onClose={() => setEditVehicle(null)} title={`Edit Vehicle ${editVehicle?.unit ?? ''}`} description="Update vehicle details" size="lg">
        {vehicleForm}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteVehicle}
        onClose={() => setDeleteVehicle(null)}
        onConfirm={confirmDelete}
        title="Remove Vehicle"
        message={`Are you sure you want to remove ${deleteVehicle?.unit ?? ''} (${deleteVehicle?.make ?? ''} ${deleteVehicle?.model ?? ''}) from your fleet? This action cannot be undone.`}
        confirmLabel="Remove Vehicle"
      />
    </div>
  );
}
