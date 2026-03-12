'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Leaf, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserRole } from '@/lib/types/user';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('farmer');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);

      // Get user from localStorage to determine role for redirect
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userRole = storedUser.role || role;

      toast.success('Login successful!');

      // Redirect based on role
      switch (userRole) {
        case 'farmer':
          router.push('/farmer/dashboard');
          break;
        case 'buyer':
          router.push('/buyer/dashboard');
          break;
        case 'transporter':
          router.push('/transporter/dashboard');
          break;
        case 'admin':
          router.push('/admin/dashboard');
          break;
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    }
  };

  const fillDemoCredentials = (demoRole: string) => {
    const creds: Record<string, { email: string; password: string; role: UserRole }> = {
      farmer: { email: 'ravi@farmer.com', password: 'password123', role: 'farmer' },
      buyer: { email: 'amit@buyer.com', password: 'password123', role: 'buyer' },
      transporter: { email: 'rajesh@transport.com', password: 'password123', role: 'transporter' },
      admin: { email: 'admin@agriai.com', password: 'password123', role: 'admin' },
    };
    const c = creds[demoRole];
    if (c) {
      setEmail(c.email);
      setPassword(c.password);
      setRole(c.role);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-green-100 p-8"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4">
          <Leaf className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 text-balance text-center">
          Welcome to AgriConnect
        </h1>
        <p className="text-slate-600 mt-2 text-center">
          AI-Powered Farmer-to-Market Platform
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="role">I am a</Label>
          <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
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
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
          disabled={isLoading}
        >
          {isLoading ? (
            'Signing in...'
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-green-600 hover:text-green-700 font-medium">
            Sign up
          </Link>
        </p>
      </div>

      {/* Demo Credentials */}
      <div className="mt-6 pt-6 border-t border-green-100">
        <p className="text-xs text-slate-500 text-center mb-3">Quick Demo Login</p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs border-green-200 hover:bg-green-50"
            onClick={() => fillDemoCredentials('farmer')}
          >
            🌾 Farmer
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs border-blue-200 hover:bg-blue-50"
            onClick={() => fillDemoCredentials('buyer')}
          >
            🛒 Buyer
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs border-orange-200 hover:bg-orange-50"
            onClick={() => fillDemoCredentials('transporter')}
          >
            🚛 Transporter
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs border-purple-200 hover:bg-purple-50"
            onClick={() => fillDemoCredentials('admin')}
          >
            👨‍💼 Admin
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
