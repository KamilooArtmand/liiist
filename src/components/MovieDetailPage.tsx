import React, { useEffect } from 'react';
import { ListItem } from '../types';
import { ArrowLeft, Play, Star, Image as ImageIcon } from 'lucide-react';

interface MovieDetailPageProps {
  movie: ListItem;
  onBack: () => void;
}

export const MovieDetailPage: React.FC<MovieDetailPageProps> = ({ movie, onBack }) => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [movie]);

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-start bg-white dark:bg-[#050505] animate-in fade-in duration-700">
      
      {/* Editorial Hero */}
      <div className="w-full max-w-7xl px-6 md:px-12 py-12 md:py-24 relative">
        <button 
          onClick={onBack}
          className="absolute top-8 left-6 md:left-12 w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-24 mt-12">
          
          {/* Left Column: Poster Placeholder */}
          <div className="shrink-0 w-full md:w-80 aspect-[2/3] bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center grayscale">
             <span className="text-8xl font-black text-neutral-300 dark:text-neutral-700 tracking-tighter">
                {movie.year}
             </span>
          </div>

          {/* Right Column: Data */}
          <div className="flex-1 flex flex-col justify-center">
            
            <div className="flex items-center gap-4 mb-6 text-xs font-mono font-bold uppercase tracking-widest text-neutral-500">
              <span>{movie.year}</span>
              <div className="w-1 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
              <span>{movie.runtime || 'N/A'}</span>
              <div className="w-1 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
              <div className="flex items-center gap-1">
                 <Star className="w-3.5 h-3.5 fill-current" />
                 {movie.score || '-'}
              </div>
            </div>

            <div className="relative">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-black dark:text-white tracking-tighter leading-[0.9] uppercase mb-8 relative z-10">
                {movie.title}
              </h1>
            </div>

            <p className="text-2xl font-serif text-neutral-500 mb-10">
              <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-neutral-400 mr-4">Director</span>
              <span className="text-black dark:text-white uppercase font-black tracking-tight">{movie.director}</span>
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-t border-neutral-200 dark:border-neutral-900 pt-12">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4">Synopsis</span>
                <p className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300 font-serif">
                  {movie.notes || 'No description available for this cinematic piece.'}
                </p>
              </div>
              
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4">Cast</span>
                <div className="flex flex-col gap-2">
                  {(movie.cast || []).map(actor => {
                    const initials = actor.split(' ').map(n => n[0]).join('').substring(0, 2);
                    return (
                      <button key={actor} className="flex items-center gap-4 py-2 pr-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-full transition-colors cursor-pointer group text-left border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-[#0a0a0a] flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-800">
                          <span className="text-[10px] font-bold text-neutral-500">{initials}</span>
                        </div>
                        <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white uppercase tracking-wide">
                          {actor}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-16">
              <button title="Play" className="flex items-center justify-center w-16 h-16 bg-black dark:bg-white text-white dark:text-black rounded-full hover:scale-105 transition-transform duration-300 cursor-pointer shadow-none">
                <Play className="w-6 h-6 fill-current ml-1" />
              </button>
              <button title="Gallery" className="flex items-center justify-center w-16 h-16 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-black dark:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors duration-300 cursor-pointer shadow-none">
                <ImageIcon className="w-6 h-6" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
