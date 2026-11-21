import type { NextRequest } from 'next/server';
import { getGithubData } from '@/lib/github';
import { computePet } from '@/lib/pet-engine';
import { USERNAME_RE } from '@/lib/util';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const users = [...new Set((sp.get('users') ?? '').split(',').map((s) => s.trim()).filter((u) => USERNAME_RE.test(u)))].slice(0, 10);
  const tzRaw = Number(sp.get('tz') ?? 8);
  const tz = Number.isFinite(tzRaw) ? Math.max(-12, Math.min(14, tzRaw)) : 8;

  const settled = await Promise.allSettled(
    users.map(async (u) => {
      const d = await getGithubData(u, { tz, scenario: null });
      const s = computePet(d, 'cat', tz);
      return {
        login: d.user.login, avatarUrl: d.user.avatarUrl, score: s.score, level: s.level,
        streak: s.streak, stage: s.stage, mood: s.mood, activeDays: s.month.activeDays, commits: s.month.commits,
      };
    }),
  );
  const rows = settled.flatMap((r) => (r.status === 'fulfilled' ? [r.value] : [])).sort((a, b) => b.score - a.score);
  const failed = users.filter((_, i) => settled[i].status === 'rejected');

  return Response.json({ rows, failed }, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } });
}
