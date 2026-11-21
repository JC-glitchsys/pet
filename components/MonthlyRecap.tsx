'use client';
import { motion } from 'framer-motion';
import { Heatmap } from './Heatmap';
import type { PetState } from '@/lib/types';

const fmt = (d: string) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

function Ring({ pct }: { pct: number }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,.10)" strokeWidth="8" />
      <motion.circle
        cx="50" cy="50" r={r} fill="none" stroke="#71c99a" strokeWidth="8" strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - pct / 100) }}
        transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
      />
      <text x="50" y="50" textAnchor="middle" dominantBaseline="central" className="rotate-90 fill-white font-mono text-[22px] font-bold" style={{ transformOrigin: '50px 50px' }}>
        {pct}%
      </text>
    </svg>
  );
}

function Tile({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: string }) {
  return (
    <div className="flex min-h-[132px] flex-col rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-[18px]">
      <div className="text-xs font-medium text-slate-400">{label}</div>
      <div className={`mt-2 font-mono text-2xl font-semibold tracking-tight sm:text-[28px] ${tone ?? 'text-white'}`}>{value}</div>
      {sub && <div className="mt-auto pt-3 text-xs leading-relaxed text-slate-500">{sub}</div>}
    </div>
  );
}

export function MonthlyRecap({ s }: { s: PetState }) {
  const m = s.month;
  const trendTone = m.trend.dir === 'up' || m.trend.dir === 'new' ? 'text-neon-green' : m.trend.dir === 'down' ? 'text-neon-red' : 'text-slate-300';
  const arrow = m.trend.dir === 'up' ? '▲' : m.trend.dir === 'down' ? '▼' : m.trend.dir === 'new' ? '★' : '●';

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-5">
      <div className="grid h-fit auto-rows-[minmax(132px,auto)] grid-cols-2 content-start gap-3 self-start sm:gap-4 md:grid-cols-3">
        <Tile label="Contributions (30 days)" value={String(m.commits)} sub={`${m.prevCommits} the month before`} />
        <Tile label="Active days" value={`${m.activeDays}/30`} sub={`HP tier: ${m.tierLabel}`} tone="text-neon-cyan" />
        <Tile label="Best day" value={m.bestDay ? fmt(m.bestDay.date) : '–'} sub={m.bestDay ? `${m.bestDay.count} contributions` : 'No activity yet'} />
        <Tile label="Most productive weekday" value={m.bestWeekday?.name ?? '–'} sub={m.bestWeekday ? `${m.bestWeekday.commits} contributions` : undefined} />
        <Tile label="Vs last month" value={`${arrow} ${m.trend.pct !== null ? `${m.trend.pct > 0 ? '+' : ''}${m.trend.pct}%` : m.trend.dir === 'new' ? 'NEW' : '0%'}`} sub={m.trend.label} tone={trendTone} />
        <Tile label="Monthly XP" value={`${m.xp} XP`} sub={`${m.commits}×10 + ${m.activeDays}×50 bonus`} tone="text-neon-gold" />
      </div>

      <div className="glass flex flex-col gap-4 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-4">
          <Ring pct={m.consistency} />
          <div>
            <div className="text-sm font-semibold text-white">Consistency</div>
            <div className="mt-1 text-xs text-slate-400">Active days this month</div>
          </div>
        </div>
        <div className="w-full">
          <Heatmap days={m.days} />
        </div>
        <div className="w-full">
          <div className="mb-2 flex justify-between gap-3 text-xs text-slate-400">
            <span>{m.beast ? 'Monthly Beast unlocked' : 'Monthly Beast progress'}</span>
            <span>{Math.min(m.activeDays, 25)}/25</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-slate-300/70 transition-all duration-1000" style={{ width: `${Math.min(100, (m.activeDays / 25) * 100)}%` }} />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">Reach 25 active days to earn an evolution boost.</p>
        </div>
      </div>
    </div>
  );
}
