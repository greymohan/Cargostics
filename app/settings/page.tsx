'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Building, Users, Link2, Bell, Bot, Shield, ChevronRight, Check, ToggleLeft, ToggleRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SettingToggle { id: string; label: string; desc: string; enabled: boolean; }

const sections = [
  { id: 'company', label: 'Company Setup', icon: Building, desc: 'Manage branches and organization structure' },
  { id: 'roles', label: 'User Roles & Permissions', icon: Users, desc: 'Define roles and control access' },
  { id: 'integrations', label: 'System Integrations', icon: Link2, desc: 'Connect GPS, ELD, accounting, fuel cards' },
  { id: 'notifications', label: 'Notifications & Alerts', icon: Bell, desc: 'Configure event rules and alert channels' },
  { id: 'ai', label: 'AI & Automation', icon: Bot, desc: 'Enable AI modules and configure thresholds' },
  { id: 'security', label: 'Security & Compliance', icon: Shield, desc: 'Audit log and security settings' },
];

const aiModules: SettingToggle[] = [
  { id: 'driver-match', label: 'Driver-Truck Matching', desc: 'AI suggests optimal driver-vehicle pairings', enabled: true },
  { id: 'delay-predict', label: 'Delay Risk Prediction', desc: 'Predict potential delivery delays in real-time', enabled: true },
  { id: 'route-opt', label: 'Route Optimization', desc: 'Suggest fuel-efficient and time-saving routes', enabled: true },
  { id: 'invoice-audit', label: 'Invoice Auditing', desc: 'Detect billing discrepancies automatically', enabled: false },
  { id: 'maintenance-pred', label: 'Predictive Maintenance', desc: 'Forecast vehicle maintenance needs', enabled: true },
];

const notifSettings: SettingToggle[] = [
  { id: 'late-pickup', label: 'Late Pickup Alerts', desc: 'Notify when pickup is behind schedule', enabled: true },
  { id: 'hos-warning', label: 'HOS Warnings', desc: 'Alert when drivers near driving limits', enabled: true },
  { id: 'temp-alert', label: 'Temperature Alerts', desc: 'Alert for reefer units exceeding thresholds', enabled: true },
  { id: 'invoice-overdue', label: 'Invoice Overdue', desc: 'Notify when invoices are past due', enabled: true },
  { id: 'maintenance-due', label: 'Maintenance Due', desc: 'Alert when vehicles need servicing', enabled: false },
];

const integrations = [
  { name: 'Omnitracs ELD', status: 'Connected', color: 'text-emerald-400' },
  { name: 'QuickBooks', status: 'Connected', color: 'text-emerald-400' },
  { name: 'Comdata Fuel Cards', status: 'Connected', color: 'text-emerald-400' },
  { name: 'Samsara GPS', status: 'Not Connected', color: 'text-muted-foreground' },
  { name: 'KeepTruckin', status: 'Not Connected', color: 'text-muted-foreground' },
];

const roles = [
  { name: 'Admin', users: 2, perms: 'Full access to all features' },
  { name: 'Dispatcher', users: 5, perms: 'Loads, dispatch, fleet, drivers' },
  { name: 'Finance', users: 3, perms: 'Billing, invoices, reports' },
  { name: 'Driver', users: 45, perms: 'Own loads, POD, navigation' },
  { name: 'Viewer', users: 8, perms: 'Read-only dashboard access' },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('company');
  const [aiToggles, setAiToggles] = useState(aiModules);
  const [notifToggles, setNotifToggles] = useState(notifSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const toggleAI = (id: string) => {
    setAiToggles(prev => (prev ?? [])?.map?.(t => t?.id === id ? { ...(t ?? {}), enabled: !t?.enabled } : t) as SettingToggle[]);
    toast.success('Setting updated');
  };

  const toggleNotif = (id: string) => {
    setNotifToggles(prev => (prev ?? [])?.map?.(t => t?.id === id ? { ...(t ?? {}), enabled: !t?.enabled } : t) as SettingToggle[]);
    toast.success('Setting updated');
  };

  if (!mounted) return null;

  const renderContent = () => {
    switch (activeSection) {
      case 'company':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[['Company Name', 'Cargostics Logistics Pty Ltd'], ['ABN', '12 345 678 901'], ['ACN', '345 678 901'], ['Headquarters', 'Sydney, NSW']]?.map?.(([label, value]) => (
                <div key={String(label)} className="space-y-1.5">
                  <label className="text-sm font-medium">{String(label ?? '')}</label>
                  <input defaultValue={String(value ?? '')} className="w-full h-10 px-3 rounded-lg bg-accent/30 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              ))}
            </div>
            <button onClick={() => toast.success('Company info saved')} className="mt-4 px-4 h-10 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition">Save Changes</button>
          </div>
        );
      case 'roles':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">User Roles & Permissions</h3>
            <div className="space-y-3">
              {roles?.map?.((role, i) => (
                <div key={role?.name ?? i} className="flex items-center justify-between p-4 bg-accent/20 rounded-xl border border-border/50">
                  <div>
                    <p className="font-medium">{role?.name ?? ''}</p>
                    <p className="text-xs text-muted-foreground">{role?.perms ?? ''}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{role?.users ?? 0} users</span>
                    <button className="text-xs text-primary hover:underline">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'integrations':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">System Integrations</h3>
            <div className="space-y-3">
              {integrations?.map?.((int, i) => (
                <div key={int?.name ?? i} className="flex items-center justify-between p-4 bg-accent/20 rounded-xl border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/50 flex items-center justify-center">
                      <Link2 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{int?.name ?? ''}</p>
                      <p className={cn('text-xs', int?.color ?? '')}>{int?.status ?? ''}</p>
                    </div>
                  </div>
                  <button className={cn('px-3 h-8 rounded-lg text-xs font-medium transition',
                    int?.status === 'Connected' ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground hover:opacity-90')}>
                    {int?.status === 'Connected' ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Notification Rules</h3>
            <div className="space-y-3">
              {(notifToggles ?? [])?.map?.((toggle) => (
                <div key={toggle?.id} className="flex items-center justify-between p-4 bg-accent/20 rounded-xl border border-border/50">
                  <div>
                    <p className="font-medium text-sm">{toggle?.label ?? ''}</p>
                    <p className="text-xs text-muted-foreground">{toggle?.desc ?? ''}</p>
                  </div>
                  <button onClick={() => toggleNotif(toggle?.id ?? '')} className="shrink-0">
                    {toggle?.enabled ? <ToggleRight className="w-8 h-8 text-primary" /> : <ToggleLeft className="w-8 h-8 text-muted-foreground" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'ai':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">AI & Automation Controls</h3>
            <div className="space-y-3">
              {(aiToggles ?? [])?.map?.((toggle) => (
                <div key={toggle?.id} className="flex items-center justify-between p-4 bg-accent/20 rounded-xl border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{toggle?.label ?? ''}</p>
                      <p className="text-xs text-muted-foreground">{toggle?.desc ?? ''}</p>
                    </div>
                  </div>
                  <button onClick={() => toggleAI(toggle?.id ?? '')} className="shrink-0">
                    {toggle?.enabled ? <ToggleRight className="w-8 h-8 text-primary" /> : <ToggleLeft className="w-8 h-8 text-muted-foreground" />}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-accent/20 rounded-xl border border-border/50">
              <p className="font-medium text-sm mb-2">AI Confidence Threshold</p>
              <p className="text-xs text-muted-foreground mb-3">Minimum confidence score for AI suggestions</p>
              <div className="flex items-center gap-4">
                <input type="range" min="50" max="99" defaultValue="75" className="flex-1 accent-primary" />
                <span className="text-sm font-bold text-primary">75%</span>
              </div>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Security & Compliance</h3>
            <div className="space-y-3">
              {[
                { time: '2 min ago', action: 'Login', user: 'Sarah Johnson', detail: 'Successful login from 192.168.1.1' },
                { time: '15 min ago', action: 'Settings Changed', user: 'Sarah Johnson', detail: 'Updated AI automation controls' },
                { time: '1 hour ago', action: 'Load Created', user: 'Mike Rodriguez', detail: 'Created load LD-2024-001854' },
                { time: '3 hours ago', action: 'Invoice Generated', user: 'Emily Chen', detail: 'Generated INV-24-1842' },
                { time: '5 hours ago', action: 'Driver Assigned', user: 'Mike Rodriguez', detail: 'Assigned Pedro Garcia to LD-2024-001853' },
              ]?.map?.((log, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-accent/20 rounded-xl border border-border/50">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium">{log?.action ?? ''}</span>
                      <span className="text-xs text-muted-foreground">• {log?.time ?? ''}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{log?.user ?? ''} — {log?.detail ?? ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure your Cargostics workspace</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 shrink-0 space-y-1">
          {sections?.map?.((section) => (
            <button key={section?.id} onClick={() => setActiveSection(section?.id ?? '')}
              className={cn('w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition text-left',
                activeSection === section?.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground')}>
              <section.icon className="w-4 h-4 shrink-0" />
              <div className="flex-1">
                <p className="font-medium">{section?.label ?? ''}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-card border border-border rounded-xl p-6">
          <motion.div key={activeSection} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
