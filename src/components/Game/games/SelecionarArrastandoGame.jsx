// SelecionarArrastandoGame.jsx
// Mecânica de SELECIONAR VÁRIOS ITENS arrastando um laço por cima deles -
// cobre a parte de "Arrastar e soltar" que fala de seleção múltipla
// (arquivos) e de seleção de texto (Módulo 1, mini-módulo 1-5).
//
// Reaproveita o mesmo gesto de laço do ArrastarSoltarGame.jsx (pointer
// events, pode começar fora de qualquer item, um retângulo acompanha o
// arraste) - mas aqui não existe "pegar 1 item e soltar numa zona": o
// que importa é QUAIS itens o retângulo tocou quando o gesto termina.
//
//   // modo 'arquivos' - grade de ícones
//   <SelecionarArrastandoGame reportResult={reportResult}
//     modo="arquivos"
//     itens={[
//       { id: 'doc1', rotulo: '📄 Documento', alvoSelecao: false },
//       { id: 'foto1', rotulo: '🖼️ Foto', alvoSelecao: true },
//     ]} />
//
//   // modo 'texto' - palavras em linha, mesma lógica de acerto
//   <SelecionarArrastandoGame reportResult={reportResult}
//     modo="texto"
//     itens={[
//       { id: 'hoje', rotulo: 'Hoje', alvoSelecao: false },
//       { id: 'computador', rotulo: 'computador', alvoSelecao: true },
//     ]} />
//
// CRITÉRIO DE ACERTO: ao soltar, o conjunto de itens tocados pelo laço
// precisa bater EXATAMENTE com os que têm alvoSelecao: true - nem
// menos (esqueceu um) nem mais (pegou um que não devia). Arraste com
// resultado vazio (clique sem mover, ou soltar sem tocar nada) não
// conta como tentativa - a pessoa pode tentar de novo sem gastar uma
// chance.
//
// Props:
//   reportResult (função, obrigatória) - vem do GameMoment
//   modo ('arquivos' | 'texto', obrigatório)
//   itens (array, obrigatório) - cada item: { id, rotulo, alvoSelecao }

import { useRef, useState, useCallback } from 'react';
import styles from './SelecionarArrastandoGame.module.css';

// Dois retângulos (DOMRect-like) se tocam se não há espaço entre eles
// em nenhum dos dois eixos.
function retangulosSeTocam(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function mesmoConjunto(a, b) {
  if (a.size !== b.size) return false;
  for (const id of a) if (!b.has(id)) return false;
  return true;
}

export function SelecionarArrastandoGame({ reportResult, modo, itens }) {
  const areaRef = useRef(null);
  const itemRefs = useRef({});
  const pontoInicial = useRef(null);

  const [arrastando, setArrastando] = useState(false);
  const [caixa, setCaixa] = useState(null); // { left, top, width, height } relativo à área
  const [tocados, setTocados] = useState(new Set());
  const [feedback, setFeedback] = useState(null); // 'erro' | 'acerto' | null

  const idsAlvo = new Set(itens.filter((i) => i.alvoSelecao).map((i) => i.id));

  const calcularCaixaEChecagens = useCallback((x, y) => {
    const areaRect = areaRef.current.getBoundingClientRect();
    const inicio = pontoInicial.current;

    const left = Math.min(inicio.x, x);
    const top = Math.min(inicio.y, y);
    const width = Math.abs(x - inicio.x);
    const height = Math.abs(y - inicio.y);

    const caixaAbsoluta = { left, top, right: left + width, bottom: top + height };
    setCaixa({
      left: left - areaRect.left,
      top: top - areaRect.top,
      width,
      height,
    });

    const novosTocados = new Set();
    itens.forEach((item) => {
      const rect = itemRefs.current[item.id]?.getBoundingClientRect();
      if (rect && retangulosSeTocam(caixaAbsoluta, rect)) {
        novosTocados.add(item.id);
      }
    });
    setTocados(novosTocados);
  }, [itens]);

  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    areaRef.current.setPointerCapture(e.pointerId);
    pontoInicial.current = { x: e.clientX, y: e.clientY };
    setFeedback(null);
    setArrastando(true);
    calcularCaixaEChecagens(e.clientX, e.clientY);
  };

  const handlePointerMove = (e) => {
    if (!arrastando) return;
    calcularCaixaEChecagens(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    if (!arrastando) return;
    setArrastando(false);
    setCaixa(null);

    if (tocados.size === 0) {
      // gesto vazio - não conta como tentativa, só reseta
      return;
    }

    if (mesmoConjunto(tocados, idsAlvo)) {
      setFeedback('acerto');
      reportResult(true, { itensSelecionados: [...tocados] });
    } else {
      setFeedback('erro');
      reportResult(false, { itensSelecionados: [...tocados] });
      setTimeout(() => {
        setFeedback(null);
        setTocados(new Set());
      }, 400);
    }
  };

  return (
    <div
      ref={areaRef}
      className={`${styles.area} ${feedback === 'erro' ? styles.erro : ''} ${feedback === 'acerto' ? styles.acerto : ''}`}
      data-modo={modo}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className={modo === 'texto' ? styles.textoLinha : styles.grade}>
        {itens.map((item) => (
          <span
            key={item.id}
            ref={(el) => { itemRefs.current[item.id] = el; }}
            className={`${modo === 'texto' ? styles.palavra : styles.icone} ${tocados.has(item.id) ? styles.tocado : ''}`}
          >
            {item.rotulo}
          </span>
        ))}
      </div>

      {caixa && (
        <div
          className={styles.laco}
          style={{
            left: caixa.left,
            top: caixa.top,
            width: caixa.width,
            height: caixa.height,
          }}
        />
      )}
    </div>
  );
}