'use client';
import { useState } from 'react';

export function CopyBlock({ snippets }: { snippets: { label: string; code: string }[] }) {
  const [tab, setTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const cur = snippets[tab];

  async function copy() {
    try {
      await navigator.clipboard.writeText(cur.code);
    } catch {
      const t = document.createElement('textarea');
      t.value = cur.code;
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="glass min-w-0 overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <div className="flex gap-1">
          {snippets.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setTab(i)}
              className={`rounded-full px-3 py-1 font-mono text-xs transition ${i === tab ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button onClick={copy} className={`rounded-full px-3 py-1 text-xs font-bold transition ${copied ? 'bg-neon-green text-ink-950' : 'bg-white/10 text-white hover:bg-white/20'}`}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-emerald-200"><code>{cur.code}</code></pre>
    </div>
  );
}
