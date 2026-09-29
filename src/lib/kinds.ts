import type { Kind } from "./types";

export const KINDS: { id: Kind; label: string; icon: string; noun: string }[] = [
  { id: "products", label: "Products", icon: "ShoppingBag", noun: "product" },
  { id: "books", label: "Books", icon: "BookOpen", noun: "book" },
  { id: "apps", label: "Apps", icon: "AppWindow", noun: "app" },
  { id: "links", label: "Links", icon: "Link", noun: "link" },
  { id: "people", label: "People", icon: "Users", noun: "person" },
  { id: "brands", label: "Brands", icon: "Tag", noun: "brand" },
  { id: "cities", label: "Cities", icon: "Building2", noun: "city" },
  { id: "places", label: "Places", icon: "MapPin", noun: "place" },
  { id: "businesses", label: "Businesses", icon: "Store", noun: "business" },
  { id: "movies", label: "Movies", icon: "Clapperboard", noun: "movie" },
  { id: "anything", label: "Anything", icon: "Sparkles", noun: "item" },
];

export const kindOf = (id: Kind) => KINDS.find((k) => k.id === id) ?? KINDS[KINDS.length - 1];

/** Accent choices: three base tones plus optional personal accents. */
export const COLORS = [
  "#0a0a0b", "#55555c", "#a0a0a8", "#ffffff",
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#14b8a6", "#3b82f6", "#6366f1", "#a855f7", "#ec4899",
];

/** Readable foreground (black or white) for a given hex background. */
export function onColor(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#0a0a0b" : "#ffffff";
}
