import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const rawCatalog = JSON.parse(fs.readFileSync(path.join(root, 'content/patterns.json'), 'utf8'));

/**
 * Normalizes a raw pattern entry into a standard database-ready model.
 */
export function normalizePatternRecord(raw) {
  // Extract tags cleanly
  let tags = [];
  if (Array.isArray(raw.tags)) {
    tags = raw.tags;
  } else if (Array.isArray(raw.categories)) {
    tags = raw.categories;
  } else if (typeof raw.tags === 'string') {
    tags = raw.tags.split(/[、,，;；\s]+/).filter(Boolean);
  }

  // Extract culture cleanly
  let culture = [];
  if (Array.isArray(raw.culture)) {
    culture = raw.culture;
  } else if (raw.culture) {
    culture = [String(raw.culture)];
  } else if (raw.country) {
    culture = [String(raw.country)];
  }

  // Normalize period/date
  const period = String(raw.dynastyOrPeriod || raw.date || raw.period || '').trim();

  // Normalize technique/medium
  const technique = String(raw.technique || raw.medium || '').trim();

  // Normalize collection
  const collection = raw.collection === 'archive' || raw.difficulty === 'complex' ? 'archive' : 'basic';

  // Normalize source platform & name
  let sourcePlatform = raw.sourcePlatform || '';
  if (!sourcePlatform) {
    if (raw.id.startsWith('museum-CMA-') || raw.batch?.includes('cma')) sourcePlatform = 'CMA';
    else if (raw.id.startsWith('met-cloud-') || raw.sourceUrl?.includes('metmuseum.org')) sourcePlatform = 'The Met';
    else sourcePlatform = raw.sourceName || raw.source || '梨花季馆藏';
  }

  // Canonical normalized record structure
  return {
    id: String(raw.id).trim(),
    title: String(raw.title || '').trim(),
    originalTitle: String(raw.originalTitle || raw.museumObjectTitle || raw.original || raw.title || '').trim(),
    subtitle: raw.subtitle ? String(raw.subtitle).trim() : null,
    region: String(raw.region || '中原').trim(),
    collection,
    styleFamily: raw.styleFamily ? String(raw.styleFamily).trim() : null,
    tags,
    culture,
    period: period || null,
    technique: technique || null,
    image: String(raw.image || raw.imageUrl || ''),
    thumbnail: String(raw.thumbnail || raw.thumbnailUrl || raw.image || ''),
    imageSha256: raw.imageSha256 || raw.sha256 || null,
    thumbnailSha256: raw.thumbnailSha256 || null,
    width: Number.isFinite(raw.width) ? Number(raw.width) : null,
    height: Number.isFinite(raw.height) ? Number(raw.height) : null,
    sourcePlatform,
    sourceName: String(raw.sourceName || raw.source || sourcePlatform).trim(),
    sourceUrl: raw.sourceUrl ? String(raw.sourceUrl).trim() : null,
    sourceApiUrl: raw.sourceApiUrl ? String(raw.sourceApiUrl).trim() : null,
    author: String(raw.author || '馆方未注明').trim(),
    license: String(raw.license || raw.sourceLicense || '开放许可').trim(),
    licenseUrl: raw.licenseUrl ? String(raw.licenseUrl).trim() : null,
    accession: raw.accession ? String(raw.accession).trim() : null,
    museumObjectId: raw.museumObjectId != null ? String(raw.museumObjectId) : null,
    rightsVerifiedAt: raw.rightsVerifiedAt ? String(raw.rightsVerifiedAt).trim() : null,
    description: raw.description ? String(raw.description).trim() : null,
    curationNote: raw.curationNote ? String(raw.curationNote).trim() : null,
    labelNote: raw.labelNote ? String(raw.labelNote).trim() : null,
    featured: Boolean(raw.featured),
    sortWeight: Number.isFinite(raw.sortWeight) ? Number(raw.sortWeight) : 0,
    searchTerms: String(raw.searchTerms || [raw.title, raw.region, raw.sourcePlatform, ...tags].join(' ')).trim()
  };
}

const normalizedList = rawCatalog.map(normalizePatternRecord);
const outputPath = path.join(root, 'content/patterns.normalized.json');
fs.writeFileSync(outputPath, JSON.stringify(normalizedList, null, 2), 'utf8');

console.log(`Successfully normalized ${normalizedList.length} patterns to: ${outputPath}`);
