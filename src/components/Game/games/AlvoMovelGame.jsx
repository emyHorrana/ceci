// AlvoMovelGame.jsx
// Mecânica de clique num alvo EM MOVIMENTO - diferente do ClicarAlvoGame
// (posições fixas), aqui o alvo fica se movendo devagar dentro de uma
// área limitada, ricocheteando nas bordas (tipo a bolinha de um DVD
// screensaver). Testa acompanhar o cursor até o alvo, não só reconhecer
// a posição certa - coordenação de verdade.
//
// Pensada pra progressão dentro de uma Unidade: começa com alvos
// parados (ClicarAlvoGame), depois vem isso, com o alvo se mexendo.
// Também é candidata natural pro "Laboratório" (área de prática livre,
// ver BACKLOG.md) quando existir - não sabe nada sobre Unidade/
// MiniModulo/tentativas, só recebe reportResult, mesmo contrato de
// sempre.
//
// Velocidade de propósito moderada por padrão (não é teste de reflexo,
// é treino de coordenação sem pressão) - ajustável via prop pra quando
// isso virar prática livre com dificuldade progressiva.
//
// Props:
//   reportResult (função, obrigatória) - vem do GameMoment
//   velocidade (número, px/s, padrão 60) - quão rápido o alvo se move
//   tamanhoAlvo (número, px, padrão 56)
//   rotulo (string/emoji, padrão '🎯') - o que aparece dentro do alvo
//   duploClique (bool, padrão false) - exige duplo clique no alvo em
//     movimento (mesma convenção do ClicarAlvoGame)

import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './AlvoMovelGame.module.css';

const ALTURA_AREA = 220;

export function AlvoMovelGame({ reportResult, velocidade = 60, tamanhoAlvo = 56, rotulo = '🎯', duploClique = false }) {
  const areaRef = useRef(null);
  const posRef = useRef({ x: 40, y: 40 });
  const velRef = useRef({ vx: velocidade, vy: velocidade * 0.7 });
  const frameRef = useRef(null);
  const capturadoRef = useRef(false);

  const [pos, setPos] = useState({ x: 40, y: 40 });
  const [capturado, setCapturado] = useState(false);

  const animar = useCallback((larguraArea) => {
    const passo = () => {
      if (capturadoRef.current) return;

      const dt = 1 / 60; // aproximação de frame - suave o bastante pra esse propósito
      let { x, y } = posRef.current;
      let { vx, vy } = velRef.current;

      x += vx * dt;
      y += vy * dt;

      const limiteX = larguraArea - tamanhoAlvo;
      const limiteY = ALTURA_AREA - tamanhoAlvo;

      if (x <= 0) { x = 0; vx = Math.abs(vx); }
      if (x >= limiteX) { x = limiteX; vx = -Math.abs(vx); }
      if (y <= 0) { y = 0; vy = Math.abs(vy); }
      if (y >= limiteY) { y = limiteY; vy = -Math.abs(vy); }

      posRef.current = { x, y };
      velRef.current = { vx, vy };
      setPos({ x, y });

      frameRef.current = requestAnimationFrame(passo);
    };

    frameRef.current = requestAnimationFrame(passo);
  }, [tamanhoAlvo]);

  useEffect(() => {
    const larguraArea = areaRef.current?.clientWidth ?? 320;
    animar(larguraArea);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [animar]);

  const handleCaptura = () => {
    if (capturadoRef.current) return;
    capturadoRef.current = true;
    setCapturado(true);
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    reportResult(true);
  };

  const propsClique = duploClique
    ? { onDoubleClick: handleCaptura }
    : { onClick: handleCaptura };

  return (
    <div ref={areaRef} className={styles.area}>
      <button
        type="button"
        className={styles.alvo}
        data-capturado={capturado}
        style={{ width: tamanhoAlvo, height: tamanhoAlvo, transform: `translate(${pos.x}px, ${pos.y}px)` }}
        aria-label={duploClique ? 'Dê um duplo clique no alvo em movimento' : 'Clique no alvo em movimento'}
        {...propsClique}
      >
        {rotulo}
      </button>
    </div>
  );
}