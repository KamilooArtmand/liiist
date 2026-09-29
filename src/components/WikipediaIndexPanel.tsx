import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Landmark,
  Languages,
  Users,
  Coins,
  Award,
  Scale,
  Trophy,
  Palette,
  Flag,
  Factory,
  Compass,
  Trees,
  Layers,
  ChevronRight,
  ListFilter
} from 'lucide-react';
import { EntityType, IndexSection } from '../types/hierarchy';

// Pure English Wikipedia-style Index presets
export const ENTITY_INDEX_PRESETS: Record<EntityType, IndexSection[]> = {
  country: [
    { id: 'history', title: 'History & Genesis', iconName: 'BookOpen' },
    { id: 'culture', title: 'Culture & Heritage', iconName: 'Palette' },
    { id: 'language', title: 'Official Languages', iconName: 'Languages' },
    { id: 'demographics', title: 'Population & Demographics', iconName: 'Users' },
    { id: 'economy', title: 'Economy & Monetary', iconName: 'Coins' },
    { id: 'brands', title: 'Global Brands & Industry', iconName: 'Factory' },
    { id: 'luminaries', title: 'Notable Luminaries', iconName: 'Award' },
    { id: 'government', title: 'Government & Leadership', iconName: 'Scale' },
    { id: 'parties', title: 'Political Parties & Systems', iconName: 'Flag' },
    { id: 'sports', title: 'Sports & Athletics', iconName: 'Trophy' },
    { id: 'wikipedia-article', title: 'Wikipedia Encyclopedia Record', iconName: 'BookOpen' },
    { id: 'tourism', title: 'Tourism & Landmarks', iconName: 'Compass' }
  ],
  state: [
    { id: 'overview', title: 'State Profile & Identity', iconName: 'Landmark' },
    { id: 'counties', title: 'Counties & Boroughs', iconName: 'Layers' },
    { id: 'cities', title: 'Municipalities & Cities', iconName: 'Building2' },
    { id: 'history', title: 'Statehood & History', iconName: 'BookOpen' },
    { id: 'culture', title: 'State Culture', iconName: 'Palette' },
    { id: 'demographics', title: 'Population & Density', iconName: 'Users' },
    { id: 'economy', title: 'GDP & Key Sectors', iconName: 'Coins' },
    { id: 'brands', title: 'Iconic Enterprises', iconName: 'Factory' },
    { id: 'luminaries', title: 'Distinguished People', iconName: 'Award' },
    { id: 'landmarks', title: 'Landmarks & Parks', iconName: 'Compass' }
  ],
  city: [
    { id: 'overview', title: 'City Profile', iconName: 'Landmark' },
    { id: 'demographics', title: 'Population & Metro Area', iconName: 'Users' },
    { id: 'economy', title: 'Municipal Economy', iconName: 'Coins' },
    { id: 'attractions', title: 'Iconic Attractions', iconName: 'Compass' },
    { id: 'districts', title: 'Boroughs & Districts', iconName: 'Layers' }
  ],
  brand: [
    { id: 'history', title: 'Founding & Genesis', iconName: 'BookOpen' },
    { id: 'products', title: 'Product Ecosystem', iconName: 'Layers' },
    { id: 'leadership', title: 'Leadership & Executives', iconName: 'Scale' },
    { id: 'financials', title: 'Valuation & Revenue', iconName: 'Coins' },
    { id: 'globalReach', title: 'International Footprint', iconName: 'Compass' }
  ],
  person: [
    { id: 'biography', title: 'Early Life & Heritage', iconName: 'BookOpen' },
    { id: 'achievements', title: 'Major Contributions', iconName: 'Award' },
    { id: 'philosophy', title: 'Ethos & Philosophy', iconName: 'Scale' },
    { id: 'legacy', title: 'Enduring Impact', iconName: 'Landmark' }
  ],
  product: [
    { id: 'specs', title: 'Technical Specifications', iconName: 'Layers' },
    { id: 'design', title: 'Industrial Design', iconName: 'Palette' },
    { id: 'ecosystem', title: 'Compatibility', iconName: 'Compass' },
    { id: 'origin', title: 'Manufacturing Origin', iconName: 'Factory' }
  ]
};

interface WikipediaIndexPanelProps {
  entityType?: EntityType;
  customSections?: IndexSection[];
  onNavigateSection?: (sectionId: string) => void;
  activeSectionId?: string;
  className?: string;
}

export const WikipediaIndexPanel: React.FC<WikipediaIndexPanelProps> = ({
  entityType = 'country',
  customSections,
  onNavigateSection,
  activeSectionId,
  className = ''
}) => {
  const sections = customSections || ENTITY_INDEX_PRESETS[entityType] || ENTITY_INDEX_PRESETS.country;
  const [currentActive, setCurrentActive] = useState<string>(activeSectionId || sections[0]?.id || '');
  
  // Hover expansion state: Default is closed bar pill. Mouse enter smoothly expands to full width; mouse leave closes back!
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (activeSectionId) {
      setCurrentActive(activeSectionId);
    }
  }, [activeSectionId]);

  // Handle smooth jump to targeted section ID
  const handleItemClick = (sectionId: string) => {
    setCurrentActive(sectionId);
    if (onNavigateSection) {
      onNavigateSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const activeSection = sections.find((s) => s.id === currentActive) || sections[0];

  const renderIcon = (name?: string) => {
    switch (name) {
      case 'BookOpen': return <BookOpen className="w-3.5 h-3.5" />;
      case 'Palette': return <Palette className="w-3.5 h-3.5" />;
      case 'Languages': return <Languages className="w-3.5 h-3.5" />;
      case 'Users': return <Users className="w-3.5 h-3.5" />;
      case 'Coins': return <Coins className="w-3.5 h-3.5" />;
      case 'Factory': return <Factory className="w-3.5 h-3.5" />;
      case 'Award': return <Award className="w-3.5 h-3.5" />;
      case 'Scale': return <Scale className="w-3.5 h-3.5" />;
      case 'Flag': return <Flag className="w-3.5 h-3.5" />;
      case 'Trophy': return <Trophy className="w-3.5 h-3.5" />;
      case 'Landmark': return <Landmark className="w-3.5 h-3.5" />;
      case 'Layers': return <Layers className="w-3.5 h-3.5" />;
      case 'Compass': return <Compass className="w-3.5 h-3.5" />;
      case 'Trees': return <Trees className="w-3.5 h-3.5" />;
      default: return <ListFilter className="w-3.5 h-3.5" />;
    }
  };

  return (
    <aside
      aria-label="Wikipedia Entity Index"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`shrink-0 transition-all duration-300 ease-out rounded-full sticky top-20 shadow-md border border-neutral-200/80 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl z-30 ${
        isHovered
          ? 'w-72 sm:w-80 rounded-3xl p-4 space-y-2'
          : 'w-auto min-w-[130px] px-3.5 py-2 flex items-center justify-between gap-3 cursor-pointer'
      } ${className}`}
    >
      {!isHovered ? (
        /* Default Closed State: A completely round pill bar displaying INDEX and current active item */
        <div className="flex items-center justify-between w-full gap-2.5 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-neutral-100 animate-pulse shrink-0" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-bold">
              INDEX
            </span>
          </div>

          {activeSection && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold shadow-xs">
              <span className="shrink-0">{renderIcon(activeSection.iconName)}</span>
              <span className="text-[11px] font-mono tracking-tight truncate max-w-[110px]">
                {activeSection.title}
              </span>
            </div>
          )}

          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        </div>
      ) : (
        /* Expanded Flyout on Mouse Hover */
        <div className="animate-in fade-in zoom-in-95 duration-200 space-y-2.5">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-neutral-800/60 select-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-neutral-100 animate-pulse shrink-0" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-900 dark:text-neutral-100 font-bold">
                INDEX
              </span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              {sections.length} Sections
            </span>
          </div>

          {/* List of Navigation Items */}
          <nav className="space-y-1 max-h-[70vh] overflow-y-auto no-scrollbar py-0.5">
            {sections.map((sec, idx) => {
              const isActive = currentActive === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => handleItemClick(sec.id)}
                  title={sec.title}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/60 hover:text-neutral-950 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`shrink-0 ${
                        isActive
                          ? 'text-white dark:text-neutral-950'
                          : 'text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300'
                      }`}
                    >
                      {renderIcon(sec.iconName)}
                    </span>
                    <span className="text-xs truncate leading-snug">
                      {sec.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    <span className="font-mono text-[10px] opacity-40">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isActive ? 'text-white dark:text-neutral-950 translate-x-0.5' : 'text-neutral-400 opacity-60'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </aside>
  );
};
