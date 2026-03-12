'use client';

import { Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { NotificationDropdown } from './notification-dropdown';
import { useAuth } from '@/lib/auth';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-green-100 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => alert('Mobile menu coming soon!')}>
          <Menu className="w-5 h-5" />
        </Button>

        {/* Search bar */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 bg-slate-50 border-slate-200"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <NotificationDropdown />

          {/* User profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-slate-900">{user?.name || 'User'}</p>
            </div>
            <Avatar className="w-10 h-10 border-2 border-green-100">
              <AvatarFallback className="bg-green-100 text-green-700">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
