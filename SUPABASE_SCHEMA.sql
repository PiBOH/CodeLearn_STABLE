-- ─────────────────────────────────────────────────────────────────────────────
-- SUPABASE_SCHEMA.sql
-- CodeLearn v1.1.0a - The Synch Update
--
-- Istruzioni:
--   1. Vai su https://supabase.com → il tuo progetto
--   2. Apri "SQL Editor"
--   3. Incolla ed esegui questo script
--   4. Vai su "Settings → API" e copia:
--        - Project URL  → VITE_SUPABASE_URL nel tuo .env
--        - anon key     → VITE_SUPABASE_ANON_KEY nel tuo .env
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Estensione UUID ───────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Tabella utenti ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  username      TEXT          NOT NULL,
  last_version  TEXT          NOT NULL DEFAULT '1.1.0a',
  platform      TEXT          NOT NULL DEFAULT 'Web',
  device_info   TEXT          NOT NULL DEFAULT '',
  progress_data JSONB         NOT NULL DEFAULT '{
    "completedLessons": [],
    "xp": 0,
    "level": 1,
    "streak": 0,
    "badges": [],
    "courseProgress": {},
    "startedCourses": []
  }'::jsonb,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── Indici ────────────────────────────────────────────────────────────────────

-- Ricerca per nome (usato per i suggerimenti in tempo reale)
CREATE INDEX IF NOT EXISTS idx_users_username
  ON public.users USING btree (lower(username) text_pattern_ops);

-- Ricerca per ID (usato per update)
CREATE INDEX IF NOT EXISTS idx_users_id
  ON public.users (id);

-- ── Trigger: aggiorna updated_at automaticamente ──────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Row Level Security (RLS) ──────────────────────────────────────────────────
-- L'app usa la anon key: permettiamo SELECT/INSERT/UPDATE senza autenticazione.
-- Questo è accettabile per un'app educativa con dati non sensibili.
-- Per una produzione con dati sensibili, usare l'autenticazione Supabase Auth.

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Chiunque può leggere (per i suggerimenti nomi)
DROP POLICY IF EXISTS "users_select_public"  ON public.users;
CREATE POLICY "users_select_public"
  ON public.users FOR SELECT USING (true);

-- Chiunque può creare un nuovo utente
DROP POLICY IF EXISTS "users_insert_public"  ON public.users;
CREATE POLICY "users_insert_public"
  ON public.users FOR INSERT WITH CHECK (true);

-- Chiunque può aggiornare (i progressi vengono mandati con l'ID utente)
DROP POLICY IF EXISTS "users_update_public"  ON public.users;
CREATE POLICY "users_update_public"
  ON public.users FOR UPDATE USING (true);

-- ── Dati di esempio (opzionale, utile per test) ───────────────────────────────
/*
INSERT INTO public.users (username, last_version, platform, device_info, progress_data)
VALUES
  ('PiBOH',   '1.1.0a', 'PC Windows',  'Windows 11 — Chrome',
   '{"completedLessons":["py-1","py-2"],"xp":50,"level":1,"streak":3,"badges":["first-step","explorer"],"courseProgress":{"python":2},"startedCourses":["python"]}'),
  ('TestUser', '1.0.2j-3', 'Android APK', 'Samsung Galaxy S21',
   '{"completedLessons":["py-1"],"xp":25,"level":1,"streak":1,"badges":["first-step"],"courseProgress":{"python":1},"startedCourses":["python"]}');
*/

-- ── Vista pubblica (opzionale) ────────────────────────────────────────────────
-- Comoda per la leaderboard o statistiche aggregate
CREATE OR REPLACE VIEW public.users_public AS
  SELECT id, username, last_version, platform,
         (progress_data->>'xp')::int    AS xp,
         (progress_data->>'level')::int AS level,
         jsonb_array_length(progress_data->'completedLessons') AS lessons_done,
         created_at, updated_at
  FROM public.users;

-- ─────────────────────────────────────────────────────────────────────────────
-- Struttura JSON di progress_data (riferimento):
-- {
--   "completedLessons": ["py-1", "py-2", ...],   -- array di lessonId
--   "xp":             150,                        -- punti XP totali
--   "level":          2,                          -- livello corrente
--   "streak":         5,                          -- giorni consecutivi
--   "badges":         ["first-step", "coder"],    -- badge sbloccati
--   "courseProgress": { "python": 3, "js": 1 },  -- lezioni per corso
--   "startedCourses": ["python", "js"]            -- corsi iniziati
-- }
-- ─────────────────────────────────────────────────────────────────────────────
