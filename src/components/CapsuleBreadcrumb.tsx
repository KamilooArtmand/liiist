import React, { useState } from 'react';
import { Copy, Check, ArrowLeft, Bookmark, ChevronRight } from 'lucide-react';

export type SegmentHierarchyTone = 'ancestor' | 'current' | 'subdivision';

export interface BreadcrumbSegment {
  label: string;
  onClick?: () => void;
  isCurrent?: boolean;
  hierarchyTone?: SegmentHierarchyTone; // 'ancestor' = medium; 'current' = bold/highlight; 'subdivision' = muted/faded
}

interface CapsuleBreadcrumbProps {
  segments: BreadcrumbSegment[];
  currentPath?: string;
  copyUrl?: string;
  onGoBack?: () => void;
  className?: string;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

export const CapsuleBreadcrumb: React.FC<CapsuleBreadcrumbProps> = ({
  segments,
  currentPath,
  copyUrl,
  onGoBack,
  className = '',
  isBookmarked,
  onToggleBookmark
}) => {
  const [copied, setCopied] = useState(false);
  const targetUrl = copyUrl || (currentPath ? `https://${currentPath.replace(/^https?:\/\//, '')}` : window.location.href);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center justify-between px-3 sm:px-4 py-1.5 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800 backdrop-blur-2xl shadow-xs transition-all ${className}`}
    >
      {/* Left side: Back affordance (optional) + Path Segments with 3 Distinct Color Tones */}
      <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-mono overflow-x-auto no-scrollbar py-0.5 min-w-0">
        {onGoBack && (
          <button
            type="button"
            onClick={onGoBack}
            className="text-neutral-500 hover:text-black dark:hover:text-white transition flex items-center gap-1 shrink-0 mr-0.5 cursor-pointer"
            title="Go back"
          >
            <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        )}

        {segments.map((seg, idx) => {
          const isInteractive = !!seg.onClick;
          const tone = seg.hierarchyTone || (seg.isCurrent ? 'current' : 'ancestor');

          // 3 Distinct Tone Styles:
          // 1. Ancestor (عناوینی که عقب‌ترند): Medium opacity / medium contrast
          // 2. Current (عنوان اصلی که در صفحه آن هستیم): Bold, high contrast, distinctive capsule pill
          // 3. Subdivision (عناوینی که زیرمجموعه و جلوترند): Subtle, muted, faded opacity
          const toneClass =
            tone === 'current'
              ? 'font-bold text-neutral-950 dark:text-white bg-neutral-200/90 dark:bg-neutral-800/90 px-2 py-0.5 rounded-md shadow-2xs whitespace-nowrap'
              : tone === 'ancestor'
              ? 'font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white whitespace-nowrap'
              : 'font-normal text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400 opacity-60 whitespace-nowrap';

          return (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <span className="text-neutral-300 dark:text-neutral-700 select-none text-[10px] shrink-0">
                  /
                </span>
              )}

              {isInteractive ? (
                <button
                  type="button"
                  onClick={seg.onClick}
                  className={`shrink-0 transition-colors cursor-pointer ${toneClass}`}
                  title={seg.label}
                >
                  {seg.label}
                </button>
              ) : (
                <span className={`shrink-0 ${toneClass}`} title={seg.label}>
                  {seg.label}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Right side: Bookmark & Copy Actions */}
      <div className="shrink-0 pl-2 sm:pl-3 border-l border-neutral-200/60 dark:border-neutral-800/60 flex items-center gap-0.5 sm:gap-1 ml-2">
        {/* Bookmark / Favorite Button */}
        {onToggleBookmark && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark();
            }}
            className={`p-1 sm:p-1.5 rounded-full transition cursor-pointer flex items-center justify-center ${
              isBookmarked
                ? 'text-black dark:text-white bg-neutral-200/60 dark:bg-neutral-800'
                : 'text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
            title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
            aria-label="Toggle bookmark"
          >
            <Bookmark className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Pure Clean Copy Icon */}
        <button
          type="button"
          onClick={handleCopy}
          className="p-1 sm:p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition cursor-pointer flex items-center justify-center"
          title="Copy link to clipboard"
          aria-label="Copy URL to clipboard"
        >
          {copied ? (
            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-950 dark:text-white animate-in zoom-in-75 duration-150" />
          ) : (
            <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          )}
        </button>
      </div>
    </nav>
  );
};
