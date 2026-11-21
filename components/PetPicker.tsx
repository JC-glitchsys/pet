'use client';
import { motion } from 'framer-motion';
import { PetSprite } from './PetSprite';
import { PET_KINDS, PETS } from '@/lib/pets';
import type { PetKind } from '@/lib/types';

const STATS: [keyof (typeof PETS)['cat']['ratings'], string][] = [['hp', 'HP'], ['xp', 'XP'], ['hunger', 'Hunger'], ['joy', 'Joy']];

export function PetPicker({ value, onPick }: { value?: PetKind | null; onPick: (k: PetKind) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      {PET_KINDS.map((k, i) => {
        const m = PETS[k];
        const on = value === k;
        return (
          <motion.button
            key={k}
            onClick={() => onPick(k)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            className={`glass rounded-2xl p-3 text-left transition ${on ? 'ring-2' : 'hover:border-white/30'}`}
            style={on ? { boxShadow: `0 0 30px ${m.color}55`, borderColor: m.color } : undefined}
          >
            <PetSprite art={{ kind: k, stage: 3, mood: 'happy', aura: on, cracks: 0 }} size="100%" pop={false} />
            <div className="font-pixel text-[10px] text-white">{m.name}</div>
            <div className="mt-1 text-xs font-semibold" style={{ color: m.color }}>{m.trait}</div>
            <p className="mt-1 min-h-[2.5rem] text-[11px] leading-snug text-slate-400">{m.traitDesc}</p>
            <div className="mt-2 space-y-1">
              {STATS.map(([key, label]) => (
                <div key={key} className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
                  <span className="w-11">{label}</span>
                  <span className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span key={n} className="h-1.5 w-3 rounded-sm" style={{ background: n <= m.ratings[key] ? m.color : 'rgba(255,255,255,.1)' }} />
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
