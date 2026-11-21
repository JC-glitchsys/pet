import Link from 'next/link';
import { ShowcaseLoop } from '@/components/ShowcaseLoop';
import { LiveDemo } from '@/components/LiveDemo';
import { EmbedSection } from '@/components/EmbedSection';

const STEPS = [
  { t: 'Pick your main', d: 'Cat, dog, axolotl, dragon, or capybara. Ikaw bahala.' },
  { t: 'Commits = pagkain', d: 'GitHub streak mo ang XP at HP niya. Wowow.' },
  { t: 'Skip ka? Ghost era.', d: 'Keep committing para sheshable ang evolution.' },
];

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:pt-24">
          <div>
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-neon-green">GitHub pet · free · no login</p>
            <h1 className="font-pixel text-2xl leading-[1.5] text-white sm:text-4xl sm:leading-[1.4]">
              Commit ka.<br />
              <span className="text-neon-red [text-shadow:0_0_30px_rgba(255,107,129,.6)]">Pet mo, aura-farming.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              GitHub streak mo ang XP niya. Commit ka, glow up siya. Biglang nawala? Gutom era. Bogphh.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard" className="btn-primary">Pili ka ng pet</Link>
              <Link href="#demo" className="btn-ghost">Vibe check</Link>
            </div>
          </div>
          <ShowcaseLoop />
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12">
        <h2 className="font-pixel text-lg text-white">Okay, paano?</h2>
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
        <h2 className="font-pixel text-lg text-white">Vibe check</h2>
        <p className="mt-2 text-slate-400">Pick a pet. Try a mood. Shesh.</p>
        <div className="mt-8"><LiveDemo /></div>
      </section>

      <section id="embed" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12">
        <h2 className="font-pixel text-lg text-white">Pet flex sa README mo</h2>
        <div className="mt-8"><EmbedSection /></div>
      </section>
    </main>
  );
}
