import { Suspense } from 'react';
import { Dashboard } from '@/components/Dashboard';

export const metadata = { title: 'Dashboard' };

export default function Page() {
  return (
    <Suspense fallback={<p className="p-10 text-center font-pixel text-xs text-slate-400">Loading pet…</p>}>
      <Dashboard />
    </Suspense>
  );
}
