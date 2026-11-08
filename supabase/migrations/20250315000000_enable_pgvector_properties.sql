-- Enable pgvector so PostgreSQL can store and compare embedding vectors.
-- Safe to re-run: IF NOT EXISTS avoids errors if the extension is already on.
-- Must run BEFORE any embedding vector(...) column is created.
CREATE EXTENSION IF NOT EXISTS vector;

-- PREIshare listings live on public.properties
-- (id uuid PRIMARY KEY, title text, description text, …)
-- from 20250321000000_sponsors_properties_rls.sql. This migration does not
-- DROP or recreate that table (would wipe sponsor rows and RLS).
--
-- Do not use CREATE TABLE IF NOT EXISTS properties here: this filename
-- timestamps before the sponsor table exists, and a thin CREATE would
-- block the later full table (owner_id, status, RLS).
--
-- embedding: one meaning-vector per listing, stored separately from the text.
-- Dimension 1536 matches docs/embedding-data-model.md. Do not change 1536
-- here without updating the data model, docs/pgvector-setup-plan.md, and
-- the TypeScript embedding helper in the same change.
-- Null is allowed until seed/backfill (insert-then-embed).
-- Ranking later uses cosine distance: embedding <=> query (smaller = closer).
-- No IVFFlat/HNSW index here — demo scale is a sequential scan
-- (docs/pgvector-setup-plan.md).

DO $$
BEGIN
  IF to_regclass('public.properties') IS NULL THEN
    RAISE NOTICE 'public.properties does not exist yet; 20250321000000_sponsors_properties_rls.sql will create it with embedding vector(1536).';
  ELSE
    ALTER TABLE public.properties
      ADD COLUMN IF NOT EXISTS embedding vector(1536);

    COMMENT ON TABLE public.properties IS
      'PREIshare investment listings; embedding powers semantic search.';
    COMMENT ON COLUMN public.properties.embedding IS
      'pgvector embedding of title + description; dimension 1536; null until backfill.';
  END IF;
END $$;
