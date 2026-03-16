'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Fuel, Truck, Users, MapPin, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const steps = [
  { icon: Truck, title: 'Set Up Your Fleet', desc: 'Add your trucks and trailers to start tracking operations.', fields: ['Fleet Size', 'Primary Vehicle Type'] },
  { icon: Users, title: 'Invite Your Team', desc: 'Add dispatchers, drivers, and finance team members.', fields: ['Team Size', 'Primary Roles'] },
  { icon: MapPin, title: 'Configure Locations', desc: 'Add your hubs, warehouses, and common routes.', fields: ['Number of Hubs', 'Primary Region'] },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const finish = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    router.push('/dashboard');
  };

  const StepIcon = steps?.[step]?.icon ?? CheckCircle;

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Fuel className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">Cargostics</span>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps?.map?.((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i <= step ? 'bg-primary' : 'bg-border'}`} />
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          <AnimatePresence mode="wait">
            {step < (steps?.length ?? 0) ? (
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <StepIcon className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-xl font-bold mb-2">{steps?.[step]?.title ?? ''}</h2>
                <p className="text-sm text-muted-foreground mb-6">{steps?.[step]?.desc ?? ''}</p>
                <div className="space-y-4">
                  {(steps?.[step]?.fields ?? [])?.map?.((field, i) => (
                    <div key={i}>
                      <label className="text-sm font-medium mb-1.5 block">{field}</label>
                      <input className="w-full h-11 px-4 rounded-lg bg-accent/30 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder={`Enter ${field?.toLowerCase?.() ?? ''}`} />
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold mb-2">You&apos;re all set!</h2>
                <p className="text-sm text-muted-foreground">Your Cargostics workspace is ready. Let&apos;s get started.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 mt-8">
            {step > 0 && step < (steps?.length ?? 0) && (
              <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 px-4 h-11 rounded-lg border border-border text-sm font-medium hover:bg-accent transition">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            <button
              onClick={() => step < (steps?.length ?? 0) ? setStep(s => s + 1) : finish()}
              disabled={loading}
              className="flex-1 h-11 bg-primary text-primary-foreground rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50">
              {loading ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> :
                step >= (steps?.length ?? 0) ? 'Go to Dashboard' : <><span>Continue</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
