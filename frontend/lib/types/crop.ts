export type CropQuality = 'A' | 'B' | 'C';
export type CropUnit = 'kg' | 'quintal' | 'ton';
export type CropStatus = 'active' | 'sold' | 'reserved' | 'expired';

export interface CropListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerRating: number;
  cropName: string;
  category: string; // vegetables, fruits, grains, etc.
  quantity: number;
  unit: CropUnit;
  quality: CropQuality;
  pricePerUnit: number;
  harvestDate: Date;
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state: string;
  };
  images: string[];
  description: string;
  status: CropStatus;
  views: number;
  createdAt: Date;
  expiresAt: Date;
}

export interface MarketPrice {
  cropName: string;
  category: string;
  currentPrice: number;
  unit: CropUnit;
  change: number; // percentage
  trend: 'up' | 'down' | 'stable';
  history: {
    date: string;
    price: number;
  }[];
  aiPrediction?: {
    nextWeekPrice: number;
    confidence: number; // 0-100
    bestDayToSell: string;
    recommendation: string;
  };
}

export interface BuyerOffer {
  id: string;
  cropListingId: string;
  buyerId: string;
  buyerName: string;
  buyerRating: number;
  quantity: number;
  offerPrice: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  createdAt: Date;
}
