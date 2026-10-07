// 64 districts -> 64-bit mask -> 8 bytes -> 11 base64url characters.
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
export const CODE_RE = /^[A-Za-z0-9_-]{11}$/;

export function encodeMask(bits: Iterable<number>): string {
  const bytes = new Uint8Array(8);
  for (const b of bits) {
    if (b >= 0 && b < 64) bytes[b >> 3] |= 1 << (b & 7);
  }
  let out = '';
  let acc = 0;
  let n = 0;
  for (const byte of bytes) {
    acc = (acc << 8) | byte;
    n += 8;
    while (n >= 6) {
      n -= 6;
      out += ALPHABET[(acc >> n) & 63];
    }
    acc &= (1 << n) - 1;
  }
  if (n > 0) out += ALPHABET[(acc << (6 - n)) & 63];
  return out;
}

/** Returns null for anything that is not a well-formed 11-char code. */
export function decodeMask(code: string | null | undefined): Set<number> | null {
  if (!code || !CODE_RE.test(code)) return null;
  const bytes = new Uint8Array(9);
  let acc = 0;
  let n = 0;
  let i = 0;
  for (const ch of code) {
    acc = (acc << 6) | ALPHABET.indexOf(ch);
    n += 6;
    if (n >= 8) {
      n -= 8;
      bytes[i++] = (acc >> n) & 255;
      acc &= (1 << n) - 1;
    }
  }
  const out = new Set<number>();
  for (let b = 0; b < 64; b++) if (bytes[b >> 3] & (1 << (b & 7))) out.add(b);
  return out;
}
