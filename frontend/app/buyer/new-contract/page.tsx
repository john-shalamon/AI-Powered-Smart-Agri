'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { toast } from 'sonner';

const mockFarmers = [
  { id: 'f1', name: 'Ravi Kumar', location: 'Delhi', rating: 4.8 },
  { id: 'f2', name: 'Amit Singh', location: 'Punjab', rating: 4.6 },
  { id: 'f3', name: 'Lakshmi Reddy', location: 'Telangana', rating: 4.9 },
  { id: 'f4', name: 'Vijay Patel', location: 'Gujarat', rating: 4.7 },
];

const cropTypes = [
  'Wheat', 'Rice', 'Tomato', 'Onion', 'Potato', 'Maize', 'Cotton', 'Sugarcane'
];

export default function NewContractPage() {
  const [formData, setFormData] = useState({
    farmerId: '',
    cropType: '',
    quantity: '',
    unit: 'kg',
    pricePerUnit: '',
    duration: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    terms: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.farmerId || !formData.cropType || !formData.quantity || !formData.pricePerUnit || !formData.startDate || !formData.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Calculate total value
    const totalValue = parseFloat(formData.quantity) * parseFloat(formData.pricePerUnit);

    // Here you would typically send the data to your backend
    console.log('Contract data:', { ...formData, totalValue });

    toast.success('Contract created successfully!');
    // Redirect back to contracts page
    window.location.href = '/buyer/contracts';
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/buyer/contracts">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Contracts
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New Contract</h1>
          <p className="text-muted-foreground">Set up a long-term supply agreement with a farmer</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Farmer Selection */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Select Farmer</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="farmer">Farmer</Label>
                <Select value={formData.farmerId} onValueChange={(value) => handleInputChange('farmerId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a farmer" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockFarmers.map((farmer) => (
                      <SelectItem key={farmer.id} value={farmer.id}>
                        {farmer.name} - {farmer.location} (★{farmer.rating})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Crop Details */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Crop Details</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cropType">Crop Type</Label>
                <Select value={formData.cropType} onValueChange={(value) => handleInputChange('cropType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent>
                    {cropTypes.map((crop) => (
                      <SelectItem key={crop} value={crop}>
                        {crop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="1000"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="quintal">quintal</SelectItem>
                      <SelectItem value="ton">ton</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="pricePerUnit">Price per Unit (₹)</Label>
                <Input
                  id="pricePerUnit"
                  type="number"
                  placeholder="25"
                  value={formData.pricePerUnit}
                  onChange={(e) => handleInputChange('pricePerUnit', e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Contract Terms */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Contract Terms</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3 months">3 months</SelectItem>
                    <SelectItem value="6 months">6 months</SelectItem>
                    <SelectItem value="12 months">12 months</SelectItem>
                    <SelectItem value="18 months">18 months</SelectItem>
                    <SelectItem value="24 months">24 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => handleInputChange('startDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => handleInputChange('endDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </Card>

          {/* Additional Terms */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Additional Terms</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="terms">Contract Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  placeholder="Enter any special terms, quality requirements, delivery schedules, etc."
                  value={formData.terms}
                  onChange={(e) => handleInputChange('terms', e.target.value)}
                  rows={6}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Contract Summary */}
        {formData.quantity && formData.pricePerUnit && (
          <Card className="p-6 bg-primary/5 border-primary/20">
            <h2 className="text-xl font-semibold mb-4">Contract Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Quantity</p>
                <p className="text-2xl font-bold text-primary">
                  {formData.quantity} {formData.unit}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price per Unit</p>
                <p className="text-2xl font-bold text-primary">
                  ₹{formData.pricePerUnit}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold text-primary">
                  ₹{(parseFloat(formData.quantity || '0') * parseFloat(formData.pricePerUnit || '0')).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-2xl font-bold text-primary">
                  {formData.duration || 'Not set'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <Button variant="outline" asChild>
            <Link href="/buyer/contracts">Cancel</Link>
          </Button>
          <Button type="submit" className="px-8">
            Create Contract
          </Button>
        </div>
      </form>
    </div>
  );
}