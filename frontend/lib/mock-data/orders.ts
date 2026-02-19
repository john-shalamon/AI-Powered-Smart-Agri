export { mockTransportRequests } from './transport-requests';

export interface MockOrder {
  id: string;
  cropId: string;
  cropName: string;
  cropImage: string;
  farmerId: string;
  farmerName: string;
  buyerId: string;
  buyerName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'in-transit' | 'delivered' | 'cancelled';
  deliveryLocation: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  pickupLocation: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  estimatedDelivery?: string;
  createdAt: string;
  timeline: {
    status: string;
    timestamp?: string;
    completed: boolean;
  }[];
}

export const mockOrders: MockOrder[] = [
  {
    id: 'o1',
    cropId: 'c1',
    cropName: 'Wheat',
    cropImage: '/placeholder.svg?height=400&width=400',
    farmerId: 'f1',
    farmerName: 'Ravi Kumar',
    buyerId: 'b1',
    buyerName: 'Rajesh Verma',
    quantity: 100,
    unit: 'quintal',
    pricePerUnit: 2500,
    totalAmount: 250000,
    status: 'confirmed',
    deliveryLocation: {
      address: 'Azadpur Mandi, Delhi',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110033',
    },
    pickupLocation: {
      address: 'Village Khera, Delhi Road',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '143001',
    },
    estimatedDelivery: '2024-02-25',
    createdAt: '2024-02-18',
    timeline: [
      { status: 'Order Placed', timestamp: '2024-02-18T10:00:00', completed: true },
      { status: 'Confirmed', timestamp: '2024-02-19T08:30:00', completed: true },
      { status: 'In Transit', completed: false },
    ],
  },
  {
    id: 'o2',
    cropId: 'c2',
    cropName: 'Tomato',
    cropImage: '/placeholder.svg?height=400&width=400',
    farmerId: 'f3',
    farmerName: 'Lakshmi Reddy',
    buyerId: 'b1',
    buyerName: 'Rajesh Verma',
    quantity: 500,
    unit: 'kg',
    pricePerUnit: 35,
    totalAmount: 17500,
    status: 'in-transit',
    deliveryLocation: {
      address: 'Linking Road, Bandra',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
    },
    pickupLocation: {
      address: 'Village Shamshabad',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500001',
    },
    estimatedDelivery: '2024-02-22',
    createdAt: '2024-02-17',
    timeline: [
      { status: 'Order Placed', timestamp: '2024-02-17T09:15:00', completed: true },
      { status: 'Confirmed', timestamp: '2024-02-17T14:20:00', completed: true },
      { status: 'In Transit', timestamp: '2024-02-20T06:00:00', completed: true },
      { status: 'Delivered', completed: false },
    ],
  },
  {
    id: 'o3',
    cropId: 'c5',
    cropName: 'Onion',
    cropImage: '/placeholder.svg?height=400&width=400',
    farmerId: 'f5',
    farmerName: 'Ganesh Naik',
    buyerId: 'b2',
    buyerName: 'Anita Sharma',
    quantity: 1000,
    unit: 'kg',
    pricePerUnit: 25,
    totalAmount: 25000,
    status: 'delivered',
    deliveryLocation: {
      address: 'Azadpur Mandi, Delhi',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110033',
    },
    pickupLocation: {
      address: 'Village Malad',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400064',
    },
    estimatedDelivery: '2024-02-18',
    createdAt: '2024-02-14',
    timeline: [
      { status: 'Order Placed', timestamp: '2024-02-14T11:00:00', completed: true },
      { status: 'Confirmed', timestamp: '2024-02-14T15:30:00', completed: true },
      { status: 'In Transit', timestamp: '2024-02-16T07:00:00', completed: true },
      { status: 'Delivered', timestamp: '2024-02-18T16:45:00', completed: true },
    ],
  },
  {
    id: 'o4',
    cropId: 'c3',
    cropName: 'Potato',
    cropImage: '/placeholder.svg?height=400&width=400',
    farmerId: 'f4',
    farmerName: 'Manjeet Singh',
    buyerId: 'b5',
    buyerName: 'Priya Singh',
    quantity: 800,
    unit: 'kg',
    pricePerUnit: 18,
    totalAmount: 14400,
    status: 'pending',
    deliveryLocation: {
      address: 'MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
    },
    pickupLocation: {
      address: 'Village Rampura',
      city: 'Amritsar',
      state: 'Punjab',
      pincode: '143001',
    },
    estimatedDelivery: '2024-02-28',
    createdAt: '2024-02-20',
    timeline: [
      { status: 'Order Placed', timestamp: '2024-02-20T13:20:00', completed: true },
      { status: 'Awaiting Confirmation', completed: false },
    ],
  },
  {
    id: 'o5',
    cropId: 'c6',
    cropName: 'Rice',
    cropImage: '/placeholder.svg?height=400&width=400',
    farmerId: 'f3',
    farmerName: 'Lakshmi Reddy',
    buyerId: 'b3',
    buyerName: 'Kumar Swamy',
    quantity: 200,
    unit: 'quintal',
    pricePerUnit: 3200,
    totalAmount: 640000,
    status: 'confirmed',
    deliveryLocation: {
      address: 'Industrial Area, Guindy',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600032',
    },
    pickupLocation: {
      address: 'Village Shamshabad',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500001',
    },
    estimatedDelivery: '2024-02-28',
    createdAt: '2024-02-21',
    timeline: [
      { status: 'Order Placed', timestamp: '2024-02-21T09:00:00', completed: true },
      { status: 'Confirmed', timestamp: '2024-02-21T14:00:00', completed: true },
      { status: 'In Transit', completed: false },
    ],
  },
];
