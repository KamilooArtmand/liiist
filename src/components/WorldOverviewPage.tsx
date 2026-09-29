import React from 'react';
import { CapsuleBreadcrumb } from './CapsuleBreadcrumb';
import {
  Globe,
  Compass,
  Waves,
  Mountain,
  MapPin,
  ChevronRight,
  Layers,
  Sparkles,
  ArrowRight,
  Building,
  Home
} from 'lucide-react';

interface WorldOverviewPageProps {
  onGoHome: () => void;
  onOpenCountryList: () => void;
}

export const WorldOverviewPage: React.FC<WorldOverviewPageProps> = ({
  onGoHome,
  onOpenCountryList
}) => {
  const continents = [
    { name: 'Asia', nations: 49, population: '4.75 Billion', landShare: '30%' },
    { name: 'Africa', nations: 54, population: '1.46 Billion', landShare: '20.4%' },
    { name: 'Europe', nations: 44, population: '742 Million', landShare: '6.8%' },
    { name: 'Americas', nations: 35, population: '1.04 Billion', landShare: '28.5%' },
    { name: 'Oceania', nations: 14, population: '45 Million', landShare: '5.7%' },
    { name: 'Antarctica', nations: 0, population: '1,000–5,000 (Research)', landShare: '9.2%' }
  ];

  const oceans = [
    { name: 'Pacific Ocean', area: '168.7 Million km²', maxDepth: 'Mariana Trench (10,994m)' },
    { name: 'Atlantic Ocean', area: '85.1 Million km²', maxDepth: 'Puerto Rico Trench (8,376m)' },
    { name: 'Indian Ocean', area: '70.5 Million km²', maxDepth: 'Java Trench (7,290m)' },
    { name: 'Southern Ocean', area: '21.9 Million km²', maxDepth: 'South Sandwich Trench (7,236m)' },
    { name: 'Arctic Ocean', area: '15.5 Million km²', maxDepth: 'Molloy Deep (5,550m)' }
  ];

  const breadcrumbSegments = [
    { label: 'liii.st', onClick: onGoHome },
    { label: 'World', isCurrent: true }
  ];

  return (
    <div className="flex-1 flex flex-col w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Hero Bento Header for Planet Earth */}
      <div className="liquid-glass-card p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              Planetary Knowledge Architecture • Node 000
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
              The World
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-mono">
              Earth • 510.1 Million km² Total Surface Area • 8.1 Billion Human Inhabitants
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenCountryList}
            className="px-4 py-2.5 rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold hover:opacity-90 transition flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>Enter Sovereign Countries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bento Grid: Dimensions of Earth */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Bento Card 1: Sovereign Countries Gateway (6 Cols) */}
        <div
          onClick={onOpenCountryList}
          className="md:col-span-6 liquid-glass-card p-6 rounded-3xl bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all cursor-pointer group space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-950 dark:text-white group-hover:text-black dark:group-hover:text-white">
                  Sovereign Countries
                </h3>
                <span className="text-[10px] font-mono text-neutral-400">
                  195 Recognized States & Observers
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
          </div>

          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-mono">
            Access the complete alphabetical index of nations with SVG vector flags, populations, landmasses, capitals, and currencies.
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs font-mono text-neutral-500">
            <span className="font-bold text-neutral-900 dark:text-white">liii.st/World/Country</span>
          </div>
        </div>

        {/* Bento Card 2: Recursive Administrative Hierarchy (6 Cols) */}
        <div className="md:col-span-6 liquid-glass-card p-6 rounded-3xl bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
                  Administrative Hierarchy
                </h3>
                <span className="text-[10px] font-mono text-neutral-400">
                  Recursive Subdivisions Roadmap
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-neutral-100/60 dark:bg-neutral-950/60 border border-neutral-200/40 dark:border-neutral-800/40">
              <span className="text-[10px] text-neutral-400 block">LEVEL 1</span>
              <span className="font-bold text-neutral-900 dark:text-white">Continents (7)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-100/60 dark:bg-neutral-950/60 border border-neutral-200/40 dark:border-neutral-800/40">
              <span className="text-[10px] text-neutral-400 block">LEVEL 2</span>
              <span className="font-bold text-neutral-900 dark:text-white">Countries (195)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-100/60 dark:bg-neutral-950/60 border border-neutral-200/40 dark:border-neutral-800/40">
              <span className="text-[10px] text-neutral-400 block">LEVEL 3 (Roadmap)</span>
              <span className="font-bold text-neutral-900 dark:text-white">States & Provinces</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-100/60 dark:bg-neutral-950/60 border border-neutral-200/40 dark:border-neutral-800/40">
              <span className="text-[10px] text-neutral-400 block">LEVEL 4 (Roadmap)</span>
              <span className="font-bold text-neutral-900 dark:text-white">Cities & Towns</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-100/60 dark:bg-neutral-950/60 border border-neutral-200/40 dark:border-neutral-800/40">
              <span className="text-[10px] text-neutral-400 block">LEVEL 5 (Roadmap)</span>
              <span className="font-bold text-neutral-900 dark:text-white">Counties & Boroughs</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-100/60 dark:bg-neutral-950/60 border border-neutral-200/40 dark:border-neutral-800/40">
              <span className="text-[10px] text-neutral-400 block">LEVEL 6 (Roadmap)</span>
              <span className="font-bold text-neutral-900 dark:text-white">Districts & Villages</span>
            </div>
          </div>
        </div>

        {/* Bento Card 3: The 7 Continents (6 Cols) */}
        <div className="md:col-span-6 liquid-glass-card p-6 rounded-3xl bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              The Continents & Landmass
            </span>
            <span className="text-xs font-mono text-neutral-400">29.2% of Earth</span>
          </div>

          <div className="space-y-2">
            {continents.map((cont) => (
              <div
                key={cont.name}
                className="p-3 rounded-2xl bg-neutral-100/50 dark:bg-neutral-950/50 border border-neutral-200/40 dark:border-neutral-800/40 flex items-center justify-between text-xs font-mono"
              >
                <div>
                  <span className="font-bold text-neutral-900 dark:text-white">{cont.name}</span>
                  <span className="text-neutral-400 text-[11px] ml-2">
                    {cont.nations > 0 ? `${cont.nations} sovereign nations` : 'Treaty Zone'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {cont.population}
                  </span>
                  <span className="text-[10px] text-neutral-400 block">{cont.landShare} land</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bento Card 4: The 5 Major World Oceans (6 Cols) */}
        <div className="md:col-span-6 liquid-glass-card p-6 rounded-3xl bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5" />
              The Oceans & Hydrosphere
            </span>
            <span className="text-xs font-mono text-neutral-400">70.8% of Earth</span>
          </div>

          <div className="space-y-2">
            {oceans.map((ocean) => (
              <div
                key={ocean.name}
                className="p-3 rounded-2xl bg-neutral-100/50 dark:bg-neutral-950/50 border border-neutral-200/40 dark:border-neutral-800/40 flex items-center justify-between text-xs font-mono"
              >
                <div>
                  <span className="font-bold text-neutral-900 dark:text-white">{ocean.name}</span>
                  <span className="text-neutral-400 text-[10px] block">{ocean.maxDepth}</span>
                </div>
                <span className="text-neutral-800 dark:text-neutral-200 font-semibold tabular-nums">
                  {ocean.area}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
