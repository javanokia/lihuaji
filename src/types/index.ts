export interface PatternVariant {
  id: string;
  label: string;
  photo?: string;
  sticker?: string;
  note?: string;
}

export interface Pattern {
  id: string;
  title: string;
  originalTitle?: string;
  subtitle?: string | null;
  region: string;
  collection: 'basic' | 'archive' | string;
  styleFamily?: string | null;
  thumbnail: string;
  image: string;
  imageSha256?: string | null;
  thumbnailSha256?: string | null;
  width?: number | null;
  height?: number | null;
  description?: string | null;
  source?: string;
  sourceName?: string;
  sourcePlatform?: string;
  sourceUrl?: string | null;
  sourceApiUrl?: string | null;
  license?: string;
  licenseUrl?: string | null;
  author?: string;
  accession?: string | null;
  museumObjectId?: string | number | null;
  museumObjectTitle?: string;
  rightsVerifiedAt?: string | null;
  curationNote?: string | null;
  labelNote?: string | null;
  period?: string | null;
  date?: string | null;
  culture?: string[];
  technique?: string | null;
  tags?: string[];
  batch?: boolean | string;
  changes?: string;
  featured?: boolean;
  sortWeight?: number;
  searchTerms?: string;
}

export type NormalizedPattern = Pattern;

export interface ProductVariant {
  id: string;
  label: string;
  photo?: string;
  sticker?: string;
  note: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  preview_group?: string;
  image_path: string;
  thumbnail_path?: string;
  description?: string;
  gallery: string[];
  variants: ProductVariant[];
}

export interface SiteInfo {
  name: string;
  title: string;
  intro: string;
  notice?: string;
  repository?: string;
}

export interface UserProgress {
  days: string[];
  best: number;
}

export interface SuxiuKnowledgeItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  scope: string;
  sourceIds: string[];
  facts: Array<{ text: string; sourceIds: string[] }>;
  orderedSteps?: string[];
  relations: Array<{ target: string; type: string }>;
  limitations?: string;
  review: { accessedDate: string; note: string };
}

export interface SuxiuData {
  knowledge: SuxiuKnowledgeItem[];
  sources: Array<{ id: string; organization: string; title: string; url: string; verified?: boolean }>;
}

export interface PracticeLesson {
  name: string;
  summary: string;
  steps: string[];
  tip: string;
}

export interface PracticeKnowledge {
  title: string;
  body: string;
  source: string;
  url?: string;
  tags?: string;
}
