'use client';

import React, { lazy, Suspense } from 'react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  name: keyof typeof dynamicIconImports;
  size?: keyof typeof sizeMap | number;
  weight?: number;
  className?: string;
}

export const Icon = ({ name, size = 'md', weight, className = '', ...props }: IconProps) => {
  const LucideIcon = lazy(dynamicIconImports[name]);
  
  const iconSize = typeof size === 'number' ? size : sizeMap[size];

  // We rely on CSS to forcefully override the inline strokeWidth attribute set by lucide-react.
  // This ensures perfect responsive rendering without JS Hydration mismatch (FOUC).
  const strokeClass = weight 
    ? '' // Use explicit weight passed as prop
    : '![stroke-width:2px] md:![stroke-width:1.5px]';

  return (
    <Suspense fallback={<div style={{ width: iconSize, height: iconSize }} className="animate-pulse bg-[var(--color-bg-tertiary)] rounded-full" />}>
      <LucideIcon
        size={iconSize}
        {...props}
        className={`text-current ${strokeClass} ${className || ''}`}
        {...(weight ? { strokeWidth: weight } : {})}
      />
    </Suspense>
  );
};
