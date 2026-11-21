'use client';
import { motion } from 'framer-motion';
import type { PetState } from '@/lib/types';

const ROWS = [
  { key: 'hp', label: 'HP', grad: 'from-rose-500 to-pink-400', glow: 'rgba(255,77,109,.55)' },
  { key: 'xp', label: 'XP', grad: 'from-cyan-400 to-blue-400', glow: 'rgba(56,232,255,.5)' },
  { key: 'hunger', label: 'HUNGER', grad: 'from-amber-400 to-yellow-300', glow: 'rgba(255,209,102,.5)' },
  { key: 'happiness', label: 'JOY', grad: 'from-emerald-400 to-lime-300', glow: 'rgba(57,255,136,.5)' },
] as const;

export function StatBars({ s }: { s: PetState }) {
  const v = { hp: s.hp, xp: s.xpPct, hunger: s.hunger, happiness: s.happiness };
  return (
    <div className="space-y-3">
      {ROWS.map((r, i) => {
        const val = v[r.key];
        const low = val < 25 && r.key !== 'xp';
        return (
          <div key={r.key}>
            <div className="mb-1 flex justify-between font-mono text-[11px] font-bold tracking-wider">
              <span className="text-slate-400">
                {r.label}
                {r.key === 'xp' && <span className="ml-2 text-cyan-300">LV.{s.level}</span>}
              </span>
              <span className={low ? 'text-rose-400' : 'text-slate-200'}>
                {val}%{r.key === 'hunger' ? ' fed' : ''}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/5">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${r.grad} ${low ? 'animate-pulse' : ''}`}
                style={{ boxShadow: `0 0 14px ${r.glow}` }}
                initial={{ width: 0 }}
                animate={{ width: `${val}%` }}
                transition={{ duration: 1.1, delay: i * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
