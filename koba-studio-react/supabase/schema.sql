-- ================================================================
-- KoBa Studio — Schema Supabase
-- Pegar en: supabase.com → tu proyecto → SQL Editor → New query
-- ================================================================

-- ── PRODUCTOS ────────────────────────────────────────────────────
create table if not exists public.products (
  id          text        primary key,          -- 'koba-ops', 'koba-flow', etc.
  name        text        not null,
  tagline     text,
  price_usd   integer,                          -- precio en USD (null = cotización)
  category    text        not null default 'saas', -- 'saas' | 'custom' | 'coming_soon'
  is_active   boolean     not null default true,
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now()
);

-- Datos iniciales de productos
insert into public.products (id, name, tagline, price_usd, category, sort_order) values
  ('koba-ops',   'KoBa Ops',   'Centro de control operacional para equipos B2B',          290, 'saas',   1),
  ('koba-flow',  'KoBa Flow',  'Motor de automatización de procesos sin código',          490, 'saas',   2),
  ('koba-pulse', 'KoBa Pulse', 'Panel de inteligencia operacional multi-fuente',          190, 'saas',   3),
  ('portal-cli', 'Portal de Clientes', 'Plataforma white-label de gestión de clientes',  null,'custom', 4),
  ('erp-sect',   'ERP Sectorial', 'Sistema de gestión empresarial a medida',              null,'custom', 5)
on conflict (id) do nothing;

-- ── PURCHASES ────────────────────────────────────────────────────
create table if not exists public.purchases (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        not null references auth.users(id) on delete cascade,
  product_id        text        not null references public.products(id),
  mp_payment_id     text        unique,          -- ID del pago en Mercado Pago
  mp_preference_id  text,                        -- ID de preferencia creada
  amount_usd        integer,                     -- monto pagado
  status            text        not null default 'pending',
                                                 -- pending | approved | rejected | cancelled
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Índice para búsquedas frecuentes
create index if not exists purchases_user_id_idx on public.purchases(user_id);
create index if not exists purchases_status_idx  on public.purchases(status);

-- ── ROW LEVEL SECURITY ────────────────────────────────────────────
alter table public.products  enable row level security;
alter table public.purchases enable row level security;

-- Products: cualquiera puede leer los activos
create policy "products_public_read"
  on public.products for select
  using (is_active = true);

-- Purchases: cada usuario solo ve las suyas
create policy "purchases_select_own"
  on public.purchases for select
  using (auth.uid() = user_id);

create policy "purchases_insert_own"
  on public.purchases for insert
  with check (auth.uid() = user_id);

-- ── TRIGGER: updated_at automático ───────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger purchases_updated_at
  before update on public.purchases
  for each row execute procedure public.set_updated_at();

-- ================================================================
-- ¡Listo! Tablas creadas con RLS.
-- El backend usa SUPABASE_SERVICE_ROLE_KEY para escribir purchases
-- desde el webhook (bypasa RLS). La app frontend usa el anon key.
-- ================================================================
