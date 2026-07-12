import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CartItem, AdminProduct, AdminOrder, LastOrder } from '../types';
import { COUPONS, ADMIN_ORDERS, initialAdminProducts } from '../data/products';

interface AppState {
  cart: CartItem[];
  favorites: string[];
  couponApplied: boolean;
  lastOrder: LastOrder | null;
  adminProducts: AdminProduct[];
  adminCoupons: typeof COUPONS;
  adminOrders: AdminOrder[];
  searchOpen: boolean;

  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  cartCount: number;

  addToCart: (id: string, name: string, price: number, img: string, size: string, qty?: number) => void;
  updateQty: (id: string, size: string, delta: number) => void;
  removeItem: (id: string, size: string) => void;
  toggleFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  applyCoupon: () => void;
  placeOrder: () => void;
  setSearchOpen: (open: boolean) => void;

  toggleAdminProductStatus: (id: string) => void;
  removeAdminProduct: (id: string) => void;
  addAdminProduct: () => void;
  removeAdminCoupon: (code: string) => void;
  addAdminPromo: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([
    { id: 'peak-runner-x', name: 'Peak Runner X', price: 349, qty: 1, size: '39', color: 'Negro/Naranja', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80' },
    { id: 'polo-dryfit-pro', name: 'Polo DryFit Pro', price: 89, qty: 2, size: 'M', color: 'Negro', img: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=200&q=80' },
    { id: 'mochila-trail-20l', name: 'Mochila Trail 20L', price: 159, qty: 1, size: 'Único', color: 'Gris', img: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=200&q=80' }
  ]);
  const [favorites, setFavorites] = useState<string[]>(['urban-trail-low', 'mochila-trail-20l']);
  const [couponApplied, setCouponApplied] = useState(false);
  const [lastOrder, setLastOrder] = useState<LastOrder | null>(null);
  const [adminProducts, setAdminProducts] = useState<AdminProduct[]>(initialAdminProducts());
  const [adminCoupons, setAdminCoupons] = useState(COUPONS);
  const [adminOrders] = useState<AdminOrder[]>(ADMIN_ORDERS);
  const [searchOpen, setSearchOpen] = useState(false);

  const subtotal = useMemo(() => cart.reduce((sum, c) => sum + c.price * c.qty, 0), [cart]);
  const shipping = cart.length ? 15 : 0;
  const discount = couponApplied ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal - discount + shipping;
  const cartCount = useMemo(() => cart.reduce((sum, c) => sum + c.qty, 0), [cart]);

  function addToCart(id: string, name: string, price: number, img: string, size: string, qty = 1) {
    setCart(prev => {
      const existing = prev.find(c => c.id === id && c.size === size);
      if (existing) return prev.map(c => c === existing ? { ...c, qty: c.qty + qty } : c);
      return [...prev, { id, name, price, qty, size, color: 'Negro', img }];
    });
  }

  function updateQty(id: string, size: string, delta: number) {
    setCart(prev => prev.map(c => c.id === id && c.size === size ? { ...c, qty: Math.max(1, c.qty + delta) } : c));
  }

  function removeItem(id: string, size: string) {
    setCart(prev => prev.filter(c => !(c.id === id && c.size === size)));
  }

  function toggleFavorite(id: string) {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  }

  function removeFavorite(id: string) {
    setFavorites(prev => prev.filter(f => f !== id));
  }

  function applyCoupon() {
    setCouponApplied(true);
  }

  function placeOrder() {
    setLastOrder({ items: cart, total, number: 'RP-20260712-0417' });
    setCart([]);
    setCouponApplied(false);
  }

  function toggleAdminProductStatus(id: string) {
    setAdminProducts(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  }

  function removeAdminProduct(id: string) {
    setAdminProducts(prev => prev.filter(p => p.id !== id));
  }

  function addAdminProduct() {
    setAdminProducts(prev => [...prev, {
      id: 'nuevo-' + Date.now(), name: 'Producto nuevo', category: 'Sin categoría',
      price: 0, img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&q=80',
      stock: 0, active: false
    }]);
  }

  function removeAdminCoupon(code: string) {
    setAdminCoupons(prev => prev.filter(c => c.code !== code));
  }

  function addAdminPromo() {
    setAdminCoupons(prev => [...prev, { code: 'NUEVA' + (prev.length + 1), desc: 'Nueva promoción', min: 'S/ 0.00', valid: 'Por definir' }]);
  }

  const value: AppState = {
    cart, favorites, couponApplied, lastOrder, adminProducts, adminCoupons, adminOrders, searchOpen,
    subtotal, shipping, discount, total, cartCount,
    addToCart, updateQty, removeItem, toggleFavorite, removeFavorite, applyCoupon, placeOrder, setSearchOpen,
    toggleAdminProductStatus, removeAdminProduct, addAdminProduct, removeAdminCoupon, addAdminPromo
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
