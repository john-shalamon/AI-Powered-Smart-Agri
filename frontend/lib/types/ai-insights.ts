import { LucideIcon } from 'lucide-react';

export type InsightType = 
  | 'price-forecast' 
  | 'disease-detection' 
  | 'demand-prediction' 
  | 'route-optimization'
  | 'sell-recommendation'
  | 'market-trend';

export interface AIInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  confidence: number; // 0-100
  recommendation: string;
  actionButton?: {
    label: string;
    action: string;
  };
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface PriceForecast {
  cropName: string;
  currentPrice: number;
  predictedPrices: {
    date: string;
    price: number;
    confidence: number;
  }[];
  bestSellDate: string;
  expectedProfit: number;
  recommendation: string;
}

export interface DiseaseDetection {
  id: string;
  cropName: string;
  imageUrl: string;
  detectedDisease: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  symptoms: string[];
  treatment: {
    chemical: string[];
    organic: string[];
    preventive: string[];
  };
  yieldImpact: {
    current: number; // percentage
    withTreatment: number;
    withoutTreatment: number;
  };
  detectedAt: Date;
}

export interface DemandPrediction {
  cropName: string;
  currentDemand: 'low' | 'medium' | 'high';
  predictedDemand: {
    week: string;
    demand: 'low' | 'medium' | 'high';
    confidence: number;
  }[];
  recommendation: string;
}

export interface RouteOptimization {
  originalRoute: {
    lat: number;
    lng: number;
  }[];
  optimizedRoute: {
    lat: number;
    lng: number;
  }[];
  timeSaved: number; // in minutes
  fuelSaved: number; // in liters
  costSaved: number;
  recommendation: string;
}

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface AIJob<T = any> {
  id: string;
  type: InsightType | 'disease-detection' | string;
  status: JobStatus;
  input?: any;
  result?: T | null;
  error?: string | null;
  createdAt: Date | string;
  updatedAt?: Date | string;
}
