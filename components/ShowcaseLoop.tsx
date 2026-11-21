'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PetSprite } from './PetSprite';
import type { ArtProps } from '@/lib/pet-art';

interface Item { art: ArtProps; say: string; bars: [number, number, number, number]; tag: string }

const ITEMS: Item[] = [
  { art: { kind: 'axolotl', stage: 2, mood: 'happy', aura: false, cracks: 0 }, say: "9-day streak! Let's gooo!", bars: [70, 62, 100, 84], tag: 'Teen Axolotl' },
  { art: { kind: 'dragon', stage: 4, mood: 'happy', aura: true, cracks: 0 }, say: 'Hari na ako. Bow down.', bars: [100, 91, 100, 96], tag: 'Legendary Dragon' },
  { art: { kind: 'cat', stage: 3, mood: 'hungry', aura: false, cracks: 0 }, say: 'Feed me with commits!', bars: [40, 48, 65, 38], tag: 'Hungry Cat' },
  { art: { kind: 'capybara', stage: 3, mood: 'ghost', aura: false, cracks: 0 }, say: 'Bro, 1 month mo na ko di pinakain...', bars: [0, 48, 0, 0], tag: 'Ghost Capybara' },
  { art: { kind: 'dog', stage: 0, mood: 'happy', aura: false, cracks: 2 }, say: '*tok tok* Hatch me with commits!', bars: [15, 8, 100, 70], tag: 'Cracking Egg' },
];
const LABELS = ['HP', 'XP', 'HUNGER', 'JOY'];
const COLORS = ['#ff4d6d', '#38e8ff', '#ffd166', '#39ff88'];

export function ShowcaseLoop() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % ITEMS.length), 3800);
    return () => clearInterval(t);
  }, []);
  const it = ITEMS[i];

  return (
    <div className="glass relative mx-auto w-full max-w-sm rounded-3xl p-6">
      <div className="mb-4 rounded-2xl bg-slate-100 px-4 py-3 font-mono text-sm font-bold text-ink-950">{it.say}</div>
      <PetSprite art={it.art} size="100%" />
      <div className="mt-1 text-center font-pixel text-[10px] text-neon-cyan">{it.tag}</div>
      <div className="mt-4 space-y-2">
        {it.bars.map((v, n) => (
          <div key={LABELS[n]} className="flex items-center gap-3 font-mono text-[10px] text-slate-400">
            <span className="w-14">{LABELS[n]}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
              <motion.div key={`${i}-${n}`} className="h-full rounded-full" style={{ background: COLORS[n] }} initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.9, delay: n * 0.08 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
