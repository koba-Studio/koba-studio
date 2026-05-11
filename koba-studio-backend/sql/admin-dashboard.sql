-- ============================================================
-- Admin Dashboard Schema & RLS Policies
-- Execute these in Supabase SQL editor
-- ============================================================

-- ============================================================
-- 1. TABLA: pages (Landing Pages Management)
-- ============================================================
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  content TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  meta_title TEXT,
  meta_description TEXT,
  views INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índices
CREATE INDEX IF NOT EXISTS pages_slug_idx ON pages(slug);
CREATE INDEX IF NOT EXISTS pages_status_idx ON pages(status);
CREATE INDEX IF NOT EXISTS pages_created_at_idx ON pages(created_at DESC);

-- Enable RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden ver páginas publicadas
CREATE POLICY "Anyone can view published pages"
ON pages
FOR SELECT
USING (status = 'published');

-- Política: Solo admin puede ver todas las páginas
CREATE POLICY "Admin can view all pages"
ON pages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- Política: Solo admin puede crear páginas
CREATE POLICY "Admin can create pages"
ON pages
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- Política: Solo admin puede editar páginas
CREATE POLICY "Admin can update pages"
ON pages
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- Política: Solo admin puede eliminar páginas
CREATE POLICY "Admin can delete pages"
ON pages
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- ============================================================
-- 2. ACTUALIZAR TABLA: contact_messages (Add missing fields)
-- ============================================================
-- Agregar columnas si no existen
ALTER TABLE contact_messages
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'open' CHECK (status IN ('open', 'replied', 'resolved')),
ADD COLUMN IF NOT EXISTS replies JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Crear índices adicionales
CREATE INDEX IF NOT EXISTS contact_messages_status_idx ON contact_messages(status);

-- ============================================================
-- 3. ACTUALIZAR TABLA: products (Add admin fields)
-- ============================================================
-- Agregar columnas si no existen
ALTER TABLE products
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Automatización',
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Mensual',
ADD COLUMN IF NOT EXISTS discount NUMERIC(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Crear índices
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS products_status_idx ON products(status);

-- ============================================================
-- 4. ACTUALIZAR TABLA: profiles (Add necessary fields)
-- ============================================================
-- Agregar columnas si no existen
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
ADD COLUMN IF NOT EXISTS last_sign_in TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Crear índices
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);
CREATE INDEX IF NOT EXISTS profiles_status_idx ON profiles(status);

-- ============================================================
-- 5. TABLA: audit_logs (Optional: Track admin changes)
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índices
CREATE INDEX IF NOT EXISTS audit_logs_admin_id_idx ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS audit_logs_table_name_idx ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON audit_logs(created_at DESC);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Política: Solo admin puede ver audit logs
CREATE POLICY "Admin can view audit logs"
ON audit_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- Política: Solo sistema puede insertar audit logs
CREATE POLICY "System can insert audit logs"
ON audit_logs
FOR INSERT
WITH CHECK (true);

-- ============================================================
-- VERIFICACIÓN: Ejecuta estas queries para verificar:
-- ============================================================
-- SELECT * FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT * FROM pg_policies WHERE tablename = 'contact_messages';
-- SELECT * FROM pg_policies WHERE tablename = 'pages';
-- SELECT * FROM profiles LIMIT 1;
