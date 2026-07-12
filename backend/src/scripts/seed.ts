import 'dotenv/config';
import { hashPassword } from '../auth.js';
import { database } from '../database.js';

if (!database) throw new Error('DATABASE_URL no está configurada');

const products = [
  ['peak-runner-x', 'Peak Runner X', 'Running', 349, null, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', 'Nuevo', ['39', '40', '41'], 8],
  ['urban-trail-low', 'Urban Trail Low', 'Casual', 279, 320, 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&q=80', '-15%', ['39', '41'], 3],
  ['polo-dryfit-pro', 'Polo DryFit Pro', 'Ropa deportiva', 89, null, 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&q=80', null, ['S', 'M', 'L'], 14],
  ['mochila-trail-20l', 'Mochila Trail 20L', 'Accesorios', 159, null, 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&q=80', null, ['Único'], 18],
  ['trail-grip-3', 'Trail Grip 3.0', 'Running', 330, 389, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&q=80', '-15%', ['40', '41', '42'], 2],
  ['street-comfort', 'Street Comfort', 'Casual', 197, 219, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80', '-10%', ['38', '39'], 13],
  ['peak-runner-x2', 'Peak Runner X2', 'Running', 379, null, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80', null, ['39', '40'], 8],
  ['peak-runner-lite', 'Peak Runner Lite', 'Running', 299, null, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80', null, ['38', '40', '42'], 10],
] as const;

const description = 'Producto deportivo RunPeak diseñado para entrenamiento y uso diario, con materiales resistentes y entrega en Arequipa.';

try {
  for (const [slug, name, category, price, oldPrice, image, badge, sizes, stock] of products) {
    await database.query(`INSERT INTO products (slug,name,category,description,price,old_price,image_url,badge)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, category=EXCLUDED.category, description=EXCLUDED.description,
      price=EXCLUDED.price, old_price=EXCLUDED.old_price, image_url=EXCLUDED.image_url, badge=EXCLUDED.badge, active=TRUE, updated_at=now()`,
    [slug, name, category, description, price, oldPrice, image, badge]);
    for (const size of sizes) {
      await database.query(`INSERT INTO product_variants (product_slug,size,color,stock) VALUES ($1,$2,'Negro',$3)
        ON CONFLICT (product_slug,size,color) DO UPDATE SET stock=EXCLUDED.stock`, [slug, size, stock]);
    }
  }

  const coupons = [
    ['BIENVENIDA10', '10% de descuento en tu primera compra', 'percent', 10, 150, null, '2026-07-31T23:59:59-05:00'],
    ['RUNPEAK20', '20% de descuento en zapatillas running', 'percent', 20, 300, 'Running', '2026-08-15T23:59:59-05:00'],
    ['ENVIOGRATIS', 'Envío gratis dentro de Arequipa', 'shipping', 0, 200, null, '2026-07-31T23:59:59-05:00'],
  ];
  for (const coupon of coupons) {
    await database.query(`INSERT INTO coupons (code,description,discount_type,discount_value,min_purchase,category,expires_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (code) DO UPDATE SET description=EXCLUDED.description,
      discount_type=EXCLUDED.discount_type, discount_value=EXCLUDED.discount_value, min_purchase=EXCLUDED.min_purchase,
      category=EXCLUDED.category, expires_at=EXCLUDED.expires_at, active=TRUE`, coupon);
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? (process.env.NODE_ENV === 'production' ? '' : 'admin@runpeak.local');
  const adminPassword = process.env.ADMIN_PASSWORD ?? (process.env.NODE_ENV === 'production' ? '' : 'Admin123!');
  if (adminEmail && adminPassword) {
    await database.query(`INSERT INTO users (name,email,password_hash,role) VALUES ('Administrador RunPeak',$1,$2,'admin')
      ON CONFLICT (email) DO UPDATE SET password_hash=EXCLUDED.password_hash, role='admin', updated_at=now()`,
    [adminEmail.toLowerCase(), hashPassword(adminPassword)]);
  }
  console.log('Productos, variantes, cupones y administrador inicial cargados');
} finally {
  await database.end();
}
