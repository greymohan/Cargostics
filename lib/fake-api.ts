import usersData from '@/mock-data/users.json';
import loadsData from '@/mock-data/loads.json';
import vehiclesData from '@/mock-data/vehicles.json';
import driversData from '@/mock-data/drivers.json';
import warehousesData from '@/mock-data/warehouses.json';
import invoicesData from '@/mock-data/invoices.json';
import notificationsData from '@/mock-data/notifications.json';
import analyticsData from '@/mock-data/analytics.json';
import podsData from '@/mock-data/pods.json';
import alertsData from '@/mock-data/alerts.json';
import type { User, Load, Vehicle, Driver, Warehouse, Invoice, Notification, AnalyticsData, POD, Alert, DashboardKPI } from '@/types';

const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export async function getUsers(): Promise<User[]> {
  await delay();
  return usersData as User[];
}

export async function getLoads(): Promise<Load[]> {
  await delay();
  return loadsData as Load[];
}

export async function getVehicles(): Promise<Vehicle[]> {
  await delay();
  return vehiclesData as Vehicle[];
}

export async function getDrivers(): Promise<Driver[]> {
  await delay();
  return driversData as Driver[];
}

export async function getWarehouses(): Promise<Warehouse[]> {
  await delay();
  return warehousesData as Warehouse[];
}

export async function getInvoices(): Promise<Invoice[]> {
  await delay();
  return invoicesData as Invoice[];
}

export async function getNotifications(): Promise<Notification[]> {
  await delay();
  return notificationsData as Notification[];
}

export async function getAnalytics(): Promise<AnalyticsData> {
  await delay();
  return analyticsData as AnalyticsData;
}

export async function getPODs(): Promise<POD[]> {
  await delay();
  return podsData as POD[];
}

export async function getAlerts(): Promise<Alert[]> {
  await delay();
  return alertsData as Alert[];
}

export function getDashboardKPIs(): DashboardKPI[] {
  return [
    { label: 'Active Loads', value: '247', change: '+12%', changeType: 'positive', icon: 'package' },
    { label: 'On-Time Rate', value: '94.2%', change: '-1.2%', changeType: 'negative', icon: 'clock' },
    { label: 'Trucks Available', value: '89/156', change: '+5', changeType: 'positive', icon: 'truck' },
    { label: 'Exceptions', value: '12', change: '3 critical', changeType: 'negative', icon: 'alert-triangle' },
    { label: 'Fuel Cost MTD', value: '$89.2K', change: '+1%', changeType: 'neutral', icon: 'fuel' },
    { label: 'Revenue MTD', value: '$1.2M', change: '+15%', changeType: 'positive', icon: 'dollar-sign' },
  ];
}
