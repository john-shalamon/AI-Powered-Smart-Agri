'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { LayoutDashboard, Users, Package, BarChart3, AlertCircle, Settings } from 'lucide-react';

const adminNavItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Crops & Orders', href: '/admin/crops-orders', icon: Package },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Reports', href: '/admin/reports', icon: AlertCircle },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar navItems={adminNavItems} userRole="admin" />
      <div className="lg:ml-64">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
}
