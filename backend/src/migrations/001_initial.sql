CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(120) NOT NULL,
  email varchar(180) NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role varchar(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  slug varchar(120) PRIMARY KEY,
  name varchar(160) NOT NULL,
  category varchar(80) NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  old_price numeric(10, 2) CHECK (old_price IS NULL OR old_price >= price),
  image_url text NOT NULL,
  badge varchar(40),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug varchar(120) NOT NULL REFERENCES products(slug) ON DELETE CASCADE,
  size varchar(30) NOT NULL,
  color varchar(60) NOT NULL DEFAULT 'Negro',
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  UNIQUE (product_slug, size, color)
);

CREATE TABLE IF NOT EXISTS coupons (
  code varchar(40) PRIMARY KEY,
  description varchar(240) NOT NULL,
  discount_type varchar(20) NOT NULL CHECK (discount_type IN ('percent', 'fixed', 'shipping')),
  discount_value numeric(10, 2) NOT NULL DEFAULT 0 CHECK (discount_value >= 0),
  min_purchase numeric(10, 2) NOT NULL DEFAULT 0 CHECK (min_purchase >= 0),
  category varchar(80),
  starts_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  active boolean NOT NULL DEFAULT true,
  usage_limit integer CHECK (usage_limit IS NULL OR usage_limit > 0),
  usage_count integer NOT NULL DEFAULT 0 CHECK (usage_count >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS favorites (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_slug varchar(120) NOT NULL REFERENCES products(slug) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_slug)
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number varchar(32) NOT NULL UNIQUE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  customer_name varchar(120) NOT NULL,
  customer_email varchar(180) NOT NULL,
  customer_phone varchar(40) NOT NULL,
  address text NOT NULL,
  city varchar(100) NOT NULL,
  reference text,
  status varchar(30) NOT NULL DEFAULT 'Recibido' CHECK (status IN ('Recibido', 'En preparación', 'Despachado', 'En tránsito', 'Entregado', 'Cancelado')),
  subtotal numeric(10, 2) NOT NULL CHECK (subtotal >= 0),
  discount numeric(10, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  shipping numeric(10, 2) NOT NULL DEFAULT 0 CHECK (shipping >= 0),
  total numeric(10, 2) NOT NULL CHECK (total >= 0),
  coupon_code varchar(40) REFERENCES coupons(code) ON DELETE SET NULL,
  payment_method varchar(30) NOT NULL CHECK (payment_method IN ('card', 'yape_plin', 'transfer')),
  payment_status varchar(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  tracking_code varchar(40) NOT NULL UNIQUE,
  estimated_delivery date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_slug varchar(120) REFERENCES products(slug) ON DELETE SET NULL,
  product_name varchar(160) NOT NULL,
  image_url text NOT NULL,
  size varchar(30) NOT NULL,
  color varchar(60) NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(10, 2) NOT NULL CHECK (unit_price >= 0),
  line_total numeric(10, 2) NOT NULL CHECK (line_total >= 0)
);

CREATE TABLE IF NOT EXISTS order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status varchar(30) NOT NULL,
  detail text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_active_category ON products(active, category);
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_email_created ON orders(customer_email, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_status_history_order ON order_status_history(order_id, created_at);
