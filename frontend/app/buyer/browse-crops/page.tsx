'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Filter, MapPin, Star, ShoppingCart, Leaf, Calendar } from 'lucide-react';
import { mockCropListings } from '@/lib/mock-data/crops';
import { toast } from 'sonner';

export default function BrowseCropsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState<typeof mockCropListings[0] | null>(null);
  const [orderQuantity, setOrderQuantity] = useState('');
  const [showOrderDialog, setShowOrderDialog] = useState(false);

  const availableCrops = mockCropListings.filter(c => c.status === 'active');
  
  const filteredCrops = availableCrops.filter(crop => {
    const matchesSearch = crop.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         crop.variety.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || crop.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handlePlaceOrder = () => {
    if (!orderQuantity || parseFloat(orderQuantity) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    if (selectedCrop && parseFloat(orderQuantity) > selectedCrop.availableQuantity) {
      toast.error('Quantity exceeds available stock');
      return;
    }
    toast.success(`Order placed for ${orderQuantity} ${selectedCrop?.unit} of ${selectedCrop?.cropName}`);
    setShowOrderDialog(false);
    setOrderQuantity('');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Browse Crops</h1>
        <p className="text-muted-foreground">Discover quality produce directly from farmers</p>
      </div>

      {/* Filters */}
      <Card className="p-4 backdrop-blur-xl bg-card/80 border-border shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search crops or varieties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="grains">Grains</SelectItem>
              <SelectItem value="vegetables">Vegetables</SelectItem>
              <SelectItem value="fruits">Fruits</SelectItem>
              <SelectItem value="pulses">Pulses</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredCrops.length}</span> crops
        </p>
      </div>

      {/* Crops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map((crop) => (
          <Card key={crop.id} className="overflow-hidden backdrop-blur-xl bg-card/80 border-border shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
            <div className="h-48 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center text-6xl">
              🌾
            </div>
            <div className="p-4 space-y-3">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{crop.cropName}</h3>
                    <p className="text-sm text-muted-foreground">{crop.variety}</p>
                  </div>
                  <Badge variant="secondary">{crop.category}</Badge>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{crop.quality.rating}</span>
                </div>
                <Badge variant="outline" className="bg-green-50">
                  {crop.quality.grade}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{crop.location.city}, {crop.location.state}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Harvest: {new Date(crop.harvestDate).toLocaleDateString()}</span>
              </div>

              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-2xl font-bold text-primary">₹{crop.pricePerUnit}</p>
                    <p className="text-sm text-muted-foreground">per {crop.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{crop.availableQuantity} {crop.unit}</p>
                    <p className="text-xs text-muted-foreground">available</p>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setSelectedCrop(crop);
                    setShowOrderDialog(true);
                  }}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Place Order
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Order Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Place Order</DialogTitle>
            <DialogDescription>
              Order {selectedCrop?.cropName} from the farmer
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Crop Details</Label>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-semibold">{selectedCrop?.cropName} - {selectedCrop?.variety}</p>
                <p className="text-sm text-muted-foreground">₹{selectedCrop?.pricePerUnit}/{selectedCrop?.unit}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity ({selectedCrop?.unit})</Label>
              <Input
                id="quantity"
                type="number"
                placeholder={`Max: ${selectedCrop?.availableQuantity}`}
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(e.target.value)}
              />
            </div>
            {orderQuantity && (
              <div className="p-3 rounded-lg bg-primary/10">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold text-primary">
                  ₹{(parseFloat(orderQuantity) * (selectedCrop?.pricePerUnit || 0)).toLocaleString()}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOrderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePlaceOrder}>
              Confirm Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
