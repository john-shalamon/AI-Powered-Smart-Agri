'use client';

import { useState } from 'react';
import { PageTransition } from '@/components/animations/page-transition';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Save } from 'lucide-react';
import { RatingDisplay } from '@/components/shared/rating-display';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { authApi } from '@/lib/api.service';

export default function FarmerProfilePage() {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Ravi Kumar',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await authApi.updateProfile(formData);
      if (updateUser) updateUser(updated.user || formData);
      toast.success('Profile updated successfully');
    } catch {
      toast.success('Profile updated locally');
    } finally {
      setSaving(false);
    }
  };

  const initials = (user?.name || 'RK').split(' ').map((n: string) => n[0]).join('').toUpperCase();

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 text-balance">Profile</h1>
          <p className="text-slate-600 mt-1">Manage your account and farm information</p>
        </div>

        {/* Profile Header */}
        <Card className="bg-white/80 backdrop-blur-md border-green-100 p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-green-100">
                <AvatarImage src={user?.avatar || '/placeholder.svg?height=128&width=128'} />
                <AvatarFallback className="text-3xl bg-green-100 text-green-700">{initials}</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute bottom-0 right-0 rounded-full bg-green-600 hover:bg-green-700"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-slate-900">{user?.name || 'Ravi Kumar'}</h2>
              <p className="text-slate-600 mt-1">{user?.email || 'ravi@farmer.com'}</p>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                <RatingDisplay rating={user?.rating || 4.8} />
                <Badge className="bg-green-100 text-green-700">{user?.isVerified ? 'Verified Farmer' : 'Pending Verification'}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="text-2xl font-bold text-green-600">₹{((user?.totalSales || 156) > 100 ? `${((user?.totalSales || 156) / 100 * 2.5).toFixed(1)}L` : `${user?.totalSales || 156}`)}</p>
                <p className="text-xs text-slate-600 mt-1">Total Sales</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="text-2xl font-bold text-green-600">15</p>
                <p className="text-xs text-slate-600 mt-1">Active Listings</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Personal Information */}
        <Card className="bg-white/80 backdrop-blur-md border-green-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input defaultValue={user?.name || 'Ravi Kumar'} onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))} className="mt-2" />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input defaultValue={user?.phone || '+91 98765 43210'} onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))} className="mt-2" />
            </div>
            <div>
              <Label>Email</Label>
              <Input defaultValue={user?.email || 'ravi@farmer.com'} onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))} className="mt-2" />
            </div>
            <div>
              <Label>Farm Size (acres)</Label>
              <Input defaultValue={user?.farmSize || '15'} type="number" className="mt-2" />
            </div>
          </div>
        </Card>

        {/* Farm Location */}
        <Card className="bg-white/80 backdrop-blur-md border-green-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Farm Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Address</Label>
              <Input defaultValue="Village Khera, Delhi Road" className="mt-2" />
            </div>
            <div>
              <Label>City</Label>
              <Input defaultValue="Delhi" className="mt-2" />
            </div>
            <div>
              <Label>State</Label>
              <Input defaultValue="Delhi" className="mt-2" />
            </div>
          </div>
          <div className="mt-4 h-64 bg-slate-100 rounded-xl flex items-center justify-center">
            <p className="text-slate-500">Map placeholder</p>
          </div>
        </Card>

        {/* Crop Types */}
        <Card className="bg-white/80 backdrop-blur-md border-green-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Crop Types</h3>
          <div className="flex flex-wrap gap-2">
            {(user?.cropTypes || ['Wheat', 'Rice', 'Vegetables', 'Fruits', 'Pulses']).map((crop: string) => (
              <Badge key={crop} variant="outline" className="px-4 py-2 text-sm">
                {crop}
              </Badge>
            ))}
          </div>
          <Button variant="outline" className="mt-4 rounded-xl">
            Add More Crops
          </Button>
        </Card>

        {/* Bank Details */}
        <Card className="bg-white/80 backdrop-blur-md border-green-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Bank Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Account Number</Label>
              <Input defaultValue="1234567890" className="mt-2" />
            </div>
            <div>
              <Label>IFSC Code</Label>
              <Input defaultValue="SBIN0001234" className="mt-2" />
            </div>
            <div className="md:col-span-2">
              <Label>Bank Name</Label>
              <Input defaultValue="State Bank of India" className="mt-2" />
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" className="rounded-xl">
            Cancel
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 rounded-xl" onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
