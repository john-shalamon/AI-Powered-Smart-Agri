'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LogOut, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  navItems: NavItem[];
  userRole: string;
}

export function Sidebar({ navItems, userRole }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    router.push('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 bg-white/80 backdrop-blur-md border-r border-green-100 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-green-100">
        <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-xl">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-slate-900">AgriConnect</h1>
          <p className="text-xs text-slate-600 capitalize">{userRole}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                    isActive
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-green-50 hover:text-green-700'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-green-100">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-slate-700 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
