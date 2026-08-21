// WebcamLuzGame.jsx
// Cena: topo de uma tela de notebook, com a lente da webcam (círculo
// escuro) e, do lado, a luzinha indicadora acesa (verde) - desenho
// básico feito à mão, mesma situação das outras cenas de hardware.
//
// Complementa o quiz de mesmo tema que já existe no checkpoint da
// Unidade (U3.4, em data/unidades.js) - lá a pergunta é verbal
// ("como você sabe que a webcam está ligada?"), aqui é o reconhecimento
// visual de verdade: achar a luzinha na imagem, não só lembrar que ela
// existe. As duas coisas juntas (reconhecer + saber explicar) fixam
// melhor do que só uma.

import { ClicarNaImagemGame } from './ClicarNaImagemGame';

const VIEW_BOX = '0 0 320 140';

const ALVOS = [
  {
    id: 'lente',
    correto: false,
    shape: 'circle',
    cx: 130, cy: 70, r: 16,
    rotuloAcessivel: 'Lente da webcam',
  },
  {
    id: 'luz-indicadora',
    correto: true,
    shape: 'circle',
    cx: 175, cy: 70, r: 10,
    rotuloAcessivel: 'Luz indicadora da webcam',
  },
];

export function WebcamLuzGame({ reportResult }) {
  return (
    <ClicarNaImagemGame reportResult={reportResult} viewBox={VIEW_BOX} alvos={ALVOS}>
      {/* Borda superior da tela do notebook */}
      <rect x="20" y="30" width="280" height="80" rx="14" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="4" />

      {/* Lente da webcam - decorativa */}
      <circle cx="130" cy="70" r="10" fill="var(--color-text-primary)" />
      <circle cx="133" cy="66" r="2.5" fill="var(--color-white)" opacity="0.6" />

      {/* Luz indicadora - decorativa, acesa (verde) */}
      <circle cx="175" cy="70" r="5" fill="var(--color-success)" />
    </ClicarNaImagemGame>
  );
}