'use client';
import { motion } from 'framer-motion';
import type { Achievement } from '@/lib/types';

function AchievementIcon({ id, unlocked }: { id: string; unlocked: boolean }) {
  const paths: Record<string, React.ReactNode> = {
    'first-commit': <><path d="M16 27V15" /><path d="M16 18C8.8 18 6 13.8 6 7c6.5 0 10 3.1 10 9" /><path d="M16 22c0-6.5 3.5-10 10-10 0 6.5-3.5 10-10 10Z" /></>,
    'week-warrior': <><path d="m8 6 18 18M24 6 6 24" /><path d="m7 5 4 1-1 4M25 5l-4 1 1 4M5 25l4-1-1-4M27 25l-4-1 1-4" /></>,
    'month-grinder': <path d="M18 3c1 6-5 7-3 12 1-2 3-3 5-4 5 7 3 15-4 17-7-1-10-7-6-13 1 4 3 5 4 5-1-7 5-9 4-17Z" />,
    legend: <><path d="m4 9 7 6 5-9 5 9 7-6-2 16H6L4 9Z" /><path d="M7 28h18" /></>,
    'monthly-beast': <><circle cx="16" cy="16" r="11" /><path d="M9 12h.01M23 12h.01M11 21c2-3 8-3 10 0M13 17h.01M19 17h.01" /></>,
    'perfect-month': <><path d="m16 3 12 13-12 13L4 16 16 3Z" /><path d="m4 16 12 1 12-1M16 3v14" /></>,
    'night-owl': <><path d="M23 21A12 12 0 0 1 11 5a12 12 0 1 0 12 16Z" /><path d="m22 5 .8 2.2L25 8l-2.2.8L22 11l-.8-2.2L19 8l2.2-.8L22 5Z" /></>,
    'weekend-grinder': <><path d="M6 12v8M10 9v14M22 9v14M26 12v8M10 16h12" /></>,
  };

  if (id === 'centurion') {
    return <svg aria-hidden="true" viewBox="0 0 32 32" className={`achievement-icon h-8 w-8 ${unlocked ? 'text-emerald-300' : 'text-slate-600'}`}><text x="16" y="21" textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="700" fontFamily="monospace">100</text></svg>;
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`achievement-icon h-8 w-8 ${unlocked ? 'text-emerald-300' : 'text-slate-600'}`}>
      {paths[id] ?? <circle cx="16" cy="16" r="10" />}
    </svg>
  );
}

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
              className={`flex min-h-40 flex-col items-center rounded-2xl border-2 p-4 text-center transition-colors sm:p-5 ${a.unlocked ? 'achievement-card-unlocked border-emerald-300/35 bg-emerald-300/[0.035]' : 'border-white/5 bg-white/[0.02]'}`}
            >
              <AchievementIcon id={a.id} unlocked={a.unlocked} />
              <div className={`mt-2 text-sm font-bold ${a.unlocked ? 'text-white' : 'text-slate-500'}`}>{a.name}</div>
              <div className="mt-1.5 text-[11px] leading-relaxed text-slate-500">{a.desc}</div>
              <div className={`mt-auto pt-3 font-mono text-[10px] ${a.unlocked ? 'text-slate-400' : 'text-slate-600'}`}>
                {a.unlocked ? 'UNLOCKED' : a.progress}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
