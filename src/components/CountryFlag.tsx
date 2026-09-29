import React from 'react';
import * as Flags from 'country-flag-icons/react/3x2';

interface CountryFlagProps {
  code: string;
  className?: string;
  title?: string;
}

export const CountryFlag: React.FC<CountryFlagProps> = ({
  code,
  className = 'w-6 h-4.5 rounded-sm overflow-hidden inline-block shrink-0',
  title
}) => {
  const upperCode = code.toUpperCase();
  // Safe lookup for flag component in country-flag-icons
  const FlagComponent = (Flags as Record<string, React.ComponentType<{ className?: string; title?: string }>>)[upperCode];

  if (!FlagComponent) {
    // Subtle monochromatic vector SVG fallback if flag code is unrecognized
    return (
      <span
        className={`${className} bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-[9px] font-mono font-bold text-neutral-600 dark:text-neutral-400`}
        title={title || upperCode}
      >
        {upperCode}
      </span>
    );
  }

  return (
    <span className={`${className} inline-flex items-center justify-center`}>
      <FlagComponent
        className="w-full h-full object-cover block"
        title={title || upperCode}
      />
    </span>
  );
};
