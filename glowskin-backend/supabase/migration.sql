-- Run this SQL in the Supabase SQL Editor to create the products table

create table if not exists public.products (
  id            bigserial primary key,
  name          text        not null,
  price         numeric     not null,
  image         text        not null default '',
  alt           text        not null default '',
  category      text        not null default '',
  stock         integer     not null default 0,
  description   text,
  benefit_points jsonb,
  ingredients   jsonb,
  usage_steps   jsonb,
  created_at    timestamptz not null default now()
);

-- Enable Row Level Security (recommended)
alter table public.products enable row level security;

-- Allow public read access (store visitors)
create policy "public_read" on public.products
  for select using (true);

-- Insert initial product data
insert into public.products (name, price, image, alt, category, stock) values
  ('Serum Iluminador',       42.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuB64h8uYsvpRJxvxj84lP0gY15xXANP9yOVR0AfJMeTUi_5Uge73fDjtSEq84K1WVjvlVuSFIa4A7mD10W0NhurrmyeXS_gbMLuMR0YjAIu8P7eI1IDMH4DVGdxblh2kK6HoTa1Cp_9PHHN4GE3U_0v3RxG7xsA04iTn-HTM8IwbINHF6EInde4mrB-k8xnA7bIlO9r5mPVVeXXoeuEz1glw1x3Ahli0kG9fHc8BBIEvwlp8btb2LyMkg', 'Close-up of a premium minimalist glass bottle with a white dropper', 'Skincare',          24),
  ('Bálsamo para Barba',     28.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBE2KhpEWcTeZKfJQdZCQdYMnyfQvmp058rYTzPPEUR4du4ImbC5xJnuwZ0bmSyX6Rhpp6USU8d6wRCRgvCz63ntG0uMmi7senQ0vrZ07j1tK-tBqR1JAbfyuqJ3jbCj4kvVupA7IgC-z3QOgm7XAY3JNB-o4xCRWWzSoQJs283aesGTQ_ECV6ZH9jVnEtRMLcGjv8fLgGirV_8QZpw4SYvkkCyLs6-Y6UIW_j0JU3itGdyZ0qduINcrg',  'Matte black tin of beard balm',                                      'Cuidado Masculino',  3),
  ('Vela Calma Profunda',    35.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvHMNebinBQ5Cz4bhbuizmSDe_mPK668h7wkD6y2eNaWfg_Ht_rhA6ChLMsT1hIEI5b16Z0XZMRlK1NSUNgPA_pXJeyj_akebcSJNF84lsKx0hKsL0ZIdCOYAvdzeZBUqTrxgRG5UTpaCJ2Ayi9a1O4BZEsLvtyPkipSvGhxlewGwJbhnKlYDo_2Mp89TiEfvv1s2uFZFYjcfRzoFckCJdmpnMZwKI2Zf_gMXXrHDB17yRUSvhYTtRIw',  'Minimalist scented candle in amber glass jar',                       'Aromas y Velas',    12),
  ('Hidratante Facial Hombre',32.00,'https://lh3.googleusercontent.com/aida-public/AB6AXuDtIfJmK0ZfURZsaCegYw_ijfx_oOR9toMYSgvG74Kmja5a8Pfee-IKZhfski2B22GeWqF1Pp-e_StLTqj8GpqcYBtkp4yTEc89-nQBgyha2UUl1_DCoSAsFI3AB74S02TFwdkOO3P3HEd_qJppBZmfYDtx5S8owaZrdN1TB5_8X0KJ3DWpsEZD8LN1VuBNfJ27KFdeT8cFYmtVr7xoB9SH_5tBumLtvuFiz_wgu6wumNjVXrOZrgqKjA', 'Minimalist dark blue tube of hydrating facial cream',                'Cuidado Masculino',  1),
  ('Crema Corporal Nutritiva',38.00,'https://lh3.googleusercontent.com/aida-public/AB6AXuCbxRbdQiW3RNA3i4WAH6leHH7gt5HqFjF8x2wpOIZtBapQbsEzTiUcr1Zkuw0o2iPIybWZQoMz2FyC9fpqPAxclEh_VGbZvHlk6lKnMPqg82oVzlMdEtgu37IXcSPkHJugEGVaC3GPOOn7cZbKmnPp93DBIK0sRSKuUANHWgXzIZSGmtm6iMtwMUEEYG99abkAWxP3XD61aYbRUsMxfj8W9SIpIjU3ZV61zQJw8w5kbCpRYqrM8j73kw',  'Crema corporal en tarro de vidrio',                                  'Cuidado Corporal',   8),
  ('Aceite Esencial Lavanda', 22.00,'https://lh3.googleusercontent.com/aida-public/AB6AXuCvHMNebinBQ5Cz4bhbuizmSDe_mPK668h7wkD6y2eNaWfg_Ht_rhA6ChLMsT1hIEI5b16Z0XZMRlK1NSUNgPA_pXJeyj_akebcSJNF84lsKx0hKsL0ZIdCOYAvdzeZBUqTrxgRG5UTpaCJ2Ayi9a1O4BZEsLvtyPkipSvGhxlewGwJbhnKlYDo_2Mp89TiEfvv1s2uFZFYjcfRzoFckCJdmpnMZwKI2Zf_gMXXrHDB17yRUSvhYTtRIw',  'Botella de aceite esencial',                                         'Aromas y Velas',    15),
  ('Exfoliante Facial Suave', 26.00,'https://lh3.googleusercontent.com/aida-public/AB6AXuB64h8uYsvpRJxvxj84lP0gY15xXANP9yOVR0AfJMeTUi_5Uge73fDjtSEq84K1WVjvlVuSFIa4A7mD10W0NhurrmyeXS_gbMLuMR0YjAIu8P7eI1IDMH4DVGdxblh2kK6HoTa1Cp_9PHHN4GE3U_0v3RxG7xsA04iTn-HTM8IwbINHF6EInde4mrB-k8xnA7bIlO9r5mPVVeXXoeuEz1glw1x3Ahli0kG9fHc8BBIEvwlp8btb2LyMkg', 'Tubo de exfoliante facial',                                          'Skincare',           9),
  ('Vitamina C + Zinc',       18.00,'https://lh3.googleusercontent.com/aida-public/AB6AXuDtIfJmK0ZfURZsaCegYw_ijfx_oOR9toMYSgvG74Kmja5a8Pfee-IKZhfski2B22GeWqF1Pp-e_StLTqj8GpqcYBtkp4yTEc89-nQBgyha2UUl1_DCoSAsFI3AB74S02TFwdkOO3P3HEd_qJppBZmfYDtx5S8owaZrdN1TB5_8X0KJ3DWpsEZD8LN1VuBNfJ27KFdeT8cFYmtVr7xoB9SH_5tBumLtvuFiz_wgu6wumNjVXrOZrgqKjA', 'Frasco de suplementos',                                              'Suplementos',       22);
