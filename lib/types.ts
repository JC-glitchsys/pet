export type PetKind = 'cat' | 'dog' | 'axolotl' | 'dragon' | 'capybara';
export type Stage = 0 | 1 | 2 | 3 | 4;
export type Mood = 'happy' | 'sleepy' | 'tired' | 'hungry' | 'sad' | 'ghost';
export type Tier = 100 | 70 | 40 | 15 | 0;

export interface Day {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface GhUser {
  login: string;
  name: string | null;
  avatarUrl: string | null;
}

export interface GhData {
  user: GhUser;
  days: Day[]; // ascending, ~3 years
  totalContributions: number;
  pushTimes: string[]; // ISO timestamps of recent PushEvents
  nightOverride?: number;
  source: 'github' | 'demo';
}

export interface Trend {
  pct: number | null;
  dir: 'up' | 'down' | 'flat' | 'new';
  label: string;
}

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  progress: string;
}

export interface MonthStats {
  commits: number;
  activeDays: number;
  consistency: number;
  xp: number;
  beast: boolean;
  tier: Tier;
  tierLabel: string;
  bestDay: Day | null;
  bestWeekday: { name: string; commits: number } | null;
  prevCommits: number;
  prevActive: number;
  trend: Trend;
  days: Day[]; // last 30 days, oldest first
}

export interface PetState {
  kind: PetKind;
  stage: Stage;
  stageName: string;
  boosted: boolean;
  mood: Mood;
  aura: boolean;
  cracks: number;

  level: number;
  xp: number;
  xpPct: number;
  hp: number;
  hunger: number; // 100 = full belly
  happiness: number;

  streak: number;
  longestStreak: number;
  totalContributions: number;
  committedToday: boolean;
  daysSince: number;
  streakAtRisk: boolean;
  hoursLeft: number;
  graceDays: number;
  graceLeft: number;
  protectedByStorage: boolean;
  nextStage: { name: string; daysLeft: number } | null;

  speech: string;
  score: number;
  month: MonthStats;
  achievements: Achievement[];
}
