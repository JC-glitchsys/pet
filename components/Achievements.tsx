'use client';
import { motion } from 'framer-motion';
import type { Achievement } from '@/lib/types';

const RARITY = { common: '#8b9bb4', rare: '#38e8ff', epic: '#b084ff', legendary: '#ffd166' } as const;

export function Achievements({ list }: { list: Achievement[] }) {
  const got = list.filter((a) => a.unlocked).length;
  return (
    <div>
      <div className="mb-3 font-mono text-xs text-slate-400">{got}/{list.length} unlocked</div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {list.map((a, i) => {
          const c = RARITY[a.rarity];
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              className={`rounded-2xl border p-3 text-center ${a.unlocked ? 'bg-white/[0.05]' : 'border-white/5 bg-white/[0.02]'}`}
              style={a.unlocked ? { borderColor: `${c}88`, boxShadow: `0 0 24px ${c}30` } : undefined}
            >
              <div className={`text-3xl ${a.unlocked ? '' : 'opacity-30 grayscale'}`}>{a.icon}</div>
              <div className={`mt-2 text-sm font-bold ${a.unlocked ? 'text-white' : 'text-slate-500'}`}>{a.name}</div>
              <div className="mt-1 text-[11px] leading-snug text-slate-500">{a.desc}</div>
              <div className="mt-2 font-mono text-[10px]" style={{ color: a.unlocked ? c : '#6e7681' }}>
                {a.unlocked ? a.rarity : a.progress}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
