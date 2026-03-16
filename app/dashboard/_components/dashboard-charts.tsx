'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import analyticsData from '@/mock-data/analytics.json';
import RevenueChart from './revenue-chart';
import FleetChart from './fleet-chart';

export function DashboardCharts() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="grid grid-cols-1 lg:grid-cols-2 gap-4"><Skeleton className="h-[340px] rounded-xl" /><Skeleton className="h-[340px] rounded-xl" /></div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold text-sm mb-4">Revenue & Profit Trend</h3>
        <RevenueChart data={analyticsData?.revenueByMonth ?? []} />
      </div>
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold text-sm mb-4">Fleet Utilization</h3>
        <FleetChart data={analyticsData?.fleetUtilization ?? []} />
      </div>
    </div>
  );
}
