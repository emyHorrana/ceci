// IdentificarCaboGame.jsx
// Cena: três conectores desenhados com formatos realmente diferentes
// entre si (USB retangular, plugue de energia redondo, plugue de fone
// P2 alongado) - a pessoa reconhece o cabo pelo formato do conector,
// não por um rótulo de texto.

import { ClicarNaImagemGame } from './ClicarNaImagemGame';

const VIEW_BOX = '0 0 320 170';

const ALVOS = [
  {
    id: 'cabo-usb',
    correto: true,
    shape: 'rect',
    x: 37, y: 53, width: 46, height: 34, rx: 8,
    rotuloAcessivel: 'Cabo USB',
  },
  {
    id: 'cabo-energia',
    correto: false,
    shape: 'circle',
    cx: 160, cy: 70, r: 26,
    rotuloAcessivel: 'Cabo de energia',
  },
  {
    id: 'cabo-fone',
    correto: false,
    shape: 'rect',
    x: 246, y: 40, width: 28, height: 60, rx: 12,
    rotuloAcessivel: 'Cabo de fone de ouvido',
  },
];

export function IdentificarCaboGame({ reportResult }) {
  return (
    <ClicarNaImagemGame reportResult={reportResult} viewBox={VIEW_BOX} alvos={ALVOS}>
      {/* Cabo USB - conector retangular com contato interno */}
      <rect x="42" y="58" width="36" height="24" rx="5" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="3" />
      <rect x="48" y="64" width="24" height="12" rx="2" fill="var(--color-text-muted)" />
      <path d="M 60 82 Q 60 108 60 128" fill="none" stroke="var(--color-border)" strokeWidth="4" strokeLinecap="round" />

      {/* Cabo de energia - plugue redondo (barril) */}
      <circle cx="160" cy="70" r="18" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="3" />
      <circle cx="160" cy="70" r="7" fill="var(--color-text-muted)" />
      <path d="M 160 88 Q 160 108 160 128" fill="none" stroke="var(--color-border)" strokeWidth="4" strokeLinecap="round" />

      {/* Cabo de fone - conector P2 (cápsula alongada com anéis) */}
      <rect x="251" y="45" width="18" height="50" rx="9" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="3" />
      <rect x="251" y="63" width="18" height="3" fill="var(--color-text-muted)" />
      <rect x="251" y="73" width="18" height="3" fill="var(--color-text-muted)" />
      <path d="M 260 95 Q 260 110 260 128" fill="none" stroke="var(--color-border)" strokeWidth="4" strokeLinecap="round" />
    </ClicarNaImagemGame>
  );
}