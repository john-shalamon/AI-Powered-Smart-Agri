'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageTransition } from '@/components/animations/page-transition';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function AddListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      toast.success('Listing created successfully!');
      router.push('/farmer/my-listings');
    }, 1500);
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 text-balance">Add New Listing</h1>
          <p className="text-slate-600 mt-1">List your crops to connect with buyers</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="bg-white/80 backdrop-blur-md border-green-100 p-8">
            <div className="space-y-6">
              {/* Crop Images */}
              <div>
                <Label>Crop Images</Label>
                <div className="mt-2 border-2 border-dashed border-green-200 rounded-xl p-8 text-center hover:border-green-400 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <p className="text-slate-700 font-medium">Click to upload or drag and drop</p>
                  <p className="text-sm text-slate-500 mt-1">PNG, JPG up to 10MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Crop Name */}
                <div>
                  <Label htmlFor="cropName">Crop Name *</Label>
                  <Input
                    id="cropName"
                    placeholder="e.g., Wheat, Rice, Tomato"
                    required
                    className="mt-2"
                  />
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select required>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grains">Grains</SelectItem>
                      <SelectItem value="vegetables">Vegetables</SelectItem>
                      <SelectItem value="fruits">Fruits</SelectItem>
                      <SelectItem value="pulses">Pulses</SelectItem>
                      <SelectItem value="cash-crops">Cash Crops</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quantity */}
                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Enter quantity"
                    required
                    className="mt-2"
                  />
                </div>

                {/* Unit */}
                <div>
                  <Label htmlFor="unit">Unit *</Label>
                  <Select required>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilogram (kg)</SelectItem>
                      <SelectItem value="quintal">Quintal</SelectItem>
                      <SelectItem value="ton">Ton</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quality Grade */}
                <div>
                  <Label htmlFor="quality">Quality Grade *</Label>
                  <Select required>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Grade A (Premium)</SelectItem>
                      <SelectItem value="B">Grade B (Standard)</SelectItem>
                      <SelectItem value="C">Grade C (Basic)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price */}
                <div>
                  <Label htmlFor="price">Price per Unit (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Enter price"
                    required
                    className="mt-2"
                  />
                </div>

                {/* Harvest Date */}
                <div>
                  <Label htmlFor="harvestDate">Harvest Date *</Label>
                  <Input id="harvestDate" type="date" required className="mt-2" />
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="City, State"
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your crop quality, farming methods, and any special features..."
                  rows={4}
                  className="mt-2"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                  disabled={loading}
                >
                  {loading ? (
                    'Creating...'
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Listing
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </PageTransition>
  );
}
