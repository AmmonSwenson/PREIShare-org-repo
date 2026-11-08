-- Rank PREIshare properties by meaning-nearness to a query embedding.
-- Dimension 1536 matches properties.embedding and src/lib/embeddings/types.ts.
--
-- Operator: <=> is pgvector cosine DISTANCE (smaller = closer / better).
-- Returned column is similarity = 1 - distance (HIGHER = closer / better).
-- ORDER BY uses raw <=> so best matches come first. Do not ORDER BY similarity
-- unless you also DESC — mixing those is the classic inverted-ranking bug.
--
-- Null embeddings are skipped (not searchable until seed/backfill).
-- SECURITY INVOKER: caller’s privileges + RLS still apply.
-- Top-K default 5 (docs/vector-search-learner-notes.md).

create or replace function public.match_properties(
  query_embedding vector(1536),
  match_count int default 5
)
returns table (
  id uuid,
  title text,
  description text,
  city text,
  similarity float
)
language plpgsql
stable
security invoker
set search_path = public
as $$
begin
  return query
  select
    p.id,
    p.title,
    p.description,
    p.city,
    (1 - (p.embedding <=> query_embedding))::float as similarity
  from public.properties p
  where p.embedding is not null
  order by p.embedding <=> query_embedding
  limit greatest(coalesce(match_count, 5), 1);
end;
$$;

comment on function public.match_properties(vector, int) is
  'Semantic search: cosine distance <=> (lower better); returns similarity 1-distance (higher better), best first.';

grant execute on function public.match_properties(vector(1536), int) to authenticated;
grant execute on function public.match_properties(vector(1536), int) to service_role;
