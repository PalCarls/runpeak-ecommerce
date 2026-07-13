export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  img: string;
  badge?: string | null;
  sizes?: string[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  size: string;
  color: string;
  img: string;
}

export interface Coupon {
  code: string;
  desc: string;
  min: string;
  valid: string;
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  photo: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  img: string;
  stock: number;
  active: boolean;
}

export interface AdminOrder {
  id: string;
  client: string;
  date: string;
  total: number;
  status: 'Recibido' | 'En preparación' | 'Despachado' | 'En tránsito' | 'Entregado';
}

export interface LastOrder {
  items: CartItem[];
  total: number;
  number: string;
}
