-- ============================================================
-- StreamPulse: Complete Database Migration
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- ============================
-- 1. TABLE DEFINITIONS
-- ============================

-- User Profiles (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    display_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    default_title TEXT,
    stream_category TEXT,
    streaming_quality TEXT DEFAULT '1080p 60fps (Recommended)',
    latency_mode TEXT DEFAULT 'Low',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Streaming Destinations (RTMP targets)
CREATE TABLE IF NOT EXISTS public.destinations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    platform TEXT NOT NULL,
    stream_key TEXT,
    active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Broadcast Schedules
CREATE TABLE IF NOT EXISTS public.schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    duration TEXT,
    platforms TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media Library (Videos)
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    url TEXT,
    thumbnail TEXT,
    duration TEXT DEFAULT '00:00:00',
    views TEXT DEFAULT '0',
    size TEXT,
    date TEXT DEFAULT 'Just now',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================
-- 2. ROW LEVEL SECURITY (RLS)
-- ============================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- ============================
-- 3. SECURITY POLICIES
-- ============================

-- Profiles: Users can read/update/insert only their own profile
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own profile' AND tablename = 'profiles') THEN
    CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile' AND tablename = 'profiles') THEN
    CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own profile' AND tablename = 'profiles') THEN
    CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Destinations: Full CRUD for own data
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own destinations' AND tablename = 'destinations') THEN
    CREATE POLICY "Users can manage own destinations" ON public.destinations
      FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Schedules: Full CRUD for own data
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own schedules' AND tablename = 'schedules') THEN
    CREATE POLICY "Users can manage own schedules" ON public.schedules
      FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Videos: Full CRUD for own data
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own videos' AND tablename = 'videos') THEN
    CREATE POLICY "Users can manage own videos" ON public.videos
      FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- ============================
-- 4. AUTH TRIGGER
-- ============================
-- Auto-create a profile when a new user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'display_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================
-- 5. PERFORMANCE INDEXES
-- ============================

CREATE INDEX IF NOT EXISTS idx_destinations_user_id ON public.destinations(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON public.schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON public.videos(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_date_time ON public.schedules(date, time);

-- ============================================================
-- Migration Complete! ✅
-- ============================================================
