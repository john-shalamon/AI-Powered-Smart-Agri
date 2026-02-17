export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'in-transit' 
  | 'delivered' 
  | 'cancelled';

export interface Order {
  id: string;
  cropListingId: string;
  cropName: string;
  cropImage: string;
  farmerId: string;
  farmerName: string;
  buyerId: string;
  buyerName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
  status: OrderStatus;
  deliveryAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    lat: number;
    lng: number;
  };
  pickupAddress: {
    address: string;
    city: string;
    state: string;
    lat: number;
    lng: number;
  };
  transporterId?: string;
  transporterName?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
  timeline: {
    status: OrderStatus;
    timestamp: Date;
    note?: string;
  }[];
}

export interface Rating {
  id: string;
  orderId: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  rating: number; // 1-5
  review: string;
  createdAt: Date;
}
