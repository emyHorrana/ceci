// PortaTraseiraGame.jsx
// Cena: painel traseiro simples com uma porta USB (retangular) e uma
// entrada de energia (redonda) - desenho básico feito à mão (mesma
// situação do GabineteFrenteGame: a designer ainda não cobre hardware
// físico, só tela de fundo/apps/janelas).
//
// De propósito, os formatos são bem diferentes entre si (retangular
// vs. redondo) e o plugue arrastado tem o mesmo formato da porta
// certa - a pessoa aprende a comparar formato do plugue com formato
// da porta, não a decorar "qual das duas é a certa".

import { ArrastarNaImagemGame } from './ArrastarNaImagemGame';

const VIEW_BOX = '0 0 320 220';

const ITEM_INICIAL = { x: 70, y: 175 };

const ZONAS = [
  {
    id: 'porta-usb',
    correta: true,
    shape: 'rect',
    x: 84, y: 84, width: 52, height: 28, rx: 6,
  },
  {
    id: 'porta-energia',
    correta: false,
    shape: 'circle',
    cx: 230, cy: 98, r: 22,
  },
];

// Plugue USB (mouse) - desenhado centrado em (0,0), o motor translada.
const ITEM_DESENHO = (
  <>
    {/* corpo do mouse, só pra deixar claro de onde vem o cabo */}
    <ellipse cx="-46" cy="-14" rx="18" ry="24" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="3" />
    <line x1="-46" y1="-36" x2="-46" y2="-14" stroke="var(--color-border)" strokeWidth="2" />
    {/* cabo curvo até o plugue */}
    <path d="M -30 4 Q -10 20 0 0" fill="none" stroke="var(--color-border)" strokeWidth="3" />
    {/* plugue USB - mesmo formato retangular da porta certa */}
    <rect x="-18" y="-11" width="36" height="22" rx="5" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="3" />
    <rect x="-12" y="-5" width="24" height="10" rx="2" fill="var(--color-text-muted)" />
  </>
);

export function PortaTraseiraGame({ reportResult }) {
  return (
    <ArrastarNaImagemGame
      reportResult={reportResult}
      viewBox={VIEW_BOX}
      itemInicial={ITEM_INICIAL}
      itemDesenho={ITEM_DESENHO}
      zonas={ZONAS}
    >
      {/* Painel traseiro */}
      <rect x="20" y="20" width="280" height="180" rx="16" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="4" />

      {/* Moldura decorativa da porta USB (retangular) */}
      <rect x="78" y="78" width="64" height="40" rx="8" fill="none" stroke="var(--color-border)" strokeWidth="2" />
      <rect x="90" y="90" width="40" height="16" rx="3" fill="var(--color-text-muted)" />

      {/* Moldura decorativa da entrada de energia (redonda) */}
      <circle cx="230" cy="98" r="28" fill="none" stroke="var(--color-border)" strokeWidth="2" />
      <circle cx="230" cy="98" r="14" fill="var(--color-text-muted)" />
    </ArrastarNaImagemGame>
  );
}