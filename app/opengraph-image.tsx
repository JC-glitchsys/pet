import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Pasabog Pet: commit daily or your GitHub pet dies';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80, background: 'linear-gradient(135deg,#0d1117,#1a1330)', color: '#fff', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', fontSize: 30, color: '#39ff88' }}>PASABOG PET</div>
        <div style={{ display: 'flex', fontSize: 84, fontWeight: 800, lineHeight: 1.05, marginTop: 24 }}>Your commits feed it.</div>
        <div style={{ display: 'flex', fontSize: 84, fontWeight: 800, lineHeight: 1.05, color: '#ff6b81' }}>Your laziness kills it.</div>
        <div style={{ display: 'flex', fontSize: 30, color: '#8b949e', marginTop: 36 }}>A living pixel pet for your GitHub README.</div>
      </div>
    ),
    size,
  );
}
