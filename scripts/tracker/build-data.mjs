// Builds tracker map + index data from the geoBoundaries BGD ADM2 GeoJSON.
//
// Source: Bangladesh Bureau of Statistics (BBS) / OCHA ROAP, via geoBoundaries (gbOpen).
// License: CC BY 3.0 IGO. Attribution is shown in the app footer.
//
// Usage: node scripts/tracker/build-data.mjs
// Outputs:
//   src/tracker/data/map.json              (inline SVG path data, imported into the bundle)
//   public/tracker-data/districts-index.json    (DistrictSummary[] + divisions, fetched at runtime)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const RAW = resolve(root, 'scripts/tracker/raw/bgd-adm2-simplified.geojson');
const TOLERANCE = Number(process.env.TOL ?? 0.55); // in SVG units (~0.4 km each)
const MIN_RING_AREA = 1.5; // drop specks smaller than this (SVG units^2)
const K = 160; // SVG units per degree of latitude
const LON0 = 88.0;
const LAT_TOP = 26.7;

const DIVISIONS = [
  { id: 'barishal', en: 'Barishal', bn: 'বরিশাল' },
  { id: 'chattogram', en: 'Chattogram', bn: 'চট্টগ্রাম' },
  { id: 'dhaka', en: 'Dhaka', bn: 'ঢাকা' },
  { id: 'khulna', en: 'Khulna', bn: 'খুলনা' },
  { id: 'mymensingh', en: 'Mymensingh', bn: 'ময়মনসিংহ' },
  { id: 'rajshahi', en: 'Rajshahi', bn: 'রাজশাহী' },
  { id: 'rangpur', en: 'Rangpur', bn: 'রংপুর' },
  { id: 'sylhet', en: 'Sylhet', bn: 'সিলেট' },
];

// geoBoundaries shapeName -> [id, display name, Bangla name, division, aliases]
const META = {
  Bagerhat: ['bagerhat', 'Bagerhat', 'বাগেরহাট', 'khulna', []],
  Bandarban: ['bandarban', 'Bandarban', 'বান্দরবান', 'chattogram', []],
  Barguna: ['barguna', 'Barguna', 'বরগুনা', 'barishal', []],
  Barisal: ['barishal', 'Barishal', 'বরিশাল', 'barishal', ['Barisal']],
  Bhola: ['bhola', 'Bhola', 'ভোলা', 'barishal', []],
  Bogra: ['bogura', 'Bogura', 'বগুড়া', 'rajshahi', ['Bogra']],
  Brahamanbaria: ['brahmanbaria', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'chattogram', ['Brahamanbaria']],
  Chandpur: ['chandpur', 'Chandpur', 'চাঁদপুর', 'chattogram', []],
  Chittagong: ['chattogram', 'Chattogram', 'চট্টগ্রাম', 'chattogram', ['Chittagong', 'CTG']],
  Chuadanga: ['chuadanga', 'Chuadanga', 'চুয়াডাঙ্গা', 'khulna', []],
  Comilla: ['cumilla', 'Cumilla', 'কুমিল্লা', 'chattogram', ['Comilla']],
  "Cox's Bazar": ['coxs-bazar', "Cox's Bazar", 'কক্সবাজার', 'chattogram', ['Cox Bazar', 'Coxsbazar']],
  Dhaka: ['dhaka', 'Dhaka', 'ঢাকা', 'dhaka', ['Dacca']],
  Dinajpur: ['dinajpur', 'Dinajpur', 'দিনাজপুর', 'rangpur', []],
  Faridpur: ['faridpur', 'Faridpur', 'ফরিদপুর', 'dhaka', []],
  Feni: ['feni', 'Feni', 'ফেনী', 'chattogram', []],
  Gaibandha: ['gaibandha', 'Gaibandha', 'গাইবান্ধা', 'rangpur', []],
  Gazipur: ['gazipur', 'Gazipur', 'গাজীপুর', 'dhaka', []],
  Gopalganj: ['gopalganj', 'Gopalganj', 'গোপালগঞ্জ', 'dhaka', []],
  Habiganj: ['habiganj', 'Habiganj', 'হবিগঞ্জ', 'sylhet', []],
  Jamalpur: ['jamalpur', 'Jamalpur', 'জামালপুর', 'mymensingh', []],
  Jessore: ['jashore', 'Jashore', 'যশোর', 'khulna', ['Jessore']],
  Jhalokati: ['jhalokathi', 'Jhalokathi', 'ঝালকাঠি', 'barishal', ['Jhalokati', 'Jhalakathi']],
  Jhenaidah: ['jhenaidah', 'Jhenaidah', 'ঝিনাইদহ', 'khulna', ['Jhenidah']],
  Joypurhat: ['joypurhat', 'Joypurhat', 'জয়পুরহাট', 'rajshahi', ['Jaipurhat']],
  Khagrachhari: ['khagrachhari', 'Khagrachhari', 'খাগড়াছড়ি', 'chattogram', ['Khagrachari']],
  Khulna: ['khulna', 'Khulna', 'খুলনা', 'khulna', []],
  Kishoreganj: ['kishoreganj', 'Kishoreganj', 'কিশোরগঞ্জ', 'dhaka', []],
  Kurigram: ['kurigram', 'Kurigram', 'কুড়িগ্রাম', 'rangpur', []],
  Kushtia: ['kushtia', 'Kushtia', 'কুষ্টিয়া', 'khulna', []],
  Lakshmipur: ['lakshmipur', 'Lakshmipur', 'লক্ষ্মীপুর', 'chattogram', ['Laxmipur']],
  Lalmonirhat: ['lalmonirhat', 'Lalmonirhat', 'লালমনিরহাট', 'rangpur', []],
  Madaripur: ['madaripur', 'Madaripur', 'মাদারীপুর', 'dhaka', []],
  Magura: ['magura', 'Magura', 'মাগুরা', 'khulna', []],
  Manikganj: ['manikganj', 'Manikganj', 'মানিকগঞ্জ', 'dhaka', []],
  Maulvibazar: ['moulvibazar', 'Moulvibazar', 'মৌলভীবাজার', 'sylhet', ['Maulvibazar', 'Maulvi Bazar']],
  Meherpur: ['meherpur', 'Meherpur', 'মেহেরপুর', 'khulna', []],
  Munshiganj: ['munshiganj', 'Munshiganj', 'মুন্সিগঞ্জ', 'dhaka', []],
  Mymensingh: ['mymensingh', 'Mymensingh', 'ময়মনসিংহ', 'mymensingh', []],
  Naogaon: ['naogaon', 'Naogaon', 'নওগাঁ', 'rajshahi', []],
  Narail: ['narail', 'Narail', 'নড়াইল', 'khulna', []],
  Narayanganj: ['narayanganj', 'Narayanganj', 'নারায়ণগঞ্জ', 'dhaka', []],
  Narsingdi: ['narsingdi', 'Narsingdi', 'নরসিংদী', 'dhaka', []],
  Natore: ['natore', 'Natore', 'নাটোর', 'rajshahi', []],
  Nawabganj: ['chapainawabganj', 'Chapainawabganj', 'চাঁপাইনবাবগঞ্জ', 'rajshahi', ['Nawabganj', 'Chapai Nawabganj', 'Chapai']],
  Netrakona: ['netrokona', 'Netrokona', 'নেত্রকোণা', 'mymensingh', ['Netrakona']],
  Nilphamari: ['nilphamari', 'Nilphamari', 'নীলফামারী', 'rangpur', []],
  Noakhali: ['noakhali', 'Noakhali', 'নোয়াখালী', 'chattogram', []],
  Pabna: ['pabna', 'Pabna', 'পাবনা', 'rajshahi', []],
  Panchagarh: ['panchagarh', 'Panchagarh', 'পঞ্চগড়', 'rangpur', []],
  Patuakhali: ['patuakhali', 'Patuakhali', 'পটুয়াখালী', 'barishal', []],
  Pirojpur: ['pirojpur', 'Pirojpur', 'পিরোজপুর', 'barishal', []],
  Rajbari: ['rajbari', 'Rajbari', 'রাজবাড়ী', 'dhaka', []],
  Rajshahi: ['rajshahi', 'Rajshahi', 'রাজশাহী', 'rajshahi', []],
  Rangamati: ['rangamati', 'Rangamati', 'রাঙ্গামাটি', 'chattogram', []],
  Rangpur: ['rangpur', 'Rangpur', 'রংপুর', 'rangpur', []],
  Satkhira: ['satkhira', 'Satkhira', 'সাতক্ষীরা', 'khulna', []],
  Shariatpur: ['shariatpur', 'Shariatpur', 'শরীয়তপুর', 'dhaka', []],
  Sherpur: ['sherpur', 'Sherpur', 'শেরপুর', 'mymensingh', []],
  Sirajganj: ['sirajganj', 'Sirajganj', 'সিরাজগঞ্জ', 'rajshahi', []],
  Sunamganj: ['sunamganj', 'Sunamganj', 'সুনামগঞ্জ', 'sylhet', []],
  Sylhet: ['sylhet', 'Sylhet', 'সিলেট', 'sylhet', []],
  Tangail: ['tangail', 'Tangail', 'টাঙ্গাইল', 'dhaka', []],
  Thakurgaon: ['thakurgaon', 'Thakurgaon', 'ঠাকুরগাঁও', 'rangpur', []],
};

const project = ([lon, lat]) => [
  (lon - LON0) * Math.cos((23.7 * Math.PI) / 180) * K,
  (LAT_TOP - lat) * K,
];

const ringArea = (r) => {
  let a = 0;
  for (let i = 0; i < r.length - 1; i++) a += r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1];
  return Math.abs(a) / 2;
};

// Douglas-Peucker on an open polyline.
function dp(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [s, e] = stack.pop();
    const [x1, y1] = pts[s];
    const [x2, y2] = pts[e];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1e-9;
    let max = 0;
    let idx = -1;
    for (let i = s + 1; i < e; i++) {
      const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / len;
      if (d > max) {
        max = d;
        idx = i;
      }
    }
    if (max > tol && idx > 0) {
      keep[idx] = 1;
      stack.push([s, idx], [idx, e]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}

function simplifyRing(ring, tol) {
  const pts = ring.slice(0, -1); // drop duplicate closing point
  // split at the two most distant points so DP handles closed rings sensibly
  let a = 0;
  let b = 0;
  let best = -1;
  const step = Math.max(1, Math.floor(pts.length / 60));
  for (let i = 0; i < pts.length; i += step) {
    for (let j = i + 1; j < pts.length; j += step) {
      const d = (pts[i][0] - pts[j][0]) ** 2 + (pts[i][1] - pts[j][1]) ** 2;
      if (d > best) {
        best = d;
        a = i;
        b = j;
      }
    }
  }
  const first = dp(pts.slice(a, b + 1), tol);
  const second = dp([...pts.slice(b), ...pts.slice(0, a + 1)], tol);
  const out = [...first.slice(0, -1), ...second.slice(0, -1)];
  return out.length >= 3 ? out : null;
}

const q = (n) => Math.round(n);

function ringToPath(ring) {
  const pts = ring.map(([x, y]) => [q(x), q(y)]);
  // remove consecutive duplicates after quantization
  const clean = pts.filter((p, i) => i === 0 || p[0] !== pts[i - 1][0] || p[1] !== pts[i - 1][1]);
  if (clean.length < 3) return '';
  let d = `M${clean[0][0]} ${clean[0][1]}l`;
  const parts = [];
  for (let i = 1; i < clean.length; i++) {
    parts.push(`${clean[i][0] - clean[i - 1][0]} ${clean[i][1] - clean[i - 1][1]}`);
  }
  d += parts.join(' ') + 'z';
  return d;
}

function centroidOf(rings) {
  // area-weighted centroid of the largest ring (lon/lat)
  let best = null;
  let bestA = -1;
  for (const r of rings) {
    const a = ringArea(r);
    if (a > bestA) {
      bestA = a;
      best = r;
    }
  }
  let cx = 0;
  let cy = 0;
  let a2 = 0;
  for (let i = 0; i < best.length - 1; i++) {
    const [x0, y0] = best[i];
    const [x1, y1] = best[i + 1];
    const f = x0 * y1 - x1 * y0;
    a2 += f;
    cx += (x0 + x1) * f;
    cy += (y0 + y1) * f;
  }
  return [cx / (3 * a2), cy / (3 * a2)];
}

const geo = JSON.parse(readFileSync(RAW, 'utf8'));
const items = [];
for (const f of geo.features) {
  const name = f.properties.shapeName;
  const m = META[name];
  if (!m) throw new Error(`No metadata for geoBoundaries name: ${name}`);
  const polys = f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates : [f.geometry.coordinates];
  // outer rings only (no holes in district data of interest)
  const outers = polys.map((p) => p[0]);
  items.push({ name, meta: m, outers });
}
if (items.length !== 64) throw new Error(`Expected 64 districts, got ${items.length}`);
const ids = new Set(items.map((i) => i.meta[0]));
if (ids.size !== 64) throw new Error('Duplicate district ids');

// stable bit order: alphabetical by id
items.sort((a, b) => a.meta[0].localeCompare(b.meta[0]));

// neighbours via shared/near vertices on a grid (~330 m)
const CELL = 0.003;
const grid = new Map();
items.forEach((it, idx) => {
  for (const r of it.outers) {
    for (const [lon, lat] of r) {
      const key = `${Math.round(lon / CELL)}:${Math.round(lat / CELL)}`;
      let s = grid.get(key);
      if (!s) grid.set(key, (s = new Set()));
      s.add(idx);
    }
  }
});
const nb = items.map(() => new Map());
for (const s of grid.values()) {
  const arr = [...s];
  for (const a of arr) for (const b of arr) if (a !== b) nb[a].set(b, (nb[a].get(b) ?? 0) + 1);
}

const mapDistricts = [];
const index = [];
let totalPts = 0;
items.forEach((it, bit) => {
  const [id, en, bn, division, aliases] = it.meta;
  const paths = [];
  for (const ring of it.outers) {
    const proj = ring.map(project);
    if (ringArea(proj) < MIN_RING_AREA) continue;
    const s = simplifyRing(proj, TOLERANCE);
    if (!s) continue;
    totalPts += s.length;
    const p = ringToPath([...s, s[0]]);
    if (p) paths.push(p);
  }
  const [clon, clat] = centroidOf(it.outers);
  const [cx, cy] = project([clon, clat]);
  mapDistricts.push({ id, d: paths.join(''), c: [q(cx), q(cy)] });
  index.push({
    id,
    bit,
    name_en: en,
    name_bn: bn,
    aliases,
    division,
    centroid: [Number(clon.toFixed(4)), Number(clat.toFixed(4))],
    neighbors: [...nb[bit].entries()]
      .filter(([, n]) => n >= 2)
      .map(([j]) => items[j].meta[0])
      .sort(),
  });
});

const W = Math.ceil(Math.max(...geo.features.flatMap((f) => (f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates.flat(2) : f.geometry.coordinates.flat(1)).map((c) => project(c)[0]))));
const H = Math.ceil(Math.max(...geo.features.flatMap((f) => (f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates.flat(2) : f.geometry.coordinates.flat(1)).map((c) => project(c)[1]))));

const mapOut = resolve(root, 'src/tracker/data/map.json');
const idxOut = resolve(root, 'public/tracker-data/districts-index.json');
mkdirSync(dirname(mapOut), { recursive: true });
mkdirSync(dirname(idxOut), { recursive: true });
writeFileSync(mapOut, JSON.stringify({ viewBox: [W, H], districts: mapDistricts }));
writeFileSync(
  idxOut,
  JSON.stringify({
    schema: 1,
    attribution: 'Boundaries: Bangladesh Bureau of Statistics / OCHA ROAP via geoBoundaries (CC BY 3.0 IGO)',
    divisions: DIVISIONS,
    districts: index,
  }),
);
console.log(`viewBox ${W}x${H}, points ${totalPts}, map.json ${JSON.stringify({ viewBox: [W, H], districts: mapDistricts }).length} bytes`);
const nbCounts = index.map((i) => i.neighbors.length);
console.log(`neighbors min/max/avg ${Math.min(...nbCounts)}/${Math.max(...nbCounts)}/${(nbCounts.reduce((a, b) => a + b, 0) / 64).toFixed(1)}`);
