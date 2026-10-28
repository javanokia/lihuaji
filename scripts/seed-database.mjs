import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const normalized = JSON.parse(
  fs.readFileSync(path.join(root, 'content/patterns.normalized.json'), 'utf8')
);

function sqlEscape(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'number') return Number.isFinite(val) ? String(val) : 'NULL';
  if (typeof val === 'object') {
    return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
  }
  return `'${String(val).replace(/'/g, "''")}'`;
}

const lines = [
  '-- Auto-generated SQL seed script for Lihuaji Pattern Database',
  `-- Total records: ${normalized.length}`,
  '',
  'BEGIN TRANSACTION;',
  ''
];

for (const p of normalized) {
  lines.push(
    `INSERT INTO patterns (id, title, original_title, subtitle, region, collection, style_family, tags, culture, period, technique, image, thumbnail, image_sha256, thumbnail_sha256, width, height, source_platform, source_name, source_url, source_api_url, author, license, license_url, accession, museum_object_id, rights_verified_at, description, curation_note, label_note, featured, sort_weight, search_terms) VALUES (${[
      sqlEscape(p.id),
      sqlEscape(p.title),
      sqlEscape(p.originalTitle),
      sqlEscape(p.subtitle),
      sqlEscape(p.region),
      sqlEscape(p.collection),
      sqlEscape(p.styleFamily),
      sqlEscape(p.tags),
      sqlEscape(p.culture),
      sqlEscape(p.period),
      sqlEscape(p.technique),
      sqlEscape(p.image),
      sqlEscape(p.thumbnail),
      sqlEscape(p.imageSha256),
      sqlEscape(p.thumbnailSha256),
      sqlEscape(p.width),
      sqlEscape(p.height),
      sqlEscape(p.sourcePlatform),
      sqlEscape(p.sourceName),
      sqlEscape(p.sourceUrl),
      sqlEscape(p.sourceApiUrl),
      sqlEscape(p.author),
      sqlEscape(p.license),
      sqlEscape(p.licenseUrl),
      sqlEscape(p.accession),
      sqlEscape(p.museumObjectId),
      sqlEscape(p.rightsVerifiedAt),
      sqlEscape(p.description),
      sqlEscape(p.curationNote),
      sqlEscape(p.labelNote),
      sqlEscape(p.featured),
      sqlEscape(p.sortWeight),
      sqlEscape(p.searchTerms)
    ].join(', ')});`
  );
}

lines.push('');
lines.push('COMMIT;');

const outputPath = path.join(root, 'contracts/seed-patterns.sql');
fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');

console.log(`Successfully generated SQL seed file with ${normalized.length} entries at: ${outputPath}`);
