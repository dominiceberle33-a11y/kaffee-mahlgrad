-- Mahlgrad Tracker – Supabase Schema
-- Führe dieses SQL im Supabase SQL Editor aus

CREATE TABLE IF NOT EXISTS coffees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  roaster TEXT,
  mahlgrad NUMERIC(4,1) NOT NULL CHECK (mahlgrad >= 1 AND mahlgrad <= 10),
  notizen TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index für Sortierung
CREATE INDEX IF NOT EXISTS coffees_updated_at_idx ON coffees (updated_at DESC);

-- Row Level Security aktivieren (optional aber empfohlen)
ALTER TABLE coffees ENABLE ROW LEVEL SECURITY;

-- Öffentlicher Zugriff (für einfachen Start ohne Auth)
CREATE POLICY "allow_all" ON coffees FOR ALL USING (true) WITH CHECK (true);
