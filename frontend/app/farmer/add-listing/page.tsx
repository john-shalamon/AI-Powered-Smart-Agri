'use client';

import { useState, useRef } from 'react';
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
import { Upload, Plus, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { mockCropListings } from '@/lib/mock-data/crops';
import { CropListing } from '@/lib/types/crop';
import { cropApi } from '@/lib/api.service';
import { useAuth } from '@/lib/auth';

interface UploadedImage {
  file: File;
  preview: string;
  id: string;
}

export default function AddListingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
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
      if (imageToRemove) {
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

      // Try API first, fall back to mock
      try {
        const apiFormData = new FormData();
        apiFormData.append('cropName', formData.cropName);
        apiFormData.append('category', formData.category);
        apiFormData.append('quantity', formData.quantity);
        apiFormData.append('unit', formData.unit);
        apiFormData.append('quality', formData.quality);
        apiFormData.append('pricePerUnit', formData.price);
        apiFormData.append('harvestDate', formData.harvestDate);
        apiFormData.append('location', formData.location);
        apiFormData.append('description', formData.description);
        uploadedImages.forEach(img => apiFormData.append('images', img.file));
        
        await cropApi.create(apiFormData);
      } catch {
        // Fallback: add to mock data
        const newListing: CropListing = {
          id: `c${Date.now()}`,
          farmerId: user?.id || 'f1',
          farmerName: user?.name || 'Ravi Kumar',
          farmerRating: 4.8,
          cropName: formData.cropName,
          category: formData.category,
          quantity: parseFloat(formData.quantity),
          unit: formData.unit as any,
          quality: formData.quality as any,
          pricePerUnit: parseFloat(formData.price),
          harvestDate: new Date(formData.harvestDate),
          location: {
            lat: 28.6139,
            lng: 77.2090,
            address: formData.location,
            city: 'Delhi',
            state: 'Delhi',
          },
          images: uploadedImages.map(img => img.preview),
          description: formData.description,
          status: 'active',
          views: 0,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        };
        mockCropListings.push(newListing);
      }

      toast.success('Listing created successfully!');
      router.push('/farmer/my-listings');
    } catch (error) {
      toast.error('Failed to create listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
                      <p className="text-slate-700 font-medium">
                        {isDragOver ? 'Drop images here' : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        PNG, JPG up to 10MB each ({uploadedImages.length}/5 images)
                      </p>
                    </div>
                  )}

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
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
                    value={formData.cropName}
                    onChange={(e) => handleInputChange('cropName', e.target.value)}
                  />
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select required value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
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
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                  />
                </div>

                {/* Unit */}
                <div>
                  <Label htmlFor="unit">Unit *</Label>
                  <Select required value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
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
                  <Select required value={formData.quality} onValueChange={(value) => handleInputChange('quality', value)}>
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
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                  />
                </div>

                {/* Harvest Date */}
                <div>
                  <Label htmlFor="harvestDate">Harvest Date *</Label>
                  <Input
                    id="harvestDate"
                    type="date"
                    required
                    className="mt-2"
                    value={formData.harvestDate}
                    onChange={(e) => handleInputChange('harvestDate', e.target.value)}
                  />
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="City, State"
                    required
                    className="mt-2"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
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
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
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
