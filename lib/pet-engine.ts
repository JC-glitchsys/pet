import type { Day, GhData, Mood, PetKind, PetState, Stage, Tier, Trend } from './types';
import { PETS, STAGE_AT, STAGE_NAMES } from './pets';
import { buildAchievements } from './achievements';
import { hashStr } from './util';

const DAY = 86_400_000;
const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const TIER_LABEL: Record<Tier, string> = {
  100: 'Legendary glow',
  70: 'Happy',
  40: 'Tired',
  15: 'Sad & hungry',
  0: 'Ghost mode',
};

export const addDays = (key: string, n: number) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
};
const dow = (key: string) => new Date(`${key}T00:00:00Z`).getUTCDay();

export const stageFor = (streak: number): Stage =>
  streak >= 100 ? 4 : streak >= 30 ? 3 : streak >= 7 ? 2 : streak >= 3 ? 1 : 0;

/** Wall-clock in the viewer's timezone (tz = UTC offset in hours). */
export function localClock(tz: number, now = Date.now()) {
  const d = new Date(now + tz * 3_600_000);
  return { key: d.toISOString().slice(0, 10), hour: d.getUTCHours(), min: d.getUTCMinutes() };
}

/**
 * The whole game lives here. Pure function: GitHub data in, pet state out.
 *
 *  HP        = tier from active days in the last 30 days (100 / 70 / 40 / 15 / 0)
 *  Stored    = strong months buy "grace days": missing a day burns stored energy
 *  energy      first (slow hunger), only then does the pet get hungry, sad, ghost.
 *  Stage     = streak thresholds 0 / 3 / 7 / 30 / 100 (+1 stage boost for Monthly Beast)
 */
export function computePet(data: GhData, kind: PetKind, tz = 8, now = Date.now()): PetState {
  const meta = PETS[kind];
  const { key: today, hour, min } = localClock(tz, now);

  const map = new Map<string, number>();
  let total = 0;
  let lifeDays = 0;
  for (const d of data.days) {
    if (d.date > today) continue;
    map.set(d.date, d.count);
    total += d.count;
    if (d.count > 0) lifeDays++;
  }
  const get = (k: string) => map.get(k) ?? 0;
  const run = (end: string) => {
    let n = 0;
    let k = end;
    while (get(k) > 0 && n < 2000) { n++; k = addDays(k, -1); }
    return n;
  };

  // ── streaks ──────────────────────────────────────────────
  const committedToday = get(today) > 0;
  let daysSince = 999;
  for (let i = 0; i < 400; i++) {
    if (get(addDays(today, -i)) > 0) { daysSince = i; break; }
  }
  const streak = committedToday ? run(today) : run(addDays(today, -1));
  const prevRun = daysSince < 999 ? run(addDays(today, -daysSince)) : 0;

  let longest = 0;
  let cur = 0;
  let last = '';
  for (const d of [...map.keys()].sort()) {
    if (get(d) > 0) {
      cur = last && addDays(last, 1) === d ? cur + 1 : 1;
      last = d;
      if (cur > longest) longest = cur;
    }
  }

  // ── last 30 days vs previous 30 ─────────────────────────
  const days30: Day[] = [];
  for (let i = 29; i >= 0; i--) {
    const k = addDays(today, -i);
    days30.push({ date: k, count: get(k) });
  }
  let prevCommits = 0;
  let prevActive = 0;
  for (let i = 59; i >= 30; i--) {
    const c = get(addDays(today, -i));
    prevCommits += c;
    if (c > 0) prevActive++;
  }
  const commits30 = days30.reduce((a, d) => a + d.count, 0);
  const active30 = days30.filter((d) => d.count > 0).length;

  let bestDay: Day | null = null;
  for (const d of days30) if (d.count > 0 && (!bestDay || d.count >= bestDay.count)) bestDay = d;
  const wd = new Array<number>(7).fill(0);
  for (const d of days30) wd[dow(d.date)] += d.count;
  const wdMax = Math.max(...wd);
  const bestWeekday = wdMax > 0 ? { name: WEEKDAYS[wd.indexOf(wdMax)], commits: wdMax } : null;

  const consistency = Math.round((active30 / 30) * 100);
  const monthXp = commits30 * 10 + active30 * 50;
  const beast = active30 >= 25;

  let trend: Trend;
  if (prevCommits === 0) {
    trend = commits30 > 0
      ? { pct: null, dir: 'new', label: 'Fresh start. Nothing to compare yet!' }
      : { pct: null, dir: 'flat', label: 'No activity in either month' };
  } else {
    const pct = Math.round(((commits30 - prevCommits) / prevCommits) * 100);
    trend = pct >= 5 ? { pct, dir: 'up', label: `Up +${pct}% vs last month!` }
      : pct <= -5 ? { pct, dir: 'down', label: `Down ${pct}% vs last month. Bawi tayo!` }
      : { pct, dir: 'flat', label: 'Steady vs last month' };
  }

  // ── HP tier + stored energy ─────────────────────────────
  const tier: Tier = active30 >= 25 ? 100 : active30 >= 15 ? 70 : active30 >= 7 ? 40 : active30 >= 1 ? 15 : 0;
  const hp = tier === 0 ? 0 : Math.min(100, tier + meta.hpBonus);
  const baseGrace = tier === 100 ? 3 : tier === 70 ? 2 : 0; // only strong months store energy
  const grace = tier === 0 ? 0 : Math.min(4, baseGrace + meta.graceBonus);
  const missed = daysSince;
  const eff = Math.max(0, missed - grace); // missed days AFTER stored energy ran out
  const ghost = active30 === 0 || eff >= 3;

  let hunger = 100;
  if (missed > 0) {
    const within = Math.min(missed, grace);
    const beyond = Math.max(0, missed - grace);
    hunger = 100 - within * 8 * meta.hungerMult - beyond * 35 * meta.hungerMult;
  }
  hunger = ghost ? 0 : clamp(Math.round(hunger));

  // ── mood ────────────────────────────────────────────────
  const night = hour >= 22 || hour < 6;
  let mood: Mood;
  if (ghost) mood = 'ghost';
  else if (eff >= 2) mood = 'sad';
  else if (eff === 1) mood = 'hungry';
  else if (night) mood = 'sleepy';
  else if (committedToday) mood = tier >= 70 ? 'happy' : tier === 40 ? 'tired' : 'hungry';
  else mood = 'tired';

  // ── stage ───────────────────────────────────────────────
  const effStreak = streak > 0 ? streak : ghost ? 0 : prevRun;
  const baseStage = stageFor(ghost ? prevRun : effStreak);
  const boosted = beast && !ghost && baseStage < 3;
  const stage = (boosted ? baseStage + 1 : baseStage) as Stage;
  const aura = !ghost && (tier === 100 || stage === 4);
  const cracks = stage === 0 && !ghost ? Math.min(3, streak) : 0;

  // ── lifetime XP / level ─────────────────────────────────
  const xp = Math.round((total * 10 + lifeDays * 50) * meta.xpMult);
  const level = Math.floor(Math.sqrt(xp / 120)) + 1;
  const xpFloor = 120 * (level - 1) ** 2;
  const xpNext = 120 * level ** 2;
  const xpPct = Math.round(((xp - xpFloor) / (xpNext - xpFloor)) * 100);

  // ── happiness ───────────────────────────────────────────
  const happiness = ghost ? 0 : clamp(Math.round(
    (active30 / 30) * 55 + (Math.min(streak, 14) / 14) * 25 + (committedToday ? 20 : 0)
    + meta.happyBonus - eff * 25 - Math.min(missed, grace) * 4,
  ));

  const hoursLeft = Math.max(0, Math.ceil(24 - (hour + min / 60)));
  const streakAtRisk = !committedToday && streak > 0 && !ghost;
  const protectedByStorage = !ghost && missed > 0 && eff === 0;
  const graceLeft = protectedByStorage ? grace - missed : 0;

  const nIdx = STAGE_AT.findIndex((t) => t > effStreak);
  const nextStage = ghost || nIdx < 0 ? null : { name: STAGE_NAMES[nIdx], daysLeft: STAGE_AT[nIdx] - effStreak };

  // ── speech ──────────────────────────────────────────────
  const seed = hashStr(`${today}${Math.floor(hour / 4)}${kind}`);
  const pick = (a: string[]) => a[seed % a.length];
  let speech: string;
  if (ghost) {
    speech = active30 === 0
      ? 'No commits this month. I am in ghost mode. Boo.'
      : pick(['Three days offline and I am a ghost. Boo.', 'One commit and I am back.']);
  } else if (mood === 'sad') {
    speech = pick(['Two days without a commit... save me?', 'One commit could turn this around.']);
  } else if ((mood === 'hungry' || mood === 'tired') && !committedToday && streak >= 3 && hoursLeft <= 8) {
    speech = `${hoursLeft}h left. Keep that ${streak}-day streak alive!`;
  } else if (mood === 'hungry' && !committedToday) {
    speech = pick(['Feed me a commit!', 'I am starving. Drop a commit!']);
  } else if (mood === 'tired' && !committedToday) {
    speech = pick(['Still running on last month’s grind. Feed me soon?', 'Stored energy is low. Commit time?']);
  } else if (mood === 'sleepy' && !committedToday) {
    speech = pick(['zZz... one commit before bed?', 'Sleepy. Catch you after a commit?']);
  } else if (active30 === 30) {
    speech = '30/30 active days. Absolutely slaying.';
  } else if (effStreak >= 100) {
    speech = `${effStreak} days?! She is legendary. Slay.`;
  } else if (beast) {
    speech = pick(['Monthly beast mode. Evolution boost unlocked!', `${active30}/30 active days. You are cooking!`]);
  } else if (trend.pct !== null && trend.pct >= 10 && commits30 > 0) {
    speech = `Commits up +${trend.pct}% vs last month. She's cooking!`;
  } else if (streak >= 2) {
    speech = `${streak}-day streak. Keep cooking!`;
  } else if (mood === 'sleepy') {
    speech = 'zZz... fed for today. Goodnight!';
  } else if (mood === 'hungry') {
    speech = 'Fed, but still hungry. More commits?';
  } else if (mood === 'tired') {
    speech = 'Nice commit. Keep the active days coming!';
  } else if (stage === 0) {
    speech = '*tap tap* Commit to hatch me!';
  } else {
    speech = pick(['Fed today. We love to see it!', 'Full HP. See you tomorrow!']);
  }

  // ── achievements ────────────────────────────────────────
  let weekend90 = 0;
  for (let i = 0; i < 90; i++) {
    const k = addDays(today, -i);
    const w = dow(k);
    if ((w === 0 || w === 6) && get(k) > 0) weekend90++;
  }
  const nightPushes = data.nightOverride ?? data.pushTimes.filter((t) => {
    const ts = Date.parse(t);
    if (!ts || now - ts > 90 * DAY) return false;
    return new Date(ts + tz * 3_600_000).getUTCHours() < 5;
  }).length;

  const achievements = buildAchievements({ total, longest, active30, night: nightPushes, weekend90 });

  return {
    kind, stage, stageName: STAGE_NAMES[stage], boosted, mood, aura, cracks,
    level, xp, xpPct, hp, hunger, happiness,
    streak, longestStreak: longest, totalContributions: total, committedToday, daysSince: missed,
    streakAtRisk, hoursLeft, graceDays: grace, graceLeft, protectedByStorage, nextStage,
    speech,
    score: monthXp + streak * 25 + level * 10,
    month: {
      commits: commits30, activeDays: active30, consistency, xp: monthXp, beast, tier,
      tierLabel: TIER_LABEL[tier], bestDay, bestWeekday, prevCommits, prevActive, trend, days: days30,
    },
    achievements,
  };
}
