import type { PetKind } from './types';

interface P { username: string; pet: PetKind; tz: number; name?: string }

export const embedUrl = (origin: string, p: P) => {
  const q = new URLSearchParams({ username: p.username, pet: p.pet, tz: String(p.tz) });
  if (p.name?.trim()) q.set('name', p.name.trim());
  return `${origin}/api/pet?${q.toString()}`;
};

export const mdSnippet = (origin: string, p: P) =>
  `[![${p.username}'s GitHub Pet](${embedUrl(origin, p)})](${origin}/dashboard?u=${p.username})`;

export const htmlSnippet = (origin: string, p: P) =>
  `<a href="${origin}/dashboard?u=${p.username}">\n  <img src="${embedUrl(origin, p)}" alt="${p.username}'s GitHub Pet" width="860" />\n</a>`;
