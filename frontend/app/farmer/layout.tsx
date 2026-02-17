'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import {
  LayoutDashboard,
  Plus,
  List,
  TrendingUp,
  Bug,
  ShoppingCart,
  Truck,
  User,
} from 'lucide-react';

const farmerNavItems = [
  { label: 'Dashboard', href: '/farmer/dashboard', icon: LayoutDashboard },
  { label: 'Add Listing', href: '/farmer/add-listing', icon: Plus },
  { label: 'My Listings', href: '/farmer/my-listings', icon: List },
  { label: 'Market Insights', href: '/farmer/market-insights', icon: TrendingUp },
  { label: 'Disease Detection', href: '/farmer/disease-detection', icon: Bug },
  { label: 'Orders', href: '/farmer/orders', icon: ShoppingCart },
  { label: 'Transport', href: '/farmer/transport', icon: Truck },
  { label: 'Profile', href: '/farmer/profile', icon: User },
];

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar navItems={farmerNavItems} userRole="farmer" />
      <div className="lg:ml-64">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
}
