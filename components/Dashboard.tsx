'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { PetSprite } from './PetSprite';
import { SpeechBubble } from './SpeechBubble';
import { StatBars } from './StatBars';
import { EvolutionTrack } from './EvolutionTrack';
import { MonthlyRecap } from './MonthlyRecap';
import { Achievements } from './Achievements';
import { Leaderboard } from './Leaderboard';
import { PetPicker } from './PetPicker';
import { CopyBlock } from './CopyBlock';
import { useOrigin, useTz } from './hooks';
import { PETS, isPet } from '@/lib/pets';
import { htmlSnippet, mdSnippet } from '@/lib/embed';
import { load, save } from '@/lib/storage';
import { USERNAME_RE } from '@/lib/util';
import type { GhUser, PetKind, PetState } from '@/lib/types';

interface Api { user: GhUser; state: PetState; source: 'github' | 'demo' }

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="mt-12 sm:mt-14">
      <h2 className="text-xl font-semibold tracking-tight text-white">{title}</h2>
      {sub && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">{sub}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function Dashboard() {
  const sp = useSearchParams();
  const router = useRouter();
  const tz = useTz();
  const origin = useOrigin();

  const [ready, setReady] = useState(false);
  const [kind, setKind] = useState<PetKind | null>(null);
  const [picking, setPicking] = useState(false);
  const [input, setInput] = useState('');
  const [user, setUser] = useState('');
  const [res, setRes] = useState<Api | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [evolved, setEvolved] = useState<PetState | null>(null);
  const [petName, setPetName] = useState('');
  const [nameDraft, setNameDraft] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [milestoneReaction, setMilestoneReaction] = useState('');

  useEffect(() => {
    const stored = load<string | null>('pp:pet', null);
    const fromUrl = sp.get('pet');
    setKind(isPet(fromUrl) ? fromUrl : isPet(stored) ? stored : null);
    const u = sp.get('u') ?? load<string>('pp:user', '');
    setUser(u);
    setInput(u);
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user) return;
    setMilestoneReaction('');
    const savedName = load<string>(`pp:pet-name:${user.toLowerCase()}`, '');
    setPetName(savedName);
    setNameDraft(savedName);
    setEditingName(false);
  }, [user]);

  useEffect(() => {
    if (!milestoneReaction) return;
    const timer = window.setTimeout(() => setMilestoneReaction(''), 7000);
    return () => window.clearTimeout(timer);
  }, [milestoneReaction]);

  useEffect(() => {
    if (!user || !kind) return;
    const ac = new AbortController();
    setLoading(true);
    setErr(null);
    const q = new URLSearchParams({ username: user, pet: kind, tz: String(tz) });
    const sc = sp.get('scenario');
    if (sc) q.set('scenario', sc);
    fetch(`/api/stats?${q}`, { signal: ac.signal })
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error ?? 'Something went wrong.');
        return j as Api;
      })
      .then((j) => {
        setRes(j);
        const milestones = [
          { days: 3, say: '3-day streak! Solid start—keep it going.' },
          { days: 7, say: '7 days straight? Shesh, that’s a proper streak.' },
          { days: 30, say: '30-day streak! Your pet is thriving.' },
          { days: 100, say: '100 days?! Legendary aura-farming.' },
        ];
        const milestoneKey = `pp:milestone:${j.user.login.toLowerCase()}`;
        const lastMilestone = load<number>(milestoneKey, 0);
        const reached = milestones.filter((m) => m.days <= j.state.streak);
        const highestReached = reached[reached.length - 1];
        const newlyReached = reached.find((m) => m.days > lastMilestone);
        if (newlyReached) setMilestoneReaction(highestReached?.say ?? newlyReached.say);
        if (highestReached && highestReached.days > lastMilestone) save(milestoneKey, highestReached.days);
        const key = `pp:stage:${j.user.login}`;
        const prev = load<number>(key, -1);
        if (prev >= 0 && j.state.stage > prev) setEvolved(j.state);
        save(key, j.state.stage);
      })
      .catch((e: Error) => { if (e.name !== 'AbortError') { setErr(e.message); setRes(null); } })
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, [user, kind, tz, sp]);

  function pick(k: PetKind) {
    setKind(k);
    save('pp:pet', k);
    setPicking(false);
  }

  function savePetName(e: React.FormEvent) {
    e.preventDefault();
    const next = nameDraft.trim().slice(0, 20);
    setPetName(next);
    setNameDraft(next);
    if (login) save(`pp:pet-name:${login.toLowerCase()}`, next);
    setEditingName(false);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const u = input.trim().replace(/^@/, '');
    if (!USERNAME_RE.test(u)) return setErr('Enter a valid GitHub username (letters, numbers, hyphens).');
    save('pp:user', u);
    setUser(u);
    router.replace(`/dashboard?u=${encodeURIComponent(u)}`);
  }

  if (!ready) return null;

  if (!kind || picking) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-pixel text-lg leading-relaxed text-white sm:text-2xl">Pick your companion</h1>
        <p className="mt-3 max-w-xl text-slate-400">Each one plays differently. It hatches as an egg and lives or dies by your commits. You can switch later, but its evolution is tied to your streak, not the species.</p>
        <div className="mt-8"><PetPicker value={kind} onPick={pick} /></div>
      </main>
    );
  }

  const s = res?.state;
  const danger = !!s && (s.mood === 'ghost' || s.mood === 'sad' || s.mood === 'hungry');
  const login = res?.user.login ?? user;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="GitHub username (try your own, or a friend's)"
          aria-label="GitHub username"
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-slate-500 focus:border-neon-cyan"
        />
        <div className="flex gap-2">
          <button className="btn-primary flex-1 sm:flex-none">Meet the pet</button>
          <button type="button" onClick={() => setPicking(true)} className="btn-ghost">Change pet</button>
          <button type="button" onClick={() => { setInput('demo'); save('pp:user', 'demo'); setUser('demo'); router.replace('/dashboard?u=demo'); }} className="btn-ghost">Demo</button>
        </div>
      </form>
      {err && <p role="alert" className="mt-3 rounded-xl border border-neon-red/30 bg-neon-red/10 px-4 py-3 text-sm text-neon-red">{err}</p>}

      {!user && !err && (
        <div className="glass mt-8 rounded-3xl p-10 text-center">
          <div className="mx-auto w-40"><PetSprite art={{ kind, stage: 0, mood: 'sleepy', aura: false, cracks: 0 }} size="100%" /></div>
          <p className="mt-4 font-pixel text-xs leading-relaxed text-white">Your {PETS[kind].name.toLowerCase()} egg is waiting.</p>
          <p className="mt-2 text-sm text-slate-400">Enter your GitHub username to hatch it.</p>
        </div>
      )}

      {loading && !s && <p className="mt-10 text-center font-pixel text-xs text-slate-400">Waking up the pet…</p>}

      {s && res && (
        <>
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass mt-6 grid gap-6 overflow-hidden rounded-3xl p-4 sm:p-6 md:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)] md:gap-8 md:p-7"
          >
            <div className="flex flex-col items-center rounded-2xl bg-white/[0.025] px-3 pb-5 pt-4 sm:px-5">
              <SpeechBubble text={milestoneReaction || s.speech} danger={danger} />
              <PetSprite art={s} size="min(100%, 280px)" className="mt-3" />
              {editingName ? (
                <form onSubmit={savePetName} className="mt-2 flex w-full max-w-sm flex-wrap justify-center gap-2">
                  <input
                    autoFocus
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    maxLength={20}
                    aria-label="Pet name"
                    placeholder="Give your pet a name"
                    className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-center text-sm text-white outline-none placeholder:text-slate-500 focus:border-white/25"
                  />
                  <button type="submit" className="btn-primary !px-4 !py-2 text-sm">Save</button>
                  <button type="button" onClick={() => { setNameDraft(petName); setEditingName(false); }} className="btn-ghost !px-4 !py-2 text-sm">Cancel</button>
                </form>
              ) : (
                <div className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                  <h3 className="font-semibold text-white">{petName || 'Your pet'}</h3>
                  <button type="button" onClick={() => { setNameDraft(petName); setEditingName(true); }} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400 transition hover:bg-white/[0.06] hover:text-white">
                    {petName ? 'Rename' : 'Name your pet'}
                  </button>
                </div>
              )}
              <div className="mt-1 text-center font-mono text-[11px] tracking-wide text-slate-400">LV.{s.level} <span className="px-1 text-slate-600">·</span> {s.stageName} {PETS[s.kind].name}</div>
              <div className="mt-1 max-w-xs text-center text-xs leading-relaxed text-slate-500">{PETS[s.kind].trait}: {PETS[s.kind].traitDesc}</div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                {res.user.avatarUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={res.user.avatarUrl} alt="" className="h-10 w-10 rounded-full ring-2 ring-white/10" />
                )}
                <div>
                  <div className="text-lg font-bold text-white">@{login}</div>
                  <div className="font-mono text-xs text-slate-500">
                    {res.source === 'demo' ? 'demo data' : `${s.totalContributions.toLocaleString()} contributions (3 yrs)`} · best streak {s.longestStreak}d
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-end gap-x-3 gap-y-2 border-y border-white/10 py-4">
                <div className="font-pixel text-4xl leading-none text-neon-gold">{s.streak}</div>
                <div className="pb-0.5 text-sm text-slate-300">day streak</div>
                {s.boosted && <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-slate-300">Monthly Beast boost</span>}
              </div>

              <div className="mt-4 space-y-2">
                {s.mood === 'ghost' && <p className="rounded-xl border border-indigo-300/30 bg-indigo-400/10 px-4 py-3 text-sm text-indigo-200">Your pet is a ghost. One contribution revives it as a fresh egg.</p>}
                {s.streakAtRisk && s.mood !== 'ghost' && <p className="rounded-xl border border-neon-gold/30 bg-neon-gold/10 px-4 py-3 text-sm text-neon-gold">{s.hoursLeft}h left today to keep your {s.streak}-day streak alive.</p>}
                {s.protectedByStorage && <p className="rounded-xl border border-neon-cyan/30 bg-neon-cyan/10 px-4 py-3 text-sm text-neon-cyan">Living on stored energy from last month. {s.graceLeft} free day{s.graceLeft === 1 ? '' : 's'} left before it gets hungry.</p>}
              </div>

              <div className="mt-6"><StatBars s={s} /></div>

              <a href={`https://github.com/${login}`} target="_blank" rel="noreferrer" className="btn-primary mt-6 w-full sm:w-auto">
                {s.committedToday ? 'Fed today. Go again' : 'Feed it: go commit'}
              </a>
            </div>
          </motion.section>

          <Section title="Evolution" sub="Streak thresholds: 3, 7, 30 and 100 days. Strong months can boost you a stage early.">
            <EvolutionTrack kind={s.kind} stage={s.stage} streak={s.streak} nextStage={s.nextStage} />
          </Section>

          <Section title="Your last month" sub="Your pet's HP and hunger come from the last 30 days, not just today.">
            <MonthlyRecap s={s} />
          </Section>

          <Section title="Achievements"><Achievements list={s.achievements} /></Section>
          <Section title="Rival board"><Leaderboard me={login} tz={tz} /></Section>

          <Section title="Put it on your README" sub="Paste this into your profile README and the pet updates itself.">
            <CopyBlock
              snippets={[
                { label: 'Markdown', code: mdSnippet(origin, { username: login, pet: s.kind, tz, name: petName }) },
                { label: 'HTML', code: htmlSnippet(origin, { username: login, pet: s.kind, tz, name: petName }) },
              ]}
            />
          </Section>
        </>
      )}

      <AnimatePresence>
        {evolved && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setEvolved(null)}
            className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center bg-ink-950/90 backdrop-blur"
          >
            <motion.div initial={{ scale: 0.3, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 160, damping: 10 }}>
              <PetSprite art={evolved} size={280} />
            </motion.div>
            <p className="mt-4 font-pixel text-xl text-neon-gold [text-shadow:0_0_24px_#ffd166]">EVOLVED!</p>
            <p className="mt-3 text-slate-300">Your pet is now a {evolved.stageName}. Tap to continue.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
