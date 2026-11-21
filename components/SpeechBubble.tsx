'use client';
import { useEffect, useState } from 'react';

export function SpeechBubble({ text, danger = false }: { text: string; danger?: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    let i = 0;
    const t = setInterval(() => {
      i++;
      setN(i);
      if (i >= text.length) clearInterval(t);
    }, 24);
    return () => clearInterval(t);
  }, [text]);

  return (
    <div className={`relative w-full max-w-sm rounded-2xl bg-slate-100 px-4 py-3 shadow-lg ${danger ? 'shadow-rose-500/30' : 'shadow-emerald-400/20'}`}>
      <p className="min-h-[2.75rem] font-mono text-sm font-bold leading-snug text-ink-950" aria-label={text}>
        {text.slice(0, n)}
        <span className="animate-pulse">▌</span>
      </p>
      <span className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-slate-100" />
    </div>
  );
}
