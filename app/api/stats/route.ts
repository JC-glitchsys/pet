import type { NextRequest } from 'next/server';
import { getGithubData, GhError } from '@/lib/github';
import { computePet } from '@/lib/pet-engine';
import { isPet } from '@/lib/pets';
import { USERNAME_RE } from '@/lib/util';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const username = (sp.get('username') ?? '').trim();
  if (!USERNAME_RE.test(username)) return Response.json({ error: 'Enter a valid GitHub username.' }, { status: 400 });

  const petParam = sp.get('pet');
  const kind = isPet(petParam) ? petParam : 'cat';
  const tzRaw = Number(sp.get('tz') ?? 8);
  const tz = Number.isFinite(tzRaw) ? Math.max(-12, Math.min(14, tzRaw)) : 8;

  try {
    const data = await getGithubData(username, { tz, scenario: sp.get('scenario') });
    return Response.json(
      { user: data.user, source: data.source, state: computePet(data, kind, tz) },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } },
    );
  } catch (e) {
    const notFound = e instanceof GhError && e.message.includes('not found');
    return Response.json(
      { error: e instanceof GhError ? e.message : 'Could not reach GitHub.' },
      { status: notFound ? 404 : 502 },
    );
  }
}
