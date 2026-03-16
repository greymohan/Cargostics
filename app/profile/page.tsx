'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Shield, Calendar, Camera } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    name: 'Sarah Johnson', email: 'sarah@cargostics.com', phone: '+61 412 345 678',
    role: 'Admin', location: 'Sydney, NSW', joined: 'January 2024',
  });

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your account information</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-8">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">SJ</div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <p className="text-xl font-bold">{form?.name ?? ''}</p>
            <p className="text-sm text-muted-foreground">Operations Manager</p>
          </div>
        </div>

        <div className="space-y-5">
          {[
            { icon: User, label: 'Full Name', key: 'name', type: 'text' },
            { icon: Mail, label: 'Email', key: 'email', type: 'email' },
            { icon: Phone, label: 'Phone', key: 'phone', type: 'tel' },
            { icon: MapPin, label: 'Location', key: 'location', type: 'text' },
          ]?.map?.((field) => (
            <div key={field?.key}>
              <label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                <field.icon className="w-4 h-4 text-muted-foreground" />
                {field?.label ?? ''}
              </label>
              <input
                type={field?.type ?? 'text'}
                value={(form as Record<string, string>)?.[field?.key ?? ''] ?? ''}
                onChange={e => setForm(p => ({ ...(p ?? {}), [field?.key ?? '']: e?.target?.value ?? '' }))}
                className="w-full h-11 px-4 rounded-lg bg-accent/30 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          ))}

          <div className="flex items-center gap-4 pt-2">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" /> Role
              </label>
              <input value={form?.role ?? ''} disabled className="w-full h-11 px-4 rounded-lg bg-muted border border-border text-sm text-muted-foreground" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" /> Joined
              </label>
              <input value={form?.joined ?? ''} disabled className="w-full h-11 px-4 rounded-lg bg-muted border border-border text-sm text-muted-foreground" />
            </div>
          </div>
        </div>

        <button onClick={() => toast.success('Profile updated successfully')}
          className="mt-6 px-6 h-11 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition">
          Save Changes
        </button>
      </motion.div>
    </div>
  );
}
