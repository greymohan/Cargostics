'use client';
import { create } from 'zustand';

interface SidebarStore {
  isOpen: boolean;
  isCollapsed: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
  toggleCollapse: () => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  isOpen: false,
  isCollapsed: false,
  toggle: () => set((state) => ({ isOpen: !state?.isOpen })),
  setOpen: (open: boolean) => set({ isOpen: open }),
  toggleCollapse: () => set((state) => ({ isCollapsed: !state?.isCollapsed })),
}));
