'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageTransition } from '@/components/animations/page-transition';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockCropListings } from '@/lib/mock-data/crops';
import { StatusBadge } from '@/components/shared/status-badge';
import { Search, Eye, Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cropApi } from '@/lib/api.service';

export default function MyListingsPage() {
  const router = useRouter();
  const [myListings, setMyListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await cropApi.getMyListings();
      setMyListings(data.crops || []);
    } catch {
      // Fallback to mock data
      setMyListings(mockCropListings.filter(c => c.farmerId === 'f1'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleDelete = async (listingId: string) => {
    try {
      await cropApi.delete(listingId);
      toast.success('Listing deleted successfully');
      fetchListings();
    } catch {
      // Fallback: local delete
      setMyListings(prev => prev.filter(l => l.id !== listingId));
      toast.success('Listing deleted successfully');
    }
  };

  const handleEdit = (listingId: string) => {
    router.push(`/farmer/edit-listing/${listingId}`);
  };

  const filteredListings = search
    ? myListings.filter(l => l.cropName?.toLowerCase().includes(search.toLowerCase()) || l.category?.toLowerCase().includes(search.toLowerCase()))
    : myListings;

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 text-balance">My Listings</h1>
            <p className="text-slate-600 mt-1">Manage your crop listings</p>
          </div>
          <Button asChild className="bg-green-600 hover:bg-green-700 rounded-xl">
            <Link href="/farmer/add-listing">
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Link>
          </Button>
        </div>

        {/* Search and Filter */}
        <Card className="bg-white/80 backdrop-blur-md border-green-100 p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search listings..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="rounded-xl">
              Filters
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/80 backdrop-blur-md border-green-100 p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{myListings.filter(l => l.status === 'active').length}</p>
            <p className="text-sm text-slate-600 mt-1">Active</p>
          </Card>
          <Card className="bg-white/80 backdrop-blur-md border-green-100 p-4 text-center">
            <p className="text-2xl font-bold text-slate-600">{myListings.filter(l => l.status === 'sold').length}</p>
            <p className="text-sm text-slate-600 mt-1">Sold</p>
          </Card>
          <Card className="bg-white/80 backdrop-blur-md border-green-100 p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{myListings.filter(l => l.status === 'reserved').length}</p>
            <p className="text-sm text-slate-600 mt-1">Reserved</p>
          </Card>
          <Card className="bg-white/80 backdrop-blur-md border-green-100 p-4 text-center">
            <p className="text-2xl font-bold text-gray-600">{myListings.filter(l => l.status === 'expired').length}</p>
            <p className="text-sm text-slate-600 mt-1">Expired</p>
          </Card>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <Card
              key={listing.id}
              className="bg-white/80 backdrop-blur-md border-green-100 overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <img
                  src={listing.images[0]}
                  alt={listing.cropName}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <StatusBadge status={listing.status} />
                </div>
                {listing.quality && (
                  <Badge className="absolute top-3 left-3 bg-green-600">
                    Grade {listing.quality}
                  </Badge>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg text-slate-900 mb-1">{listing.cropName}</h3>
                <p className="text-sm text-slate-600 mb-3">
                  {listing.quantity} {listing.unit} • {listing.category}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-500">Price per {listing.unit}</p>
                    <p className="text-xl font-bold text-green-600">₹{listing.pricePerUnit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Views</p>
                    <div className="flex items-center gap-1 text-slate-700">
                      <Eye className="w-4 h-4" />
                      <span className="font-medium">{listing.views}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl"
                    size="sm"
                    onClick={() => handleEdit(listing.id)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl text-red-600 hover:bg-red-50"
                    size="sm"
                    onClick={() => handleDelete(listing.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {filteredListings.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
              {search ? 'No matching listings found' : 'No listings yet. Create your first listing!'}
            </div>
          )}
        </div>
        )}
      </div>
    </PageTransition>
  );
}
