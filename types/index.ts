export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Dispatcher' | 'Finance' | 'Driver' | 'Viewer';
  avatar?: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

export interface Load {
  id: string;
  customer: string;
  origin: string;
  destination: string;
  driver: string;
  driverId: string;
  truck: string;
  status: 'In Transit' | 'Assigned' | 'Loading' | 'Delivered' | 'Delayed' | 'Cancelled';
  pickupDate: string;
  deliveryDate: string;
  rate: number;
  weight: string;
  commodity: string;
  distance: string;
  margin: number;
  priority: 'High' | 'Medium' | 'Low';
}

export interface Vehicle {
  id: string;
  unit: string;
  type: string;
  make: string;
  model: string;
  year: number;
  status: 'Available' | 'In Transit' | 'Maintenance' | 'Out of Service';
  driver?: string;
  mileage: number;
  healthScore: number;
  nextMaintenance: string;
  fuelType: string;
  licensePlate: string;
  location: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'Available' | 'On Route' | 'Off Duty' | 'On Break';
  cdlNumber: string;
  cdlExpiry: string;
  medicalExpiry: string;
  hosRemaining: string;
  safetyScore: number;
  loadsCompleted: number;
  rating: number;
  currentLoad?: string;
  homeBase: string;
  avatar?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  address: string;
  capacity: number;
  utilization: number;
  docks: number;
  docksAvailable: number;
  manager: string;
  type: 'Distribution' | 'Cross-Dock' | 'Cold Storage' | 'Fulfillment';
  status: 'Active' | 'Maintenance' | 'Closed';
}

export interface Invoice {
  id: string;
  loadId: string;
  customer: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Disputed';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
}

export interface POD {
  id: string;
  loadId: string;
  deliveryDate: string;
  recipient: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  signedBy: string;
  notes?: string;
}

export interface Notification {
  id: string;
  type: 'alert' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
  category: 'pickup' | 'delivery' | 'hos' | 'maintenance' | 'invoice' | 'system';
}

export interface AnalyticsData {
  revenueByMonth: { month: string; revenue: number; cost: number; profit: number }[];
  loadsByStatus: { status: string; count: number }[];
  topCustomers: { customer: string; loads: number; revenue: number }[];
  onTimeRate: { week: string; rate: number }[];
  fleetUtilization: { day: string; active: number; idle: number; maintenance: number }[];
  revenueByLane: { lane: string; revenue: number; loads: number }[];
}

export interface DashboardKPI {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
}

export interface RoutePoint {
  id: string;
  loadId: string;
  lat: number;
  lng: number;
  status: 'on-time' | 'delayed' | 'critical';
  driver: string;
  eta: string;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
  loadId?: string;
  actionable: boolean;
}
