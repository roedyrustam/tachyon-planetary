-- ============================================================
-- StreamPulse: Additional Schema Migration
-- Adds missing columns and the chat_messages table
-- ============================================================

-- 1. Extend Profiles with Live Status
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_live BOOLEAN DEFAULT false;

-- 2. Create Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    display_name TEXT NOT NULL,
    text TEXT NOT NULL,
    platform TEXT NOT NULL,
    is_super_chat BOOLEAN DEFAULT false,
    amount TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 4. Permissions
-- Anyone can read chat messages (publicly visible streams)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view chat messages' AND tablename = 'chat_messages') THEN
    CREATE POLICY "Anyone can view chat messages" ON public.chat_messages FOR SELECT USING (true);
  END IF;
END $$;

-- Authenticated users can insert messages
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can post messages' AND tablename = 'chat_messages') THEN
    CREATE POLICY "Authenticated users can post messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

-- Users can delete their own messages
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own messages' AND tablename = 'chat_messages') THEN
    CREATE POLICY "Users can delete own messages" ON public.chat_messages FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- 5. Performance Index
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at DESC);

-- ============================================================
-- Migration Complete! ✅
-- ============================================================
