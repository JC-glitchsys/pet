'use client';
import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { load, save } from '@/lib/storage';
import { USERNAME_RE } from '@/lib/util';
import { STAGE_NAMES } from '@/lib/pets';

interface Row {
  login: string; avatarUrl: string | null; score: number; level: number;
  streak: number; stage: number; mood: string; activeDays: number; commits: number;
}

export function Leaderboard({ me, tz }: { me: string; tz: number }) {
  const [friends, setFriends] = useState<string[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => setFriends(load<string[]>('pp:friends', [])), []);

  const refresh = useCallback(async () => {
    const users = [me, ...friends].filter(Boolean);
    if (!users.length) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/leaderboard?users=${encodeURIComponent(users.join(','))}&tz=${tz}`);
      const j = (await r.json()) as { rows: Row[]; failed: string[] };
      setRows(j.rows);
      setNote(j.failed.length ? `Couldn't load: ${j.failed.join(', ')}` : '');
    } catch {
      setNote('Leaderboard is offline. Try again.');
    } finally {
      setBusy(false);
    }
  }, [me, friends, tz]);

  useEffect(() => { void refresh(); }, [refresh]);

  function add(e: React.FormEvent) {
    e.preventDefault();
    const u = input.trim().replace(/^@/, '');
    if (!USERNAME_RE.test(u)) return setNote('That is not a valid GitHub username.');
    if ([me, ...friends].some((x) => x.toLowerCase() === u.toLowerCase())) return setNote('Already on the board.');
    if (friends.length >= 8) return setNote('Max 8 rivals. Remove one first.');
    const next = [...friends, u];
    setFriends(next);
    save('pp:friends', next);
    setInput('');
    setNote('');
  }
  function remove(u: string) {
    const next = friends.filter((f) => f !== u);
    setFriends(next);
    save('pp:friends', next);
  }

  return (
    <div>
      <form onSubmit={add} className="mb-5 flex gap-2 sm:mb-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a rival's GitHub username"
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-slate-500 focus:border-neon-cyan"
        />
        <button className="btn-ghost !py-2.5 text-sm">Add rival</button>
      </form>
      {note && <p className="mb-3 text-xs text-neon-gold">{note}</p>}

      <ol className="space-y-3">
        {rows.map((r, i) => (
          <motion.li
            key={r.login}
            layout
            className={`flex items-center gap-3 rounded-2xl border p-4 sm:gap-4 sm:p-5 ${r.login.toLowerCase() === me.toLowerCase() ? 'border-neon-green/45 bg-neon-green/[0.045]' : 'border-white/10 bg-white/[0.025]'}`}
          >
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border font-mono text-xs font-bold ${i === 0 ? 'border-neon-gold/30 bg-neon-gold/10 text-neon-gold' : 'border-white/10 bg-white/[0.03] text-slate-500'}`}>
              {String(i + 1).padStart(2, '0')}
            </span>
            {r.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.avatarUrl} alt="" className="h-9 w-9 rounded-full" />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 font-bold uppercase">{r.login[0]}</span>
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold text-white">{r.login}</div>
              <div className="font-mono text-[11px] text-slate-500">
                LV.{r.level} · {STAGE_NAMES[r.stage]} · {r.streak}d streak · {r.activeDays}/30
                {r.mood === 'ghost' && <span className="ml-1 text-neon-red">ghost</span>}
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-sm font-bold text-neon-gold">{r.score}</div>
              <div className="text-[10px] text-slate-500">score</div>
            </div>
            {r.login.toLowerCase() !== me.toLowerCase() && (
              <button onClick={() => remove(r.login)} aria-label={`Remove ${r.login}`} className="text-slate-600 hover:text-neon-red">✕</button>
            )}
          </motion.li>
        ))}
      </ol>
      {busy && <p className="mt-3 text-xs text-slate-500">Updating…</p>}
      {rows.length <= 1 && !busy && <p className="mt-3 text-sm text-slate-400">Add a friend and see whose pet survives the month.</p>}
      <p className="mt-4 text-[11px] text-slate-600">Score = monthly XP + 25 per streak day + 10 per level. Your rivals list is saved in this browser.</p>
    </div>
  );
}
