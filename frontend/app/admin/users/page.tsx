'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, UserPlus, Copy, Check, UserCheck, UserX, RefreshCw } from 'lucide-react';
import { adminApi } from '@/lib/api.service';
import { toast } from 'sonner';

type UserRole = 'farmer' | 'buyer' | 'transporter' | 'admin';

interface UserRecord {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  farmLocation?: { city?: string; state?: string };
  location?: { city?: string; state?: string };
  address?: { city?: string; state?: string };
  farmSize?: number;
  cropTypes?: string[];
  rating?: number;
  totalSales?: number;
  totalPurchases?: number;
  totalDeliveries?: number;
  businessType?: string;
  vehicleType?: string;
}

interface CreatedCredentials {
  email: string;
  password: string;
  name: string;
  role: string;
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Create user dialog state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'farmer' as UserRole,
    phone: '',
  });
  const [isCreating, setIsCreating] = useState(false);

  // Credentials display dialog state
  const [showCredentials, setShowCredentials] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<CreatedCredentials | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = { limit: '100' };
      if (activeTab !== 'all') params.role = activeTab;
      if (searchQuery) params.search = searchQuery;

      const data = await adminApi.getUsers(params);
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await adminApi.toggleUserStatus(userId);
      setUsers(prev =>
        prev.map(u => (u._id === userId ? { ...u, isActive: !currentStatus } : u))
      );
      toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
    } catch {
      toast.error('Failed to update user status');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const result = await adminApi.createUser(createForm);
      setCreatedCredentials({
        ...result.credentials,
        name: result.user.name,
        role: result.user.role,
      });
      setShowCreateDialog(false);
      setShowCredentials(true);
      setCreateForm({ name: '', email: '', password: '', role: 'farmer', phone: '' });
      await fetchUsers();
      toast.success('User created successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create user');
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getUserLocation = (user: UserRecord): string => {
    if (user.farmLocation?.city) return `${user.farmLocation.city}, ${user.farmLocation.state || ''}`;
    if (user.location?.city) return `${user.location.city}, ${user.location.state || ''}`;
    if (user.address?.city) return `${user.address.city}, ${user.address.state || ''}`;
    return 'N/A';
  };

  const farmers = users.filter(u => u.role === 'farmer');
  const buyers = users.filter(u => u.role === 'buyer');
  const transporters = users.filter(u => u.role === 'transporter');
  const admins = users.filter(u => u.role === 'admin');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
          <p className="text-muted-foreground">
            Manage farmers, buyers, and transporters · {total} total users
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchUsers} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({total})</TabsTrigger>
          <TabsTrigger value="farmer">Farmers ({farmers.length})</TabsTrigger>
          <TabsTrigger value="buyer">Buyers ({buyers.length})</TabsTrigger>
          <TabsTrigger value="transporter">Transporters ({transporters.length})</TabsTrigger>
          <TabsTrigger value="admin">Admins ({admins.length})</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin text-green-600 mr-2" />
            <span className="text-muted-foreground">Loading users...</span>
          </div>
        ) : (
          <>
            <TabsContent value="all">
              <UserTable users={users} onToggleStatus={handleToggleStatus} getUserLocation={getUserLocation} />
            </TabsContent>
            <TabsContent value="farmer">
              <FarmerTable users={farmers} onToggleStatus={handleToggleStatus} />
            </TabsContent>
            <TabsContent value="buyer">
              <BuyerTable users={buyers} onToggleStatus={handleToggleStatus} getUserLocation={getUserLocation} />
            </TabsContent>
            <TabsContent value="transporter">
              <TransporterTable users={transporters} onToggleStatus={handleToggleStatus} getUserLocation={getUserLocation} />
            </TabsContent>
            <TabsContent value="admin">
              <UserTable users={admins} onToggleStatus={handleToggleStatus} getUserLocation={getUserLocation} />
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Create User Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Create a new user account. The credentials will be displayed once created.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-role">Role</Label>
              <Select
                value={createForm.role}
                onValueChange={(v) => setCreateForm(f => ({ ...f, role: v as UserRole }))}
              >
                <SelectTrigger id="create-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="farmer">🌾 Farmer</SelectItem>
                  <SelectItem value="buyer">🛒 Buyer</SelectItem>
                  <SelectItem value="transporter">🚛 Transporter</SelectItem>
                  <SelectItem value="admin">👨‍💼 Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-name">Full Name</Label>
              <Input
                id="create-name"
                placeholder="John Doe"
                value={createForm.name}
                onChange={(e) => setCreateForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-email">Email</Label>
              <Input
                id="create-email"
                type="email"
                placeholder="user@example.com"
                value={createForm.email}
                onChange={(e) => setCreateForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-phone">Phone (optional)</Label>
              <Input
                id="create-phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={createForm.phone}
                onChange={(e) => setCreateForm(f => ({ ...f, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-password">Password</Label>
              <Input
                id="create-password"
                type="text"
                placeholder="Min. 6 characters"
                value={createForm.password}
                onChange={(e) => setCreateForm(f => ({ ...f, password: e.target.value }))}
                required
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">
                The password will be shown after creation so you can share it.
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating} className="bg-green-600 hover:bg-green-700">
                {isCreating ? 'Creating...' : 'Create User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Credentials Display Dialog */}
      <Dialog open={showCredentials} onOpenChange={setShowCredentials}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700">
              <UserCheck className="w-5 h-5" />
              User Created Successfully
            </DialogTitle>
            <DialogDescription>
              Share these credentials with <strong>{createdCredentials?.name}</strong>. The password cannot be retrieved later.
            </DialogDescription>
          </DialogHeader>
          {createdCredentials && (
            <div className="space-y-4">
              <div className="rounded-xl bg-green-50 border border-green-200 p-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Name</p>
                  <p className="font-medium text-slate-900">{createdCredentials.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Role</p>
                  <Badge variant="secondary" className="capitalize">{createdCredentials.role}</Badge>
                </div>
                <div>
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Email</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-white border border-green-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-900">
                      {createdCredentials.email}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(createdCredentials.email, 'email')}
                    >
                      {copiedField === 'email' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Password</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-white border border-green-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-900">
                      {createdCredentials.password}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(createdCredentials.password, 'password')}
                    >
                      {copiedField === 'password' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                ⚠️ Store these credentials securely. The password cannot be retrieved after closing this dialog.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowCredentials(false)} className="w-full bg-green-600 hover:bg-green-700">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Sub-tables ──────────────────────────────────────────────────────────────

interface TableProps {
  users: UserRecord[];
  onToggleStatus: (id: string, current: boolean) => void;
  getUserLocation?: (u: UserRecord) => string;
}

function UserTable({ users, onToggleStatus, getUserLocation }: TableProps) {
  if (!users.length) return <EmptyState />;
  return (
    <Card className="backdrop-blur-xl bg-card/80 border-border shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-sm font-semibold">Name</th>
              <th className="text-left p-4 text-sm font-semibold">Email</th>
              <th className="text-left p-4 text-sm font-semibold">Role</th>
              <th className="text-left p-4 text-sm font-semibold">Location</th>
              <th className="text-left p-4 text-sm font-semibold">Status</th>
              <th className="text-right p-4 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                <td className="p-4">
                  <p className="font-medium">{u.name}</p>
                  <p className="text-sm text-muted-foreground">{u.phone || '—'}</p>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{u.email}</td>
                <td className="p-4">
                  <Badge variant="outline" className="capitalize">{u.role}</Badge>
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {getUserLocation ? getUserLocation(u) : '—'}
                </td>
                <td className="p-4">
                  <Badge variant={u.isActive ? 'default' : 'destructive'}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleStatus(u._id, u.isActive)}
                    title={u.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {u.isActive ? <UserX className="w-4 h-4 text-red-500" /> : <UserCheck className="w-4 h-4 text-green-600" />}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function FarmerTable({ users, onToggleStatus }: TableProps) {
  if (!users.length) return <EmptyState />;
  return (
    <Card className="backdrop-blur-xl bg-card/80 border-border shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-sm font-semibold">Name</th>
              <th className="text-left p-4 text-sm font-semibold">Location</th>
              <th className="text-left p-4 text-sm font-semibold">Farm Size</th>
              <th className="text-left p-4 text-sm font-semibold">Crops</th>
              <th className="text-left p-4 text-sm font-semibold">Rating</th>
              <th className="text-left p-4 text-sm font-semibold">Status</th>
              <th className="text-right p-4 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                <td className="p-4">
                  <p className="font-medium">{u.name}</p>
                  <p className="text-sm text-muted-foreground">{u.phone || '—'}</p>
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {u.farmLocation?.city ? `${u.farmLocation.city}, ${u.farmLocation.state || ''}` : '—'}
                </td>
                <td className="p-4 text-sm">{u.farmSize ? `${u.farmSize} acres` : '—'}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {(u.cropTypes || []).slice(0, 2).map((c, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{c}</Badge>
                    ))}
                    {(u.cropTypes || []).length === 0 && <span className="text-sm text-muted-foreground">—</span>}
                  </div>
                </td>
                <td className="p-4 text-sm font-medium">{u.rating ? u.rating.toFixed(1) : '—'}</td>
                <td className="p-4">
                  <Badge variant={u.isActive ? 'default' : 'destructive'}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="sm" onClick={() => onToggleStatus(u._id, u.isActive)}>
                    {u.isActive ? <UserX className="w-4 h-4 text-red-500" /> : <UserCheck className="w-4 h-4 text-green-600" />}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function BuyerTable({ users, onToggleStatus, getUserLocation }: TableProps) {
  if (!users.length) return <EmptyState />;
  return (
    <Card className="backdrop-blur-xl bg-card/80 border-border shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-sm font-semibold">Name</th>
              <th className="text-left p-4 text-sm font-semibold">Business Type</th>
              <th className="text-left p-4 text-sm font-semibold">Location</th>
              <th className="text-left p-4 text-sm font-semibold">Total Purchases</th>
              <th className="text-left p-4 text-sm font-semibold">Status</th>
              <th className="text-right p-4 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                <td className="p-4">
                  <p className="font-medium">{u.name}</p>
                  <p className="text-sm text-muted-foreground">{u.phone || '—'}</p>
                </td>
                <td className="p-4 text-sm capitalize">{u.businessType || '—'}</td>
                <td className="p-4 text-sm text-muted-foreground">
                  {getUserLocation ? getUserLocation(u) : '—'}
                </td>
                <td className="p-4 text-sm">{u.totalPurchases ?? '0'}</td>
                <td className="p-4">
                  <Badge variant={u.isActive ? 'default' : 'destructive'}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="sm" onClick={() => onToggleStatus(u._id, u.isActive)}>
                    {u.isActive ? <UserX className="w-4 h-4 text-red-500" /> : <UserCheck className="w-4 h-4 text-green-600" />}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function TransporterTable({ users, onToggleStatus, getUserLocation }: TableProps) {
  if (!users.length) return <EmptyState />;
  return (
    <Card className="backdrop-blur-xl bg-card/80 border-border shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-sm font-semibold">Name</th>
              <th className="text-left p-4 text-sm font-semibold">Vehicle</th>
              <th className="text-left p-4 text-sm font-semibold">Location</th>
              <th className="text-left p-4 text-sm font-semibold">Rating</th>
              <th className="text-left p-4 text-sm font-semibold">Total Trips</th>
              <th className="text-left p-4 text-sm font-semibold">Status</th>
              <th className="text-right p-4 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                <td className="p-4">
                  <p className="font-medium">{u.name}</p>
                  <p className="text-sm text-muted-foreground">{u.phone || '—'}</p>
                </td>
                <td className="p-4 text-sm capitalize">{u.vehicleType || '—'}</td>
                <td className="p-4 text-sm text-muted-foreground">
                  {getUserLocation ? getUserLocation(u) : '—'}
                </td>
                <td className="p-4 text-sm font-medium">{u.rating ? u.rating.toFixed(1) : '—'}</td>
                <td className="p-4 text-sm">{u.totalDeliveries ?? '0'}</td>
                <td className="p-4">
                  <Badge variant={u.isActive ? 'default' : 'destructive'}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="sm" onClick={() => onToggleStatus(u._id, u.isActive)}>
                    {u.isActive ? <UserX className="w-4 h-4 text-red-500" /> : <UserCheck className="w-4 h-4 text-green-600" />}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="backdrop-blur-xl bg-card/80 border-border shadow-lg">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No users found</p>
      </div>
    </Card>
  );
}
