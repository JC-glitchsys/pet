import type { PetKind } from './types';

interface P { username: string; pet: PetKind; tz: number }

export const embedUrl = (origin: string, p: P) =>
  `${origin}/api/pet?username=${encodeURIComponent(p.username)}&pet=${p.pet}&tz=${p.tz}`;

export const mdSnippet = (origin: string, p: P) =>
  `[![${p.username}'s GitHub Pet](${embedUrl(origin, p)})](${origin}/dashboard?u=${p.username})`;

export const htmlSnippet = (origin: string, p: P) =>
  `<a href="${origin}/dashboard?u=${p.username}">\n  <img src="${embedUrl(origin, p)}" alt="${p.username}'s GitHub Pet" width="640" />\n</a>`;
