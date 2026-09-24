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
//   itemDesenho (node OU função, obrigatório) - SVG do item, desenhado
//     como se estivesse centrado em (0,0) - o motor translada pra
//     posição certa. Pode ser um node estático (caso comum) ou uma
//     função (estado) => node quando a cena precisa trocar o desenho
//     durante a interação (ex: personagem "caindo" ao passar por cima
//     da zona certa). estado = { arrastando, zonaAtiva, concluido, pos }.
//     `pos` ({x, y}) é a posição atual do item no viewBox - útil pra
//     desenhar algo que ACOMPANHA o item mas fica fora dele (ex: o cabo
//     que liga o plugue ao mouse, que continua parado no lugar).
//   zonas (array, obrigatório) - cada item:
//     { id, correta, shape: 'circle' | 'rect', ...coords }
//   children também pode ser uma função (estado) => node, com o mesmo
//     `estado` do itemDesenho - útil quando a ilustração de fundo muda
//     ao concluir (ex: pufe vazio → Ceci sentada no pufe).
//   limiteRef (ref, opcional) - elemento (ex: o card/arena que envolve o
//     jogo) dentro do qual o item pode ser arrastado. Quando informado:
//       1) o <svg> deixa de cortar o desenho no limite do viewBox (senão
//          a arte some assim que sai do quadrado da cena), e
//       2) o item é mantido dentro desse elemento (não some pra fora do
//          card nem fica arrastável pela página inteira).
//     Sem esse prop o comportamento é o de sempre (corta no viewBox).
//   margemLimite ({ x, y }, opcional) - folga, em unidades do viewBox,
//     entre o CENTRO do item e a borda do limiteRef (use ~metade do
//     tamanho da arte pra ela não passar da borda). Padrão: 0.

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

// Mantém o ponto dentro do retângulo de `elemento` (convertido pro
// sistema de coordenadas do svg), deixando `margem` de folga.
function limitarAoElemento(svg, elemento, ponto, margem) {
  const r = elemento.getBoundingClientRect();
  const topoEsq = clientParaSvg(svg, r.left, r.top);
  const baixoDir = clientParaSvg(svg, r.right, r.bottom);
  const grampear = (v, min, max) => (min > max ? (min + max) / 2 : Math.min(Math.max(v, min), max));
  return {
    x: grampear(ponto.x, topoEsq.x + margem.x, baixoDir.x - margem.x),
    y: grampear(ponto.y, topoEsq.y + margem.y, baixoDir.y - margem.y),
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

const SEM_MARGEM = { x: 0, y: 0 };

export function ArrastarNaImagemGame({
  reportResult, viewBox, children, itemInicial, itemDesenho, zonas,
  limiteRef, margemLimite = SEM_MARGEM,
}) {
  const svgRef = useRef(null);
  const [pos, setPos] = useState(itemInicial);
  const [arrastando, setArrastando] = useState(false);
  const [zonaAtiva, setZonaAtiva] = useState(null);
  const [zonaErro, setZonaErro] = useState(null);
  const [concluido, setConcluido] = useState(false);

  const estado = { arrastando, zonaAtiva, concluido, pos };
  const desenhoAtual = typeof itemDesenho === 'function' ? itemDesenho(estado) : itemDesenho;
  const fundoAtual = typeof children === 'function' ? children(estado) : children;

  // Posição do ponteiro no espaço do svg, já limitada ao limiteRef (se houver).
  const pontoDoPonteiro = (e) => {
    const ponto = clientParaSvg(svgRef.current, e.clientX, e.clientY);
    return limiteRef?.current
        ? limitarAoElemento(svgRef.current, limiteRef.current, ponto, margemLimite)
        : ponto;
  };

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
    const ponto = pontoDoPonteiro(e);
    setPos(ponto);
    setZonaAtiva(encontrarZona(ponto)?.id ?? null);
  };

  const handlePointerUp = (e) => {
    if (!arrastando || concluido) return;
    setArrastando(false);

    const ponto = pontoDoPonteiro(e);
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

  // O navegador pode cancelar o gesto (ex: troca de janela no meio do
  // arraste). Sem isso `arrastando` ficava preso em true e o item
  // ficava travado na arte de "segurando".
  const handlePointerCancel = () => {
    if (!arrastando || concluido) return;
    setArrastando(false);
    setZonaAtiva(null);
    setPos(itemInicial);
  };

  return (
      <svg
          ref={svgRef}
          viewBox={viewBox}
          className={`${styles.cena} ${limiteRef ? styles.cenaLivre : ''}`}
          data-concluido={concluido}
          role="group"
          aria-label="Arraste o item até o lugar certo"
      >
        {fundoAtual}

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
            onPointerCancel={handlePointerCancel}
            style={{ touchAction: 'none' }}
        >
          {desenhoAtual}
        </g>
      </svg>
  );
}