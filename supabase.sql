-- Tabla de productos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category TEXT,
  image_url TEXT,
  gallery TEXT[],
  available BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de órdenes
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_commune TEXT,
  customer_region TEXT,
  customer_comment TEXT,
  total INTEGER NOT NULL,
  status TEXT DEFAULT 'pendiente',
  buy_order TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de items de la orden
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  unit_price INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal INTEGER NOT NULL
);

-- Tabla de pagos
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  token TEXT,
  buy_order TEXT,
  session_id TEXT,
  amount INTEGER,
  status TEXT,
  authorization_code TEXT,
  payment_type_code TEXT,
  response_code INTEGER,
  installments_number INTEGER,
  transaction_date TEXT,
  raw_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejor rendimiento
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_available ON products(available);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Políticas Row Level Security (RLS)

-- Habilitar RLS en todas las tablas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- PRODUCTS: Lectura pública solo de productos disponibles
CREATE POLICY "Public can read available products"
  ON products FOR SELECT
  USING (available = true);

-- PRODUCTS: Solo autenticados pueden crear
CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- PRODUCTS: Solo autenticados pueden actualizar
CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  WITH CHECK (auth.role() = 'authenticated');

-- PRODUCTS: Solo autenticados pueden eliminar
CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  USING (auth.role() = 'authenticated');

-- ORDERS: Cualquiera puede insertar (desde checkout)
CREATE POLICY "Anyone can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- ORDERS: Solo autenticados pueden leer
CREATE POLICY "Authenticated users can read orders"
  ON orders FOR SELECT
  USING (auth.role() = 'authenticated');

-- ORDERS: Solo autenticados pueden actualizar
CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  WITH CHECK (auth.role() = 'authenticated');

-- ORDER_ITEMS: Cualquiera puede insertar al crear orden
CREATE POLICY "Anyone can insert order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- ORDER_ITEMS: Solo autenticados pueden leer
CREATE POLICY "Authenticated users can read order items"
  ON order_items FOR SELECT
  USING (auth.role() = 'authenticated');

-- PAYMENTS: Solo autenticados pueden insertar/actualizar
CREATE POLICY "Authenticated users can insert payments"
  ON payments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update payments"
  ON payments FOR UPDATE
  WITH CHECK (auth.role() = 'authenticated');

-- PAYMENTS: Solo autenticados pueden leer
CREATE POLICY "Authenticated users can read payments"
  ON payments FOR SELECT
  USING (auth.role() = 'authenticated');

-- Insertar datos de ejemplo
INSERT INTO products (name, description, price, category, image_url, available, featured, stock) VALUES
('Canasta Tejida Grande', 'Hermosa canasta tejida a mano con asas de cuero. Perfecta para almacenar o decorar.', 45000, 'Canastas', 'https://via.placeholder.com/400?text=Canasta+Grande', true, true, 10),
('Plato Decorativo', 'Plato decorativo tejido en mimbre. Ideal para pared o como base.', 25000, 'Decoración', 'https://via.placeholder.com/400?text=Plato', true, true, 15),
('Cesta de Picnic', 'Cesta tradicional con tapa para picnics y transportar cosas.', 55000, 'Canastas', 'https://via.placeholder.com/400?text=Cesta+Picnic', true, false, 8),
('Posavasos Tejidos', 'Set de 4 posavasos tejidos artesanalmente.', 15000, 'Accesorios', 'https://via.placeholder.com/400?text=Posavasos', true, false, 20),
('Lámpara de Mimbre', 'Lámpara decorativa tejida. Crea una iluminación cálida y acogedora.', 75000, 'Iluminación', 'https://via.placeholder.com/400?text=Lampara', true, true, 5);
