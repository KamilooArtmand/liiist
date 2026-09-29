export interface BookmarkedPage {
  id: string; // e.g. 'page-country-US', 'page-state-CA'
  title: string;
  handle: string; // e.g. '@usa', '@california'
  canonicalPath: string; // e.g. 'liii.st/World/Country/United States'
  type: 'country' | 'state' | 'city' | 'world' | 'list';
  subtitle?: string;
  icon?: string;
  createdAt: string;
}
