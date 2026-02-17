export type UserRole = 'farmer' | 'buyer' | 'transporter' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  createdAt: Date;
  avatar?: string;
}

export interface Farmer extends User {
  role: 'farmer';
  farmLocation: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state: string;
  };
  cropTypes: string[];
  farmSize: number; // in acres
  rating: number;
  totalSales: number;
  bankInfo?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
}

export interface Buyer extends User {
  role: 'buyer';
  businessName: string;
  businessType: 'retailer' | 'wholesaler' | 'processor' | 'exporter';
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state: string;
  };
  rating: number;
  totalPurchases: number;
}

export interface Transporter extends User {
  role: 'transporter';
  vehicleType: 'truck' | 'mini-truck' | 'tempo' | 'van';
  vehicleNumber: string;
  capacity: number; // in tons
  licenseNumber: string;
  rating: number;
  totalDeliveries: number;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  availability: boolean;
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}
