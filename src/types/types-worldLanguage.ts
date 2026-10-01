export interface WorldLanguage {
  id: string;
  name: string;
  nativeName: string;
  code: string; // ISO 639-1 or 3
  family: string;
  branch: string;
  speakers: number; // Native + L2 in millions (approx)
  description: string;
}
