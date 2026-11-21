import type { NextRequest } from 'next/server';
import { getGithubData, GhError } from '@/lib/github';
import { computePet } from '@/lib/pet-engine';
import { cardSVG, errorSVG } from '@/lib/pet-art';
import { isPet } from '@/lib/pets';
import { USERNAME_RE } from '@/lib/util';

export const runtime = 'edge';

// GitHub proxies README images through camo, which honours max-age.
// 15 min keeps the pet feeling alive without hammering the GitHub API.
const headers = (maxAge: number) => ({
  'Content-Type': 'image/svg+xml; charset=utf-8',
  'Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge}, stale-while-revalidate=86400`,
  'Access-Control-Allow-Origin': '*',
});

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const username = (sp.get('username') ?? sp.get('u') ?? '').trim();
  if (!USERNAME_RE.test(username)) {
    return new Response(errorSVG('Add ?username=YOUR_GITHUB_USERNAME to the URL.'), { headers: headers(60) });
  }

  const petParam = sp.get('pet');
  const kind = isPet(petParam) ? petParam : 'cat';
  const tzRaw = Number(sp.get('tz') ?? 8);
  const tz = Number.isFinite(tzRaw) ? Math.max(-12, Math.min(14, tzRaw)) : 8;

  try {
    const data = await getGithubData(username, { tz, scenario: sp.get('scenario') });
    const state = computePet(data, kind, tz);
    return new Response(cardSVG(state, { username: data.user.login }), { headers: headers(900) });
  } catch (e) {
    const msg = e instanceof GhError ? e.message : 'Could not reach GitHub.';
    return new Response(errorSVG(msg), { headers: headers(120) });
  }
}
