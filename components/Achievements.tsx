'use client';
import { motion } from 'framer-motion';
import type { Achievement } from '@/lib/types';

export function Achievements({ list }: { list: Achievement[] }) {
  const got = list.filter((a) => a.unlocked).length;
  return (
    <div>
      <div className="mb-4 text-xs font-medium text-slate-400">{got} of {list.length} unlocked</div>
      <div className="grid grid-cols-2 content-start gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {list.map((a, i) => {
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              className={`flex min-h-40 flex-col items-center rounded-2xl border p-4 text-center transition-colors hover:border-white/20 sm:p-5 ${a.unlocked ? 'border-white/10 bg-white/[0.045]' : 'border-white/5 bg-white/[0.02]'}`}
            >
              <div className={`text-3xl ${a.unlocked ? '' : 'opacity-30 grayscale'}`}>{a.icon}</div>
              <div className={`mt-2 text-sm font-bold ${a.unlocked ? 'text-white' : 'text-slate-500'}`}>{a.name}</div>
              <div className="mt-1.5 text-[11px] leading-relaxed text-slate-500">{a.desc}</div>
              <div className={`mt-auto pt-3 font-mono text-[10px] ${a.unlocked ? 'text-slate-400' : 'text-slate-600'}`}>
                {a.unlocked ? a.rarity : a.progress}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
