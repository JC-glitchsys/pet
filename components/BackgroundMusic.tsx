'use client';

import { useEffect, useRef, useState } from 'react';

type MusicStatus = 'blocked' | 'playing' | 'paused' | 'missing';

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<MusicStatus>('blocked');

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const removeGestureListeners = () => {
      document.removeEventListener('pointerdown', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
    const handlePlay = () => {
      setStatus('playing');
      removeGestureListeners();
    };
    const handlePause = () => setStatus('paused');
    const handleError = () => setStatus('missing');
    const handlePlaybackError = (error: unknown) => {
      const name = error instanceof DOMException ? error.name : '';
      setStatus(name === 'NotAllowedError' ? 'blocked' : 'missing');
    };
    const handleUserInteraction = () => {
      removeGestureListeners();
      if (audio.paused) audio.play().catch(handlePlaybackError);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    document.addEventListener('pointerdown', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    audio.play().catch(handlePlaybackError);

    return () => {
      removeGestureListeners();
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
      setStatus('playing');
    } catch (error) {
      const name = error instanceof DOMException ? error.name : '';
      setStatus(name === 'NotAllowedError' ? 'blocked' : 'missing');
    }
  }

  const label = status === 'playing' ? 'Pause background music' : 'Play background music';

  return (
    <>
      <audio ref={audioRef} src="/music.mp3" loop autoPlay preload="none" />
      <button
        type="button"
        onClick={toggleMusic}
        aria-label={status === 'missing' ? 'Add music.mp3 to the public folder' : label}
        aria-pressed={status === 'playing'}
        title={status === 'missing' ? 'Add music.mp3 to the public folder' : label}
        className="music-control rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10"
      >
        <span aria-hidden="true">{'\u266B'}</span>
        <span className="ml-1.5 hidden sm:inline">{status === 'playing' ? 'Music on' : status === 'missing' ? 'Add music.mp3' : 'Play music'}</span>
      </button>
    </>
  );
}
