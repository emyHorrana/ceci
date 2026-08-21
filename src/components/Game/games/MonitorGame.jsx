// MonitorGame.jsx
// Cena: um monitor visto de frente, com o botão de ligar dele (embaixo
// da moldura) e o pedestal - desenho básico feito à mão, mesma
// situação das outras cenas de hardware (GabineteFrenteGame,
// PortaTraseiraGame): a designer ainda não cobre hardware físico.
//
// Ensina algo que confunde muita gente iniciante: o MONITOR tem um
// botão de ligar PRÓPRIO, diferente do botão de ligar do gabinete
// (já visto em GabineteFrenteGame). Uma tela apagada nem sempre quer
// dizer "computador desligado" - às vezes é só o monitor.

import { ClicarNaImagemGame } from './ClicarNaImagemGame';

const VIEW_BOX = '0 0 320 300';

const ALVOS = [
  {
    id: 'pedestal',
    correto: false,
    shape: 'rect',
    x: 130, y: 250, width: 60, height: 30, rx: 6,
    rotuloAcessivel: 'Pedestal do monitor',
  },
  {
    id: 'ligar-monitor',
    correto: true,
    shape: 'circle',
    cx: 270, cy: 210, r: 20,
    rotuloAcessivel: 'Botão de ligar do monitor',
  },
];

export function MonitorGame({ reportResult }) {
  return (
    <ClicarNaImagemGame reportResult={reportResult} viewBox={VIEW_BOX} alvos={ALVOS}>
      {/* Tela */}
      <rect x="20" y="20" width="280" height="180" rx="14" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="4" />
      <rect x="36" y="36" width="248" height="148" rx="6" fill="var(--color-yellow-bg)" stroke="var(--color-border)" strokeWidth="2" />

      {/* Moldura inferior, onde fica o botão de ligar do monitor */}
      <rect x="20" y="196" width="280" height="30" rx="8" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="3" />
      <circle cx="270" cy="210" r="7" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2" />
      <line x1="270" y1="205" x2="270" y2="210" stroke="var(--color-text-secondary)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Haste + pedestal (decorativos) */}
      <rect x="150" y="224" width="20" height="30" fill="var(--color-border)" />
      <rect x="130" y="250" width="60" height="16" rx="6" fill="var(--color-border)" />
    </ClicarNaImagemGame>
  );
}