import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Enforce Edge runtime for minimum latency
export const runtime = 'edge';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'mock-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    // 1. Generate Embedding from natural language query
    // In a real environment, this calls an LLM (e.g., text-embedding-ada-002 or Gemini)
    // const embedding = await generateEmbedding(query);
    const mockEmbedding = new Array(1536).fill(0).map(() => Math.random());

    // 2. Query Supabase pgvector using the matched embedding
    // We assume an RPC function `match_entities` exists that returns semantic matches
    const { data: entities, error } = await supabase.rpc('match_entities', {
      query_embedding: mockEmbedding,
      match_threshold: 0.7,
      match_count: 5, // Return top 5 most semantically relevant entities
    });

    if (error) {
      console.error('Supabase pgvector error:', error);
      throw error;
    }

    // Map the DB results to the UI SearchResult format
    const results = (entities || []).map((entity: any) => ({
      id: entity.id,
      slug: entity.slug,
      type: entity.type,
      title: entity.base_metadata?.title || entity.slug,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { error: 'Failed to execute semantic search' },
      { status: 500 }
    );
  }
}
