'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Fuel, Mail, Lock, User, Building, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', email: '', password: '' });

  const handleSignup = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    router.push('/onboarding');
  };

  const update = (key: string, val: string) => setForm(p => ({ ...(p ?? {}), [key]: val }));

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Fuel className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">Cargostics</span>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-2 text-center">Create your account</h2>
          <p className="text-muted-foreground text-center mb-6 text-sm">Start managing your logistics operations</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" value={form?.name ?? ''} onChange={e => update('name', e?.target?.value ?? '')}
                  placeholder="Sarah Johnson" className="w-full h-11 pl-10 pr-4 rounded-lg bg-accent/30 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Company</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" value={form?.company ?? ''} onChange={e => update('company', e?.target?.value ?? '')}
                  placeholder="Acme Logistics" className="w-full h-11 pl-10 pr-4 rounded-lg bg-accent/30 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" value={form?.email ?? ''} onChange={e => update('email', e?.target?.value ?? '')}
                  placeholder="sarah@company.com" className="w-full h-11 pl-10 pr-4 rounded-lg bg-accent/30 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type={showPass ? 'text' : 'password'} value={form?.password ?? ''} onChange={e => update('password', e?.target?.value ?? '')}
                  placeholder="Min 8 characters" className="w-full h-11 pl-10 pr-10 rounded-lg bg-accent/30 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full h-11 bg-primary text-primary-foreground rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 mt-2">
              {loading ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account? <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
