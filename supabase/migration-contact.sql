-- ============================================
-- 99DH STORE - MIGRATION CONTACT MESSAGES
-- Rejouable sur une base Supabase existante
-- ============================================

-- Table
create table if not exists public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz default now()
);

-- RLS
alter table public.contact_messages enable row level security;

-- Public insert policy
drop policy if exists "Public insert contact_messages" on public.contact_messages;
create policy "Public insert contact_messages" on public.contact_messages for insert with check (true);

-- Admin read policy
drop policy if exists "Admin read contact_messages" on public.contact_messages;
create policy "Admin read contact_messages" on public.contact_messages for select
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Admin update policy (marquer lu/non lu)
drop policy if exists "Admin update contact_messages" on public.contact_messages;
create policy "Admin update contact_messages" on public.contact_messages for update
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
