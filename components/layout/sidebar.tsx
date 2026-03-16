'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/use-sidebar';
import {
  LayoutDashboard, Package, CalendarRange, Truck, Users, MapPin,
  Warehouse, FileCheck, Receipt, BarChart3, Bot, Settings, ChevronLeft,
  ChevronRight, X, Fuel, Route, DollarSign, Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  label: string;
  href: string;
  icon: any;
  section?: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Orders / Loads', href: '/orders', icon: Package },
  { label: 'Dispatch Board', href: '/dispatch', icon: CalendarRange },
  { label: 'Fleet', href: '/fleet', icon: Truck },
  { label: 'Drivers', href: '/drivers', icon: Users },
  { label: 'Routes & Tracking', href: '/routes', icon: MapPin },
  { label: 'Warehouses', href: '/warehouses', icon: Warehouse },
  { label: 'Proof of Delivery', href: '/pod', icon: FileCheck },
  { label: 'Billing & Invoices', href: '/billing', icon: Receipt },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
  // AI-Powered section
  { label: 'AI Ops Assistant', href: '/ai-assistant', icon: Bot, section: 'AI-Powered' },
  { label: 'Route Optimizer', href: '/route-optimizer', icon: Route, section: 'AI-Powered' },
  { label: 'Cost Analyzer', href: '/cost-analyzer', icon: DollarSign, section: 'AI-Powered' },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, isCollapsed, setOpen, toggleCollapse } = useSidebar();

  let lastSection = '';

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full bg-card border-r border-border flex flex-col transition-all duration-300',
          isCollapsed ? 'w-[68px]' : 'w-[260px]',
          'lg:relative',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Fuel className="w-4 h-4 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <span className="text-lg font-bold text-foreground">Cargostics</span>
            )}
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-accent text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems?.map((item) => {
            const isActive = pathname === item?.href || pathname?.startsWith?.(`${item?.href}/`);
            const Icon = item?.icon;
            const showSection = item?.section && item?.section !== lastSection;
            if (item?.section) lastSection = item.section;

            return (
              <div key={item?.href}>
                {showSection && !isCollapsed && (
                  <div className="px-3 pt-4 pb-1.5">
                    <div className="flex items-center gap-2">
                      <Brain className="w-3 h-3 text-violet-400" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-400">{item?.section}</span>
                    </div>
                  </div>
                )}
                {showSection && isCollapsed && (
                  <div className="flex justify-center py-2">
                    <div className="w-5 h-[1px] bg-violet-500/30" />
                  </div>
                )}
                <Link
                  href={item?.href ?? '#'}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : item?.section === 'AI-Powered'
                        ? 'text-muted-foreground hover:bg-violet-500/5 hover:text-violet-400'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  {Icon && <Icon className={cn('w-5 h-5 shrink-0', isActive && 'text-primary')} />}
                  {!isCollapsed && <span>{item?.label}</span>}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Collapse toggle - desktop only */}
        <div className="hidden lg:flex p-3 border-t border-border">
          <button
            onClick={toggleCollapse}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-accent text-muted-foreground transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  );
}
