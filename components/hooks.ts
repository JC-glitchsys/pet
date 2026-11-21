'use client';
import { useEffect, useState } from 'react';

export function useOrigin() {
  const [o, setO] = useState('');
  useEffect(() => setO(window.location.origin), []);
  return o || process.env.NEXT_PUBLIC_SITE_URL || 'https://my-pet.vercel.app';
}

/** Viewer's UTC offset in hours (drives "night = sleepy" and what counts as today). */
export function useTz() {
  const [t, setT] = useState(8);
  useEffect(() => setT(-new Date().getTimezoneOffset() / 60), []);
  return t;
}
