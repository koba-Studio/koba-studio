-- Ejecutar en Supabase → SQL Editor

-- Tabla de perfiles de usuario
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Tabla de compras
create table purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id text not null,
  product_name text not null,
  status text default 'active' check (status in ('active', 'inactive', 'pending')),
  price numeric(10,2),
  created_at timestamp with time zone default timezone('utc', now())
);

-- Tabla de productos del catálogo
create table products (
  id text primary key,
  name text not null,
  description text,
  price_monthly numeric(10,2),
  price_setup numeric(10,2),
  status text default 'active' check (status in ('active', 'coming_soon', 'inactive')),
  industry text,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Insertar productos iniciales
insert into products (id, name, description, price_monthly, price_setup, status, industry) values
('constructora-v1', 'Gestión de Facturas por Proyecto', 'Automatización del registro y supervisión de facturas para constructoras', 49000, 150000, 'active', 'construcción'),
('aserradero-v1', 'Coordinación Logística de Mantención', 'Gestión automatizada de mantención de maquinaria por módulo', 49000, 150000, 'active', 'industria');

-- Seguridad: Row Level Security
alter table profiles enable row level security;
alter table purchases enable row level security;
alter table products enable row level security;

-- Políticas: cada usuario solo ve sus propios datos
create policy "Usuarios ven su propio perfil"
  on profiles for select using (auth.uid() = id);

create policy "Usuarios ven sus propias compras"
  on purchases for select using (auth.uid() = user_id);

create policy "Productos visibles para todos"
  on products for select using (true);

-- Crear perfil automáticamente al registrar usuario
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
