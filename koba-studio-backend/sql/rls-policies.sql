-- ============================================================
-- Row Level Security (RLS) Policies for KOBA-STUDIO
-- Execute these in Supabase SQL editor to enable RLS
-- ============================================================

-- 1. TABLA: contact_messages (Crear si no existe)
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  servicio TEXT,
  empresa TEXT,
  urgencia TEXT[] DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índices para mejorar queries
CREATE INDEX IF NOT EXISTS contact_messages_user_id_idx ON contact_messages(user_id);
CREATE INDEX IF NOT EXISTS contact_messages_email_idx ON contact_messages(email);
CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON contact_messages(created_at DESC);

-- Enable RLS en contact_messages
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Política: Solo admin/staff pueden ver todos los mensajes
CREATE POLICY "Admin can view all contact messages"
ON contact_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- Política: Usuarios pueden ver sus propios mensajes si están autenticados
CREATE POLICY "Users can view their own contact messages"
ON contact_messages
FOR SELECT
USING (auth.uid() = user_id);

-- Política: Cualquiera puede insertar (control via API + rate limiting)
CREATE POLICY "Anyone can insert contact messages"
ON contact_messages
FOR INSERT
WITH CHECK (true);

-- Política: Solo admin puede actualizar
CREATE POLICY "Admin can update contact messages"
ON contact_messages
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- ============================================================
-- 2. TABLA: purchases (Configurar RLS si no existe)
-- ============================================================
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios solo ven sus propias compras
CREATE POLICY "Users can view their own purchases"
ON purchases
FOR SELECT
USING (auth.uid() = user_id);

-- Política: Solo admin puede ver todas las compras
CREATE POLICY "Admin can view all purchases"
ON purchases
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- Política: Usuarios pueden crear sus propias compras
CREATE POLICY "Users can create purchases"
ON purchases
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política: Solo admin puede actualizar estado de compras
CREATE POLICY "Admin can update purchases"
ON purchases
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- ============================================================
-- 3. TABLA: products (Lectura pública, escritura restringida)
-- ============================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden ver productos publicados
CREATE POLICY "Anyone can view published products"
ON products
FOR SELECT
USING (published = true);

-- Política: Solo admin puede insertar productos
CREATE POLICY "Admin can insert products"
ON products
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- Política: Solo admin puede actualizar productos
CREATE POLICY "Admin can update products"
ON products
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- ============================================================
-- NOTAS IMPORTANTES
-- ============================================================
--
-- 1. Después de ejecutar este SQL, el Supabase Anon Key
--    seguirá funcionando porque uses los políticas RLS
--    para controlar acceso, no la autenticación.
--
-- 2. Para asignar rol 'admin' a un usuario, ejecutar:
--    UPDATE auth.users
--    SET raw_user_meta_data = jsonb_set(
--      COALESCE(raw_user_meta_data, '{}'),
--      '{role}',
--      '"admin"'
--    )
--    WHERE email = 'admin@example.com';
--
-- 3. El endpoint /api/contact acepta mensajes de cualquiera
--    pero almacena la IP y valida datos en servidor.
--
-- 4. La tabla contact_messages está protegida por RLS:
--    - Anon users: pueden insertar, no pueden leer
--    - Autenticados: pueden ver sus mensajes
--    - Admins: pueden ver todos
