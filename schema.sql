-- CareLens Health Awareness System - Supabase Database Schema
-- Run this schema in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Users Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  age INTEGER,
  blood_group TEXT,
  allergies TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS (Row Level Security) on users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view their own profile" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Allow system to insert profiles" 
  ON public.users FOR INSERT 
  WITH CHECK (true); -- Service role and public inserts during sign up


-- 2. Symptoms & AI Triage History
CREATE TABLE IF NOT EXISTS public.symptoms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symptoms TEXT NOT NULL,
  prediction TEXT,
  severity TEXT,
  recommendations JSONB,
  awareness_tips TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.symptoms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view their own symptom predictions" 
  ON public.symptoms FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own symptom predictions" 
  ON public.symptoms FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own symptom predictions"
  ON public.symptoms FOR DELETE
  USING (auth.uid() = user_id);


-- 3. Medical / Lab Reports OCR History
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT,
  file_url TEXT,
  extracted_text TEXT,
  analysis_summary TEXT,
  markers TEXT,
  abnormalities TEXT,
  suggestions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view their own reports" 
  ON public.reports FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own reports" 
  ON public.reports FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own reports" 
  ON public.reports FOR DELETE 
  USING (auth.uid() = user_id);


-- 4. Medication Reminders
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  medicine_name TEXT NOT NULL,
  dosage TEXT,
  reminder_time TEXT NOT NULL, -- Format e.g., "08:00 AM" or "20:00"
  frequency TEXT DEFAULT 'daily',
  notes TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view their own reminders" 
  ON public.reminders FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own reminders" 
  ON public.reminders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own reminders" 
  ON public.reminders FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own reminders" 
  ON public.reminders FOR DELETE 
  USING (auth.uid() = user_id);


-- 5. Emergency Contacts
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  contact_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  relation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view their own emergency contacts" 
  ON public.emergency_contacts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own emergency contacts" 
  ON public.emergency_contacts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own emergency contacts" 
  ON public.emergency_contacts FOR DELETE 
  USING (auth.uid() = user_id);


-- 6. SOS Events log
CREATE TABLE IF NOT EXISTS public.sos_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  message TEXT DEFAULT 'SOS triggered.',
  contacts_notified INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.sos_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view their own SOS events" 
  ON public.sos_events FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own SOS events" 
  ON public.sos_events FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
