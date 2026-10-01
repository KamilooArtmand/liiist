import React, { useState } from 'react';
import { Film, ChevronRight, Search } from 'lucide-react';
import { MOVIES_100 } from '../data/data-moviesData';
import { ListItem } from '../types/types-index';

interface MoviesDirectoryPageProps {
  onBack: () => void;
  onSelectMovie: (movie: ListItem) => void;
}

export const MoviesDirectoryPage: React.FC<MoviesDirectoryPageProps> = ({ onBack, onSelectMovie }) => {
  const [query, setQuery] = useState('');

  const filteredMovies = MOVIES_100.filter(m => 
    m.title.toLowerCase().includes(query.toLowerCase()) ||
    m.director?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-start px-4 sm:px-6 lg:px-12 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="w-full max-w-7xl flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200 dark:border-neutral-900">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tighter uppercase">
              Cinema
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 font-serif italic mt-2 text-lg">
              The Encyclopedia of Moving Pictures
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search movies, directors..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-medium focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors"
              />
            </div>
            <div className="shrink-0 px-4 py-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center gap-2">
              <Film className="w-4 h-4 text-neutral-500" />
              <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white">{MOVIES_100.length}</span>
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMovies.map((movie, idx) => (
            <button
              key={movie.id}
              onClick={() => onSelectMovie(movie as unknown as ListItem)}
              className="group flex flex-col text-left bg-white dark:bg-[#050505] border border-neutral-200 dark:border-neutral-900 rounded-2xl overflow-hidden hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-500 cursor-pointer"
            >
              <div className="w-full aspect-[16/9] bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center relative grayscale group-hover:grayscale-0 transition-all duration-700">
                <span className="text-5xl font-black text-neutral-300 dark:text-neutral-800 tracking-tighter mix-blend-multiply dark:mix-blend-screen opacity-50">
                  {movie.year}
                </span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="p-5 flex flex-col gap-1 relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-neutral-400">
                    {String(idx + 1).padStart(3, '0')}
                  </span>
                  <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                    {movie.runtime}
                  </span>
                </div>
                
                <h3 className="text-lg font-black text-neutral-900 dark:text-white uppercase tracking-tight mt-1 truncate">
                  {movie.title}
                </h3>
                
                <p className="text-sm font-serif text-neutral-500 dark:text-neutral-400 truncate">
                  <span className="text-[9px] uppercase font-sans font-bold tracking-widest mr-2">DIR</span>
                  {movie.director}
                </p>

                <div className="absolute right-5 bottom-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <ChevronRight className="w-5 h-5 text-neutral-900 dark:text-white" />
                </div>
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
