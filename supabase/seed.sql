insert into public.categories (name, slug, icon) values
  ('Electronique', 'electronique', 'Smartphone'),
  ('Maison', 'maison', 'Home'),
  ('Beaute', 'beaute', 'Sparkles'),
  ('Mode', 'mode', 'Shirt'),
  ('Cuisine', 'cuisine', 'Utensils'),
  ('Gadgets', 'gadgets', 'Zap'),
  ('Accessoires', 'accessoires', 'Watch')
on conflict (slug) do nothing;

with inserted as (
  insert into public.products (
    name, description, category_id, images, specs, rating, reviews_count, stock, is_flash_sale, flash_sale_end
  )
  select
    'Ecouteurs Bluetooth Mini',
    'Son clair, boitier compact et autonomie longue duree.',
    c.id,
    array['https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80'],
    '[{"label":"Autonomie","value":"Jusqu a 6h"}]'::jsonb,
    4.8,
    238,
    42,
    true,
    now() + interval '8 hours'
  from public.categories c
  where c.slug = 'electronique'
    and not exists (select 1 from public.products p where p.name = 'Ecouteurs Bluetooth Mini')
  returning id, images
)
insert into public.product_images (product_id, image_url, position)
select id, images[1], 0 from inserted
on conflict do nothing;

with inserted as (
  insert into public.products (
    name, description, category_id, images, specs, rating, reviews_count, stock, is_flash_sale, flash_sale_end
  )
  select
    'Organisateur de Cuisine',
    'Rangement modulable pour epices, bocaux et accessoires.',
    c.id,
    array['https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80'],
    '[{"label":"Matiere","value":"Plastique renforce"}]'::jsonb,
    4.7,
    184,
    78,
    true,
    now() + interval '8 hours'
  from public.categories c
  where c.slug = 'cuisine'
    and not exists (select 1 from public.products p where p.name = 'Organisateur de Cuisine')
  returning id, images
)
insert into public.product_images (product_id, image_url, position)
select id, images[1], 0 from inserted
on conflict do nothing;

insert into public.testimonials (name, city, message, rating)
select 'Sara El Amrani', 'Casablanca', 'Commande recue le lendemain, prix clair et produits tres corrects.', 5
where not exists (select 1 from public.testimonials where name = 'Sara El Amrani');

insert into public.testimonials (name, city, message, rating)
select 'Yassine Berrada', 'Rabat', 'J aime le concept du prix unique, ca rend l achat rapide.', 5
where not exists (select 1 from public.testimonials where name = 'Yassine Berrada');

insert into public.testimonials (name, city, message, rating)
select 'Imane Zahraoui', 'Marrakech', 'Le paiement a la livraison m a rassuree pour ma premiere commande.', 5
where not exists (select 1 from public.testimonials where name = 'Imane Zahraoui');
