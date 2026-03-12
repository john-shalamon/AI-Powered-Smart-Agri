'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function TransporterProfilePage() {
  const handleSave = () => {
    toast.success('Profile updated successfully');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your transporter profile and vehicle details</p>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personal">Personal Details</TabsTrigger>
          <TabsTrigger value="vehicle">Vehicle Information</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="bank">Bank Details</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
                  🚛
                </div>
                <Button variant="outline" onClick={() => toast.info('Photo upload feature coming soon!')}>Change Photo</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input id="full-name" defaultValue="Suresh Kumar" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="suresh@transport.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input id="whatsapp" defaultValue="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" defaultValue="Mumbai" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" defaultValue="Maharashtra" />
                </div>
              </div>

              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="vehicle">
          <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle-type">Vehicle Type</Label>
                  <Select defaultValue="mini-truck">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mini-truck">Mini Truck</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="large-truck">Large Truck</SelectItem>
                      <SelectItem value="tempo">Tempo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicle-number">Vehicle Number</Label>
                  <Input id="vehicle-number" defaultValue="MH01AB1234" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Load Capacity (kg)</Label>
                  <Input id="capacity" type="number" defaultValue="2000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Vehicle Model</Label>
                  <Input id="model" defaultValue="Tata Ace" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Manufacturing Year</Label>
                  <Input id="year" type="number" defaultValue="2020" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance">Insurance Valid Till</Label>
                  <Input id="insurance" type="date" />
                </div>
              </div>

              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="license">Driving License Number</Label>
                  <Input id="license" defaultValue="MH0120230012345" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license-expiry">License Expiry Date</Label>
                  <Input id="license-expiry" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rc">RC Number</Label>
                  <Input id="rc" defaultValue="MH01234567890" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aadhar">Aadhar Number</Label>
                  <Input id="aadhar" defaultValue="1234 5678 9012" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pan">PAN Number</Label>
                  <Input id="pan" defaultValue="ABCDE1234F" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Upload Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Driving License</p>
                    <Button variant="outline" size="sm" onClick={() => toast.info('Document upload feature coming soon!')}>Upload</Button>
                  </div>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Vehicle RC</p>
                    <Button variant="outline" size="sm" onClick={() => toast.info('Document upload feature coming soon!')}>Upload</Button>
                  </div>
                </div>
              </div>

              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="bank">
          <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bank-name">Bank Name</Label>
                  <Input id="bank-name" defaultValue="State Bank of India" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input id="account-number" defaultValue="1234567890" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ifsc">IFSC Code</Label>
                  <Input id="ifsc" defaultValue="SBIN0001234" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-holder">Account Holder Name</Label>
                  <Input id="account-holder" defaultValue="Suresh Kumar" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upi">UPI ID</Label>
                  <Input id="upi" defaultValue="suresh@paytm" />
                </div>
              </div>

              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
