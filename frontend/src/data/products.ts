import type { Product, Coupon, Testimonial, AdminProduct, AdminOrder } from '../types';

export const RAW_PRODUCTS: Product[] = [
  { id: 'peak-runner-x', name: 'Peak Runner X', category: 'Running', price: 349, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', badge: 'Nuevo', sizes: ['39', '40', '41'] },
  { id: 'urban-trail-low', name: 'Urban Trail Low', category: 'Casual', price: 279, oldPrice: 320, img: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&q=80', badge: '-15%', sizes: ['39', '41'] },
  { id: 'polo-dryfit-pro', name: 'Polo DryFit Pro', category: 'Ropa deportiva', price: 89, img: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&q=80', badge: null, sizes: ['S', 'M', 'L'] },
  { id: 'mochila-trail-20l', name: 'Mochila Trail 20L', category: 'Accesorios', price: 159, img: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&q=80', badge: null, sizes: ['Único'] },
  { id: 'trail-grip-3', name: 'Trail Grip 3.0', category: 'Running', price: 389, img: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&q=80', badge: null, sizes: ['40', '41', '42'] },
  { id: 'street-comfort', name: 'Street Comfort', category: 'Casual', price: 219, img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80', badge: null, sizes: ['38', '39'] },
  { id: 'peak-runner-x2', name: 'Peak Runner X2', category: 'Running', price: 379, img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80', badge: null, sizes: ['39', '40'] },
  { id: 'peak-runner-lite', name: 'Peak Runner Lite', category: 'Running', price: 299, img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80', badge: null, sizes: ['38', '40', '42'] }
];

export const PROMO_PRODUCTS: Product[] = [
  { id: 'urban-trail-low', name: 'Urban Trail Low', category: 'Casual', price: 279, oldPrice: 320, img: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&q=80' },
  { id: 'trail-grip-3', name: 'Trail Grip 3.0', category: 'Running', price: 330, oldPrice: 389, img: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&q=80' },
  { id: 'street-comfort', name: 'Street Comfort', category: 'Casual', price: 197, oldPrice: 219, img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80' },
  { id: 'mochila-trail-20l', name: 'Mochila Trail 20L', category: 'Accesorios', price: 127, oldPrice: 159, img: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&q=80' }
];

export const TESTIMONIALS: Testimonial[] = [
  { name: 'Mariana Chávez', role: 'Corredora amateur, Cayma', quote: 'Compré mis primeras zapatillas de trail acá y el envío llegó en un día. La calidad se nota apenas te las pruebas.', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80' },
  { name: 'Renzo Apaza', role: 'Ciclista, Yanahuara', quote: 'Buena atención y precios justos. El seguimiento del pedido me tuvo tranquilo todo el proceso.', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
  { name: 'Fiorella Begazo', role: 'Instructora fitness, Yura', quote: 'La ropa deportiva aguanta bien los entrenamientos intensos y no pierde forma después de varios lavados.', photo: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=200&q=80' }
];

export const COUPONS: Coupon[] = [
  { code: 'BIENVENIDA10', desc: '10% de descuento en tu primera compra', min: 'S/ 150.00', valid: '31 de julio, 2026' },
  { code: 'RUNPEAK20', desc: '20% de descuento en zapatillas running', min: 'S/ 300.00', valid: '15 de agosto, 2026' },
  { code: 'ENVIOGRATIS', desc: 'Envío gratis dentro de Arequipa', min: 'S/ 200.00', valid: '31 de julio, 2026' }
];

const STOCK_BY_ID: Record<string, number> = {
  'peak-runner-x': 24, 'urban-trail-low': 6, 'polo-dryfit-pro': 40, 'mochila-trail-20l': 18,
  'trail-grip-3': 3, 'street-comfort': 27, 'peak-runner-x2': 15, 'peak-runner-lite': 31
};

export function initialAdminProducts(): AdminProduct[] {
  return RAW_PRODUCTS.map(p => ({
    id: p.id, name: p.name, category: p.category, price: p.price, img: p.img,
    stock: STOCK_BY_ID[p.id] ?? 10, active: true
  }));
}

export const ADMIN_ORDERS: AdminOrder[] = [
  { id: '#RP-0417', client: 'Carlos Palomino', date: '12 jul, 2026', total: 667, status: 'En tránsito' },
  { id: '#RP-0416', client: 'Mariana Chávez', date: '11 jul, 2026', total: 349, status: 'Entregado' },
  { id: '#RP-0415', client: 'Renzo Apaza', date: '11 jul, 2026', total: 218, status: 'Despachado' },
  { id: '#RP-0414', client: 'Fiorella Begazo', date: '10 jul, 2026', total: 479, status: 'En preparación' },
  { id: '#RP-0413', client: 'Diego Salas', date: '9 jul, 2026', total: 159, status: 'Recibido' }
];

export const SALES_BY_MONTH = [
  { label: 'Feb', value: 32 }, { label: 'Mar', value: 41 }, { label: 'Abr', value: 38 },
  { label: 'May', value: 52 }, { label: 'Jun', value: 47 }, { label: 'Jul', value: 61 }
];

export const TOP_PRODUCTS = [
  { name: 'Peak Runner X', units: 214 }, { name: 'Polo DryFit Pro', units: 176 },
  { name: 'Urban Trail Low', units: 132 }, { name: 'Mochila Trail 20L', units: 98 }
];

export const money = (n: number) => 'S/ ' + n.toFixed(2);
