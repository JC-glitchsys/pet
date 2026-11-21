'use client';

import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem('pet-theme');
    } catch {
      // Keep the default theme when storage is unavailable.
    }
    const next: Theme = saved === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    setTheme(next);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem('pet-theme', next);
    } catch {
      // The current page still switches theme without persistent storage.
    }
    setTheme(next);
  }

  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={theme === 'light'}
      title={label}
      className="theme-control rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-sm text-slate-300 transition hover:bg-white/10 sm:px-3"
    >
      <span aria-hidden="true">{theme === 'dark' ? '\u2600' : '\u263E'}</span>
      <span className="ml-1.5 hidden sm:inline">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
    </button>
  );
}
