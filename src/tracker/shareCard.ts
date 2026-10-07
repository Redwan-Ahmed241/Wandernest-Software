import type { Lang } from './domain/types';
import type { MapDistrict } from './components/LivingFlagMap';

export type CardFormat = 'story' | 'post';

export interface CardInput {
  format: CardFormat;
  lang: Lang;
  districts: MapDistrict[];
  viewBox: [number, number];
  visited: ReadonlySet<string>;
  want: ReadonlySet<string>;
  count: number;
  percent: number;
  rankLabel: string;
  heading: string;
  unit: string;
  site: string;
  /** Icons of earned badges. */
  badges: string[];
  badgesLabel: string;
}

const GREEN = '#006A4E';
const DEEP = '#04231b';
const RED = '#F42A41';
const FONT = 'system-ui, "Segoe UI", "Noto Sans Bengali", "Hind Siliguri", sans-serif';

const BN = '০১২৩৪৫৬৭৮৯';
const digits = (lang: Lang, s: string) => (lang === 'bn' ? s.replace(/\d/g, (d) => BN[Number(d)]) : s);

/** Pure canvas rendering from the same SVG path data the map uses. */
export async function renderCard(input: CardInput): Promise<Blob> {
  const { format, lang, districts, viewBox, visited, want, count, percent, rankLabel, heading, unit, site, badges, badgesLabel } =
    input;
  const W = 1080;
  const H = format === 'story' ? 1920 : 1350;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas unavailable');

  // background
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#07372b');
  bg.addColorStop(1, DEEP);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // sun glow
  const sun = ctx.createRadialGradient(W * 0.72, H * 0.2, 10, W * 0.72, H * 0.2, W * 0.75);
  sun.addColorStop(0, 'rgba(244,42,65,0.55)');
  sun.addColorStop(1, 'rgba(244,42,65,0)');
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, W, H);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';

  // heading
  const headY = format === 'story' ? 190 : 130;
  ctx.font = `700 54px ${FONT}`;
  wrapText(ctx, heading, W / 2, headY, W - 160, 66);

  // map
  const mapTop = format === 'story' ? 330 : 200;
  const mapBottom = format === 'story' ? H - 720 : H - 580;
  const availH = mapBottom - mapTop;
  const availW = W - 140;
  const scale = Math.min(availW / viewBox[0], availH / viewBox[1]);
  const ox = (W - viewBox[0] * scale) / 2;
  const oy = mapTop + (availH - viewBox[1] * scale) / 2;
  ctx.save();
  ctx.setTransform(scale, 0, 0, scale, ox, oy);
  ctx.lineJoin = 'round';
  ctx.lineWidth = 0.9;
  for (const d of districts) {
    const p = new Path2D(d.d);
    ctx.fillStyle = visited.has(d.id) ? RED : want.has(d.id) ? '#7fd1b0' : GREEN;
    ctx.fill(p);
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.stroke(p);
  }
  ctx.restore();

  // score
  const scoreY = mapBottom + 150;
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 170px ${FONT}`;
  ctx.fillText(`${digits(lang, String(count))}/${digits(lang, '64')}`, W / 2, scoreY);
  ctx.font = `600 46px ${FONT}`;
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText(`${digits(lang, String(percent))}% ${unit}`, W / 2, scoreY + 70);

  // rank pill
  ctx.font = `700 44px ${FONT}`;
  const tw = ctx.measureText(rankLabel).width + 80;
  const py = scoreY + 125;
  roundRect(ctx, (W - tw) / 2, py, tw, 76, 38);
  ctx.fillStyle = RED;
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillText(rankLabel, W / 2, py + 52);

  // badges
  if (badges.length) {
    ctx.font = `600 38px ${FONT}`;
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.fillText(`${badges.slice(0, 8).join(' ')}  ${digits(lang, String(badges.length))} ${badgesLabel}`, W / 2, py + 140);
  }

  // watermark
  ctx.font = `700 40px ${FONT}`;
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fillText('WanderNest BD', W / 2, H - 78);
  if (site) {
    ctx.font = `500 28px ${FONT}`;
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText(site, W / 2, H - 38);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png');
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number) {
  const words = text.split(' ');
  let line = '';
  let yy = y;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, yy);
      line = w;
      yy += lh;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, yy);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
