// Types for Sovereign Country Directory & Universal Knowledge Graph
export interface CountryCurrency {
  name: string;
  code: string;
  symbol: string;
}

export interface CountryPolitics {
  system: string;
  headOfState?: string;
}

export interface Country {
  code: string; // ISO 3166-1 alpha-2 (e.g. 'JP', 'IR', 'US', 'FR')
  name: string;
  officialName: string;
  nativeName?: string;
  continent: 'Africa' | 'Americas' | 'Asia' | 'Europe' | 'Oceania';
  subregion: string;
  capital: string;
  population: number;
  areaKm2: number;
  independenceYear: number;
  currency: CountryCurrency;
  languages: string[];
  callingCode: string;
  tld: string;
  timezones: string[];
  sublists: string[]; // Universal directory sublists
  overview: string;
  borderingCodes?: string[];
  isG20?: boolean;
  isIsland?: boolean;
  isLandlocked?: boolean;
  indexNumber?: string;

  // Deep Dimensions requested by User
  historyOrigin?: string; // تاریخ، پیدایش و ریشه‌های کهن
  cultureHeritage?: string; // فرهنگ، تمدن و هویت بومی
  revolutions?: string; // انقلاب‌ها، تحولات بنیادین
  revolutionsTurningPoints?: string; // اختیاری
  politics?: CountryPolitics; // سیاست، رهبری و نظام سیاسی
  politicsGovernance?: CountryPolitics;
  luminaries?: string[]; // نامداران، متفکران و نوابغ تاریخ
  notableFigures?: string[];
  ecosystem?: string; // اکوسیستم، طبیعت و زیست‌بوم
  ecosystemNature?: string;
  tourism?: string[]; // مقاصد توریستی و نمادهای معماری
  tourismDestinations?: string[];
  brands?: string[]; // صنایع کلیدی، نمادها و برندهای شاخص جهانی
  industryBrands?: string[];
}

export type CountrySortOption =
  | 'alpha-asc'
  | 'alpha-desc'
  | 'continent'
  | 'population-desc'
  | 'population-asc'
  | 'area-desc'
  | 'area-asc'
  | 'independence-asc'
  | 'independence-desc';
