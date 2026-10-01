export interface Movie {
  id: string;
  title: string;
  director: string;
  year: number;
  countryCode: string; // For the flag
  imdbScore: number;
  runtime: string;
  plot: string;
  cast: string[];
  coverColor: string; // Tailwind class for placeholder
  genre: string[];
}