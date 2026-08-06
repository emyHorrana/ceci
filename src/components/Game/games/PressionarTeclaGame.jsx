// Mecânica genérica de "aperte esta tecla". Cobre teclas isoladas do
// Módulo 2 (Teclado): Espaço, Enter, Backspace, Delete, Caps Lock,
// Shift, Esc, Setas. Combinações (Ctrl+C, Ctrl+V etc) são um caso
// diferente.
//
// Letras, números e símbolos individuais NÃO cabem aqui - o teclado
// desenhado (Teclado.jsx) não tem rótulo em cada tecla, só nas
// especiais nomeadas. Pra esses casos, a mecânica certa é digitar
// (DigitarTextoGame), não apontar no teclado.
//
// Diferente de clicar/arrastar/scroll, aqui não tem nada na tela pra
// clicar - a "resposta" é apertar a tecla certa no teclado físico.
// Por isso escuta o teclado inteiro (window), sem precisar de foco em
// nenhum elemento específico.
//
//   <PressionarTeclaGame reportResult={reportResult} tecla="backspace" />
//
// Props:
//   reportResult (função, obrigatória) - vem do GameMoment
//   tecla        obrigatório, um de:
//     'espaco' | 'enter' | 'backspace' | 'delete' | 'capslock' |
//     'shift' | 'esc' | 'seta-cima' | 'seta-baixo' | 'seta-esquerda' |
//     'seta-direita'
//     Também repassada direto pro <Teclado teclaDestacada={tecla}>,
//     então os dois sempre concordam sobre qual tecla está sendo pedida.

import { useEffect, useState } from 'react';
import { Teclado } from '../Teclado';
import styles from './PressionarTeclaGame.module.css';

// Cada tecla mapeia pra uma LISTA de e.code aceitos - a maioria tem só
// um, mas o Shift existe em dobro (ShiftLeft/ShiftRight) e qualquer um
// dos dois é uma resposta certa.
const CODIGOS_ESPERADOS = {
  espaco: ['Space'],
  enter: ['Enter'],
  backspace: ['Backspace'],
  delete: ['Delete'],
  capslock: ['CapsLock'],
  shift: ['ShiftLeft', 'ShiftRight'],
  esc: ['Escape'],
  'seta-cima': ['ArrowUp'],
  'seta-baixo': ['ArrowDown'],
  'seta-esquerda': ['ArrowLeft'],
  'seta-direita': ['ArrowRight'],
};

// Teclas "especiais" que contam como erro se apertadas na hora errada
// (todas as que esta mecânica já ensina, hoje ou no futuro). NÃO
// inclui letras/números de propósito - apertar uma tecla comum
// enquanto se decide não deveria contar como tentativa errada, só
// apertar outra tecla especial (sinal de confusão real entre elas,
// tipo apertar Enter quando era pra apertar Backspace).
const TECLAS_ESPECIAIS = Object.values(CODIGOS_ESPERADOS).flat().concat(['Tab']);

export function PressionarTeclaGame({ reportResult, tecla }) {
  const [errada, setErrada] = useState(false);

  useEffect(() => {
    const codigosEsperados = CODIGOS_ESPERADOS[tecla] || [];

    const handleKeyDown = (e) => {
      if (codigosEsperados.includes(e.code)) {
        e.preventDefault();
        reportResult(true, { tecla: e.code });
        return;
      }

      if (TECLAS_ESPECIAIS.includes(e.code)) {
        e.preventDefault();
        setErrada(true);
        reportResult(false, { tecla: e.code });
        setTimeout(() => setErrada(false), 400);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tecla, reportResult]);

  return (
    <div className={`${styles.wrapper} ${errada ? styles.erro : ''}`}>
      <Teclado teclaDestacada={tecla} />
    </div>
  );
}