'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { ShoppingCart, Package, TrendingUp, FileText, Star, User } from 'lucide-react';

const buyerNavItems = [
  { label: 'Dashboard', href: '/buyer/dashboard', icon: TrendingUp },
  { label: 'Browse Crops', href: '/buyer/browse-crops', icon: ShoppingCart },
  { label: 'My Orders', href: '/buyer/my-orders', icon: Package },
  { label: 'Contracts', href: '/buyer/contracts', icon: FileText },
  { label: 'Suppliers', href: '/buyer/suppliers', icon: Star },
  { label: 'Profile', href: '/buyer/profile', icon: User },
];

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar navItems={buyerNavItems} userRole="buyer" />
      <div className="lg:ml-64">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
}
