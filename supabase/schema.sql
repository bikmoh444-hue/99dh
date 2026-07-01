-- ============================================
-- 99DH STORE - MIGRATION GLOBALE COMPLETE
-- Rejouable sur une base Supabase vide ou existante
-- ============================================

create extension if not exists "uuid-ossp";
create extension if not exists pg_trgm;

-- Categories
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  icon text,
  created_at timestamptz default now()
);

-- Products
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  price numeric(10,2) not null default 99.00,
  images text[] default '{}',
  specs jsonb default '[]',
  rating numeric(2,1) default 0,
  reviews_count integer default 0,
  stock integer default 100,
  is_flash_sale boolean default false,
  flash_sale_end timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.products add column if not exists images text[] default '{}';
alter table public.products add column if not exists specs jsonb default '[]';
alter table public.products add column if not exists rating numeric(2,1) default 0;
alter table public.products add column if not exists reviews_count integer default 0;
alter table public.products add column if not exists stock integer default 100;
alter table public.products add column if not exists is_flash_sale boolean default false;
alter table public.products add column if not exists flash_sale_end timestamptz;
alter table public.products add column if not exists is_active boolean default true;

-- Product images, ordered gallery
create table if not exists public.product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references public.products(id) on delete cascade,
  image_url text not null,
  position integer default 0,
  created_at timestamptz default now()
);

-- Customers, no login required
create table if not exists public.customers (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  phone text not null,
  city text not null,
  address text not null,
  created_at timestamptz default now()
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_number serial unique,
  customer_id uuid references public.customers(id) on delete cascade,
  full_name text not null,
  phone text not null,
  city text not null,
  address text not null,
  total_amount numeric(10,2) not null default 0,
  subtotal numeric default 0,
  shipping_fee numeric default 35,
  total numeric default 0,
  status text not null default 'en_attente'
    check (status in ('en_attente', 'en_cours', 'livree', 'annulee')),
  admin_note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.orders add column if not exists subtotal numeric default 0;
alter table public.orders add column if not exists shipping_fee numeric default 35;
alter table public.orders add column if not exists total numeric default 0;
alter table public.orders add column if not exists admin_note text;

-- Order items
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(10,2) not null default 99.00,
  subtotal numeric(10,2) not null,
  created_at timestamptz default now()
);

-- Product reviews
create table if not exists public.product_reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references public.products(id) on delete cascade,
  customer_name text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

-- Homepage testimonials
create table if not exists public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  name text,
  city text,
  message text,
  rating numeric default 5,
  avatar_url text,
  is_published boolean default true,
  created_at timestamptz default now()
);

alter table public.testimonials add column if not exists name text;
alter table public.testimonials add column if not exists city text;
alter table public.testimonials add column if not exists message text;
alter table public.testimonials add column if not exists rating numeric default 5;
alter table public.testimonials add column if not exists avatar_url text;
alter table public.testimonials add column if not exists is_published boolean default true;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'testimonials'
      and column_name = 'customer_name'
  ) then
    execute 'alter table public.testimonials alter column customer_name drop not null';
    execute 'update public.testimonials set name = customer_name where name is null';
  end if;
end $$;

-- Newsletter
create table if not exists public.newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  subscribed_at timestamptz default now()
);

-- Admin users, auth only for admin
create table if not exists public.admin_users (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  full_name text,
  role text default 'admin',
  created_at timestamptz default now()
);

-- Store settings, single row
create table if not exists public.site_settings (
  id int primary key default 1,
  shipping_fee numeric not null default 35,
  whatsapp_number text default '',
  phone_number text default '',
  contact_email text default 'contact@99dh.store',
  instagram_url text default '',
  facebook_url text default '',
  whatsapp_message text default 'Bonjour, j''ai une question sur un produit 99 DH Store.',
  show_testimonials boolean not null default true,
  constraint single_row check (id = 1)
);

insert into public.site_settings (id) values (1)
on conflict (id) do nothing;

-- updated_at trigger
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.orders;
create trigger set_updated_at
before update on public.orders
for each row execute function public.update_updated_at_column();

-- Search index
create index if not exists idx_products_name_trgm
on public.products using gin (name gin_trgm_ops);

-- RLS
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.product_reviews enable row level security;
alter table public.testimonials enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;

-- Public read policies
drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories" on public.categories for select using (true);

drop policy if exists "Public read products" on public.products;
create policy "Public read products" on public.products for select using (is_active = true);

drop policy if exists "Public read product_images" on public.product_images;
create policy "Public read product_images" on public.product_images for select using (true);

drop policy if exists "Public read reviews" on public.product_reviews;
create policy "Public read reviews" on public.product_reviews for select using (true);

drop policy if exists "Public read testimonials" on public.testimonials;
create policy "Public read testimonials" on public.testimonials for select using (coalesce(is_published, true) = true);

drop policy if exists "Public read site_settings" on public.site_settings;
create policy "Public read site_settings" on public.site_settings for select using (true);

-- Public checkout insert policies
drop policy if exists "Public insert customers" on public.customers;
create policy "Public insert customers" on public.customers for insert with check (true);

drop policy if exists "Public insert orders" on public.orders;
create policy "Public insert orders" on public.orders for insert with check (true);

drop policy if exists "Public insert order_items" on public.order_items;
create policy "Public insert order_items" on public.order_items for insert with check (true);

drop policy if exists "Public newsletter insert" on public.newsletter_subscribers;
create policy "Public newsletter insert" on public.newsletter_subscribers for insert with check (true);

-- Admin policies
drop policy if exists "Admin read admin users" on public.admin_users;
create policy "Admin read admin users" on public.admin_users for select
  using (user_id = auth.uid());

drop policy if exists "Admin full access categories" on public.categories;
create policy "Admin full access categories" on public.categories for all
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admin full access products" on public.products;
create policy "Admin full access products" on public.products for all
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admin manage product_images" on public.product_images;
create policy "Admin manage product_images" on public.product_images for all
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admin full access orders" on public.orders;
create policy "Admin full access orders" on public.orders for all
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admin full access order_items" on public.order_items;
create policy "Admin full access order_items" on public.order_items for all
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admin full access customers" on public.customers;
create policy "Admin full access customers" on public.customers for all
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admin full access reviews" on public.product_reviews;
create policy "Admin full access reviews" on public.product_reviews for all
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admin manage testimonials" on public.testimonials;
create policy "Admin manage testimonials" on public.testimonials for all
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admin manage site_settings" on public.site_settings;
create policy "Admin manage site_settings" on public.site_settings for all
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Realtime orders, idempotent
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'orders'
  ) then
    execute 'alter publication supabase_realtime add table public.orders';
  end if;
end $$;

-- Storage bucket
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read product-images bucket" on storage.objects;
create policy "Public read product-images bucket"
  on storage.objects for select using (bucket_id = 'product-images');

drop policy if exists "Admin upload product-images" on storage.objects;
create policy "Admin upload product-images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and exists (select 1 from public.admin_users where user_id = auth.uid())
  );

drop policy if exists "Admin delete product-images" on storage.objects;
create policy "Admin delete product-images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.admin_users where user_id = auth.uid())
  );

drop policy if exists "Admin update product-images" on storage.objects;
create policy "Admin update product-images"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.admin_users where user_id = auth.uid())
  );
