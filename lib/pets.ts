import type { PetKind } from './types';

export interface PetMeta {
  kind: PetKind;
  name: string;
  tagline: string;
  trait: string;
  traitDesc: string;
  color: string;
  xpMult: number;
  hungerMult: number;
  happyBonus: number;
  hpBonus: number;
  graceBonus: number;
  ratings: { hp: number; xp: number; hunger: number; joy: number };
}

export const PETS: Record<PetKind, PetMeta> = {
  cat: {
    kind: 'cat', name: 'Cat', tagline: 'Judges your code in silence.',
    trait: 'Nine Lives', traitDesc: '+1 free missed day before it gets hungry',
    color: '#ffa94d', xpMult: 1, hungerMult: 1, happyBonus: 0, hpBonus: 0, graceBonus: 1,
    ratings: { hp: 3, xp: 3, hunger: 4, joy: 3 },
  },
  dog: {
    kind: 'dog', name: 'Dog', tagline: 'Thinks every commit is a walk.',
    trait: 'Good Boy', traitDesc: '+12 joy, but gets hungry 30% faster',
    color: '#f4c27a', xpMult: 1, hungerMult: 1.3, happyBonus: 12, hpBonus: 0, graceBonus: 0,
    ratings: { hp: 3, xp: 3, hunger: 2, joy: 5 },
  },
  axolotl: {
    kind: 'axolotl', name: 'Axolotl', tagline: 'Regrows from anything. Even your bugs.',
    trait: 'Regen', traitDesc: '+10 HP in every tier, but 15% less XP',
    color: '#ff7eb6', xpMult: 0.85, hungerMult: 1, happyBonus: 0, hpBonus: 10, graceBonus: 0,
    ratings: { hp: 5, xp: 2, hunger: 3, joy: 3 },
  },
  dragon: {
    kind: 'dragon', name: 'Dragon', tagline: 'Hoards green squares.',
    trait: 'Hoard', traitDesc: '+30% XP, but starves 60% faster',
    color: '#4ade80', xpMult: 1.3, hungerMult: 1.6, happyBonus: -5, hpBonus: 0, graceBonus: 0,
    ratings: { hp: 3, xp: 5, hunger: 1, joy: 2 },
  },
  capybara: {
    kind: 'capybara', name: 'Capybara', tagline: 'Unbothered. Moisturized. Slow to starve.',
    trait: 'Zen', traitDesc: 'Hunger drains 40% slower, +6 joy',
    color: '#c8935a', xpMult: 0.8, hungerMult: 0.6, happyBonus: 6, hpBonus: 0, graceBonus: 0,
    ratings: { hp: 3, xp: 2, hunger: 5, joy: 4 },
  },
};

export const PET_KINDS = Object.keys(PETS) as PetKind[];
export const STAGE_NAMES = ['Egg', 'Baby', 'Teen', 'Adult', 'Legendary'] as const;
export const STAGE_AT = [0, 3, 7, 30, 100] as const;
export const isPet = (v: unknown): v is PetKind => typeof v === 'string' && v in PETS;
