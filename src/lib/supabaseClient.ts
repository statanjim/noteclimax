import { createClient } from '@supabase/supabase-js';
import { Book, Purchase, UserProfile } from '../types';

// Admin Email configuration from environment variable
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'ADMIN_EMAIL_TO_REPLACE@gmail.com';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase-project') &&
  !supabaseAnonKey.includes('your-supabase-anon-key')
);

// Fallback dummy client if credentials aren't provided yet
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

// --- LOCAL STORAGE PERSISTENCE ENGINE FOR PREVIEW/FALLBACK MODE ---
const STORAGE_KEYS = {
  BOOKS: 'noteclimax_books_v1',
  PURCHASES: 'noteclimax_purchases_v1',
  PROFILES: 'noteclimax_profiles_v1',
  CURRENT_USER: 'noteclimax_user_v1',
};

// Initial state starts empty as requested ("Website starts completely empty. No mock data.")
// Unless admin uploads notes via Admin Panel.
export const getStoredBooks = (): Book[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveStoredBooks = (books: Book[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  } catch (e) {
    console.error('Failed to save books to local storage:', e);
  }
};

export const getStoredPurchases = (): Purchase[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PURCHASES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveStoredPurchases = (purchases: Purchase[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
  } catch (e) {
    console.error('Failed to save purchases:', e);
  }
};

export const getStoredUser = (): { email: string; full_name?: string; role?: string } | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveStoredUser = (user: { email: string; full_name?: string; role?: string } | null) => {
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } else {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }
};

// Helper function to check if an email is authorized as Admin
export const checkIsAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const targetEmail = ADMIN_EMAIL.trim().toLowerCase();
  const currentEmail = email.trim().toLowerCase();
  return currentEmail === targetEmail;
};

// SQL Schema for Supabase setup documentation
export const SUPABASE_SQL_SETUP = `-- NoteClimax Supabase Schema Setup Script
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- 1. Create Books Table
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  class_level integer not null,
  class_label text not null,
  subject text not null,
  chapter text,
  description text,
  content_html text not null,
  price integer default 0,
  is_free boolean default true,
  is_featured boolean default false,
  pdf_url text,
  thumbnail_url text,
  views integer default 0,
  created_at timestamptz default now()
);

-- 2. Create Profiles Table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text default 'student',
  created_at timestamptz default now()
);

-- 3. Create Purchases Table
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  book_id uuid references public.books(id) on delete cascade,
  amount integer not null,
  trx_id text not null,
  created_at timestamptz default now()
);

-- 4. Enable Row Level Security (RLS)
alter table public.books enable row level security;
alter table public.profiles enable row level security;
alter table public.purchases enable row level security;

-- 5. RLS Policies for Books Table
-- Anyone can view notes
create policy "Books are viewable by everyone" 
  on public.books for select using (true);

-- Only Admin Email can insert books
create policy "Only admin can insert books" 
  on public.books for insert 
  with check (auth.jwt() ->> 'email' = '${ADMIN_EMAIL}');

-- Only Admin Email can update books
create policy "Only admin can update books" 
  on public.books for update 
  using (auth.jwt() ->> 'email' = '${ADMIN_EMAIL}');

-- Only Admin Email can delete books
create policy "Only admin can delete books" 
  on public.books for delete 
  using (auth.jwt() ->> 'email' = '${ADMIN_EMAIL}');

-- 6. RLS Policies for Profiles & Purchases
create policy "Profiles are viewable by owner and admin" 
  on public.profiles for select 
  using (auth.uid() = id or auth.jwt() ->> 'email' = '${ADMIN_EMAIL}');

create policy "Users can update own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

create policy "Purchases viewable by owner or admin" 
  on public.purchases for select 
  using (auth.uid() = user_id or auth.jwt() ->> 'email' = '${ADMIN_EMAIL}');

create policy "Users can insert own purchases" 
  on public.purchases for insert 
  with check (auth.uid() = user_id);

-- 7. Storage Bucket Setup
-- Create public buckets 'notes-pdf' and 'note-thumbnails' in Supabase Storage
insert into storage.buckets (id, name, public) values ('notes-pdf', 'notes-pdf', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('note-thumbnails', 'note-thumbnails', true) on conflict do nothing;

-- Storage Policies for Public Reading and Admin Uploading
create policy "Public Access PDF" on storage.objects for select using (bucket_id = 'notes-pdf');
create policy "Public Access Thumbnails" on storage.objects for select using (bucket_id = 'note-thumbnails');
create policy "Public Insert PDF" on storage.objects for insert with check (bucket_id = 'notes-pdf');
create policy "Public Insert Thumbnails" on storage.objects for insert with check (bucket_id = 'note-thumbnails');
`;
