import React from 'react';
import { InfiniteVirtualizedList, ListItem } from '@liiist/ui';
import { createClient } from '@supabase/supabase-js';

// In a real app, instantiate this securely outside the component or use Supabase SSR package
const supabaseUrl = process.env.SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'mock-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function ListInfinitePage({ params }: { params: { id: string } }) {
  // 1. Initial Data Fetch (Server-Side)
  // Fetching the first 50 items for the specific list via the entity_relations graph
  const { data: initialData, count } = await supabase
    .from('entity_relations')
    .select(`
      target_id,
      metadata,
      entities!target_id (
        id,
        slug,
        base_metadata
      )
    `, { count: 'exact' })
    .eq('source_id', params.id)
    .eq('relation_type', 'IN_LIST')
    .range(0, 49);

  // Map to UI format
  const mappedInitial: ListItem[] = (initialData || []).map((row: any) => ({
    id: row.entities.id,
    slug: row.entities.slug,
    title: row.entities.base_metadata?.title || row.entities.slug,
    subtitle: row.metadata?.custom_subtitle || row.entities.base_metadata?.subtitle,
    cover_url: row.entities.base_metadata?.cover_url,
  }));

  const totalCount = count || 0;

  // 2. Server Action to fetch paginated chunks (Passed securely to Client Component)
  async function fetchNextPage(offset: number, limit: number): Promise<ListItem[]> {
    'use server';
    
    // In production, ensure auth validation here
    const { data } = await supabase
      .from('entity_relations')
      .select(`
        target_id,
        metadata,
        entities!target_id (
          id,
          slug,
          base_metadata
        )
      `)
      .eq('source_id', params.id)
      .eq('relation_type', 'IN_LIST')
      .range(offset, offset + limit - 1);

    return (data || []).map((row: any) => ({
      id: row.entities.id,
      slug: row.entities.slug,
      title: row.entities.base_metadata?.title || row.entities.slug,
      subtitle: row.metadata?.custom_subtitle || row.entities.base_metadata?.subtitle,
      cover_url: row.entities.base_metadata?.cover_url,
    }));
  }

  return (
    <main className="flex flex-col w-full h-screen overflow-hidden bg-white dark:bg-black">
      {/* Header Context */}
      <header className="w-full px-6 py-8 border-b border-neutral-200 dark:border-neutral-900 shrink-0 z-10 bg-white dark:bg-black">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">
          Infinite Liiist
        </span>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black dark:text-white mt-2">
          {params.id === 'movies' ? 'Top 100 Movies' : 'System Entities'}
        </h1>
      </header>

      {/* The high-performance virtualized column */}
      <InfiniteVirtualizedList 
        initialItems={mappedInitial}
        totalCount={totalCount}
        fetchNextPage={fetchNextPage}
      />
    </main>
  );
}
