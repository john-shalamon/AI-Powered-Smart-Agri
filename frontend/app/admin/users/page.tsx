'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, UserPlus, UserCheck, UserX, Loader2 } from 'lucide-react';
import { adminApi } from '@/lib/api.service';
import { toast } from 'sonner';

type UserRole = 'farmer' | 'buyer' | 'transporter' | 'admin';

interface UserRecord {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  rating?: number;
  farmLocation?: { city?: string; state?: string };
  location?: { city?: string; state?: string };
  businessName?: string;
  businessType?: string;
  farmSize?: number;
  cropTypes?: string[];
  totalSales?: number;
  totalPurchases?: number;
  vehicleType?: string;
  totalDeliveries?: number;
}

const ROLE_LABELS: Record<UserRole, string> = {
  farmer: 'Farmer',
  buyer: 'Buyer',
  transporter: 'Transporter',
  admin: 'Admin',
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<UserRole | 'all'>('all');
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'farmer' as UserRole,
  });

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (activeTab !== 'all') params.role = activeTab;
      if (searchQuery) params.search = searchQuery;
      params.limit = '100';

      const data = await adminApi.getUsers(params);
      setUsers(data.users || []);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = async (userId: string) => {
    try {
      await adminApi.toggleUserStatus(userId);
      toast.success('User status updated');
      fetchUsers();
    } catch {
      toast.error('Failed to update user status');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (newUser.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminApi.createUser({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        phone: newUser.phone || undefined,
      });
      toast.success(`${ROLE_LABELS[newUser.role]} account created successfully`);
      setIsDialogOpen(false);
      setNewUser({ name: '', email: '', phone: '', password: '', role: 'farmer' });
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const usersByRole = (role: UserRole) => users.filter(u => u.role === role);

  const renderUserTable = (roleUsers: UserRecord[], role: UserRole) => (
    <Card className="backdrop-blur-xl bg-card/80 border-border shadow-lg">
      <div className="overflow-x-auto">
        {roleUsers.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No {ROLE_LABELS[role].toLowerCase()}s found.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-semibold text-foreground">Name</th>
                <th className="text-left p-4 text-sm font-semibold text-foreground">Email</th>
                <th className="text-left p-4 text-sm font-semibold text-foreground">Phone</th>
                {role === 'farmer' && (
                  <>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Farm Size</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Crops</th>
                  </>
                )}
                {role === 'buyer' && (
                  <>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Business</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Orders</th>
                  </>
                )}
                {role === 'transporter' && (
                  <>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Vehicle</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Deliveries</th>
                  </>
                )}
                <th className="text-left p-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-right p-4 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roleUsers.map((user) => (
                <tr key={user._id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.isVerified ? '✓ Verified' : 'Unverified'}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{user.email}</td>
                  <td className="p-4 text-sm text-muted-foreground">{user.phone || '—'}</td>
                  {role === 'farmer' && (
                    <>
                      <td className="p-4 text-sm text-foreground">
                        {user.farmSize ? `${user.farmSize} acres` : '—'}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {(user.cropTypes || []).slice(0, 2).map((crop, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{crop}</Badge>
                          ))}
                        </div>
                      </td>
                    </>
                  )}
                  {role === 'buyer' && (
                    <>
                      <td className="p-4 text-sm text-foreground">{user.businessName || user.businessType || '—'}</td>
                      <td className="p-4 text-sm text-foreground">{user.totalPurchases ?? '—'}</td>
                    </>
                  )}
                  {role === 'transporter' && (
                    <>
                      <td className="p-4 text-sm text-foreground">{user.vehicleType || '—'}</td>
                      <td className="p-4 text-sm text-foreground">{user.totalDeliveries ?? '—'}</td>
                    </>
                  )}
                  <td className="p-4">
                    <Badge variant={user.isActive ? 'default' : 'destructive'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(user._id)}
                        title={user.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {user.isActive ? (
                          <UserX className="w-4 h-4 text-red-500" />
                        ) : (
                          <UserCheck className="w-4 h-4 text-green-500" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );

  const allRoles: UserRole[] = ['farmer', 'buyer', 'transporter', 'admin'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
          <p className="text-muted-foreground">Manage farmers, buyers, transporters and admins</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="new-role">Role *</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value as UserRole }))}
                >
                  <SelectTrigger id="new-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farmer">Farmer</SelectItem>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="transporter">Transporter</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-name">Full Name *</Label>
                <Input
                  id="new-name"
                  placeholder="John Doe"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-email">Email *</Label>
                <Input
                  id="new-email"
                  type="email"
                  placeholder="user@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-phone">Phone</Label>
                <Input
                  id="new-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={newUser.phone}
                  onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Password *</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Min 6 characters"
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  required
                  minLength={6}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create User'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          <span className="ml-3 text-muted-foreground">Loading users...</span>
        </div>
      ) : (
        /* Tabs */
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as UserRole | 'all')} className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All ({users.length})</TabsTrigger>
            {allRoles.map(role => (
              <TabsTrigger key={role} value={role}>
                {ROLE_LABELS[role]}s ({usersByRole(role).length})
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-6">
              {allRoles.map(role => (
                usersByRole(role).length > 0 && (
                  <div key={role}>
                    <h2 className="text-lg font-semibold text-foreground mb-3">{ROLE_LABELS[role]}s</h2>
                    {renderUserTable(usersByRole(role), role)}
                  </div>
                )
              ))}
              {users.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">No users found.</div>
              )}
            </div>
          </TabsContent>

          {allRoles.map(role => (
            <TabsContent key={role} value={role}>
              {renderUserTable(usersByRole(role), role)}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
