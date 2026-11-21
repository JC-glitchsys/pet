import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { JetBrains_Mono, Press_Start_2P, Space_Grotesk } from 'next/font/google';
import './globals.css';

const pixel = Press_Start_2P({ weight: '400', subsets: ['latin'], variable: '--font-pixel', display: 'swap' });
const sans = Space_Grotesk({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: 'Pasabog Pet · A GitHub pet that dies if you stop committing', template: '%s · Pasabog Pet' },
  description:
    'A living pixel pet for your GitHub profile README. It evolves with your real commit streak, gets hungry when you skip a day, and turns into a ghost if you vanish.',
  openGraph: { title: 'Pasabog Pet', description: 'Commit daily or your GitHub pet dies.', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Pasabog Pet', description: 'Commit daily or your GitHub pet dies.' },
};

export const viewport: Viewport = { themeColor: '#07080d', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${pixel.variable} ${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen font-sans">
        <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/70 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2 font-pixel text-[11px] text-white">
              <span className="inline-block h-3 w-3 rounded-sm bg-neon-green shadow-[0_0_12px_#39ff88]" />
              PASABOG<span className="text-neon-green">PET</span>
            </Link>
            <div className="hidden items-center gap-6 text-sm text-slate-400 sm:flex">
              <Link href="/#how" className="hover:text-white">How it works</Link>
              <Link href="/#demo" className="hover:text-white">Live demo</Link>
              <Link href="/#embed" className="hover:text-white">Add to README</Link>
            </div>
            <Link href="/dashboard" className="btn-primary !px-4 !py-2 text-sm">Adopt a pet</Link>
          </nav>
        </header>
        {children}
        <footer className="mt-24 border-t border-white/5 py-10 text-center text-sm text-slate-500">
          Built with Next.js, the GitHub GraphQL API and too many green squares. Not affiliated with GitHub.
        </footer>
      </body>
    </html>
  );
}
