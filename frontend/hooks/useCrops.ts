'use client';

import { useState, useEffect, useCallback } from 'react';
import { cropApi } from '@/lib/api.service';

interface CropFilters {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  location?: string;
  search?: string;
  sort?: string;
  page?: string;
  limit?: string;
}

export function useCrops(initialFilters: CropFilters = {}) {
  const [crops, setCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CropFilters>(initialFilters);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchCrops = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cropApi.getAll(filters);
      setCrops(data.crops || []);
      setPagination({
        page: data.currentPage || 1,
        totalPages: data.totalPages || 1,
        total: data.total || 0,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch crops');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  const updateFilters = useCallback((newFilters: Partial<CropFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return { crops, loading, error, filters, pagination, updateFilters, refresh: fetchCrops };
}

export function useMyListings() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cropApi.getMyListings();
      setListings(data.crops || data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const createListing = useCallback(async (cropData: any) => {
    const data = await cropApi.create(cropData);
    await fetchListings();
    return data;
  }, [fetchListings]);

  const updateListing = useCallback(async (id: string, cropData: any) => {
    const data = await cropApi.update(id, cropData);
    await fetchListings();
    return data;
  }, [fetchListings]);

  const deleteListing = useCallback(async (id: string) => {
    await cropApi.delete(id);
    await fetchListings();
  }, [fetchListings]);

  return { listings, loading, error, createListing, updateListing, deleteListing, refresh: fetchListings };
}
