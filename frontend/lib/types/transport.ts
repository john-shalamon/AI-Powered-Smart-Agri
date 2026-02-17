export type DeliveryStatus = 
  | 'requested' 
  | 'accepted' 
  | 'in-transit' 
  | 'delivered' 
  | 'cancelled';

export interface TransportRequest {
  id: string;
  orderId: string;
  farmerId: string;
  farmerName: string;
  buyerId: string;
  buyerName: string;
  cropName: string;
  quantity: number;
  unit: string;
  pickupLocation: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state: string;
  };
  dropLocation: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state: string;
  };
  distance: number; // in km
  estimatedCost: number;
  status: 'open' | 'assigned' | 'completed';
  createdAt: Date;
  pickupDate: Date;
}

export interface TransportOffer {
  id: string;
  transportRequestId: string;
  transporterId: string;
  transporterName: string;
  transporterRating: number;
  vehicleType: string;
  offerPrice: number;
  estimatedTime: number; // in hours
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface Delivery {
  id: string;
  transportRequestId: string;
  transporterId: string;
  transporterName: string;
  orderId: string;
  status: DeliveryStatus;
  pickupLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  dropLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  currentLocation?: {
    lat: number;
    lng: number;
  };
  route: {
    lat: number;
    lng: number;
  }[];
  distance: number;
  estimatedTime: number;
  actualTime?: number;
  earnings: number;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
}
