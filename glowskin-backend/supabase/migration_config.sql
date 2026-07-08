-- Ejecutar en el SQL Editor de Supabase (después de migration.sql)

create table if not exists public.config (
  key   text primary key,
  value text not null default ''
);

alter table public.config enable row level security;

-- Lectura pública (el frontend la necesita sin autenticación)
create policy "public_read" on public.config
  for select using (true);

-- Datos iniciales
insert into public.config (key, value) values
  ('wa_phone', '')
on conflict (key) do nothing;
