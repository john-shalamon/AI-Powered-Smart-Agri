'use client';

import { useEffect } from 'react';
import { useSocketEvent, useSocket } from '../lib/socket';
import { toast } from 'sonner';

export const useNotifications = (userId?: string, role?: string) => {
  const { joinUser, joinRole } = useSocket();

  // Join rooms when userId or role changes
  useEffect(() => {
    if (userId) {
      joinUser(userId);
    }
  }, [userId, joinUser]);

  useEffect(() => {
    if (role) {
      joinRole(role);
    }
  }, [role, joinRole]);

  // Listen for order status changes
  useSocketEvent('order-status-changed', (data) => {
    toast.info(`Order ${data.orderId} status updated to ${data.status}`, {
      description: data.message || 'Check your orders for details.',
    });
  });

  // Listen for market data changes
  useSocketEvent('market-data-changed', (data) => {
    toast.info('Market data updated', {
      description: `New prices available for ${data.cropType || 'various crops'}.`,
    });
  });

  // Listen for disease notifications
  useSocketEvent('disease-notification', (data) => {
    toast.warning('Disease Alert Detected', {
      description: `Potential ${data.diseaseName} detected in your crops. Take immediate action.`,
    });
  });

  // Listen for general notifications
  useSocketEvent('notification', (data) => {
    const toastType = data.type === 'error' ? toast.error :
                     data.type === 'success' ? toast.success :
                     data.type === 'warning' ? toast.warning : toast.info;

    toastType(data.title || 'Notification', {
      description: data.message,
    });
  });
};