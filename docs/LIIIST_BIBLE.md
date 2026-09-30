# Liiist Product Bible & Design System

## 1. Core Philosophy
Liiist is an ultimate, expansive encyclopedia and cataloging platform. It is NOT a standard web app. It is a premium, cutting-edge cinematic experience built on editorial, Bauhaus, and Swiss design principles.

## 2. Strict UI/UX Rules
- **Color Palette**: STRICTLY Monochrome (White, Gray, Black). Do not use soft pastel colors, ambers, or blue primary buttons unless explicitly asked. Focus on stark contrast.
- **Surface & Depth**: FLAT DESIGN ONLY. **Absolutely NO drop shadows (shadow-md, etc.) and NO backdrop-blurs (ackdrop-blur).** Elevations are handled by hairline borders (order-[0.5px], order-neutral-200/900) and stark background color contrast.
- **Layout & Space**: Expansive layouts. Do NOT restrict main content to narrow central columns (max-w-4xl) unless it's a specific modal or reading block. Let grids stretch edge-to-edge.
- **Typography**: Cinematic and Editorial. Use huge watermarked texts (	ext-[10rem]+, 	racking-tighter, absolute positioning with z-[-1]) behind main titles. Use uppercase monospaced fonts for metadata and tags.
- **Icons**: Icon-only interfaces for actions. Do not write "Back" or "Play Trailer" next to icons. Use pure, minimal icons. On hover, use soft transparent glass/gray circles (g-black/5 or g-white/10).
- **Posters/Images**: Movie posters and catalog covers should have curved edges (ounded-xl or ounded-2xl) and default to grayscale with high contrast, transitioning to color/sharpness on active states.
- **Animations**: Fluid, spring-like, and cinematic. Use cubic-bezier easing, duration-700 or duration-1000.

## 3. Information Architecture (The Cosmos)
- **Hierarchy is everything**: Every entity belongs to a deep path. Example: liii.st/World/Culture/Art/Cinema/Movie.
- **View Modes**: Features like "Timeline" or "Board" are **View Modes** for Lists, NOT separate standalone pages. A Timeline is just a way to view data that has dates (Inventions, Wars, Movies).
- **Entities**: Every item (e.g., a Movie, an Actor, a Country, a State) has its own dedicated Detail Page. Clicking a movie from a list should open the Movie Detail Page, not default to a timeline. Clicking an Actor should open an Artist Profile Page.

## 4. Development Protocol (The Machine's Directive)
- Read this document whenever making architectural or UI decisions.
- Never override the user's creative vision with default web-dev habits (like adding shadows or max-widths).
- Always maintain the BreadcrumbSegment logic to reflect the deep path.
