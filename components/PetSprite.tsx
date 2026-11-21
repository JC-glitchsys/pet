'use client';
import { memo, useId, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { petSVG, type ArtProps } from '@/lib/pet-art';

interface Props {
  art: ArtProps;
  size?: number | string;
  className?: string;
  /** Pop/flash animation whenever stage or mood changes. */
  pop?: boolean;
}

function PetSpriteBase({ art, size = 220, className = '', pop = true }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const html = useMemo(
    () => petSVG(art, { uid }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [art.kind, art.stage, art.mood, art.aura, art.cracks, uid],
  );
  const style = { width: size, aspectRatio: '1 / 1' } as const;

  if (!pop) return <div className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />;
  return (
    <div className={className} style={style}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${art.kind}${art.stage}${art.mood}`}
          initial={{ scale: 0.5, opacity: 0, filter: 'brightness(4)' }}
          animate={{ scale: 1, opacity: 1, filter: 'brightness(1)' }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 16 }}
          style={{ width: '100%', height: '100%' }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </AnimatePresence>
    </div>
  );
}

export const PetSprite = memo(PetSpriteBase);
