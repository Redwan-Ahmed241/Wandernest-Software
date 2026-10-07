// Validates scripts/tracker/listings.mjs and writes public/tracker-data/listings.json.
// Exits non-zero on any invalid record so bad data never ships.
//
// Usage: node scripts/tracker/build-listings.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LISTINGS } from './listings.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const index = JSON.parse(readFileSync(resolve(root, 'public/tracker-data/districts-index.json'), 'utf8'));
const districts = new Set(index.districts.map((d) => d.id));

const errors = [];
const fail = (id, msg) => errors.push(`${id}: ${msg}`);
const ID = /^[a-z0-9-]{3,60}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const HTTPS = /^https:\/\/[^\s<>"]+$/i;
const FB = /^https:\/\/(www\.|m\.|web\.)?facebook\.com\/[^\s<>"]+$/i;
// Bangladeshi mobile (01XXXXXXXXX) or landline/mobile with +880 prefix.
const BD_PHONE = /^(\+880|0)(1[3-9]\d{8}|[2-9]\d{6,9})$/;
const today = new Date().toISOString().slice(0, 10);
const seen = new Set();

for (const l of LISTINGS) {
  const id = l.id ?? '(no id)';
  if (!ID.test(id)) fail(id, 'bad id');
  if (seen.has(id)) fail(id, 'duplicate id');
  seen.add(id);
  if (!['stay', 'guide', 'tour'].includes(l.kind)) fail(id, `bad kind ${l.kind}`);
  if (!districts.has(l.district)) fail(id, `unknown district ${l.district}`);
  if (!l.name || l.name.length > 80) fail(id, 'name missing or too long');
  if (!HTTPS.test(l.sourceUrl ?? '')) fail(id, 'sourceUrl must be https');
  if (!DATE.test(l.collectedOn ?? '') || l.collectedOn > today) fail(id, 'collectedOn must be a past YYYY-MM-DD');
  if (l.about && (!l.about.en || !l.about.bn)) fail(id, 'about needs en and bn');
  if (l.priceNote && l.priceNote.length > 120) fail(id, 'priceNote too long');

  const c = l.contact ?? {};
  for (const k of ['phone', 'whatsapp']) {
    if (c[k] && !BD_PHONE.test(c[k].replace(/[\s()-]/g, ''))) fail(id, `${k} "${c[k]}" is not a Bangladeshi number`);
  }
  for (const k of ['website', 'mapUrl']) if (c[k] && !HTTPS.test(c[k])) fail(id, `${k} must be https`);
  if (c.facebook && !FB.test(c.facebook)) fail(id, 'facebook must be an https facebook.com URL');
  if (!c.phone && !c.whatsapp && !c.website && !c.facebook && !c.email) fail(id, 'needs at least one contact');
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

writeFileSync(resolve(root, 'public/tracker-data/listings.json'), JSON.stringify(LISTINGS));
const by = {};
for (const l of LISTINGS) by[l.district] = (by[l.district] ?? 0) + 1;
console.log(`wrote ${LISTINGS.length} listings across ${Object.keys(by).length} districts`, by);
