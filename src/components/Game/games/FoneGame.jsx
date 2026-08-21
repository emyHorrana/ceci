// FoneGame.jsx
// Cena: lateral de um notebook com duas entradas parecidas em posição
// (redondas, pequenas) - a entrada de fone (P2) e a entrada de energia
// (barril) - desenho básico feito à mão, mesma situação das outras
// cenas de hardware.
//
// De propósito as duas entradas são bem parecidas (ambas redondas),
// diferente do PortaTraseiraGame (onde USB x energia já tinham
// formatos bem diferentes) - aqui o desafio é reparar no detalhe fino
// (o símbolo de fone gravado ao lado da entrada certa), que é o tipo
// de atenção que ajuda de verdade no notebook real.

import { ArrastarNaImagemGame } from './ArrastarNaImagemGame';

const VIEW_BOX = '0 0 320 200';

const ITEM_INICIAL = { x: 60, y: 165 };

const ZONAS = [
  {
    id: 'entrada-fone',
    correta: true,
    shape: 'circle',
    cx: 140, cy: 90, r: 16,
  },
  {
    id: 'entrada-energia',
    correta: false,
    shape: 'circle',
    cx: 220, cy: 90, r: 16,
  },
];

// Plugue P2 do fone - desenhado centrado em (0,0), com o fiozinho do
// fone saindo pra deixar claro o que é.
const ITEM_DESENHO = (
  <>
    <path d="M -40 -20 Q -20 -35 0 -6" fill="none" stroke="var(--color-border)" strokeWidth="3" />
    <rect x="-6" y="-6" width="12" height="30" rx="6" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="3" />
    <rect x="-6" y="6" width="12" height="3" fill="var(--color-text-muted)" />
  </>
);

export function FoneGame({ reportResult }) {
  return (
    <ArrastarNaImagemGame
      reportResult={reportResult}
      viewBox={VIEW_BOX}
      itemInicial={ITEM_INICIAL}
      itemDesenho={ITEM_DESENHO}
      zonas={ZONAS}
    >
      {/* Lateral do notebook */}
      <rect x="20" y="20" width="280" height="140" rx="16" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="4" />

      {/* Entrada de fone - símbolo de fone de ouvido ao lado, pra dar
          a pista visual de verdade (não é só "adivinhar a redonda certa") */}
      <circle cx="140" cy="90" r="20" fill="none" stroke="var(--color-border)" strokeWidth="2" />
      <path d="M 128 68 a 12 12 0 0 1 24 0 v 10" fill="none" stroke="var(--color-text-muted)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="126" cy="80" r="4" fill="var(--color-text-muted)" />
      <circle cx="154" cy="80" r="4" fill="var(--color-text-muted)" />

      {/* Entrada de energia - símbolo de raio ao lado */}
      <circle cx="220" cy="90" r="20" fill="none" stroke="var(--color-border)" strokeWidth="2" />
      <path d="M 222 66 l -8 14 h 6 l -4 12 l 10 -16 h -6 z" fill="var(--color-text-muted)" />
    </ArrastarNaImagemGame>
  );
}