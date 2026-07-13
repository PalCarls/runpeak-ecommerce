import { randomInt } from 'node:crypto';
import { Router, type Response } from 'express';
import type { PoolClient } from 'pg';
import { createToken, hashPassword, optionalAuth, requireAdmin, requireAuth, type AuthenticatedRequest } from './auth.js';
import { database } from './database.js';
import { verifyPassword } from './auth.js';

export const api = Router();

const db = () => {
  if (!database) throw new Error('DATABASE_URL no está configurada');
  return database;
};

const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';
const money = (value: unknown) => Number(Number(value).toFixed(2));
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function publicUser(row: Record<string, unknown>) {
  return { id: row.id, name: row.name, email: row.email, role: row.role };
}

function productFromRow(row: Record<string, unknown>) {
  const variants = Array.isArray(row.variants) ? row.variants : [];
  return {
    id: row.slug,
    name: row.name,
    category: row.category,
    description: row.description,
    price: Number(row.price),
    oldPrice: row.old_price === null ? undefined : Number(row.old_price),
    img: row.image_url,
    badge: row.badge,
    active: row.active,
    sizes: variants.filter((variant: { stock: number }) => variant.stock > 0).map((variant: { size: string }) => variant.size),
    variants,
    stock: variants.reduce((sum: number, variant: { stock: number }) => sum + Number(variant.stock), 0),
  };
}

const productSelect = `
  SELECT p.*,
    COALESCE(json_agg(json_build_object('id', v.id, 'size', v.size, 'color', v.color, 'stock', v.stock)
      ORDER BY v.size) FILTER (WHERE v.id IS NOT NULL), '[]') AS variants
  FROM products p
  LEFT JOIN product_variants v ON v.product_slug = p.slug`;

api.get('/products', async (req, res) => {
  const values: unknown[] = [];
  const filters = [req.query.admin === 'true' ? 'TRUE' : 'p.active = TRUE'];

  if (text(req.query.category)) {
    values.push(text(req.query.category));
    filters.push(`LOWER(p.category) = LOWER($${values.length})`);
  }
  if (text(req.query.search)) {
    values.push(`%${text(req.query.search)}%`);
    filters.push(`(p.name ILIKE $${values.length} OR p.description ILIKE $${values.length})`);
  }
  if (req.query.promo === 'true') filters.push('p.old_price IS NOT NULL');

  const result = await db().query(`${productSelect}
    WHERE ${filters.join(' AND ')}
    GROUP BY p.slug
    ORDER BY p.created_at DESC`, values);
  res.json(result.rows.map(productFromRow));
});

api.get('/products/:slug', async (req, res) => {
  const result = await db().query(`${productSelect}
    WHERE p.slug = $1 AND p.active = TRUE
    GROUP BY p.slug`, [req.params.slug]);
  if (!result.rowCount) return res.status(404).json({ message: 'Producto no encontrado' });
  res.json(productFromRow(result.rows[0]));
});

api.get('/coupons', async (_req, res) => {
  const result = await db().query(`SELECT code, description, discount_type, discount_value, min_purchase, category, expires_at
    FROM coupons WHERE active = TRUE AND starts_at <= now() AND (expires_at IS NULL OR expires_at > now()) ORDER BY created_at`);
  res.json(result.rows.map((row) => ({
    code: row.code,
    desc: row.description,
    min: `S/ ${Number(row.min_purchase).toFixed(2)}`,
    valid: row.expires_at ? new Date(row.expires_at).toLocaleDateString('es-PE') : 'Sin vencimiento',
    type: row.discount_type,
    value: Number(row.discount_value),
  })));
});

api.post('/coupons/validate', async (req, res) => {
  const code = text(req.body.code).toUpperCase();
  const subtotal = money(req.body.subtotal);
  const result = await db().query(`SELECT * FROM coupons WHERE code = $1 AND active = TRUE AND starts_at <= now()
    AND (expires_at IS NULL OR expires_at > now()) AND (usage_limit IS NULL OR usage_count < usage_limit)`, [code]);
  const coupon = result.rows[0];
  if (!coupon || subtotal < Number(coupon.min_purchase)) return res.status(400).json({ message: 'Cupón inválido o no cumple el mínimo de compra' });
  const discount = coupon.discount_type === 'percent'
    ? money(subtotal * Number(coupon.discount_value) / 100)
    : coupon.discount_type === 'fixed' ? Math.min(subtotal, Number(coupon.discount_value)) : 0;
  res.json({ code, discount, freeShipping: coupon.discount_type === 'shipping' });
});

api.post('/auth/register', async (req, res) => {
  const name = text(req.body.name);
  const email = text(req.body.email).toLowerCase();
  const password = text(req.body.password);
  if (name.length < 2 || !emailPattern.test(email) || password.length < 8) {
    return res.status(400).json({ message: 'Nombre, correo o contraseña inválidos (mínimo 8 caracteres)' });
  }
  try {
    const result = await db().query(`INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)
      RETURNING id, name, email, role`, [name, email, hashPassword(password)]);
    const user = publicUser(result.rows[0]);
    res.status(201).json({ user, token: createToken(user as Parameters<typeof createToken>[0]) });
  } catch (error) {
    if ((error as { code?: string }).code === '23505') return res.status(409).json({ message: 'El correo ya está registrado' });
    throw error;
  }
});

api.post('/auth/login', async (req, res) => {
  const email = text(req.body.email).toLowerCase();
  const password = text(req.body.password);
  const result = await db().query('SELECT id, name, email, role, password_hash FROM users WHERE email = $1', [email]);
  const row = result.rows[0];
  if (!row || !verifyPassword(password, row.password_hash)) return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
  const user = publicUser(row);
  res.json({ user, token: createToken(user as Parameters<typeof createToken>[0]) });
});

api.get('/auth/me', requireAuth, async (req: AuthenticatedRequest, res) => {
  const result = await db().query('SELECT id, name, email, role FROM users WHERE id = $1', [req.user!.id]);
  if (!result.rowCount) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.json(publicUser(result.rows[0]));
});

api.get('/favorites', requireAuth, async (req: AuthenticatedRequest, res) => {
  const result = await db().query('SELECT product_slug FROM favorites WHERE user_id = $1 ORDER BY created_at DESC', [req.user!.id]);
  res.json(result.rows.map((row) => row.product_slug));
});

api.post('/favorites/:slug', requireAuth, async (req: AuthenticatedRequest, res) => {
  await db().query('INSERT INTO favorites (user_id, product_slug) VALUES ($1, $2) ON CONFLICT DO NOTHING', [req.user!.id, req.params.slug]);
  res.status(201).json({ productId: req.params.slug });
});

api.delete('/favorites/:slug', requireAuth, async (req: AuthenticatedRequest, res) => {
  await db().query('DELETE FROM favorites WHERE user_id = $1 AND product_slug = $2', [req.user!.id, req.params.slug]);
  res.status(204).send();
});

interface CheckoutItem { productId: string; size: string; color?: string; quantity: number }

async function findCoupon(client: PoolClient, code: string | undefined, subtotal: number, categories: string[]) {
  if (!code) return { code: null, discount: 0, freeShipping: false };
  const result = await client.query(`SELECT * FROM coupons WHERE code = $1 AND active = TRUE AND starts_at <= now()
    AND (expires_at IS NULL OR expires_at > now()) AND (usage_limit IS NULL OR usage_count < usage_limit) FOR UPDATE`, [code.toUpperCase()]);
  const coupon = result.rows[0];
  if (!coupon || subtotal < Number(coupon.min_purchase) || (coupon.category && !categories.includes(coupon.category))) {
    throw new Error('Cupón inválido o no aplicable');
  }
  const discount = coupon.discount_type === 'percent' ? money(subtotal * Number(coupon.discount_value) / 100)
    : coupon.discount_type === 'fixed' ? Math.min(subtotal, Number(coupon.discount_value)) : 0;
  return { code: coupon.code, discount, freeShipping: coupon.discount_type === 'shipping' };
}

api.post('/orders', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  const customer = req.body.customer ?? {};
  const items = Array.isArray(req.body.items) ? req.body.items as CheckoutItem[] : [];
  const paymentMethod = text(req.body.paymentMethod) || 'card';
  if (!text(customer.name) || !emailPattern.test(text(customer.email)) || !text(customer.phone) || !text(customer.address) || !text(customer.city)) {
    return res.status(400).json({ message: 'Completa los datos de envío' });
  }
  if (!items.length || items.some((item) => !text(item.productId) || !text(item.size) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20)) {
    return res.status(400).json({ message: 'El carrito no es válido' });
  }
  if (!['card', 'yape_plin', 'transfer'].includes(paymentMethod)) return res.status(400).json({ message: 'Método de pago inválido' });

  const client = await db().connect();
  try {
    await client.query('BEGIN');
    const resolved = [];
    for (const item of items) {
      const variant = await client.query(`SELECT p.slug, p.name, p.category, p.price, p.image_url, v.id AS variant_id, v.size, v.color, v.stock
        FROM products p JOIN product_variants v ON v.product_slug = p.slug
        WHERE p.slug = $1 AND v.size = $2 AND p.active = TRUE ORDER BY v.stock DESC LIMIT 1 FOR UPDATE`,
      [item.productId, item.size]);
      const row = variant.rows[0];
      if (!row) throw new Error(`Producto o variante no disponible: ${item.productId}`);
      if (row.stock < item.quantity) throw new Error(`Stock insuficiente para ${row.name} talla ${row.size}`);
      resolved.push({ ...row, quantity: item.quantity, lineTotal: money(Number(row.price) * item.quantity) });
    }

    const subtotal = money(resolved.reduce((sum, item) => sum + item.lineTotal, 0));
    const coupon = await findCoupon(client, text(req.body.couponCode) || undefined, subtotal, resolved.map((item) => item.category));
    const shipping = coupon.freeShipping ? 0 : 15;
    const total = money(subtotal - coupon.discount + shipping);
    const suffix = randomInt(1000, 9999);
    const orderNumber = `RP-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${suffix}`;
    const trackingCode = `RPX-${Date.now().toString().slice(-8)}-PE`;
    const order = await client.query(`INSERT INTO orders
      (order_number, user_id, customer_name, customer_email, customer_phone, address, city, reference, subtotal, discount, shipping, total, coupon_code, payment_method, payment_status, tracking_code, estimated_delivery)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,'paid',$15,current_date + 2) RETURNING *`,
    [orderNumber, req.user?.id ?? null, text(customer.name), text(customer.email).toLowerCase(), text(customer.phone), text(customer.address), text(customer.city), text(customer.reference) || null, subtotal, coupon.discount, shipping, total, coupon.code, paymentMethod, trackingCode]);

    for (const item of resolved) {
      await client.query(`INSERT INTO order_items (order_id, product_slug, product_name, image_url, size, color, quantity, unit_price, line_total)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [order.rows[0].id, item.slug, item.name, item.image_url, item.size, item.color, item.quantity, item.price, item.lineTotal]);
      await client.query('UPDATE product_variants SET stock = stock - $1 WHERE id = $2', [item.quantity, item.variant_id]);
    }
    await client.query(`INSERT INTO order_status_history (order_id, status, detail) VALUES ($1, 'Recibido', 'Hemos recibido tu pedido y está siendo validado.')`, [order.rows[0].id]);
    if (coupon.code) await client.query('UPDATE coupons SET usage_count = usage_count + 1 WHERE code = $1', [coupon.code]);
    await client.query('COMMIT');
    res.status(201).json({ ...order.rows[0], items: resolved.map((item) => ({ id: item.slug, name: item.name, price: Number(item.price), qty: item.quantity, size: item.size, color: item.color, img: item.image_url })) });
  } catch (error) {
    await client.query('ROLLBACK');
    const message = error instanceof Error ? error.message : 'No se pudo crear el pedido';
    res.status(400).json({ message });
  } finally {
    client.release();
  }
});

api.get('/orders', requireAuth, async (req: AuthenticatedRequest, res) => {
  const result = await db().query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [req.user!.id]);
  res.json(result.rows);
});

api.get('/orders/:number', optionalAuth, async (req: AuthenticatedRequest, res) => {
  const values = [req.params.number];
  let ownership = '';
  if (req.user) {
    values.push(req.user.id);
    ownership = 'AND o.user_id = $2';
  } else {
    const email = text(req.query.email).toLowerCase();
    if (!email) return res.status(400).json({ message: 'Indica el correo usado en la compra' });
    values.push(email);
    ownership = 'AND LOWER(o.customer_email) = $2';
  }
  const result = await db().query(`SELECT o.*,
    COALESCE(json_agg(DISTINCT jsonb_build_object('id', i.product_slug, 'name', i.product_name, 'img', i.image_url, 'size', i.size, 'color', i.color, 'qty', i.quantity, 'price', i.unit_price)) FILTER (WHERE i.id IS NOT NULL), '[]') AS items,
    COALESCE(json_agg(DISTINCT jsonb_build_object('status', h.status, 'detail', h.detail, 'date', h.created_at)) FILTER (WHERE h.id IS NOT NULL), '[]') AS history
    FROM orders o LEFT JOIN order_items i ON i.order_id = o.id LEFT JOIN order_status_history h ON h.order_id = o.id
    WHERE o.order_number = $1 ${ownership} GROUP BY o.id`, values);
  if (!result.rowCount) return res.status(404).json({ message: 'Pedido no encontrado' });
  res.json(result.rows[0]);
});

api.post('/admin/products', requireAdmin, async (req, res) => {
  const body = req.body;
  const slug = text(body.slug);
  if (!slug || !text(body.name) || !text(body.category) || Number(body.price) < 0 || !text(body.imageUrl)) return res.status(400).json({ message: 'Datos de producto inválidos' });
  await db().query(`INSERT INTO products (slug,name,category,description,price,old_price,image_url,badge,active)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [slug, text(body.name), text(body.category), text(body.description), Number(body.price), body.oldPrice || null, text(body.imageUrl), text(body.badge) || null, body.active !== false]);
  for (const variant of Array.isArray(body.variants) ? body.variants : []) {
    await db().query('INSERT INTO product_variants (product_slug,size,color,stock) VALUES ($1,$2,$3,$4)', [slug, text(variant.size), text(variant.color) || 'Negro', Number(variant.stock) || 0]);
  }
  res.status(201).json({ id: slug });
});

api.patch('/admin/products/:slug', requireAdmin, async (req, res) => {
  const allowed: Record<string, string> = { name: 'name', category: 'category', description: 'description', price: 'price', oldPrice: 'old_price', imageUrl: 'image_url', badge: 'badge', active: 'active' };
  const entries = Object.entries(req.body).filter(([key]) => allowed[key]);
  if (!entries.length) return res.status(400).json({ message: 'No hay cambios válidos' });
  const values = entries.map(([, value]) => value);
  values.push(req.params.slug);
  const sets = entries.map(([key], index) => `${allowed[key]} = $${index + 1}`);
  const result = await db().query(`UPDATE products SET ${sets.join(', ')}, updated_at = now() WHERE slug = $${values.length} RETURNING slug`, values);
  if (!result.rowCount) return res.status(404).json({ message: 'Producto no encontrado' });
  res.json({ id: result.rows[0].slug });
});

api.delete('/admin/products/:slug', requireAdmin, async (req, res) => {
  await db().query('UPDATE products SET active = FALSE, updated_at = now() WHERE slug = $1', [req.params.slug]);
  res.status(204).send();
});

api.get('/admin/orders', requireAdmin, async (_req, res) => {
  const result = await db().query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 100');
  res.json(result.rows);
});

api.patch('/admin/orders/:number/status', requireAdmin, async (req, res) => {
  const status = text(req.body.status);
  const valid = ['Recibido', 'En preparación', 'Despachado', 'En tránsito', 'Entregado', 'Cancelado'];
  if (!valid.includes(status)) return res.status(400).json({ message: 'Estado inválido' });
  const result = await db().query('UPDATE orders SET status = $1, updated_at = now() WHERE order_number = $2 RETURNING id', [status, req.params.number]);
  if (!result.rowCount) return res.status(404).json({ message: 'Pedido no encontrado' });
  await db().query('INSERT INTO order_status_history (order_id,status,detail) VALUES ($1,$2,$3)', [result.rows[0].id, status, text(req.body.detail) || null]);
  res.json({ number: req.params.number, status });
});

api.get('/admin/dashboard', requireAdmin, async (_req, res) => {
  const [summary, top] = await Promise.all([
    db().query(`SELECT COALESCE(SUM(total),0) AS sales, COUNT(*) AS orders,
      (SELECT COUNT(*) FROM product_variants WHERE stock <= 5) AS low_stock FROM orders WHERE created_at >= date_trunc('month', now()) AND status <> 'Cancelado'`),
    db().query(`SELECT i.product_name AS name, SUM(i.quantity)::int AS units FROM order_items i JOIN orders o ON o.id = i.order_id
      WHERE o.status <> 'Cancelado' GROUP BY i.product_name ORDER BY units DESC LIMIT 5`),
  ]);
  res.json({ ...summary.rows[0], topProducts: top.rows });
});
