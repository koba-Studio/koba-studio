-- ============================================================
-- PASO 3: Actualizar tabla CONTACT_MESSAGES
-- Agregar campos que faltan (si no existen)
-- ============================================================

-- Agregar columnas si no existen
ALTER TABLE contact_messages
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'open' CHECK (status IN ('open', 'replied', 'resolved'));

ALTER TABLE contact_messages
ADD COLUMN IF NOT EXISTS replies JSONB DEFAULT '[]'::jsonb;

ALTER TABLE contact_messages
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Crear índices
CREATE INDEX IF NOT EXISTS contact_messages_status_idx ON contact_messages(status);

-- Verificar que RLS esté habilitado
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Recrear políticas RLS (eliminar las viejas primero si existen)
DROP POLICY IF EXISTS "Admin can view all contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Users can view their own contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admin can update contact messages" ON contact_messages;

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

-- Política: Usuarios pueden ver sus propios mensajes
CREATE POLICY "Users can view their own contact messages"
ON contact_messages
FOR SELECT
USING (auth.uid() = user_id);

-- Política: Cualquiera puede insertar
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
