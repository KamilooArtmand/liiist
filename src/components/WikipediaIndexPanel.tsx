import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen, Landmark, Languages, Users, Coins, Award,
  Scale, Trophy, Palette, Flag, Factory, Compass,
  Trees, Layers, ListFilter, Building2,
} from 'lucide-react';
import { EntityType, IndexSection } from '../types/hierarchy';
import { ENTITY_INDEX_PRESETS } from '../data/entityIndexPresets';

export { ENTITY_INDEX_PRESETS } from '../data/entityIndexPresets';

interface WikipediaIndexPanelProps {
  entityType?: EntityType;
  customSections?: IndexSection[];
  onNavigateSection?: (sectionId: string) => void;
  activeSectionId?: string;
  className?: string;
}

/* ─── icon renderer ─── */
function Icon({ name }: { name?: string }) {
  const cls = 'w-[14px] h-[14px] flex-none';
  switch (name) {
    case 'BookOpen':   return <BookOpen   className={cls} />;
    case 'Palette':    return <Palette    className={cls} />;
    case 'Languages':  return <Languages  className={cls} />;
    case 'Users':      return <Users      className={cls} />;
    case 'Coins':      return <Coins      className={cls} />;
    case 'Factory':    return <Factory    className={cls} />;
    case 'Award':      return <Award      className={cls} />;
    case 'Scale':      return <Scale      className={cls} />;
    case 'Flag':       return <Flag       className={cls} />;
    case 'Trophy':     return <Trophy     className={cls} />;
    case 'Landmark':   return <Landmark   className={cls} />;
    case 'Layers':     return <Layers     className={cls} />;
    case 'Compass':    return <Compass    className={cls} />;
    case 'Trees':      return <Trees      className={cls} />;
    case 'Building2':  return <Building2  className={cls} />;
    default:           return <ListFilter className={cls} />;
  }
}

/* ─── constants ─── */
const PILL_W   = 34;   // collapsed width  (px)
const OPEN_W   = 218;  // expanded width   (px)
const EASE     = 'cubic-bezier(0.4, 0, 0.2, 1)';
const DUR_OPEN  = '300ms';
const DUR_CLOSE = '260ms';

/* ─── component ─── */
export const WikipediaIndexPanel: React.FC<WikipediaIndexPanelProps> = ({
  entityType = 'country',
  customSections,
  onNavigateSection,
  activeSectionId,
  className = '',
}) => {
  const sections = customSections ?? ENTITY_INDEX_PRESETS[entityType] ?? ENTITY_INDEX_PRESETS.country;

  const [active, setActive] = useState(activeSectionId ?? sections[0]?.id ?? '');
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (activeSectionId) setActive(activeSectionId);
  }, [activeSectionId]);

  const clear = () => { if (timer.current) { clearTimeout(timer.current); timer.current = null; } };

  const onEnter = () => { clear(); setOpen(true); };
  const onLeave = () => { timer.current = setTimeout(() => setOpen(false), 100); };

  const navigate = (id: string) => {
    setActive(id);
    if (onNavigateSection) {
      onNavigateSection(id);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const dur = open ? DUR_OPEN : DUR_CLOSE;

  return (
    <aside
      aria-label="Page Index"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        width: open ? OPEN_W : PILL_W,
        transition: `width ${dur} ${EASE}`,
      }}
      className={[
        'shrink-0 sticky top-20 z-30 overflow-hidden',
        'bg-white dark:bg-neutral-950',
        'border border-neutral-200 dark:border-neutral-800',
        'rounded-[17px]',
        className,
      ].join(' ')}
    >

      {/* ───── header: dot + "INDEX" ───── */}
      <div
        className="flex items-center px-[10px] select-none"
        style={{ height: 40, gap: open ? 8 : 0, transition: `gap ${dur} ${EASE}` }}
      >
        {/* live dot */}
        <span className={[
          'block rounded-full flex-none',
          'bg-neutral-300 dark:bg-neutral-600',
          open ? 'w-[6px] h-[6px]' : 'w-[6px] h-[6px]',
        ].join(' ')} />

        {/* "INDEX" word */}
        <span
          aria-hidden
          className="text-[9.5px] font-mono tracking-[.17em] uppercase font-semibold text-neutral-400 dark:text-neutral-500 whitespace-nowrap"
          style={{
            maxWidth: open ? 120 : 0,
            opacity: open ? 1 : 0,
            overflow: 'hidden',
            transition: `max-width ${dur} ${EASE}, opacity ${open ? '220ms' : '120ms'} ease`,
          }}
        >
          INDEX
        </span>
      </div>

      {/* hairline */}
      <div className="mx-[10px] h-px bg-black/[0.05] dark:bg-white" />

      {/* ───── item list ───── */}
      <nav
        className="flex flex-col py-[6px] overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 180px)' }}
      >
        {sections.map((sec, i) => {
          const isActive = active === sec.id;
          const stagger = `${i * 14}ms`;

          return (
            <button
              key={sec.id}
              type="button"
              title={open ? undefined : sec.title}
              onClick={() => navigate(sec.id)}
              style={{
                height: 32,
                padding: open ? '0 10px' : '0',
                gap: open ? 9 : 0,
                transition: `padding ${dur} ${EASE}, gap ${dur} ${EASE}`,
              }}
              className={[
                'group relative flex items-center w-full cursor-pointer outline-none',
                !open && 'justify-center',
              ].filter(Boolean).join(' ')}
            >

              {/* ── background layer (active / hover) ── */}
              <span
                aria-hidden
                className={[
                  'absolute inset-x-[6px] inset-y-[3px] rounded-[10px]',
                  'transition-opacity duration-[140ms]',
                  isActive
                    ? 'opacity-100 bg-neutral-950 dark:bg-white'
                    : 'opacity-0 group-hover:opacity-100 bg-neutral-100 dark:bg-white',
                ].join(' ')}
              />

              {/* ── icon ── */}
              <span
                aria-hidden
                className={[
                  'relative z-10 flex-none flex items-center justify-center',
                  'transition-colors duration-[140ms]',
                  isActive
                    ? 'text-white dark:text-neutral-950'
                    : 'text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300',
                ].join(' ')}
              >
                <Icon name={sec.iconName} />
              </span>

              {/* ── label ── */}
              <span
                className={[
                  'relative z-10 text-[11.5px] leading-none font-[450] tracking-[-0.01em]',
                  'whitespace-nowrap overflow-hidden',
                  'transition-colors duration-[140ms]',
                  isActive
                    ? 'text-white dark:text-neutral-950'
                    : 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white',
                ].join(' ')}
                style={{
                  maxWidth: open ? 160 : 0,
                  opacity: open ? 1 : 0,
                  transition: [
                    `max-width ${dur} ${EASE} ${stagger}`,
                    `opacity ${open ? '200ms' : '80ms'} ease ${open ? stagger : '0ms'}`,
                  ].join(', '),
                }}
              >
                {sec.title}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ───── footer: section count ───── */}
      <div
        className="overflow-hidden"
        style={{
          maxHeight: open ? 28 : 0,
          opacity: open ? 1 : 0,
          transition: `max-height ${dur} ${EASE}, opacity ${open ? '220ms' : '100ms'} ease`,
        }}
      >
        <div className="mx-[10px] h-px bg-black/[0.04] dark:bg-white" />
        <p className="px-[14px] py-[7px] text-[9.5px] font-mono text-neutral-300 dark:text-neutral-600 tracking-wider">
          {sections.length}&nbsp;sections
        </p>
      </div>

    </aside>
  );
};
