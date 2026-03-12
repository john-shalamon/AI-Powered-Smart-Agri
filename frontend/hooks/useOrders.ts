'use client';

import { useState, useEffect, useCallback } from 'react';
import { orderApi } from '@/lib/api.service';

export function useOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderApi.getAll();
      setOrders(data.orders || data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await orderApi.getStats();
      setStats(data);
    } catch {
      // Stats are optional
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [fetchOrders, fetchStats]);

  const createOrder = useCallback(async (orderData: any) => {
    const data = await orderApi.create(orderData);
    await fetchOrders();
    return data;
  }, [fetchOrders]);

  const updateStatus = useCallback(async (id: string, status: string) => {
    const data = await orderApi.updateStatus(id, status);
    await fetchOrders();
    return data;
  }, [fetchOrders]);

  return { orders, loading, error, stats, createOrder, updateStatus, refresh: fetchOrders };
}

export function useTransport() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      const data = await (await import('@/lib/api.service')).transportApi.getAvailableJobs();
      setJobs(data.jobs || data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch jobs');
    }
  }, []);

  const fetchDeliveries = useCallback(async () => {
    try {
      const data = await (await import('@/lib/api.service')).transportApi.getMyDeliveries();
      setDeliveries(data.deliveries || data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch deliveries');
    }
  }, []);

  const fetchEarnings = useCallback(async () => {
    try {
      const data = await (await import('@/lib/api.service')).transportApi.getEarnings();
      setEarnings(data);
    } catch {
      // Earnings optional
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchJobs(), fetchDeliveries(), fetchEarnings()]).finally(() => setLoading(false));
  }, [fetchJobs, fetchDeliveries, fetchEarnings]);

  const acceptJob = useCallback(async (jobId: string) => {
    const { transportApi } = await import('@/lib/api.service');
    const data = await transportApi.acceptJob(jobId);
    await fetchJobs();
    await fetchDeliveries();
    return data;
  }, [fetchJobs, fetchDeliveries]);

  return { jobs, deliveries, earnings, loading, error, acceptJob, refreshJobs: fetchJobs, refreshDeliveries: fetchDeliveries };
}
