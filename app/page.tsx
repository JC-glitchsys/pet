import Link from 'next/link';
import { ShowcaseLoop } from '@/components/ShowcaseLoop';
import { LiveDemo } from '@/components/LiveDemo';
import { EmbedSection } from '@/components/EmbedSection';

const STEPS = [
  { t: 'Choose a pet', d: 'Cat, dog, axolotl, dragon, or capybara. Pick your fave.' },
  { t: 'Commits feed it', d: 'Your real GitHub streak powers its HP and XP.' },
  { t: 'Skip days? Ghost mode.', d: 'Keep the streak going to help it evolve.' },
];

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:pt-24">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.2em] text-neon-green">GitHub pet · free · no login</p>
            <h1 className="font-pixel text-2xl leading-[1.5] text-white sm:text-4xl sm:leading-[1.4]">
              Your GitHub streak<br />
              <span className="text-neon-red [text-shadow:0_0_30px_rgba(255,107,129,.6)]">keeps your pet alive.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Your real GitHub activity feeds a pixel pet. Keep committing to help it grow; disappear for too long and it goes ghost.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard" className="btn-primary">Pick your pet</Link>
              <Link href="#demo" className="btn-ghost">See the demo</Link>
            </div>
          </div>
          <ShowcaseLoop />
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12">
        <h2 className="text-xl font-semibold text-white">How it works</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.t} className="glass rounded-2xl p-4">
              <div className="font-pixel text-[10px] text-neon-green">0{i + 1}</div>
              <div className="mt-3 font-bold text-white">{s.t}</div>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="demo" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12">
        <h2 className="text-xl font-semibold text-white">Vibe Check</h2>
        <p className="mt-2 text-slate-400">Pick a pet and try a mood.</p>
        <div className="mt-8"><LiveDemo /></div>
      </section>

      <section id="embed" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12">
        <h2 className="text-xl font-semibold text-white">Add it to your README</h2>
        <div className="mt-8"><EmbedSection /></div>
      </section>
    </main>
  );
}
