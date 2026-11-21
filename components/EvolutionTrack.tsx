'use client';
import { PetSprite } from './PetSprite';
import { STAGE_AT, STAGE_NAMES } from '@/lib/pets';
import type { PetKind, Stage } from '@/lib/types';

interface Props {
  kind: PetKind;
  stage: number;
  streak: number;
  nextStage?: { name: string; daysLeft: number } | null;
}

export function EvolutionTrack({ kind, stage, streak, nextStage }: Props) {
  const lo = STAGE_AT[Math.min(stage, 4)];
  const hi = STAGE_AT[Math.min(stage + 1, 4)];
  const pct = stage >= 4 ? 100 : Math.max(0, Math.min(100, ((streak - lo) / (hi - lo)) * 100));

  return (
    <div>
      <div className="grid grid-cols-5 gap-2">
        {STAGE_NAMES.map((name, i) => {
          const reached = i <= stage;
          return (
            <div
              key={name}
              className={`glass rounded-2xl p-2 text-center transition ${i === stage ? 'ring-2 ring-neon-green/70' : ''} ${reached ? '' : 'opacity-35 grayscale'}`}
            >
              <PetSprite art={{ kind, stage: i as Stage, mood: 'happy', aura: i === 4, cracks: 0 }} size="100%" pop={false} />
              <div className="font-pixel text-[8px] leading-tight text-white sm:text-[9px]">{name}</div>
              <div className="mt-1 font-mono text-[10px] text-slate-400">{i === 0 ? 'start' : `${STAGE_AT[i]}d`}</div>
            </div>
          );
        })}
      </div>
      {nextStage !== undefined && (
        <div className="mt-4">
          <div className="mb-1 flex justify-between font-mono text-xs text-slate-400">
            <span>{nextStage ? `${nextStage.daysLeft} day${nextStage.daysLeft === 1 ? '' : 's'} to ${nextStage.name}` : stage >= 4 ? 'Max evolution. All hail the crown.' : 'Revive your pet to evolve again'}</span>
            <span>{Math.round(pct)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-green transition-all duration-1000" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
