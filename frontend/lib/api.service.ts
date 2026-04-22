import { LocalStorage } from './localStorage';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

// Generic API client with authentication
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(isFormData = false): HeadersInit {
    const headers: HeadersInit = {};
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    const user = LocalStorage.getUser() as any;
    const token = LocalStorage.get<string>('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, value);
        }
      });
    }

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${res.status}`);
    }

    return res.json();
  }

  async post<T>(path: string, data?: any, isFormData = false): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.getHeaders(isFormData),
      body: isFormData ? data : JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || error.errors?.join(', ') || `HTTP ${res.status}`);
    }

    return res.json();
  }

  async put<T>(path: string, data?: any): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${res.status}`);
    }

    return res.json();
  }

  async delete<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${res.status}`);
    }

    return res.json();
  }
}

const api = new ApiClient(API_BASE);

// ==================== AUTH API ====================
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ user: any; token: string }>('/api/auth/login', { email, password }),

  register: (data: { name: string; email: string; password: string; role: string; phone?: string }) =>
    api.post<{ user: any; token: string }>('/api/auth/register', data),

  getProfile: () => api.get<any>('/api/auth/profile'),

  updateProfile: (data: any) => api.put<any>('/api/auth/profile', data),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post<{ message: string }>('/api/auth/change-password', { currentPassword, newPassword }),
};

// ==================== CROP API ====================
export const cropApi = {
  getAll: (params?: { page?: string; limit?: string; category?: string; search?: string; status?: string; quality?: string; sortBy?: string; minPrice?: string; maxPrice?: string }) =>
    api.get<{ crops: any[]; totalPages: number; currentPage: number; total: number }>('/api/crops', params as any),

  getById: (id: string) => api.get<any>(`/api/crops/${encodeURIComponent(id)}`),

  getMyListings: () => api.get<{ crops: any[]; total: number; stats: any }>('/api/crops/farmer/my-listings'),

  getCategories: () => api.get<Record<string, number>>('/api/crops/categories'),

  create: (formData: FormData) => api.post<any>('/api/crops', formData, true),

  update: (id: string, data: any) => api.put<any>(`/api/crops/${encodeURIComponent(id)}`, data),

  delete: (id: string) => api.delete<{ message: string }>(`/api/crops/${encodeURIComponent(id)}`),
};

// ==================== ORDER API ====================
export const orderApi = {
  getAll: (params?: { page?: string; limit?: string; status?: string }) =>
    api.get<{ orders: any[]; totalPages: number; currentPage: number; stats: any }>('/api/orders', params as any),

  getById: (id: string) => api.get<any>(`/api/orders/${encodeURIComponent(id)}`),

  getStats: () => api.get<any>('/api/orders/stats'),

  create: (data: { cropListingId: string; quantity: number; deliveryAddress?: any }) =>
    api.post<any>('/api/orders', data),

  updateStatus: (id: string, status: string, note?: string) =>
    api.put<any>(`/api/orders/${encodeURIComponent(id)}/status`, { status, note }),

  assignTransporter: (id: string, transporterId: string) =>
    api.put<any>(`/api/orders/${encodeURIComponent(id)}/assign-transporter`, { transporterId }),
};

// ==================== TRANSPORT API ====================
export const transportApi = {
  getAvailableJobs: (params?: { search?: string; distance?: string }) =>
    api.get<{ jobs: any[]; total: number }>('/api/transport/jobs', params as any),

  acceptJob: (id: string, data?: { offerPrice?: number; estimatedTime?: number; message?: string }) =>
    api.post<any>(`/api/transport/jobs/${encodeURIComponent(id)}/accept`, data),

  getMyDeliveries: (params?: { status?: string }) =>
    api.get<{ deliveries: any[]; total: number }>('/api/transport/deliveries', params as any),

  updateDeliveryStatus: (id: string, status: string, currentLocation?: { lat: number; lng: number }) =>
    api.put<any>(`/api/transport/deliveries/${encodeURIComponent(id)}/status`, { status, currentLocation }),

  getEarnings: () => api.get<any>('/api/transport/earnings'),

  createTransportRequest: (data: { orderId: string; pickupDate?: string; vehicleRequired?: string }) =>
    api.post<any>('/api/transport/requests', data),

  getFarmerTransportRequests: () =>
    api.get<{ requests: any[]; total: number; stats: any }>('/api/transport/requests/farmer'),
};

// ==================== WEATHER API ====================
export const weatherApi = {
  getWeather: (city?: string) =>
    api.get<any>('/api/weather', city ? { city } : undefined),

  getMultiLocationWeather: (cities?: string) =>
    api.get<any>('/api/weather/multi', cities ? { cities } : undefined),
};

// ==================== NOTIFICATION API ====================
export const notificationApi = {
  getAll: (params?: { page?: string; limit?: string; unreadOnly?: string }) =>
    api.get<{ notifications: any[]; total: number; unreadCount: number }>('/api/notifications', params as any),

  markAsRead: (id: string) => api.put<any>(`/api/notifications/${encodeURIComponent(id)}/read`),

  markAllAsRead: () => api.put<{ message: string }>('/api/notifications/read-all'),

  delete: (id: string) => api.delete<{ message: string }>(`/api/notifications/${encodeURIComponent(id)}`),
};

// ==================== ADMIN API ====================
export const adminApi = {
  getDashboard: () => api.get<any>('/api/admin/dashboard'),

  getUsers: (params?: { page?: string; limit?: string; role?: string; search?: string }) =>
    api.get<{ users: any[]; totalPages: number; currentPage: number; total: number }>('/api/admin/users', params as any),

  createUser: (data: { name: string; email: string; password: string; role: string; phone?: string }) =>
    api.post<{ user: any }>('/api/admin/users', data),

  toggleUserStatus: (id: string) => api.put<any>(`/api/admin/users/${encodeURIComponent(id)}/toggle-status`),

  getAnalytics: (params?: { period?: string }) =>
    api.get<any>('/api/admin/analytics', params as any),

  getCropsAndOrders: (params?: { tab?: string; search?: string }) =>
    api.get<any>('/api/admin/crops-orders', params as any),

  getReports: (params?: { type?: string; period?: string }) =>
    api.get<any>('/api/admin/reports', params as any),
};

// ==================== AI API ====================
export const aiApi = {
  submitDiseaseImage: async (file?: File | null) => {
    const fd = new FormData();
    if (file) fd.append('image', file);
    return api.post<{ jobId: string }>('/api/ai/disease-detection', fd, true);
  },

  getJobStatus: (jobId: string) =>
    api.get<any>(`/api/ai/jobs/${encodeURIComponent(jobId)}`),

  getMarketPrices: () => api.get<any>('/api/ai/market-prices'),
};

// ==================== PAYMENT API ====================
export const paymentApi = {
  createOrder: (amount: number, orderId: string, userId: string) =>
    api.post<any>('/api/payments/create-order', { amount, orderId, userId }),

  verifyPayment: (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) =>
    api.post<any>('/api/payments/verify', data),

  getDetails: (paymentId: string) =>
    api.get<any>(`/api/payments/${encodeURIComponent(paymentId)}`),

  refund: (paymentId: string, amount: number, reason: string) =>
    api.post<any>('/api/payments/refund', { paymentId, amount, reason }),
};

// ==================== HEALTH CHECK ====================
export const healthApi = {
  check: () => api.get<{ status: string; timestamp: string; uptime: number }>('/api/health'),
};
