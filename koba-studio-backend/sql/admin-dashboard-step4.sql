-- ============================================================
-- PASO 4: Actualizar tabla PRODUCTS
-- Agregar campos para admin dashboard (si no existen)
-- ============================================================

-- Agregar columnas si no existen
ALTER TABLE products
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Automatización';

ALTER TABLE products
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Mensual';

ALTER TABLE products
ADD COLUMN IF NOT EXISTS discount NUMERIC(5,2) DEFAULT 0;

ALTER TABLE products
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending'));

ALTER TABLE products
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE products
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Crear índices
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS products_status_idx ON products(status);
CREATE INDEX IF NOT EXISTS products_updated_at_idx ON products(updated_at DESC);

-- Verificar que RLS esté habilitado
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Recrear políticas RLS
DROP POLICY IF EXISTS "Anyone can view published products" ON products;
DROP POLICY IF EXISTS "Admin can insert products" ON products;
DROP POLICY IF EXISTS "Admin can update products" ON products;
DROP POLICY IF EXISTS "Admin can delete products" ON products;

-- Política: Todos pueden ver productos activos/publicados
CREATE POLICY "Anyone can view published products"
ON products
FOR SELECT
USING (status = 'active' OR status IS NULL);

-- Política: Solo admin puede insertar
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

-- Política: Solo admin puede actualizar
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

-- Política: Solo admin puede eliminar
CREATE POLICY "Admin can delete products"
ON products
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  )
);
