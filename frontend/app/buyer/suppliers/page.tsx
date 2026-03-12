'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RatingDisplay } from '@/components/shared/rating-display';
import { Search, MapPin, Phone, Mail, MessageSquare } from 'lucide-react';
import { mockFarmers } from '@/lib/mock-data/farmers';
import { useState } from 'react';

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFarmers = mockFarmers.filter(farmer => 
    farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farmer.farmLocation.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Suppliers</h1>
        <p className="text-muted-foreground">Browse and connect with verified farmers</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search suppliers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFarmers.map((farmer) => (
          <Card key={farmer.id} className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg hover:shadow-xl transition-all">
            <div className="space-y-4">
              {/* Profile */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                  👨‍🌾
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-foreground">{farmer.name}</h3>
                  <RatingDisplay rating={farmer.rating} count={0} />
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{farmer.farmLocation.city}, {farmer.farmLocation.state}</span>
              </div>

              {/* Farm Info */}
              <div className="bg-secondary/30 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Farm Size</span>
                  <span className="font-medium text-foreground">{farmer.farmSize} acres</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Sales</span>
                  <span className="font-medium text-foreground">₹{farmer.totalSales.toLocaleString()}</span>
                </div>
              </div>

              {/* Crops */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">SPECIALIZES IN</p>
                <div className="flex flex-wrap gap-2">
                  {farmer.cropTypes.map((crop, index) => (
                    <Badge key={index} variant="secondary">{crop}</Badge>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{farmer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{farmer.email}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button className="flex-1" onClick={() => toast.info('View profile feature coming soon!')}>View Profile</Button>
                <Button variant="outline" onClick={() => toast.info('Messaging feature coming soon!')}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
