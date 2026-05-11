-- ============================================================
-- PASO 1: Verificar estructura actual
-- Ejecuta esto primero para ver qué existe
-- ============================================================

-- Ver columnas de profiles
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Ver si existen las tablas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
