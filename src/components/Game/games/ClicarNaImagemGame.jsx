// ClicarNaImagemGame.jsx
// Mecânica genérica de clique sobre uma ILUSTRAÇÃO (em vez de botões
// de texto/emoji do ClicarAlvoGame). Dá posição espacial real: a
// pessoa aprende a reconhecer o elemento certo dentro de um desenho,
// não a ler o rótulo certo numa lista - mais parecido com a
// habilidade de verdade (achar o botão de ligar no gabinete real).
//
// Não é usada sozinha - sempre por dentro de um componente "cena"
// (ex: GabineteFrenteGame.jsx), que passa a ilustração de fundo (SVG
// estático, não-interativo) como children e define onde ficam os
// alvos clicáveis (coordenadas do mesmo viewBox).
//
// Separado assim de propósito, porque ilustração e lógica de clique
// mudam por motivos diferentes:
//  - a ilustração troca quando a arte de verdade chegar (só mexe no
//    componente da cena, nada aqui muda)
//  - a lógica de acerto/erro/reportResult fica só aqui, uma vez,
//    reusada por toda cena nova
//
// Props:
//   reportResult (função, obrigatória) - vem do GameMoment
//   viewBox (string, obrigatória) - mesmo viewBox do <svg> da
//     ilustração em children, pra as coordenadas dos alvos baterem
//   children (SVG estático da ilustração de fundo - <path>, <rect> etc)
//   alvos (array, obrigatório) - cada item:
//     { id, correto, shape: 'circle' | 'rect', ...coords }
//     shape 'circle': { cx, cy, r }
//     shape 'rect':   { x, y, width, height, rx? }

import { useState } from 'react';
import styles from './ClicarNaImagemGame.module.css';

export function ClicarNaImagemGame({ reportResult, viewBox, children, alvos }) {
  const [alvoErrado, setAlvoErrado] = useState(null);
  const [alvoCerto, setAlvoCerto] = useState(null);

  const handleClique = (alvo) => {
    if (alvo.correto) {
      setAlvoCerto(alvo.id);
      reportResult(true, { alvoEscolhido: alvo.id });
      return;
    }

    setAlvoErrado(alvo.id);
    reportResult(false, { alvoEscolhido: alvo.id });
    setTimeout(() => setAlvoErrado(null), 400);
  };

  const handleTeclado = (e, alvo) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClique(alvo);
    }
  };

  return (
    <svg
      viewBox={viewBox}
      className={styles.cena}
      role="group"
      aria-label="Clique no elemento certo da imagem"
    >
      {children}

      {alvos.map((alvo) => {
        const estado = `${alvoErrado === alvo.id ? styles.erro : ''} ${alvoCerto === alvo.id ? styles.acerto : ''}`;
        const propsComuns = {
          className: `${styles.alvo} ${estado}`,
          onClick: () => handleClique(alvo),
          onKeyDown: (e) => handleTeclado(e, alvo),
          role: 'button',
          tabIndex: 0,
          'aria-label': alvo.rotuloAcessivel ?? 'Área clicável da imagem',
        };

        return alvo.shape === 'circle' ? (
          <circle key={alvo.id} {...propsComuns} cx={alvo.cx} cy={alvo.cy} r={alvo.r} />
        ) : (
          <rect key={alvo.id} {...propsComuns} x={alvo.x} y={alvo.y} width={alvo.width} height={alvo.height} rx={alvo.rx ?? 4} />
        );
      })}
    </svg>
  );
}