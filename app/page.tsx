import Link from 'next/link';
import { ShowcaseLoop } from '@/components/ShowcaseLoop';
import { PetSprite } from '@/components/PetSprite';
import { EvolutionTrack } from '@/components/EvolutionTrack';
import { LiveDemo } from '@/components/LiveDemo';
import { EmbedSection } from '@/components/EmbedSection';
import type { Mood } from '@/lib/types';

const STEPS = [
  { t: 'Pick a companion', d: 'Cat, Dog, Axolotl, Dragon or Capybara. Each has its own strengths and its own way of starving.' },
  { t: 'Commit to feed it', d: 'We read your real GitHub contributions: streak, active days, and the last 30 days of activity.' },
  { t: 'Watch it evolve or die', d: 'Streaks hatch and evolve it. Skip days and it gets hungry, then sad, then turns into a ghost.' },
  { t: 'Embed it on your profile', d: 'One image link in your README. It updates on its own and everyone who visits sees the pet.' },
];

const MOODS: { mood: Mood; title: string; line: string }[] = [
  { mood: 'happy', title: 'Committed today', line: "7-day streak! Let's gooo!" },
  { mood: 'sleepy', title: 'Late at night', line: 'zZz... isang commit pa bago matulog?' },
  { mood: 'hungry', title: 'One day skipped', line: 'Feed me with commits!' },
  { mood: 'sad', title: 'Two days skipped', line: 'Ayoko pang maging multo :(' },
  { mood: 'ghost', title: 'Gone for good', line: 'Bro, 1 month mo na ko di pinakain...' },
];

const RULES = [
  ['25-30 active days', '100% HP, legendary glow'],
  ['15-24 active days', '70% HP, happy'],
  ['7-14 active days', '40% HP, tired'],
  ['1-6 active days', '15% HP, sad and hungry'],
  ['0 active days', 'Ghost mode'],
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:pt-24">
          <div>
            <h1 className="font-pixel text-2xl leading-[1.5] text-white sm:text-4xl sm:leading-[1.4]">
              Your commits feed it.<br />
              <span className="text-neon-red [text-shadow:0_0_30px_rgba(255,107,129,.6)]">Your laziness kills it.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              A living pixel pet for your GitHub profile. It grows from your real contribution streak, gets hungry when you skip a day,
              and turns into a ghost if you disappear for good.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard" className="btn-primary">Adopt your pet</Link>
              <Link href="#demo" className="btn-ghost">Try the live demo</Link>
            </div>
            <p className="mt-5 text-sm text-slate-500">Free, open source, and no sign-in. Just your GitHub username.</p>
          </div>
          <ShowcaseLoop />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <h2 className="font-pixel text-lg text-white">How it works</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.t} className="glass rounded-2xl p-5">
              <div className="font-pixel text-[10px] text-neon-green">Step {i + 1}</div>
              <div className="mt-3 text-lg font-bold text-white">{s.t}</div>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Evolution */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-pixel text-lg text-white">Five stages. One hundred days to the crown.</h2>
        <p className="mt-3 max-w-2xl text-slate-400">Egg, Baby, Teen, Adult, then Legendary: a shiny recolor, a crown and a glow that other people will notice on your profile.</p>
        <div className="mt-8"><EvolutionTrack kind="dragon" stage={4} streak={100} /></div>
      </section>

      {/* Moods */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-pixel text-lg text-white">Neglect it and see what happens</h2>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
          {MOODS.map((m) => (
            <div key={m.mood} className="glass rounded-2xl p-3 text-center">
              <PetSprite art={{ kind: 'cat', stage: 3, mood: m.mood, aura: false, cracks: 0 }} size="100%" pop={false} />
              <div className="text-sm font-bold text-white">{m.title}</div>
              <p className="mt-2 rounded-lg bg-slate-100 px-2 py-1.5 font-mono text-[11px] font-bold leading-snug text-ink-950">{m.line}</p>
            </div>
          ))}
        </div>
        <div className="glass mt-8 grid gap-6 rounded-2xl p-6 md:grid-cols-[1fr_1.2fr]">
          <div>
            <h3 className="text-lg font-bold text-white">It remembers your last month</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              HP and hunger come from your last 30 days, not just today. A strong month stores energy, so one or two missed days
              will not kill a pet you have fed all month. Past that, it gets hungry quickly.
            </p>
          </div>
          <ul className="space-y-2">
            {RULES.map(([a, b]) => (
              <li key={a} className="flex justify-between rounded-xl bg-white/[0.04] px-4 py-2 font-mono text-xs">
                <span className="text-slate-300">{a}</span><span className="text-neon-green">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Live demo */}
      <section id="demo" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <h2 className="font-pixel text-lg text-white">Live demo</h2>
        <p className="mt-3 max-w-2xl text-slate-400">This is the real image your README will show, rendered at the edge. Change the pet and the situation.</p>
        <div className="mt-8"><LiveDemo /></div>
      </section>

      {/* Embed */}
      <section id="embed" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <h2 className="font-pixel text-lg text-white">Add it to your README</h2>
        <div className="mt-8"><EmbedSection /></div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="font-pixel text-xl leading-relaxed text-white">Your pet is an egg right now.</h2>
        <p className="mt-4 text-slate-400">Keep it alive for 100 days.</p>
        <Link href="/dashboard" className="btn-primary mt-8">Adopt your pet</Link>
      </section>
    </main>
  );
}
