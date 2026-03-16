'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/hooks/use-sidebar';
import { useTheme } from 'next-themes';
import {
  Menu, Search, Bell, Sun, Moon, ChevronDown, LogOut,
  User, Settings, Calendar, MapPin, X, AlertTriangle, Info, CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import notificationsData from '@/mock-data/notifications.json';
import type { Notification } from '@/types';

export function Header() {
  const router = useRouter();
  const { toggle } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData as Notification[]);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications?.filter?.(n => !n?.read)?.length ?? 0;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef?.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef?.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => (prev ?? [])?.map?.(n => ({ ...(n ?? {}), read: true })) ?? []);
  };

  const notifIcon = (type: string) => {
    if (type === 'alert') return <AlertTriangle className="w-4 h-4 text-red-400" />;
    if (type === 'warning') return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    if (type === 'success') return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    return <Info className="w-4 h-4 text-blue-400" />;
  };

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-4 gap-4">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button onClick={toggle} className="lg:hidden p-2 rounded-lg hover:bg-accent text-muted-foreground">
          <Menu className="w-5 h-5" />
        </button>

        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search loads, trucks, drivers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value ?? '')}
            className="w-[280px] lg:w-[360px] h-9 pl-9 pr-3 rounded-lg bg-accent/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Filters */}
        <div className="hidden md:flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-accent/50 border border-border text-sm text-muted-foreground hover:text-foreground transition">
            <Calendar className="w-3.5 h-3.5" />
            <span>Last 7 days</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-accent/50 border border-border text-sm text-muted-foreground hover:text-foreground transition">
            <MapPin className="w-3.5 h-3.5" />
            <span>All Locations</span>
          </button>
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg hover:bg-accent text-muted-foreground transition"
        >
          {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative p-2 rounded-lg hover:bg-accent text-muted-foreground transition"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-medium">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-[380px] max-h-[480px] bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <button onClick={markAllRead} className="text-xs text-primary hover:underline">Mark all read</button>
              </div>
              <div className="overflow-y-auto max-h-[380px]">
                {(notifications ?? [])?.map?.((n) => (
                  <div key={n?.id} className={cn('flex gap-3 p-4 border-b border-border/50 hover:bg-accent/50 transition cursor-pointer', !n?.read && 'bg-primary/5')}>
                    <div className="mt-0.5">{notifIcon(n?.type ?? 'info')}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{n?.title ?? ''}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n?.message ?? ''}</p>
                      <p className="text-xs text-muted-foreground mt-1">{n?.time ?? ''}</p>
                    </div>
                    {!n?.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                  </div>
                )) ?? []}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg hover:bg-accent transition"
          >
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">SJ</div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium leading-tight">Sarah Johnson</p>
              <p className="text-[11px] text-muted-foreground">Operations Manager</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
              <div className="p-3 border-b border-border">
                <p className="text-sm font-medium">Sarah Johnson</p>
                <p className="text-xs text-muted-foreground">sarah@cargostics.com</p>
              </div>
              <div className="py-1">
                <button onClick={() => { setProfileOpen(false); router.push('/profile'); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition">
                  <User className="w-4 h-4" /> Profile
                </button>
                <button onClick={() => { setProfileOpen(false); router.push('/settings'); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition">
                  <Settings className="w-4 h-4" /> Settings
                </button>
              </div>
              <div className="py-1 border-t border-border">
                <button onClick={() => { setProfileOpen(false); router.push('/login'); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-accent transition">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
