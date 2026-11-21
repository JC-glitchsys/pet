import type { Achievement } from './types';

interface Inputs {
  total: number;
  longest: number;
  active30: number;
  night: number;
  weekend90: number;
}

export function buildAchievements(i: Inputs): Achievement[] {
  const a = (
    id: string, name: string, desc: string, icon: string,
    rarity: Achievement['rarity'], cur: number, goal: number, unit = '',
  ): Achievement => ({
    id, name, desc, icon, rarity,
    unlocked: cur >= goal,
    progress: `${Math.min(cur, goal)}/${goal}${unit}`,
  });

  return [
    a('first-commit', 'First Commit', 'Make your very first contribution.', '🌱', 'common', i.total, 1),
    a('week-warrior', '7-Day Warrior', 'Reach a 7-day streak.', '⚔️', 'rare', i.longest, 7, ' days'),
    a('month-grinder', '30-Day Grinder', 'Reach a 30-day streak.', '🔥', 'epic', i.longest, 30, ' days'),
    a('legend', '100-Day Legend', 'Reach a 100-day streak. Crown unlocked.', '👑', 'legendary', i.longest, 100, ' days'),
    a('monthly-beast', 'Monthly Beast', '25+ active days in the last 30.', '🦁', 'epic', i.active30, 25, ' days'),
    a('perfect-month', 'Perfect Month', '30 of 30 days active.', '💎', 'legendary', i.active30, 30, ' days'),
    a('night-owl', 'Night Owl', '5+ pushes between 12am and 5am (last 90 days).', '🦉', 'rare', i.night, 5, ' pushes'),
    a('weekend-grinder', 'Weekend Grinder', '8+ active weekend days (last 90 days).', '🏋️', 'rare', i.weekend90, 8, ' days'),
    a('centurion', 'Centurion', '500 contributions in 3 years.', '💯', 'common', i.total, 500),
  ];
}
