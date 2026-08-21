// MonitorEGabineteGame.jsx
// Cena combinada: monitor e gabinete lado a lado, cada um com seu
// próprio botão de ligar.
//
// Por quê: MonitorGame.jsx e GabineteFrenteGame.jsx já existem
// separados, e cada um sozinho só tem 1-2 distratores óbvios (o pé do
// monitor, a ventilação do gabinete) - fácil demais pra testar a
// dúvida real, que é "qual dos DOIS eu aperto pra fazer X". Esta cena
// junta as duas, então a pessoa escolhe entre os 2 botões de ligar de
// verdade, não só entre 1 botão certo e 1 decorativo na mesma peça.
//
// alvoCorreto: 'monitor' | 'gabinete' - qual botão é o certo pra essa
// pergunta específica. A pergunta em si (liga a TELA vs liga o
// COMPUTADOR) fica no `instructions` da etapa em modulos.js - o mesmo
// componente serve pras duas perguntas, só trocando esse prop.
//
// Reaproveita a arte e as coordenadas exatas de MonitorGame.jsx e
// GabineteFrenteGame.jsx (só deslocadas com <g transform>), então se
// um dia a arte da designer chegar pra qualquer um dos dois, é só
// trocar o SVG estático aqui dentro - os alvos continuam batendo.

import { ClicarNaImagemGame } from './ClicarNaImagemGame';

const VIEW_BOX = '0 0 700 440';

function montarAlvos(alvoCorreto) {
  return [
    // Gabinete - deslocado com translate(20,10)
    {
      id: 'ventilacao',
      correto: false,
      shape: 'rect',
      x: 85, y: 55, width: 170, height: 65, rx: 8,
      rotuloAcessivel: 'Saída de ventilação do gabinete',
    },
    {
      id: 'ligar-gabinete',
      correto: alvoCorreto === 'gabinete',
      shape: 'circle',
      cx: 170, cy: 220, r: 30,
      rotuloAcessivel: 'Botão de ligar do gabinete',
    },
    {
      id: 'entrada-cabos',
      correto: false,
      shape: 'rect',
      x: 110, y: 360, width: 120, height: 32, rx: 6,
      rotuloAcessivel: 'Entrada de cabos do gabinete',
    },
    // Monitor - deslocado com translate(360,70)
    {
      id: 'pedestal',
      correto: false,
      shape: 'rect',
      x: 490, y: 320, width: 60, height: 30, rx: 6,
      rotuloAcessivel: 'Pedestal do monitor',
    },
    {
      id: 'ligar-monitor',
      correto: alvoCorreto === 'monitor',
      shape: 'circle',
      cx: 630, cy: 280, r: 20,
      rotuloAcessivel: 'Botão de ligar do monitor',
    },
  ];
}

export function MonitorEGabineteGame({ reportResult, alvoCorreto }) {
  const alvos = montarAlvos(alvoCorreto);

  return (
    <ClicarNaImagemGame reportResult={reportResult} viewBox={VIEW_BOX} alvos={alvos}>
      {/* Gabinete (mesma arte de GabineteFrenteGame.jsx, só deslocada) */}
      <g transform="translate(20,10)">
        <rect x="40" y="20" width="220" height="380" rx="24" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="4" />
        {[55, 65, 75, 85, 95].map((y) => (
          <line key={y} x1="75" y1={y} x2="225" y2={y} stroke="var(--color-border)" strokeWidth="5" strokeLinecap="round" />
        ))}
        <circle cx="150" cy="210" r="30" fill="var(--color-white)" stroke="var(--color-text-secondary)" strokeWidth="3" />
        <line x1="150" y1="194" x2="150" y2="210" stroke="var(--color-text-secondary)" strokeWidth="4" strokeLinecap="round" />
        <path d="M 134 202 A 20 20 0 1 0 166 202" fill="none" stroke="var(--color-text-secondary)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="150" cy="260" r="5" fill="var(--color-success)" />
        <rect x="100" y="358" width="34" height="16" rx="3" fill="var(--color-border)" />
        <rect x="166" y="358" width="34" height="16" rx="3" fill="var(--color-border)" />
      </g>

      {/* Monitor (mesma arte de MonitorGame.jsx, só deslocada) */}
      <g transform="translate(360,70)">
        <rect x="20" y="20" width="280" height="180" rx="14" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="4" />
        <rect x="36" y="36" width="248" height="148" rx="6" fill="var(--color-yellow-bg)" stroke="var(--color-border)" strokeWidth="2" />
        <rect x="20" y="196" width="280" height="30" rx="8" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="3" />
        <circle cx="270" cy="210" r="7" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2" />
        <line x1="270" y1="205" x2="270" y2="210" stroke="var(--color-text-secondary)" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="150" y="224" width="20" height="30" fill="var(--color-border)" />
        <rect x="130" y="250" width="60" height="16" rx="6" fill="var(--color-border)" />
      </g>
    </ClicarNaImagemGame>
  );
}