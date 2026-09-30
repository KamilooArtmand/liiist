-- Supabase RPC function for semantic matching
CREATE OR REPLACE FUNCTION match_entities(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  slug text,
  type text,
  base_metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.slug,
    e.type,
    e.base_metadata,
    1 - (e.embedding <=> query_embedding) AS similarity
  FROM entities e
  WHERE 1 - (e.embedding <=> query_embedding) > match_threshold
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
