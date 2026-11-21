import type { Day, GhData } from './types';
import { addDays, localClock } from './pet-engine';
import { hashStr } from './util';

export class GhError extends Error {}

const ENDPOINT = 'https://api.github.com/graphql';
const DAY = 86_400_000;
const TTL = 10 * 60_000;
const memo = new Map<string, { t: number; v: GhData }>();

const QUERY = /* GraphQL */ `
  query ($login: String!, $mF: DateTime!, $mT: DateTime!, $pF: DateTime!, $pT: DateTime!,
         $aF: DateTime!, $aT: DateTime!, $bF: DateTime!, $bT: DateTime!, $cF: DateTime!, $cT: DateTime!) {
    user(login: $login) {
      login
      name
      avatarUrl
      month: contributionsCollection(from: $mF, to: $mT) { ...Cal }
      prev:  contributionsCollection(from: $pF, to: $pT) { ...Cal }
      y1:    contributionsCollection(from: $aF, to: $aT) { ...Cal }
      y2:    contributionsCollection(from: $bF, to: $bT) { ...Cal }
      y3:    contributionsCollection(from: $cF, to: $cT) { ...Cal }
    }
  }
  fragment Cal on ContributionsCollection {
    contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } }
  }
`;

type Cal = { contributionCalendar: { weeks: { contributionDays: { date: string; contributionCount: number }[] }[] } };

async function fetchPushTimes(login: string, token: string): Promise<string[]> {
  try {
    const r = await fetch(`https://api.github.com/users/${login}/events/public?per_page=100`, {
      headers: { Authorization: `bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'pasabog-pet' },
    });
    if (!r.ok) return [];
    const ev = (await r.json()) as { type: string; created_at: string }[];
    return ev.filter((e) => e.type === 'PushEvent').map((e) => e.created_at);
  } catch {
    return [];
  }
}

async function fetchReal(login: string, token: string): Promise<GhData> {
  const now = Date.now();
  const iso = (ms: number) => new Date(ms).toISOString();
  const Y = 364 * DAY;
  const variables = {
    login,
    // contributionsCollection(from: last 30 days, to: today)
    mF: iso(now - 30 * DAY), mT: iso(now),
    pF: iso(now - 60 * DAY), pT: iso(now - 30 * DAY),
    // 3 years of history for streaks (GraphQL caps each window at 1 year)
    aF: iso(now - Y), aT: iso(now),
    bF: iso(now - 2 * Y), bT: iso(now - Y),
    cF: iso(now - 3 * Y), cT: iso(now - 2 * Y),
  };

  const [res, pushTimes] = await Promise.all([
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'pasabog-pet' },
      body: JSON.stringify({ query: QUERY, variables }),
      cache: 'no-store',
    }),
    fetchPushTimes(login, token),
  ]);

  if (res.status === 401) throw new GhError('Bad or missing GITHUB_TOKEN on the server.');
  if (res.status === 403 || res.status === 429) throw new GhError('GitHub rate limit hit. Try again in a bit.');
  if (!res.ok) throw new GhError(`GitHub returned ${res.status}.`);

  const json = (await res.json()) as {
    data?: { user: (Record<string, Cal> & { login: string; name: string | null; avatarUrl: string }) | null };
    errors?: { type?: string; message: string }[];
  };
  if (json.errors?.some((e) => e.type === 'NOT_FOUND') || (json.data && !json.data.user)) {
    throw new GhError(`GitHub user "${login}" not found.`);
  }
  if (json.errors?.length || !json.data?.user) throw new GhError(json.errors?.[0]?.message ?? 'Unknown GitHub error.');

  const u = json.data.user;
  // Windows overlap on boundary days; keep the max so a partial day never undercounts.
  const merged = new Map<string, number>();
  for (const k of ['y3', 'y2', 'y1', 'prev', 'month']) {
    u[k]?.contributionCalendar.weeks.forEach((w) =>
      w.contributionDays.forEach((d) => merged.set(d.date, Math.max(merged.get(d.date) ?? 0, d.contributionCount))));
  }
  const days: Day[] = [...merged.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).map(([date, count]) => ({ date, count }));

  return {
    user: { login: u.login, name: u.name, avatarUrl: u.avatarUrl },
    days,
    totalContributions: days.reduce((a, d) => a + d.count, 0),
    pushTimes,
    source: 'github',
  };
}

/* ───────────────────────── demo data ───────────────────────── */

const n = (i: number, m: number) => (Math.imul(i + 7, 2654435761) >>> 0) % m;
type Scenario = (i: number) => number | undefined; // i = days ago (0 = today)

const SCENARIOS: Record<string, Scenario> = {
  happy: (i) => (i < 9 ? 1 + n(i, 4) : i < 30 ? (i % 3 === 0 ? 2 : 0) : undefined),
  beast: (i) => (i < 27 ? 1 + n(i, 5) : undefined),
  perfect: (i) => (i < 30 ? 2 + n(i, 4) : undefined),
  legend: (i) => (i < 140 ? 1 + n(i, 6) : undefined),
  hungry: (i) => (i < 30 ? (i % 4 === 1 ? 2 : 0) : undefined),
  sad: (i) => (i < 30 ? (i % 3 === 2 ? 3 : 0) : undefined),
  protected: (i) => (i < 3 ? 0 : i < 33 ? 2 + n(i, 3) : undefined),
  ghost: (i) => (i < 35 ? 0 : i < 60 ? 2 : undefined),
  egg: (i) => (i === 0 ? 1 : 0),
};
const SCENARIO_KEYS = ['happy', 'beast', 'legend', 'hungry', 'protected', 'perfect', 'egg'];

export function mockData(login: string, scenario: string | null | undefined, tz: number): GhData {
  const key = scenario && SCENARIOS[scenario] ? scenario : SCENARIO_KEYS[hashStr(login) % SCENARIO_KEYS.length];
  const fn = SCENARIOS[key];
  const today = localClock(tz).key;
  const days: Day[] = [];
  for (let i = 1100; i >= 0; i--) {
    const v = fn(i) ?? (i >= 60 ? (i % 4 === 0 ? 1 : 0) : i >= 30 ? (i % 3 === 0 ? 2 : 0) : 0);
    days.push({ date: addDays(today, -i), count: v });
  }
  return {
    user: { login, name: login, avatarUrl: null },
    days,
    totalContributions: days.reduce((a, d) => a + d.count, 0),
    pushTimes: [],
    nightOverride: key === 'legend' ? 9 : undefined,
    source: 'demo',
  };
}

/** Real GitHub data when GITHUB_TOKEN is set, deterministic demo data otherwise. */
export async function getGithubData(
  username: string,
  opts: { tz: number; scenario?: string | null },
): Promise<GhData> {
  const token = process.env.GITHUB_TOKEN;
  const lower = username.toLowerCase();
  if (lower === 'demo' || !token) return mockData(username, opts.scenario ?? (lower === 'demo' ? 'happy' : null), opts.tz);

  const hit = memo.get(lower);
  if (hit && Date.now() - hit.t < TTL) return hit.v;
  const v = await fetchReal(username, token);
  memo.set(lower, { t: Date.now(), v });
  if (memo.size > 200) memo.delete(memo.keys().next().value as string);
  return v;
}
