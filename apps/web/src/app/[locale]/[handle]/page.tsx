import React from 'react';
import { notFound } from 'next/navigation';
import { ProfileTabs } from '@liiist/ui';
import { createClient } from '@supabase/supabase-js';

// In a real app, use the Supabase SSR client with proper env vars
const supabaseUrl = process.env.SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'mock-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function UserProfilePage({ params }: { params: { handle: string } }) {
  // Strip the '@' if the user navigated to /@kamiloo
  const rawHandle = params.handle;
  const handle = rawHandle.startsWith('@') ? rawHandle.slice(1) : rawHandle;

  // 1. Secure Server-side Data Fetching
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('handle', handle)
    .single();

  // Mocking profile for dev environment if Supabase isn't seeded
  const mockProfile = {
    handle: handle,
    display_name: 'Kamiloo Artmand',
    bio: 'Architecting the Cosmos. Building Liiist.',
    avatar_url: 'https://github.com/KamilooArtmand.png',
    cover_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
  };

  const currentProfile = profile || mockProfile;

  if (error && !profile && process.env.NODE_ENV === 'production') {
    notFound();
  }

  return (
    <main className="flex flex-col w-full min-h-screen bg-[var(--color-bg-primary)]">
      
      {/* 2. Responsive Cover Image (16:9 -> 3:1) */}
      <div className="relative w-full aspect-[16/9] md:aspect-[3/1] bg-[var(--color-bg-tertiary)] overflow-hidden">
        {currentProfile.cover_url && (
          <img 
            src={currentProfile.cover_url} 
            alt={`@${currentProfile.handle}'s cover`}
            className="w-full h-full object-cover opacity-80"
          />
        )}
      </div>

      {/* 3. Sticky Profile Header & Overhanging Avatar */}
      <div className="max-w-5xl mx-auto w-full px-4 md:px-8 relative">
        
        <div className="flex justify-between items-end -mt-16 md:-mt-24 mb-4">
          {/* Overhanging Circular Avatar */}
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-[var(--color-bg-primary)] bg-[var(--color-bg-secondary)] overflow-hidden shadow-none z-10">
            {currentProfile.avatar_url ? (
              <img 
                src={currentProfile.avatar_url} 
                alt={currentProfile.display_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] text-4xl font-bold">
                {currentProfile.handle.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Action Buttons (Follow/Edit) */}
          <div className="flex gap-4 z-10 pb-4">
            <button className="px-6 py-2 bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] font-bold text-xs uppercase tracking-widest rounded-full hover:opacity-90 transition-opacity">
              Follow
            </button>
          </div>
        </div>

        {/* Identity Details */}
        <div className="flex flex-col mt-4">
          <h1 className="text-3xl md:text-5xl font-black text-[var(--color-text-primary)] tracking-[var(--tracking-editorial-tighter)]">
            {currentProfile.display_name}
          </h1>
          <h2 className="text-lg md:text-xl font-mono text-[var(--color-text-tertiary)] mt-1">
            @{currentProfile.handle}
          </h2>
          
          {currentProfile.bio && (
            <p className="mt-6 text-[var(--color-text-secondary)] font-serif text-lg leading-[var(--leading-editorial-relaxed)] max-w-2xl">
              {currentProfile.bio}
            </p>
          )}
        </div>
      </div>

      {/* 4. Tabbed Navigation System */}
      <ProfileTabs />

      {/* Content Area (Placeholder for actual lists) */}
      <div className="max-w-5xl mx-auto w-full px-4 md:px-8 py-12">
        <div className="w-full h-64 border border-[var(--color-border-subtle)] rounded-2xl border-dashed flex items-center justify-center">
          <span className="text-[var(--color-text-tertiary)] font-mono text-xs uppercase tracking-widest">
            Collection data will render here
          </span>
        </div>
      </div>
    </main>
  );
}
