'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { Upload, Plus, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { mockCropListings } from '@/lib/mock-data/crops';
import { CropListing } from '@/lib/types/crop';

interface UploadedImage {
  file: File;
  preview: string;
  id: string;
}

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const listingId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [formData, setFormData] = useState({
    cropName: '',
    category: '',
    quantity: '',
    unit: '',
    quality: '',
    price: '',
    harvestDate: '',
    location: '',
    description: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const listing = mockCropListings.find(l => l.id === listingId);
    if (!listing) {
      toast.error('Listing not found');
      router.push('/farmer/my-listings');
      return;
    }

    // Pre-fill form data
    setFormData({
      cropName: listing.cropName,
      category: listing.category,
      quantity: listing.quantity.toString(),
      unit: listing.unit,
      quality: listing.quality,
      price: listing.pricePerUnit.toString(),
      harvestDate: listing.harvestDate.toISOString().split('T')[0],
      location: listing.location.address,
      description: listing.description
    });

    // Load existing images
    const existingImages: UploadedImage[] = listing.images.map((img, index) => ({
      file: new File([], `existing-${index}`), // Placeholder file
      preview: img,
      id: `existing-${index}`
    }));
    setUploadedImages(existingImages);

    setInitialLoading(false);
  }, [listingId, router]);

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image file`);
        return;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is 10MB`);
        return;
      }
      validFiles.push(file);
    });

    if (uploadedImages.length + validFiles.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const newImages: UploadedImage[] = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));

    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setUploadedImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove && !id.startsWith('existing-')) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (uploadedImages.length === 0) {
        toast.error('Please upload at least one image');
        setLoading(false);
        return;
      }

      if (!formData.cropName || !formData.category || !formData.quantity || !formData.unit || !formData.quality || !formData.price || !formData.harvestDate || !formData.location) {
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }

      const listingIndex = mockCropListings.findIndex(l => l.id === listingId);
      if (listingIndex === -1) {
        toast.error('Listing not found');
        setLoading(false);
        return;
      }

      // Update the listing
      const updatedListing: CropListing = {
        ...mockCropListings[listingIndex],
        cropName: formData.cropName,
        category: formData.category,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit as any,
        quality: formData.quality as any,
        pricePerUnit: parseFloat(formData.price),
        harvestDate: new Date(formData.harvestDate),
        location: {
          ...mockCropListings[listingIndex].location,
          address: formData.location,
        },
        images: uploadedImages.map(img => img.preview),
        description: formData.description,
      };

      mockCropListings[listingIndex] = updatedListing;

      toast.success('Listing updated successfully!');
      router.push('/farmer/my-listings');
    } catch (error) {
      toast.error('Failed to update listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (initialLoading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading listing...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 text-balance">Edit Listing</h1>
          <p className="text-slate-600 mt-1">Update your crop listing details</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="bg-white/80 backdrop-blur-md border-green-100 p-8">
            <div className="space-y-6">
              {/* Crop Images */}
              <div>
                <Label>Crop Images *</Label>
                <div className="mt-2">
                  {/* Uploaded Images Grid */}
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                      {uploadedImages.map((image) => (
                        <div key={image.id} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border-2 border-green-200">
                            <img
                              src={image.preview}
                              alt="Crop"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(image.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Area */}
                  {uploadedImages.length < 5 && (
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                        isDragOver
                          ? 'border-green-400 bg-green-50'
                          : 'border-green-200 hover:border-green-400'
                      }`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-12 h-12 text-green-600 mx-auto mb-3" />
                      <p className="text-slate-600 mb-2">Drop images here or click to browse</p>
                      <p className="text-sm text-slate-500">PNG, JPG up to 10MB each (max 5 images)</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {/* Crop Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="cropName">Crop Name *</Label>
                  <Input
                    id="cropName"
                    value={formData.cropName}
                    onChange={(e) => handleInputChange('cropName', e.target.value)}
                    placeholder="e.g., Wheat, Rice, Tomato"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Grains">Grains</SelectItem>
                      <SelectItem value="Vegetables">Vegetables</SelectItem>
                      <SelectItem value="Fruits">Fruits</SelectItem>
                      <SelectItem value="Pulses">Pulses</SelectItem>
                      <SelectItem value="Oilseeds">Oilseeds</SelectItem>
                      <SelectItem value="Spices">Spices</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    placeholder="e.g., 500"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="unit">Unit *</Label>
                  <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="quintal">Quintal</SelectItem>
                      <SelectItem value="ton">Ton</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quality">Quality Grade *</Label>
                  <Select value={formData.quality} onValueChange={(value) => handleInputChange('quality', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Grade A (Premium)</SelectItem>
                      <SelectItem value="B">Grade B (Standard)</SelectItem>
                      <SelectItem value="C">Grade C (Basic)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price">Price per Unit (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="e.g., 2500"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="harvestDate">Harvest Date *</Label>
                  <Input
                    id="harvestDate"
                    type="date"
                    value={formData.harvestDate}
                    onChange={(e) => handleInputChange('harvestDate', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Village Name, City"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your crop, farming methods, special features..."
                  className="mt-1 min-h-24"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/farmer/my-listings')}
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 rounded-xl"
                >
                  {loading ? 'Updating...' : 'Update Listing'}
                </Button>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </PageTransition>
  );
}