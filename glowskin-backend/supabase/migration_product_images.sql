-- Run in the Supabase SQL Editor to enable multiple images per product.
alter table public.products
  add column if not exists images jsonb not null default '[]'::jsonb;

update public.products
set images = jsonb_build_array(image)
where images = '[]'::jsonb
  and coalesce(image, '') <> '';