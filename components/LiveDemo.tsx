'use client';
import { useEffect, useState } from 'react';
import { CopyBlock } from './CopyBlock';
import { useOrigin, useTz } from './hooks';
import { PET_KINDS, PETS } from '@/lib/pets';
import { htmlSnippet, mdSnippet } from '@/lib/embed';
import { USERNAME_RE } from '@/lib/util';
import type { PetKind } from '@/lib/types';

const SCENES = [
  ['legend', 'Legendary'], ['beast', 'Monthly Beast'], ['protected', 'Stored energy'],
  ['hungry', 'Hungry'], ['ghost', 'Ghost'], ['egg', 'Fresh egg'], ['live', 'My GitHub'],
] as const;

export function LiveDemo() {
  const origin = useOrigin();
  const tz = useTz();
  const [kind, setKind] = useState<PetKind>('axolotl');
  const [scene, setScene] = useState<string>('legend');
  const [name, setName] = useState('');
  const [applied, setApplied] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [bad, setBad] = useState(false);

  const live = scene === 'live';
  const username = live ? applied || 'demo' : 'demo';
  const src = `/api/pet?username=${encodeURIComponent(username)}&pet=${kind}&tz=${tz}${live ? '' : `&scenario=${scene}`}`;
  useEffect(() => { setLoaded(false); setImageError(false); }, [src]);

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
      <div className="space-y-6">
        <div>
          <div className="mb-2 text-sm font-semibold text-white">1. Pick a pet</div>
          <div className="flex flex-wrap gap-2">
            {PET_KINDS.map((k) => (
              <button key={k} onClick={() => setKind(k)} aria-pressed={kind === k}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${kind === k ? 'text-ink-950' : 'border-white/10 text-slate-300 hover:border-white/30'}`}
                style={kind === k ? { background: PETS[k].color, borderColor: PETS[k].color } : undefined}>
                {PETS[k].name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 text-sm font-semibold text-white">2. Pick a situation</div>
          <div className="flex flex-wrap gap-2">
            {SCENES.map(([id, label]) => (
              <button key={id} onClick={() => setScene(id)} aria-pressed={scene === id}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${scene === id ? 'border-neon-green bg-neon-green/15 text-neon-green' : 'border-white/10 text-slate-300 hover:border-white/30'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
        {live && (
          <form onSubmit={(e) => { e.preventDefault(); const u = name.trim().replace(/^@/, ''); if (USERNAME_RE.test(u)) { setBad(false); setApplied(u); } else setBad(true); }} className="flex gap-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="your-github-username" aria-label="GitHub username"
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-neon-cyan" />
            <button className="btn-primary !py-2.5 text-sm">Load</button>
          </form>
        )}
        {bad && <p className="text-xs text-neon-red">That is not a valid GitHub username.</p>}
      </div>

      <div className="min-w-0">
        <div className="glass overflow-hidden rounded-2xl">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2 font-mono text-xs text-slate-500">
            <span className="h-2.5 w-2.5 rounded-full bg-neon-red/70" /><span className="h-2.5 w-2.5 rounded-full bg-neon-gold/70" /><span className="h-2.5 w-2.5 rounded-full bg-neon-green/70" />
            <span className="ml-2">{username}/README.md</span>
          </div>
          <div className="bg-ink-900/60 p-4 sm:p-6">
            <div className="relative mx-auto max-w-[860px]" style={{ aspectRatio: '860 / 300' }}>
              {!loaded && !imageError && <div className="absolute inset-0 animate-pulse rounded-2xl bg-white/5" />}
              {imageError && <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/5 p-6 text-center text-sm text-slate-400">The preview could not be loaded. Please try again in a moment.</div>}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={src} src={src} alt="Live preview of the GitHub README pet card" onLoad={() => { setLoaded(true); setImageError(false); }} onError={() => { setLoaded(false); setImageError(true); }} className={`w-full rounded-2xl transition-opacity ${loaded ? 'opacity-100' : 'opacity-0'}`} />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <CopyBlock snippets={[
            { label: 'Markdown', code: mdSnippet(origin, { username: applied || 'YOUR_USERNAME', pet: kind, tz }) },
            { label: 'HTML', code: htmlSnippet(origin, { username: applied || 'YOUR_USERNAME', pet: kind, tz }) },
          ]} />
        </div>
      </div>
    </div>
  );
}
