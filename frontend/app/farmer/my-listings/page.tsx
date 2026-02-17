'use client';

import { PageTransition } from '@/components/animations/page-transition';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockCropListings } from '@/lib/mock-data/crops';
import { StatusBadge } from '@/components/shared/status-badge';
import { Search, Eye, Edit, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function MyListingsPage() {
  const myListings = mockCropListings.filter(c => c.farmerId === 'f1');

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
              <Input placeholder="Search listings..." className="pl-10" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myListings.map((listing) => (
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
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl text-red-600 hover:bg-red-50"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
