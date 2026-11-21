import type { Mood, PetKind, PetState, Stage } from './types';
import { PETS, STAGE_NAMES } from './pets';

/**
 * Pixel-art pets rendered as pure SVG strings.
 * The same strings power the README card (<img> on GitHub, edge-rendered)
 * and the inline sprites in the web app, so both always match.
 * Animations are CSS keyframes inside the SVG: no JS, works inside <img>.
 */

export interface ArtProps {
  kind: PetKind;
  stage: Stage;
  mood: Mood;
  aura: boolean;
  cracks: number;
}

type PalKey = 'k' | 'b' | 'B' | 'l' | 'a' | 'p' | 'n';
type Pal = Record<PalKey, string>;

const INK = '#171321';
const f = (x: number) => Math.round(x * 100) / 100;
const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ESC[c]);
const rect = (x: number, y: number, w: number, h: number, fill: string, extra = '') =>
  `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}"${extra}/>`;

/* ───────────── palettes ───────────── */
const PAL: Record<PetKind, { base: Pal; shiny: Pal }> = {
  cat: {
    base: { k: '#2b1b17', b: '#f5a65b', B: '#d9822b', l: '#ffe3c2', a: '#ff8fa3', p: '#ff9db1', n: '#5a2d2d' },
    shiny: { k: '#1d2147', b: '#aab8ff', B: '#7f90f2', l: '#eef1ff', a: '#ffd966', p: '#ffb3e6', n: '#3a3f8f' },
  },
  dog: {
    base: { k: '#2b1b17', b: '#e0b17a', B: '#8a5a2b', l: '#f8e6c8', a: '#ff8fa3', p: '#ff9db1', n: '#2b1b17' },
    shiny: { k: '#4a3000', b: '#ffd34d', B: '#d99a00', l: '#fff3b0', a: '#ffffff', p: '#ffa6c9', n: '#4a3000' },
  },
  axolotl: {
    base: { k: '#4a1f3a', b: '#ffb3d1', B: '#ff8fb8', l: '#ffe0ee', a: '#ff4f87', p: '#ff7aa8', n: '#4a1f3a' },
    shiny: { k: '#06394a', b: '#9ef0ff', B: '#5fd4f0', l: '#e4fcff', a: '#2b8cff', p: '#7fe0ff', n: '#06394a' },
  },
  dragon: {
    base: { k: '#052e16', b: '#4ade80', B: '#16a34a', l: '#bbf7d0', a: '#fbbf24', p: '#fb7185', n: '#14532d' },
    shiny: { k: '#2e1065', b: '#c084fc', B: '#9333ea', l: '#f3e8ff', a: '#fde047', p: '#f0abfc', n: '#3b0764' },
  },
  capybara: {
    base: { k: '#2a1a0d', b: '#b9824a', B: '#8b5e34', l: '#dcc08e', a: '#d6a46b', p: '#e59a7a', n: '#3b2412' },
    shiny: { k: '#083344', b: '#5eead4', B: '#14b8a6', l: '#ccfbf1', a: '#fde68a', p: '#fda4af', n: '#134e4a' },
  },
};
const GHOST: Pal = { k: '#7480c4', b: '#d6defc', B: '#a9b6ee', l: '#f1f4ff', a: '#a9b6ee', p: '#c3ccf7', n: '#6470b0' };

/* ───────────── sprites (E = eye cell, M = mouth anchor) ───────────── */
const GRID: Record<PetKind, string[]> = {
  cat: [
    '..k..........k..',
    '.kbk........kbk.',
    '.kbak......kabk.',
    '.kbbbkkkkkkbbbk.',
    'kbbbbbbbbbbbbbbk',
    'kbbbbbbbbbbbbbbk',
    'kbbbEbbbbbbEbbbk',
    'kbbbEbbbbbbEbbbk',
    'kbbpbbbnnbbbpbbk',
    'kbbbbbbMMbbbbbbk',
    'kbbbbbbbbbbbbbbk',
    '.kbbbbbbbbbbbbk.',
    '..kkbbbbbbbbkk..',
    '...kkkkkkkkkk...',
  ],
  dog: [
    '..kkk......kkk..',
    '.kBBBk....kBBBk.',
    '.kBBBkkkkkkBBBk.',
    'kBBBbbbbbbbbBBBk',
    'kBBBbbbbbbbbBBBk',
    'kBBBbEbbbbEbBBBk',
    'kBBBbEbbbbEbBBBk',
    'kBBBbllllllbBBBk',
    'kBBBbllnnllbBBBk',
    'kBBBbllMMllbBBBk',
    'kBBBbllllllbBBBk',
    '.kBBbbbbbbbbBBk.',
    '..kkkbbbbbbkkk..',
    '.....kkkkkk.....',
  ],
  axolotl: [
    '....kkkkkkkk....',
    'a...kbbbbbbk...a',
    'aa.kbbbbbbbbk.aa',
    '.aakbbbbbbbbkaa.',
    'aakbbbbbbbbbbkaa',
    '.akbbbbbbbbbbka.',
    '..kbbEbbbbEbbk..',
    '..kbbEbbbbEbbk..',
    '..kbpbbbbbbpbk..',
    '..kbbbbMMbbbbk..',
    '..kbbbllllbbbk..',
    '...kbbbbbbbbk...',
    '....kkkkkkkk....',
    '................',
  ],
  dragon: [
    '..a....aa....a..',
    '..aa..aaaa..aa..',
    '...kkkkkkkkkk...',
    '..kbbbbbbbbbbk..',
    '.kbbbbbbbbbbbbk.',
    '.kbbEbbbbbbEbbk.',
    '.kbbEbbbbbbEbbk.',
    '.kbbllllllllbbk.',
    '.kbbllnllnllbbk.',
    '.kbblllMMlllbbk.',
    '.kbbllllllllbbk.',
    '..kbbbbbbbbbbk..',
    '...kkkkkkkkkk...',
    '................',
  ],
  capybara: [
    '...kk......kk...',
    '..kbbk....kbbk..',
    '.kbbbkkkkkkbbbk.',
    'kbbbbbbbbbbbbbbk',
    'kbbbEbbbbbbEbbbk',
    'kbbbEbbbbbbEbbbk',
    'kbbbbbbbbbbbbbbk',
    'kbbllllllllllbbk',
    'kbbllnnnnnnllbbk',
    'kbbllllMMllllbbk',
    'kbbllllllllllbbk',
    '.kbbbbbbbbbbbbk.',
    '..kkkkkkkkkkkk..',
    '................',
  ],
};

const EGG: string[] = [
  '....kkkk....',
  '..kkbbbbkk..',
  '.kbbbbbbbbk.',
  '.kbbSSbbbbk.',
  'kbbbSSbbbbbk',
  'kbbbbbbbbSbk',
  'kbbEbbbbEbbk',
  'kbbEbbbbEbbk',
  'kbbbbMMbbbbk',
  'kbSbbbbbbSbk',
  '.kbbbbbbbbk.',
  '.kkbbbbbbkk.',
  '...kkkkkk...',
];

const colorOf = (ch: string, pal: Pal): string | null => {
  if (ch === '.') return null;
  if (ch === 'S') return pal.a;
  return pal[ch as PalKey] ?? null;
};

function normalize(g: string[]): string[] {
  return g.map((row) =>
    [...row].map((ch, i, arr) => {
      if (ch !== 'E' && ch !== 'M') return ch;
      for (let j = i - 1; j >= 0; j--) if (arr[j] !== 'E' && arr[j] !== 'M') return arr[j];
      for (let j = i + 1; j < arr.length; j++) if (arr[j] !== 'E' && arr[j] !== 'M') return arr[j];
      return 'b';
    }).join(''));
}
function eyeAnchors(g: string[]) {
  const out: [number, number][] = [];
  g.forEach((row, r) => [...row].forEach((ch, c) => { if (ch === 'E' && g[r - 1]?.[c] !== 'E') out.push([c, r]); }));
  return out;
}
function mouthPos(g: string[]) {
  for (let r = 0; r < g.length; r++) {
    const i = g[r].indexOf('M');
    if (i >= 0) return { cx: (i + g[r].lastIndexOf('M') + 1) / 2, r };
  }
  return null;
}
const mk = (raw: string[]) => ({ raw, norm: normalize(raw), eyes: eyeAnchors(raw), mouth: mouthPos(raw) });
type Spr = ReturnType<typeof mk>;
const SPR = Object.fromEntries((Object.keys(GRID) as PetKind[]).map((k) => [k, mk(GRID[k])])) as Record<PetKind, Spr>;
const EGG_SPR = mk(EGG);

/* ───────────── drawing helpers ───────────── */
function bodySVG(g: string[], pal: Pal, u: number) {
  let s = '';
  g.forEach((row, r) => {
    let c = 0;
    while (c < row.length) {
      const col = colorOf(row[c], pal);
      if (!col) { c++; continue; }
      let e = c + 1;
      while (e < row.length && colorOf(row[e], pal) === col) e++;
      s += rect(c * u, r * u, (e - c) * u, u, col);
      c = e;
    }
  });
  return s;
}

function eyesSVG(mood: Mood, anc: [number, number][], u: number) {
  let open = '';
  let rest = '';
  anc.forEach(([c, r], i) => {
    const x = c * u;
    const y = r * u;
    if (mood === 'ghost') {
      rest += ([[0, 0.4], [0.6, 0.4], [0.3, 0.85], [0, 1.3], [0.6, 1.3]] as const)
        .map(([dx, dy]) => rect(x + dx * u, y + dy * u, 0.4 * u, 0.4 * u, INK)).join('');
    } else if (mood === 'sleepy') {
      rest += rect(x - 0.15 * u, y + 1.2 * u, 1.3 * u, 0.4 * u, INK);
    } else if (mood === 'happy') {
      rest += rect(x + 0.25 * u, y + 0.4 * u, 0.5 * u, 0.5 * u, INK)
        + rect(x, y + 0.9 * u, 0.4 * u, 0.6 * u, INK) + rect(x + 0.6 * u, y + 0.9 * u, 0.4 * u, 0.6 * u, INK);
    } else if (mood === 'tired') {
      rest += rect(x, y + 0.9 * u, u, 1.1 * u, INK) + rect(x + 0.15 * u, y + 1.05 * u, 0.4 * u, 0.4 * u, '#fff');
    } else {
      open += rect(x, y, u, 2 * u, INK) + rect(x + 0.1 * u, y + 0.2 * u, 0.55 * u, 0.55 * u, '#fff')
        + rect(x + 0.6 * u, y + 1.2 * u, 0.28 * u, 0.28 * u, '#fff');
      if (mood === 'sad') {
        rest += `<rect class="pp-tear" style="animation-delay:${i * 0.7}s" x="${f(x + 0.2 * u)}" y="${f(y + 2 * u)}" width="${f(0.6 * u)}" height="${f(0.9 * u)}" fill="#7dd3fc"/>`;
      }
    }
  });
  return (open ? `<g class="pp-blink">${open}</g>` : '') + rest;
}

function mouthSVG(mood: Mood, cx: number, y: number, u: number) {
  switch (mood) {
    case 'happy':
      return rect(cx - 2 * u, y, u, u, INK) + rect(cx - u, y + u, 2 * u, u, INK) + rect(cx + u, y, u, u, INK);
    case 'sad':
      return rect(cx - 2 * u, y + u, u, u, INK) + rect(cx - u, y, 2 * u, u, INK) + rect(cx + u, y + u, u, u, INK);
    case 'hungry':
      return rect(cx - u, y, 2 * u, 2 * u, INK) + rect(cx - 0.6 * u, y + 1.2 * u, 1.2 * u, 0.8 * u, '#ff6b81');
    case 'sleepy':
      return rect(cx - 0.6 * u, y + 0.2 * u, 1.2 * u, 1.1 * u, INK);
    case 'ghost':
      return rect(cx - u, y + 0.2 * u, 2 * u, 1.4 * u, INK);
    default:
      return rect(cx - 1.5 * u, y + 0.4 * u, 3 * u, 0.5 * u, INK);
  }
}

function crownSVG(w: number, u: number) {
  const x = w / 2 - 3.5 * u;
  const y = -2.4 * u;
  const G = '#ffd166';
  let s = '';
  [0, 3, 6].forEach((c) => { s += rect(x + c * u, y, u, u, G); });
  s += rect(x, y + u, 7 * u, u, G) + rect(x, y + 2 * u, 7 * u, u, '#e09f1f')
    + rect(x + 3 * u, y + u, u, u, '#ff4fd8') + rect(x + u, y + u, u, u, '#38e8ff') + rect(x + 5 * u, y + u, u, u, '#38e8ff');
  return s;
}

function cracksSVG(n: number, w: number, u: number) {
  const p = (d: string) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${f(u * 0.38)}"/>`;
  const x = w / 2;
  const l = (dx: number, dy: number) => `l${f(dx * u)} ${f(dy * u)}`;
  let s = p(`M${f(x - u * 0.5)} ${f(u * 1.2)}${l(0.9, 1.4)}${l(-0.9, 1.3)}${l(0.9, 1.5)}`);
  if (n > 1) s += p(`M${f(x + u * 2.6)} ${f(u * 3.2)}${l(-0.8, 1.2)}${l(1, 1)}`);
  if (n > 2) s += p(`M${f(x - u * 3.2)} ${f(u * 6.5)}${l(1, 0.9)}${l(-0.7, 1.1)}`);
  return s;
}

const heart = (x: number, y: number, s: number, d: number) =>
  `<g class="pp-heart" style="animation-delay:${d}s">${['.x.x.', 'xxxxx', '.xxx.', '..x..']
    .map((row, r) => [...row].map((ch, c) => (ch === 'x' ? rect(x + c * s, y + r * s, s, s, '#ff5c8a') : '')).join('')).join('')}</g>`;

const star = (x: number, y: number, r: number, d: number, fill: string) =>
  `<g transform="translate(${f(x)} ${f(y)})"><polygon class="pp-twinkle" style="animation-delay:${d}s" fill="${fill}" points="0,${-r} ${f(r * 0.3)},${f(-r * 0.3)} ${r},0 ${f(r * 0.3)},${f(r * 0.3)} 0,${r} ${f(-r * 0.3)},${f(r * 0.3)} ${-r},0 ${f(-r * 0.3)},${f(-r * 0.3)}"/></g>`;

const zzz = (x: number, y: number) =>
  [0, 1.2].map((d, i) => `<text class="pp-zzz" style="animation-delay:${d}s" x="${f(x + i * 9)}" y="${f(y - i * 10)}" font-size="${14 - i * 3}" font-weight="800" fill="#9fb6ff" font-family="monospace">${i ? 'z' : 'Z'}</text>`).join('');

const MOTION: Record<Mood, string> = {
  happy: 'pp-jump', sleepy: 'pp-bob-slow', tired: 'pp-bob-slow', hungry: 'pp-shake', sad: 'pp-sad', ghost: 'pp-float',
};
const CELL: Record<number, number> = { 0: 9, 1: 6, 2: 7.5, 3: 9, 4: 9.5 };

/** One pet: aura + shadow + sprite + ornaments. Centered on cx, feet on `ground`. */
export function petScene(a: ArtProps, cx: number, ground: number, uid: string): string {
  const u = CELL[a.stage];
  const sp = a.stage === 0 ? EGG_SPR : SPR[a.kind];
  const ghost = a.mood === 'ghost';
  const pal = ghost ? GHOST : a.stage === 4 ? PAL[a.kind].shiny : PAL[a.kind].base;
  const w = sp.raw[0].length * u;
  const h = sp.raw.length * u;

  let inner = `<g shape-rendering="crispEdges">${bodySVG(sp.norm, pal, u)}`
    + `${eyesSVG(a.mood, sp.eyes, u)}${sp.mouth ? mouthSVG(a.mood, sp.mouth.cx * u, sp.mouth.r * u, u) : ''}`;
  if (a.stage === 0 && a.cracks > 0 && !ghost) inner += cracksSVG(a.cracks, w, u);
  if (a.stage === 4 && !ghost) inner += crownSVG(w, u);
  inner += '</g>';

  const motion = ghost ? 'pp-float' : a.stage === 0 ? (a.mood === 'happy' ? 'pp-wobble-fast' : 'pp-wobble') : MOTION[a.mood];

  let orn = '';
  if (a.mood === 'happy') orn += heart(w * 0.84, -u * 0.5, 3, 0) + heart(w * 0.02, u * 0.6, 2.4, 1.1);
  if (a.mood === 'sleepy') orn += zzz(w * 0.78, -u * 0.2);
  if (a.mood === 'tired') orn += `<rect class="pp-tear" x="${f(w * 0.86)}" y="${f(u * 0.8)}" width="${f(u * 0.5)}" height="${f(u * 0.8)}" fill="#7dd3fc"/>`;
  if (ghost) orn += `<ellipse class="pp-halo" cx="${f(w / 2)}" cy="${f(-u * 1.2)}" rx="${f(u * 3.2)}" ry="${f(u * 0.8)}" fill="none" stroke="#ffe9a8" stroke-width="${f(u * 0.5)}"/>`;
  if (a.stage === 4 && !ghost) {
    orn += star(-u, u * 2, 7, 0, '#ffd166') + star(w + u, u * 1.5, 5, 0.6, '#ffffff')
      + star(w * 0.1, -u * 2.2, 4, 1.1, '#ffd166') + star(w * 0.92, h * 0.55, 6, 1.5, '#ff4fd8');
  }

  const auraColor = ghost ? '#8b8fd6' : a.stage === 4 ? '#ffd166' : PETS[a.kind].color;
  const aura = a.aura || ghost
    ? `<defs><radialGradient id="${uid}a"><stop offset="0" stop-color="${auraColor}" stop-opacity="${ghost ? 0.35 : 0.6}"/><stop offset="1" stop-color="${auraColor}" stop-opacity="0"/></radialGradient></defs>`
      + `<circle class="pp-aura" cx="${f(cx)}" cy="${f(ground - h / 2)}" r="${f(Math.max(w, h) * 0.95)}" fill="url(#${uid}a)"/>`
    : '';
  const shadow = `<ellipse class="${a.mood === 'happy' && a.stage > 0 ? 'pp-shadow' : ''}" cx="${f(cx)}" cy="${f(ground + 3)}" rx="${f(w * 0.36)}" ry="5" fill="#000" fill-opacity="${ghost ? 0.15 : 0.38}"/>`;

  return `<g>${aura}${shadow}<g transform="translate(${f(cx - w / 2)} ${f(ground - h)})"><g class="${motion}">${inner}</g>${orn}</g></g>`;
}

export const ART_CSS = `
[class^="pp-"],[class*=" pp-"]{transform-box:fill-box;transform-origin:50% 100%}
.pp-blink,.pp-twinkle,.pp-aura,.pp-shadow,.pp-halo,.pp-pulse{transform-origin:50% 50%}
.pp-fill{transform-origin:0 50%}
.pp-bob-slow{animation:pp-bob 3.6s ease-in-out infinite}
.pp-jump{animation:pp-jump 1.1s cubic-bezier(.3,.7,.4,1) infinite}
.pp-shake{animation:pp-shake 1.2s linear infinite}
.pp-sad{animation:pp-sad 3.2s ease-in-out infinite}
.pp-float{animation:pp-float 3.4s ease-in-out infinite}
.pp-wobble{animation:pp-wobble 2.6s ease-in-out infinite}
.pp-wobble-fast{animation:pp-wobble 1s ease-in-out infinite}
.pp-blink{animation:pp-blink 4.2s infinite}
.pp-tear{animation:pp-tear 1.8s ease-in infinite}
.pp-zzz{animation:pp-zzz 3s ease-in-out infinite}
.pp-heart{animation:pp-heart 2.4s ease-out infinite}
.pp-twinkle{animation:pp-tw 2s ease-in-out infinite}
.pp-aura{animation:pp-aura 3.2s ease-in-out infinite}
.pp-halo{animation:pp-aura 2.4s ease-in-out infinite}
.pp-shadow{animation:pp-shadow 1.1s ease-in-out infinite}
.pp-fill{animation:pp-fill 1.3s cubic-bezier(.2,.8,.2,1) both}
.pp-pulse{animation:pp-pulse 1.1s ease-in-out infinite}
@keyframes pp-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes pp-jump{0%,100%{transform:translateY(0) scale(1,1)}12%{transform:translateY(0) scale(1.07,.91)}40%,60%{transform:translateY(-20px) scale(.96,1.05)}88%{transform:translateY(0) scale(1.07,.91)}}
@keyframes pp-shake{0%,55%,100%{transform:translateX(0)}10%{transform:translateX(-3px)}20%{transform:translateX(3px)}30%{transform:translateX(-3px)}40%{transform:translateX(2px)}}
@keyframes pp-sad{0%,100%{transform:translateY(0) rotate(-1.2deg)}50%{transform:translateY(3px) rotate(1.2deg) scale(1,.97)}}
@keyframes pp-float{0%,100%{transform:translateY(0);opacity:.62}50%{transform:translateY(-9px);opacity:.88}}
@keyframes pp-wobble{0%,60%,100%{transform:rotate(0)}68%{transform:rotate(-5deg)}76%{transform:rotate(5deg)}84%{transform:rotate(-3deg)}92%{transform:rotate(2deg)}}
@keyframes pp-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.08)}}
@keyframes pp-tear{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(26px);opacity:0}}
@keyframes pp-zzz{0%{transform:translate(0,6px);opacity:0}30%{opacity:1}100%{transform:translate(8px,-14px);opacity:0}}
@keyframes pp-heart{0%{transform:translateY(8px) scale(.6);opacity:0}25%{opacity:1}100%{transform:translateY(-24px) scale(1);opacity:0}}
@keyframes pp-tw{0%,100%{transform:scale(.3);opacity:.2}50%{transform:scale(1);opacity:1}}
@keyframes pp-aura{0%,100%{transform:scale(.92);opacity:.75}50%{transform:scale(1.08);opacity:1}}
@keyframes pp-shadow{0%,100%{transform:scaleX(1);opacity:1}40%,60%{transform:scaleX(.7);opacity:.6}}
@keyframes pp-fill{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes pp-pulse{0%,100%{opacity:1}50%{opacity:.35}}
@media (prefers-reduced-motion:reduce){[class^="pp-"],[class*=" pp-"]{animation:none!important}}
`;

/** Standalone sprite for the web app (square viewBox, transparent background). */
export function petSVG(a: ArtProps, o: { uid?: string } = {}): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220" width="100%" height="100%" role="img" aria-label="${a.kind} feeling ${a.mood}"><style>${ART_CSS}</style>${petScene(a, 110, 196, o.uid ?? 'pp')}</svg>`;
}

/* ───────────── README card ───────────── */
const LV = ['#1b2230', '#0e4429', '#006d32', '#26a641', '#39d353'];
const lvl = (c: number) => (c === 0 ? 0 : c < 3 ? 1 : c < 6 ? 2 : c < 10 ? 3 : 4);

function wrap(s: string, max: number) {
  const lines: string[] = [];
  let cur = '';
  for (const w of s.split(' ')) {
    if ((cur + ' ' + w).trim().length > max) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 2);
}

export function cardSVG(s: PetState, o: { username: string }): string {
  const m = s.month;
  const meta = PETS[s.kind];
  const neon = s.mood === 'ghost' ? '#8b8fd6' : s.stage === 4 ? '#ffd166'
    : s.mood === 'sad' || s.mood === 'hungry' ? '#ff6b81' : s.mood === 'sleepy' || s.mood === 'tired' ? '#7aa2ff' : '#39ff88';
  const lines = wrap(s.speech, 62);
  const bubble = lines.map((l, i) =>
    `<text x="579" y="${lines.length === 1 ? 51 : 44 + i * 17}" text-anchor="middle" font-size="13" font-weight="700" fill="#0d1117">${esc(l)}</text>`).join('');

  const bars = ([
    ['HP', s.hp, `${s.hp}%`, 'g-hp'],
    ['XP', s.xpPct, `LV${s.level} · ${s.xpPct}%`, 'g-xp'],
    ['HUNGER', s.hunger, `${s.hunger}% fed`, 'g-hu'],
    ['JOY', s.happiness, `${s.happiness}%`, 'g-jo'],
  ] as const).map(([label, v, txt, g], i) => {
    const y = 128 + i * 22;
    const low = v < 25 && label !== 'XP';
    return `<text x="308" y="${y + 9}" font-size="11" font-weight="700" fill="#8b949e">${label}</text>`
      + `<rect x="382" y="${y}" width="360" height="10" rx="5" fill="#fff" fill-opacity=".08"/>`
      + (v > 0 ? `<rect class="pp-fill${low ? ' pp-pulse' : ''}" style="animation-delay:${i * 0.12}s" x="382" y="${y}" width="${f((360 * v) / 100)}" height="10" rx="5" fill="url(#${g})"/>` : '')
      + `<text x="844" y="${y + 9}" text-anchor="end" font-size="11" font-weight="700" fill="${low ? '#ff6b81' : '#e6edf3'}">${txt}</text>`;
  }).join('');

  const heat = m.days.map((d, i) => {
    const x = 308 + (i % 15) * 28;
    const y = 230 + (i < 15 ? 0 : 1) * 18;
    const today = i === 29;
    return `<rect${today ? ' class="pp-pulse"' : ''} x="${x}" y="${y}" width="14" height="14" rx="3" fill="${LV[lvl(d.count)]}"${today ? ' stroke="#fff" stroke-width="1.5"' : ''}/>`;
  }).join('');

  const top = s.mood === 'ghost' ? 'GHOST MODE · 1 COMMIT REVIVES'
    : s.streakAtRisk && s.hoursLeft <= 6 ? `${s.hoursLeft}H LEFT · SAVE THE STREAK`
    : s.month.beast ? 'MONTHLY BEAST' : '';
  const topCol = s.mood === 'ghost' ? '#a9b6ee' : s.month.beast && !(s.streakAtRisk && s.hoursLeft <= 6) ? '#ffd166' : '#ff6b81';
  const sub = `${s.streak}-DAY STREAK · BEST ${s.longestStreak} · LV ${s.level}${s.boosted ? ' · BOOSTED' : ''}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="860" height="300" viewBox="0 0 860 300" role="img" aria-label="${esc(o.username)}'s GitHub pet: ${s.stageName} ${meta.name}, ${s.mood}" font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace">
<title>${esc(o.username)}'s GitHub Pet · ${s.stageName} ${meta.name} · ${s.streak}-day streak</title>
<style>${ART_CSS}</style>
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0d1117"/><stop offset="1" stop-color="#1a1330"/></linearGradient>
<linearGradient id="stg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".07"/><stop offset="1" stop-color="#fff" stop-opacity=".01"/></linearGradient>
<linearGradient id="g-hp"><stop offset="0" stop-color="#ff4d6d"/><stop offset="1" stop-color="#ff8fa3"/></linearGradient>
<linearGradient id="g-xp"><stop offset="0" stop-color="#38e8ff"/><stop offset="1" stop-color="#7aa2ff"/></linearGradient>
<linearGradient id="g-hu"><stop offset="0" stop-color="#ffa94d"/><stop offset="1" stop-color="#ffd166"/></linearGradient>
<linearGradient id="g-jo"><stop offset="0" stop-color="#39ff88"/><stop offset="1" stop-color="#b6ff5c"/></linearGradient>
<pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0H0V16" fill="none" stroke="#fff" stroke-opacity=".04"/></pattern>
<clipPath id="stage"><rect x="16" y="16" width="260" height="268" rx="16"/></clipPath>
</defs>
<rect width="860" height="300" rx="20" fill="url(#bg)"/>
<rect width="860" height="300" rx="20" fill="url(#grid)"/>
<rect x=".75" y=".75" width="858.5" height="298.5" rx="19.5" fill="none" stroke="${neon}" stroke-opacity=".6" stroke-width="1.5"/>
<rect x="16" y="16" width="260" height="268" rx="16" fill="url(#stg)" stroke="#fff" stroke-opacity=".08"/>
<g clip-path="url(#stage)">
<rect x="16" y="228" width="260" height="56" fill="#000" fill-opacity=".18"/>
${petScene(s, 146, 226, 'c')}
</g>
${top ? `<text class="pp-pulse" x="146" y="36" text-anchor="middle" font-size="10" font-weight="800" fill="${topCol}">${top}</text>` : ''}
<text x="146" y="258" text-anchor="middle" font-size="12" font-weight="800" fill="#e6edf3">${s.stageName.toUpperCase()} ${meta.name.toUpperCase()}</text>
<text x="146" y="274" text-anchor="middle" font-size="10" fill="#8b949e">${esc(meta.trait.toUpperCase())} · ${esc(m.tierLabel.toUpperCase())}</text>
<rect x="308" y="20" width="536" height="54" rx="10" fill="#e6edf3"/>
<polygon points="296,46 310,38 310,54" fill="#e6edf3"/>
${bubble}
<text x="308" y="97" font-size="18" font-weight="800" fill="#fff">@${esc(o.username)}</text>
<circle cx="749" cy="92" r="4" fill="${neon}"/>
<text x="844" y="97" text-anchor="end" font-size="12" font-weight="800" fill="${neon}">${s.mood.toUpperCase()}</text>
<text x="308" y="114" font-size="10" fill="#8b949e">${sub}</text>
${bars}
<text x="308" y="222" font-size="10" fill="#8b949e">LAST 30 DAYS · ${m.commits} CONTRIBUTIONS · ${m.consistency}% CONSISTENT</text>
${heat}
<text x="844" y="249" text-anchor="end" font-size="26" font-weight="800" fill="${neon}">${m.activeDays}<tspan font-size="12" fill="#8b949e">/30</tspan></text>
<text x="844" y="262" text-anchor="end" font-size="9" fill="#8b949e">ACTIVE DAYS</text>
</svg>`;
}

export function errorSVG(msg: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="120" viewBox="0 0 640 120" font-family="ui-monospace,Menlo,Consolas,monospace"><rect width="640" height="120" rx="16" fill="#0d1117" stroke="#ff6b81" stroke-opacity=".6"/><text x="24" y="52" fill="#ff6b81" font-size="16" font-weight="700">GITHUB PET · oops</text><text x="24" y="82" fill="#c9d1d9" font-size="13">${esc(msg).slice(0, 80)}</text></svg>`;
}

export { STAGE_NAMES };
