'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Truck, Package, MapPin, Star, DollarSign, User } from 'lucide-react';

const transporterNavItems = [
  { label: 'Dashboard', href: '/transporter/dashboard', icon: Truck },
  { label: 'Available Jobs', href: '/transporter/available-jobs', icon: Package },
  { label: 'My Deliveries', href: '/transporter/my-deliveries', icon: MapPin },
  { label: 'Earnings', href: '/transporter/earnings', icon: DollarSign },
  { label: 'Reviews', href: '/transporter/reviews', icon: Star },
  { label: 'Profile', href: '/transporter/profile', icon: User },
];

export default function TransporterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar navItems={transporterNavItems} userRole="transporter" />
      <div className="lg:ml-64">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
}
