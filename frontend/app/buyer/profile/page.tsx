'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Building, MapPin, Phone, Mail, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export default function BuyerProfilePage() {
  const handleSave = () => {
    toast.success('Profile updated successfully');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your business information</p>
      </div>

      <Tabs defaultValue="business" className="space-y-6">
        <TabsList>
          <TabsTrigger value="business">Business Details</TabsTrigger>
          <TabsTrigger value="contact">Contact Information</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="business">
          <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
                  🏢
                </div>
                <Button variant="outline" onClick={() => toast.info('Photo upload feature coming soon!')}>Change Photo</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Business Name</Label>
                  <Input id="business-name" defaultValue="Fresh Mart Pvt Ltd" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-type">Business Type</Label>
                  <Input id="business-type" defaultValue="Retail Chain" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gst">GST Number</Label>
                  <Input id="gst" defaultValue="29ABCDE1234F1Z5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pan">PAN Number</Label>
                  <Input id="pan" defaultValue="ABCDE1234F" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Textarea id="address" defaultValue="123 Market Street, Commercial Complex" rows={3} />
              </div>

              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Contact Person</Label>
                  <Input id="contact-name" defaultValue="Ramesh Gupta" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input id="designation" defaultValue="Procurement Manager" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="ramesh@freshmart.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alternate-phone">Alternate Phone</Label>
                  <Input id="alternate-phone" defaultValue="+91 98765 43211" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input id="whatsapp" defaultValue="+91 98765 43210" />
                </div>
              </div>

              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-4">Bank Account Details</h3>
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
                    <Input id="account-holder" defaultValue="Fresh Mart Pvt Ltd" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="font-semibold text-lg text-foreground mb-4">Payment Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">UPI Payment</p>
                        <p className="text-sm text-muted-foreground">freshmart@upi</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toast.info('Edit payment method feature coming soon!')}>Edit</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Credit Period</p>
                        <p className="text-sm text-muted-foreground">30 days</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toast.info('Edit credit period feature coming soon!')}>Edit</Button>
                  </div>
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
