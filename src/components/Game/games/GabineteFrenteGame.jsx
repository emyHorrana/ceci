// GabineteFrenteGame.jsx
// Cena: frente de um gabinete (torre), com o botão de ligar, a saída
// de ventilação e as entradas de cabo desenhados de forma simples e
// reconhecível - não é a arte contextualizada final da designer (que
// por enquanto está cobrindo só tela de fundo/aplicativos/janelas,
// não hardware físico), é um desenho básico feito à mão pra dar
// posição espacial real em vez de botões de texto.
//
// Quando uma ilustração de verdade existir pra esse tópico, troca só
// o SVG estático aqui dentro (ou substitui por uma <image>) - os
// alvos (coordenadas + correto/errado) continuam funcionando do mesmo
// jeito, e ClicarNaImagemGame.jsx não muda nada.

import { ClicarNaImagemGame } from './ClicarNaImagemGame';

const VIEW_BOX = '0 0 300 420';

const ALVOS = [
  {
    id: 'ventilacao',
    correto: false,
    shape: 'rect',
    x: 65, y: 45, width: 170, height: 65, rx: 8,
    rotuloAcessivel: 'Saída de ventilação',
  },
  {
    id: 'ligar',
    correto: true,
    shape: 'circle',
    cx: 150, cy: 210, r: 30,
    rotuloAcessivel: 'Botão de ligar',
  },
  {
    id: 'entrada-cabos',
    correto: false,
    shape: 'rect',
    x: 90, y: 350, width: 120, height: 32, rx: 6,
    rotuloAcessivel: 'Entrada de cabos',
  },
];

export function GabineteFrenteGame({ reportResult }) {
  return (
    <ClicarNaImagemGame reportResult={reportResult} viewBox={VIEW_BOX} alvos={ALVOS}>
      {/* Corpo do gabinete */}
      <rect x="40" y="20" width="220" height="380" rx="24" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="4" />

      {/* Grade de ventilação (decorativa - o alvo clicável é o rect
          transparente por cima, desenhado por ALVOS) */}
      {[55, 65, 75, 85, 95].map((y) => (
        <line key={y} x1="75" y1={y} x2="225" y2={y} stroke="var(--color-border)" strokeWidth="5" strokeLinecap="round" />
      ))}

      {/* Botão de ligar - círculo com o símbolo clássico de power */}
      <circle cx="150" cy="210" r="30" fill="var(--color-white)" stroke="var(--color-text-secondary)" strokeWidth="3" />
      <line x1="150" y1="194" x2="150" y2="210" stroke="var(--color-text-secondary)" strokeWidth="4" strokeLinecap="round" />
      <path d="M 134 202 A 20 20 0 1 0 166 202" fill="none" stroke="var(--color-text-secondary)" strokeWidth="4" strokeLinecap="round" />

      {/* Luz de atividade */}
      <circle cx="150" cy="260" r="5" fill="var(--color-success)" />

      {/* Entradas de cabo (USB) - decorativas */}
      <rect x="100" y="358" width="34" height="16" rx="3" fill="var(--color-border)" />
      <rect x="166" y="358" width="34" height="16" rx="3" fill="var(--color-border)" />
    </ClicarNaImagemGame>
  );
}