import React from 'react';

/**
 * ==============================================================================
 * STRUCTURAL LAYOUT PRIMITIVES
 * Resolving design debt by enforcing strict composition rules.
 * NO MARGINS ALLOWED (`mt-`, `mb-`, etc). Spacing is exclusively handled 
 * via `gap` properties on these parent containers.
 * ==============================================================================
 */

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const Container = ({ children, className = '', as: Component = 'div' }: LayoutProps) => {
  return (
    <Component className={`w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6 md:gap-12 lg:gap-16 ${className}`}>
      {children}
    </Component>
  );
};

export const CosmicGrid = ({ children, className = '', as: Component = 'div' }: LayoutProps) => {
  return (
    // Fluid responsive grid without explicit breakpoints, powered by auto-fit and minmax
    <Component className={`grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-6 lg:gap-8 ${className}`}>
      {children}
    </Component>
  );
};

export const BentoCell = ({ children, className = '', as: Component = 'div' }: LayoutProps) => {
  return (
    // Uses Container Queries (@container) so internals respond to the cell width, not viewport
    <Component className={`@container relative bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-2xl p-6 lg:p-8 flex flex-col gap-6 ${className}`}>
      {children}
    </Component>
  );
};

export const Stack = ({ children, className = '', as: Component = 'div', direction = 'col' }: LayoutProps & { direction?: 'row' | 'col' }) => {
  return (
    <Component className={`flex ${direction === 'col' ? 'flex-col' : 'flex-row items-center'} gap-4 ${className}`}>
      {children}
    </Component>
  );
};
