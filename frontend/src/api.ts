import type { CartItem, Product } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('runpeak_token');
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(data?.message || 'No se pudo completar la solicitud');
  return data as T;
}

export const api = {
  products: () => request<Product[]>('/products'),
  coupons: () => request<Array<{ code: string; desc: string; min: string; valid: string }>>('/coupons'),
  validateCoupon: (code: string, subtotal: number) => request<{ discount: number; freeShipping: boolean }>('/coupons/validate', {
    method: 'POST', body: JSON.stringify({ code, subtotal }),
  }),
  createOrder: (cart: CartItem[], customer: Record<string, string>, couponCode?: string) => request<{
    order_number: string; total: number; items: CartItem[];
  }>('/orders', {
    method: 'POST',
    body: JSON.stringify({
      customer,
      couponCode,
      paymentMethod: 'card',
      items: cart.map((item) => ({ productId: item.id, size: item.size, color: item.color, quantity: item.qty })),
    }),
  }),
};
