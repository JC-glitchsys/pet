'use client';
import { CopyBlock } from './CopyBlock';
import { useOrigin, useTz } from './hooks';
import { mdSnippet, htmlSnippet } from '@/lib/embed';

export function EmbedSection() {
  const origin = useOrigin();
  const tz = useTz();
  const p = { username: 'YOUR_USERNAME', pet: 'cat' as const, tz };
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <ol className="space-y-5 text-slate-300">
        {[
          ['Open your profile repo', 'It is the repo named exactly like your username, e.g. github.com/you/you.'],
          ['Paste the snippet', 'Add it to README.md. Swap YOUR_USERNAME, and pet= for cat, dog, axolotl, dragon or capybara.'],
          ['Add it to your profile', 'Your pet appears on your profile and refreshes approximately every 15 minutes.'],
        ].map(([t, d], i) => (
          <li key={t} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neon-green/15 font-pixel text-[10px] text-neon-green">{i + 1}</span>
            <div><div className="font-semibold text-white">{t}</div><p className="mt-1 text-sm text-slate-400">{d}</p></div>
          </li>
        ))}
      </ol>
      <CopyBlock snippets={[{ label: 'Markdown', code: mdSnippet(origin, p) }, { label: 'HTML', code: htmlSnippet(origin, p) }]} />
    </div>
  );
}
