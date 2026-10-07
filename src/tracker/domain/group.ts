import { decodeMask } from './share';

export interface Member {
  name: string;
  code: string;
}

export const MAX_MEMBERS = 8;
export const cleanName = (s: string) =>
  s
    .replace(/[^\p{L}\p{M}\p{N} ]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 20);

/** Accepts a full share link (…?v=CODE) or a bare 11-character code. */
export function codeFromInput(input: string): string | null {
  const s = input.trim();
  if (decodeMask(s)) return s;
  try {
    const v = new URL(s).searchParams.get('v');
    return v && decodeMask(v) ? v : null;
  } catch {
    return null;
  }
}

/** ?g=Name.CODE~Name.CODE  (names are restricted to letters, digits and spaces). */
export function parseGroupParam(g: string | null): Member[] {
  if (!g) return [];
  const out: Member[] = [];
  for (const part of g.split('~').slice(0, MAX_MEMBERS)) {
    const i = part.lastIndexOf('.');
    if (i < 1) continue;
    const name = cleanName(part.slice(0, i));
    const code = part.slice(i + 1);
    if (name && decodeMask(code)) out.push({ name, code });
  }
  return out;
}

