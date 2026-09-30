// Hierarchy types for Countries, States/Provinces, Cities, and Knowledge Entities

export interface CityInfo {
  name: string;
  population: number;
  isCapital?: boolean;
  areaKm2?: number;
  founded?: number;
  elevationM?: number;
  nickname?: string;
  notableAttractions?: string[];
  mayorOrLeader?: string;
  metroPopulation?: number;
  gdpBillion?: number;
}

export interface StateInfo {
  code: string; // e.g., 'CA', 'TX', 'NY'
  name: string;
  capital: string;
  largestCity: string;
  population: number;
  areaKm2: number;
  admissionYear: number;
  governor: string;
  gdpBillion: number;
  motto: string;
  nickname: string;
  timezone: string;
  cities: CityInfo[];
  history: string;
  culture: string;
  economy: string;
  brands: string[];
  luminaries: string[];
  landmarks: string[];
  universities?: string[];
  climate?: string;
  subdivisionsCount?: number; // Counties count (e.g. 58 for CA, 254 for TX)
  flagUrl?: string; // Official state flag
  coverUrl?: string; // Representative landmark cover photo
}

export type EntityType = 'country' | 'state' | 'city' | 'brand' | 'person' | 'product' | 'language';

export interface IndexSection {
  id: string;
  title: string;
  nativeTitle?: string;
  iconName?: string;
  count?: number;
}
