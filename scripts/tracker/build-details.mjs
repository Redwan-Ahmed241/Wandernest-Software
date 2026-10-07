// Validates scripts/tracker/content.mjs and writes public/tracker-data/districts/<id>.json.
// Fails (non-zero exit) on any invalid record so bad data never ships.
//
// Usage: node scripts/tracker/build-details.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONTENT } from './content.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const index = JSON.parse(readFileSync(resolve(root, 'public/tracker-data/districts-index.json'), 'utf8'));
const byId = new Map(index.districts.map((d) => [d.id, d]));
const outDir = resolve(root, 'public/tracker-data/districts');

const errors = [];
const fail = (id, msg) => errors.push(`${id}: ${msg}`);
const bil = (id, label, v) => {
  if (!v || typeof v.en !== 'string' || typeof v.bn !== 'string' || !v.en.trim() || !v.bn.trim()) {
    fail(id, `${label} needs non-empty en and bn`);
  }
};
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const URL_OK = /^https?:\/\//i;
const seen = new Set();

for (const c of CONTENT) {
  const base = byId.get(c.id);
  if (!base) {
    fail(c.id, 'unknown district id');
    continue;
  }
  if (seen.has(c.id)) fail(c.id, 'duplicate record');
  seen.add(c.id);
  if (!['draft', 'verified'].includes(c.status)) fail(c.id, 'bad status');
  bil(c.id, 'summary', c.summary);
  if (!c.bestSeason.months.length || c.bestSeason.months.some((m) => !Number.isInteger(m) || m < 1 || m > 12)) fail(c.id, 'bad months');
  for (const a of c.attractions) {
    bil(c.id, 'attraction', a.name);
    if (!['nature', 'heritage', 'landmark'].includes(a.category)) fail(c.id, `bad category ${a.category}`);
    if (a.sourceUrl && !URL_OK.test(a.sourceUrl)) fail(c.id, 'bad sourceUrl');
    if (a.lastVerified && !DATE.test(a.lastVerified)) fail(c.id, 'bad lastVerified');
  }
  for (const f of c.food) bil(c.id, 'food', f.name);
  for (const s of c.stays ?? []) {
    if (!s.source || !DATE.test(s.lastVerified ?? '')) fail(c.id, `stay "${s.name}" needs source + lastVerified`);
    if (!['৳', '৳৳', '৳৳৳'].includes(s.priceBand)) fail(c.id, `stay "${s.name}" bad priceBand`);
    for (const k of ['website', 'mapUrl']) if (s.directContact?.[k] && !URL_OK.test(s.directContact[k])) fail(c.id, `stay "${s.name}" bad ${k}`);
  }
  if (c.status === 'verified' && c.attractions.some((a) => !a.lastVerified)) fail(c.id, 'verified record needs lastVerified on every attraction');
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
for (const c of CONTENT) {
  writeFileSync(resolve(outDir, `${c.id}.json`), JSON.stringify({ ...byId.get(c.id), ...c }));
}
console.log(`wrote ${CONTENT.length} district detail files (${64 - CONTENT.length} districts have no editorial content yet)`);
