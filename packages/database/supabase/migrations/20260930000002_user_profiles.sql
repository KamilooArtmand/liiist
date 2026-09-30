-- ==============================================================================
-- USER PROFILES & IDENTITY SYSTEM
-- ==============================================================================

-- 1. Profiles Table
-- Stores public user information and the unique @handle mapping
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    handle TEXT UNIQUE NOT NULL CHECK (handle ~ '^[a-zA-Z0-9_]{3,20}$'), -- Alphanumeric and underscores only, 3-20 chars
    display_name TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    cover_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optimize routing lookups for app/[handle]
CREATE INDEX profiles_handle_idx ON public.profiles (handle);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles are publically viewable by anyone
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.profiles FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can insert their own profile." 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ==============================================================================
-- SUPABASE STORAGE BUCKETS
-- ==============================================================================

-- Insert buckets for avatars and covers (requires storage schema access)
-- Note: In a real Supabase setup, this assumes storage.buckets exists.
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true) ON CONFLICT DO NOTHING;

-- RLS for Avatars
CREATE POLICY "Avatar images are publicly accessible." 
ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload an avatar." 
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- RLS for Covers
CREATE POLICY "Cover images are publicly accessible." 
ON storage.objects FOR SELECT USING (bucket_id = 'covers');

CREATE POLICY "Anyone can upload a cover." 
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'covers' AND auth.role() = 'authenticated');
