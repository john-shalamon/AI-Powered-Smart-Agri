import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (amount: number, orderId: string, userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, orderId, userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment order');
      }

      const orderData = await response.json();
      return orderData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment order creation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (orderData: any, onSuccess: (response: any) => void, onError: (error: any) => void) => {
    const options = {
      key: orderData.key,
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.orderId,
      name: 'AI-Powered Smart Agri',
      description: 'Crop Purchase Payment',
      handler: async (response: any) => {
        try {
          // Verify payment on backend
          const verifyResponse = await fetch(`${API_BASE}/api/payments/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(response),
          });

          if (verifyResponse.ok) {
            onSuccess(response);
          } else {
            onError(new Error('Payment verification failed'));
          }
        } catch (err) {
          onError(err);
        }
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#10B981', // Green theme
      },
    };

    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } else {
      onError(new Error('Razorpay SDK not loaded'));
    }
  };

  return {
    createOrder,
    processPayment,
    loading,
    error,
  };
};