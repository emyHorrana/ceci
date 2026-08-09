// ArrastarNaImagemGame.jsx
// Mecânica genérica de ARRASTAR sobre uma ILUSTRAÇÃO - equivalente ao
// ClicarNaImagemGame.jsx, só que pra arrastar-e-soltar em vez de
// clicar. Mesma separação: a ilustração (troca quando a arte de
// verdade chegar) fica na cena que usa este motor; a lógica de
// arrastar/soltar/acertar/errar fica só aqui, uma vez.
//
// Diferente do ArrastarSoltarGame (que usa o drag-and-drop nativo do
// HTML5, bom pra elementos soltos na página), este usa Pointer Events
// com posicionamento manual dentro do <svg> - necessário porque o
// item arrastável e as zonas de soltar fazem parte do mesmo desenho,
// não são blocos HTML separados.
//
// Não é usada sozinha - sempre por dentro de um componente "cena" (ex:
// PortaTraseiraGame.jsx), que passa a ilustração de fundo (children),
// o desenho do item arrastável e onde ficam as zonas.
//
// Props:
//   reportResult (função, obrigatória) - vem do GameMoment
//   viewBox (string, obrigatória)
//   children (SVG estático da ilustração de fundo - não interativo)
//   itemInicial ({x, y}, obrigatório) - posição inicial do item
//   itemDesenho (node, obrigatório) - SVG do item, desenhado como se
//     estivesse centrado em (0,0) - o motor translada pra posição certa
//   zonas (array, obrigatório) - cada item:
//     { id, correta, shape: 'circle' | 'rect', ...coords }

import { useState, useRef, useCallback } from 'react';
import styles from './ArrastarNaImagemGame.module.css';

function clientParaSvg(svg, clientX, clientY) {
  const rect = svg.getBoundingClientRect();
  const vb = svg.viewBox.baseVal;
  return {
    x: vb.x + ((clientX - rect.left) / rect.width) * vb.width,
    y: vb.y + ((clientY - rect.top) / rect.height) * vb.height,
  };
}

function pontoDentroDaZona(ponto, zona) {
  if (zona.shape === 'circle') {
    const dx = ponto.x - zona.cx;
    const dy = ponto.y - zona.cy;
    return Math.sqrt(dx * dx + dy * dy) <= zona.r;
  }
  return ponto.x >= zona.x && ponto.x <= zona.x + zona.width
      && ponto.y >= zona.y && ponto.y <= zona.y + zona.height;
}

export function ArrastarNaImagemGame({ reportResult, viewBox, children, itemInicial, itemDesenho, zonas }) {
  const svgRef = useRef(null);
  const [pos, setPos] = useState(itemInicial);
  const [arrastando, setArrastando] = useState(false);
  const [zonaAtiva, setZonaAtiva] = useState(null);
  const [zonaErro, setZonaErro] = useState(null);
  const [concluido, setConcluido] = useState(false);

  const encontrarZona = useCallback(
    (ponto) => zonas.find((z) => pontoDentroDaZona(ponto, z)) ?? null,
    [zonas],
  );

  const handlePointerDown = (e) => {
    if (concluido) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setArrastando(true);
  };

  const handlePointerMove = (e) => {
    if (!arrastando || concluido) return;
    const ponto = clientParaSvg(svgRef.current, e.clientX, e.clientY);
    setPos(ponto);
    setZonaAtiva(encontrarZona(ponto)?.id ?? null);
  };

  const handlePointerUp = (e) => {
    if (!arrastando || concluido) return;
    setArrastando(false);

    const ponto = clientParaSvg(svgRef.current, e.clientX, e.clientY);
    const zona = encontrarZona(ponto);
    setZonaAtiva(null);

    if (!zona) {
      // Soltou fora de qualquer zona - não conta como erro, só volta
      // pro início (igual soltar no vazio no ArrastarSoltarGame).
      setPos(itemInicial);
      return;
    }

    if (zona.correta) {
      const centro = zona.shape === 'circle'
        ? { x: zona.cx, y: zona.cy }
        : { x: zona.x + zona.width / 2, y: zona.y + zona.height / 2 };
      setPos(centro);
      setConcluido(true);
      reportResult(true, { zonaEscolhida: zona.id });
      return;
    }

    setZonaErro(zona.id);
    reportResult(false, { zonaEscolhida: zona.id });
    setPos(itemInicial);
    setTimeout(() => setZonaErro(null), 400);
  };

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      className={styles.cena}
      role="group"
      aria-label="Arraste o item até o lugar certo"
    >
      {children}

      {zonas.map((zona) => {
        const estado = `${zonaAtiva === zona.id ? styles.zonaAtiva : ''} ${zonaErro === zona.id ? styles.erro : ''}`;
        const propsComuns = { className: `${styles.zona} ${estado}` };
        return zona.shape === 'circle' ? (
          <circle key={zona.id} {...propsComuns} cx={zona.cx} cy={zona.cy} r={zona.r} />
        ) : (
          <rect key={zona.id} {...propsComuns} x={zona.x} y={zona.y} width={zona.width} height={zona.height} rx={zona.rx ?? 4} />
        );
      })}

      <g
        className={styles.item}
        data-arrastando={arrastando}
        transform={`translate(${pos.x}, ${pos.y})`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: 'none' }}
      >
        {itemDesenho}
      </g>
    </svg>
  );
}