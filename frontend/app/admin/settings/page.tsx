'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function SettingsPage() {
  const handleSave = () => {
    toast.success('Settings updated successfully');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Platform Settings</h1>
        <p className="text-muted-foreground">Configure system preferences and policies</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="fees">Fees & Commission</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Platform Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <Input id="platform-name" defaultValue="AgriConnect" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-email">Support Email</Label>
                    <Input id="support-email" type="email" defaultValue="support@agriconnect.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-phone">Support Phone</Label>
                    <Input id="support-phone" defaultValue="+91 1800 123 4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input id="timezone" defaultValue="Asia/Kolkata (IST)" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Feature Toggles</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div>
                      <p className="font-medium text-foreground">AI Disease Detection</p>
                      <p className="text-sm text-muted-foreground">Enable AI-powered crop disease detection</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div>
                      <p className="font-medium text-foreground">Market Price Insights</p>
                      <p className="text-sm text-muted-foreground">Show AI-generated price predictions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div>
                      <p className="font-medium text-foreground">Contract Farming</p>
                      <p className="text-sm text-muted-foreground">Enable long-term supply contracts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="fees">
          <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Commission Structure</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="farmer-commission">Farmer Commission (%)</Label>
                    <Input id="farmer-commission" type="number" defaultValue="2.5" />
                    <p className="text-xs text-muted-foreground">Commission charged on successful sales</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyer-commission">Buyer Commission (%)</Label>
                    <Input id="buyer-commission" type="number" defaultValue="1.5" />
                    <p className="text-xs text-muted-foreground">Commission charged on purchases</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transport-commission">Transport Commission (%)</Label>
                    <Input id="transport-commission" type="number" defaultValue="10" />
                    <p className="text-xs text-muted-foreground">Platform fee on delivery charges</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="min-order">Minimum Order Value (₹)</Label>
                    <Input id="min-order" type="number" defaultValue="500" />
                  </div>
                </div>
              </div>

              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Email Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">New User Registration</p>
                    <p className="text-sm text-muted-foreground">Notify admin on new user signup</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Order Completion</p>
                    <p className="text-sm text-muted-foreground">Send notifications on order delivery</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Payment Alerts</p>
                    <p className="text-sm text-muted-foreground">Notify on payment confirmations</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Quality Issues</p>
                    <p className="text-sm text-muted-foreground">Alert on reported quality concerns</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div>
                      <p className="font-medium text-foreground">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div>
                      <p className="font-medium text-foreground">Session Timeout</p>
                      <p className="text-sm text-muted-foreground">Auto-logout after 30 minutes of inactivity</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div>
                      <p className="font-medium text-foreground">Login Alerts</p>
                      <p className="text-sm text-muted-foreground">Notify on suspicious login attempts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Password Policy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-length">Minimum Length</Label>
                    <Input id="min-length" type="number" defaultValue="8" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry-days">Password Expiry (days)</Label>
                    <Input id="expiry-days" type="number" defaultValue="90" />
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
