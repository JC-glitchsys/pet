'use client';
import { motion } from 'framer-motion';
import type { Day } from '@/lib/types';

const LV = ['#1b2230', '#0e4429', '#006d32', '#26a641', '#39d353'];
const level = (c: number) => (c === 0 ? 0 : c < 3 ? 1 : c < 6 ? 2 : c < 10 ? 3 : 4);

/** GitHub-style: columns are weeks, rows are weekdays. Last 30 days only. */
export function Heatmap({ days }: { days: Day[] }) {
  const first = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const cells: (Day | null)[] = [...Array<null>(first).fill(null), ...days];
  while (cells.length % 7) cells.push(null);
  const cols = cells.length / 7;
  const todayKey = days[days.length - 1].date;

  return (
    <div className="flex gap-2">
      <div className="grid font-mono text-[9px] text-slate-500" style={{ gridTemplateRows: 'repeat(7, minmax(0, 1fr))' }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={i} className="flex items-center">{d}</span>
        ))}
      </div>
      <div
        className="grid flex-1 gap-1"
        style={{ gridTemplateRows: 'repeat(7, minmax(0, 1fr))', gridAutoFlow: 'column', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {cells.map((c, i) =>
          c ? (
            <motion.div
              key={c.date}
              title={`${c.date}: ${c.count} contribution${c.count === 1 ? '' : 's'}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.02, type: 'spring', stiffness: 300, damping: 18 }}
              className="aspect-square rounded-[4px]"
              style={{
                background: LV[level(c.count)],
                boxShadow: level(c.count) >= 3 ? '0 0 8px #39d35366' : undefined,
                outline: c.date === todayKey ? '1.5px solid #fff' : undefined,
              }}
            />
          ) : (
            <div key={`n${i}`} />
          ),
        )}
      </div>
    </div>
  );
}
