'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell, Check, X, Package, TrendingUp, Truck, Cloud, Brain, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { notificationApi } from '@/lib/api.service';
import { useAuth } from '@/lib/auth';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date | string;
}

// Fallback mock notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Order Status Updated',
    message: 'Your order #1234 has been confirmed and is being processed.',
    type: 'order',
    read: false,
    actionUrl: '/farmer/orders',
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '2',
    title: 'Market Price Alert',
    message: 'Rice prices have increased by 5% in your region.',
    type: 'market',
    read: false,
    actionUrl: '/farmer/market-insights',
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: '3',
    title: 'Weather Alert',
    message: 'Heavy rainfall expected in your area tomorrow.',
    type: 'weather',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '4',
    title: 'AI Disease Detection',
    message: 'Early signs of leaf blight detected. Check recommendations.',
    type: 'ai',
    read: true,
    actionUrl: '/farmer/disease-detection',
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
  },
];

export function NotificationDropdown() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Load notifications from API
  useEffect(() => {
    if (!user) return;
    notificationApi.getAll({ limit: '20' })
      .then(data => {
        if (data.notifications?.length > 0) {
          setNotifications(data.notifications);
        }
      })
      .catch(() => {
        // Use mock data as fallback
      });
  }, [user]);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    try { await notificationApi.markAsRead(id); } catch {}
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try { await notificationApi.markAllAsRead(); } catch {}
  }, []);

  const removeNotification = useCallback(async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    try { await notificationApi.delete(id); } catch {}
  }, []);

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return d.toLocaleDateString();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order': return <Package className="w-4 h-4 text-blue-500" />;
      case 'market': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'transport':
      case 'delivery': return <Truck className="w-4 h-4 text-orange-500" />;
      case 'weather': return <Cloud className="w-4 h-4 text-cyan-500" />;
      case 'ai': return <Brain className="w-4 h-4 text-purple-500" />;
      default: return <ShieldAlert className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-slate-700" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs h-8 px-2"
            >
              <Check className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-slate-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50/50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getTypeIcon(notification.type)}
                        <p className="text-sm font-medium truncate">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 ml-6">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 ml-6">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setIsOpen(false)}>
                View all notifications
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}