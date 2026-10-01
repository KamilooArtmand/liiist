import React, { useState } from 'react';
import { Country } from '../types/types-country';
import { COUNTRIES_DATA } from '../data/data-countriesData';
import { CountryDirectoryColumn } from './components-CountryDirectoryColumn';
import { CountryFlag } from './components-CountryFlag';
import { CapsuleBreadcrumb } from './components-CapsuleBreadcrumb';
import {
  Globe,
  ArrowRight,
  TrendingUp,
  Maximize2,
  Calendar,
  Users,
  Building2,
  Layers,
  Sparkles,
  MapPin,
  Waves
} from 'lucide-react';

interface WorldCountryPageProps {
  onSelectCountry: (country: Country) => void;
  onGoHome: () => void;
  onOpenWorldOverview: () => void;
  onOpenCosmicList?: (listId: string) => void;
}

export const WorldCountryPage: React.FC<WorldCountryPageProps> = ({
  onSelectCountry,
  onGoHome,
  onOpenWorldOverview,
  onOpenCosmicList
}) => {
  const [activeContinentFilter, setActiveContinentFilter] = useState<string | null>(null);

  // Spotlight country
  const spotlightCountry = COUNTRIES_DATA.find((c) => c.code === 'JP') || COUNTRIES_DATA[0];

  // Aggregate statistics across 195 countries
  const totalPopulation = COUNTRIES_DATA.reduce((sum, c) => sum + c.population, 0);
  const totalArea = COUNTRIES_DATA.reduce((sum, c) => sum + c.areaKm2, 0);

  // Continent counts
  const continentCounts = {
    Africa: COUNTRIES_DATA.filter((c) => c.continent === 'Africa').length,
    Americas: COUNTRIES_DATA.filter((c) => c.continent === 'Americas').length,
    Asia: COUNTRIES_DATA.filter((c) => c.continent === 'Asia').length,
    Europe: COUNTRIES_DATA.filter((c) => c.continent === 'Europe').length,
    Oceania: COUNTRIES_DATA.filter((c) => c.continent === 'Oceania').length
  };

  const breadcrumbSegments = [
    { label: 'liii.st', onClick: onGoHome },
    { label: 'World', onClick: onOpenWorldOverview },
    { label: 'Country', isCurrent: true }
  ];

  return (
    <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Main Grid: Left Column is CountryDirectoryColumn, Right Area is Bento Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* The Long Country Column (5 Cols on Desktop, Full Width on Mobile) */}
        <div className="lg:col-span-5 xl:col-span-5 w-full">
          <CountryDirectoryColumn
            onSelectCountry={onSelectCountry}
            title="liiist : Countries"
          />
        </div>

        {/* Bento Grid Visual Cards & Widgets (7 Cols on Desktop) */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-5">
          {/* Bento Card 1: Macro Sovereign Nations Overview */}
          <div className="liquid-glass-card p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                  Universal Directory • Sovereign Catalog
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
                  World / Country
                </h2>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Exhaustive index of all recognized sovereign member states and observers of the world.
              Browse by alphabet, continent, population density, landmass, or antiquity.
            </p>

            {/* Micro Metrics Strip inside the Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800/50">
                <span className="text-[10px] font-mono text-neutral-400 block">NATIONS</span>
                <span className="text-lg font-mono font-bold tabular-nums text-neutral-950 dark:text-white">
                  {COUNTRIES_DATA.length}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800/50">
                <span className="text-[10px] font-mono text-neutral-400 block">POPULATION</span>
                <span className="text-lg font-mono font-bold tabular-nums text-neutral-950 dark:text-white">
                  {(totalPopulation / 1_000_000_000).toFixed(2)}B
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800/50">
                <span className="text-[10px] font-mono text-neutral-400 block">LANDMASS</span>
                <span className="text-lg font-mono font-bold tabular-nums text-neutral-950 dark:text-white">
                  {(totalArea / 1_000_000).toFixed(1)}M km²
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800/50">
                <span className="text-[10px] font-mono text-neutral-400 block">CONTINENTS</span>
                <span className="text-lg font-mono font-bold tabular-nums text-neutral-950 dark:text-white">
                  7
                </span>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Interactive Continents Breakdown Widgets */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(continentCounts).map(([cont, count]) => (
              <div
                key={cont}
                onClick={() =>
                  setActiveContinentFilter(activeContinentFilter === cont ? null : cont)
                }
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeContinentFilter === cont
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-transparent '
                    : 'bg-white dark:bg-neutral-900 border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                }`}
              >
                <span className="text-[10px] font-mono uppercase tracking-wider block opacity-70">
                  Continent
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-bold">{cont}</span>
                  <span className="text-xs font-mono font-semibold tabular-nums opacity-80">
                    {count}
                  </span>
                </div>
              </div>
            ))}

            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                G20 Nations
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm font-bold text-neutral-900 dark:text-white">
                  Major Economies
                </span>
                <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white">
                  20
                </span>
              </div>
            </div>
          </div>

          {/* Bento Card 3: Spotlight Sovereign State Card */}
          {spotlightCountry && (
            <div className="liquid-glass-card p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                  Featured Sovereign Profile
                </span>
                <button
                  type="button"
                  onClick={() => onSelectCountry(spotlightCountry)}
                  className="text-xs font-medium flex items-center gap-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition cursor-pointer"
                >
                  <span>Open Dedicated Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <CountryFlag
                  code={spotlightCountry.code}
                  className="w-16 h-11 rounded-md  shrink-0"
                  title={spotlightCountry.name}
                />
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-neutral-950 dark:text-white flex items-center gap-2">
                    {spotlightCountry.name}
                    <span className="text-xs font-mono text-neutral-400 font-normal">
                      ({spotlightCountry.code})
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    {spotlightCountry.officialName} • Capital: {spotlightCountry.capital}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-200/60 dark:border-neutral-800/60 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-neutral-400 block">POPULATION</span>
                  <span className="font-semibold tabular-nums text-neutral-900 dark:text-white">
                    {(spotlightCountry.population / 1_000_000).toFixed(1)}M
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">AREA</span>
                  <span className="font-semibold tabular-nums text-neutral-900 dark:text-white">
                    {spotlightCountry.areaKm2.toLocaleString()} km²
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">CURRENCY</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {spotlightCountry.currency.code} ({spotlightCountry.currency.symbol})
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Bento Card 4: Global Extremes & Curiosities */}
          <div className="liquid-glass-card p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
              Sovereign Records & Extremes
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/40 dark:border-neutral-800/40">
                <span className="text-neutral-400 text-[10px] font-mono block">LARGEST LANDMASS</span>
                <span className="font-bold text-neutral-900 dark:text-white">Russia</span>
                <span className="text-[11px] font-mono text-neutral-500 block">17,098,242 km²</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/40 dark:border-neutral-800/40">
                <span className="text-neutral-400 text-[10px] font-mono block">SMALLEST SOVEREIGN</span>
                <span className="font-bold text-neutral-900 dark:text-white">Vatican City</span>
                <span className="text-[11px] font-mono text-neutral-500 block">0.49 km² • 825 people</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/40 dark:border-neutral-800/40">
                <span className="text-neutral-400 text-[10px] font-mono block">MOST POPULOUS</span>
                <span className="font-bold text-neutral-900 dark:text-white">India</span>
                <span className="text-[11px] font-mono text-neutral-500 block">1.428 Billion inhabitants</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/40 dark:border-neutral-800/40">
                <span className="text-neutral-400 text-[10px] font-mono block">OLDEST CONTINUOUS SOVEREIGN</span>
                <span className="font-bold text-neutral-900 dark:text-white">San Marino</span>
                <span className="text-[11px] font-mono text-neutral-500 block">Founded 301 CE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
