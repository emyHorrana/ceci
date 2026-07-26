// DigitarNomeGame.jsx
// Interação de diagnóstico do fluxo de boas-vindas: pedir o nome.
//
// Isso é só uma CONFIGURAÇÃO da mecânica genérica DigitarTextoGame - não
// tem lógica própria. Serve de exemplo de como plugar a mecânica pra um
// mini-tópico específico sem criar um jogo do zero.
//
// Uso (dentro de um <GameMoment>):
//   {({ reportResult }) => <DigitarNomeGame reportResult={reportResult} />}

import { DigitarTextoGame } from './DigitarTextoGame';

export function DigitarNomeGame({ reportResult }) {
  return (
    <DigitarTextoGame
      reportResult={reportResult}
      placeholder="Digite seu nome aqui"
    />
  );
}