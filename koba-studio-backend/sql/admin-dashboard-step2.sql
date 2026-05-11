-- ============================================================
-- PASO 2: Crear tabla PAGES (Landing Pages)
-- Ejecuta esto si la tabla no existe
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
DROP POLICY IF EXISTS "Anyone can view published pages" ON pages;
CREATE POLICY "Anyone can view published pages"
ON pages
FOR SELECT
USING (status = 'published');

-- Política: Solo admin puede ver todas las páginas
DROP POLICY IF EXISTS "Admin can view all pages" ON pages;
CREATE POLICY "Admin can view all pages"
ON pages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- Política: Solo admin puede crear páginas
DROP POLICY IF EXISTS "Admin can create pages" ON pages;
CREATE POLICY "Admin can create pages"
ON pages
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- Política: Solo admin puede editar páginas
DROP POLICY IF EXISTS "Admin can update pages" ON pages;
CREATE POLICY "Admin can update pages"
ON pages
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- Política: Solo admin puede eliminar páginas
DROP POLICY IF EXISTS "Admin can delete pages" ON pages;
CREATE POLICY "Admin can delete pages"
ON pages
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  )
);
