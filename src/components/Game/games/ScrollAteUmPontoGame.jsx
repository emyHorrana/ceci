// Mecânica genérica de SCROLL. Cobre a seção "Scroll (a rodinha do
// mouse)" do Módulo 1 - tanto "rolar a página" quanto "controlar a
// velocidade" (usando uma zona-alvo mais estreita pra exigir mais
// precisão), e também ajuda em "Coordenação e precisão" (1-6).
//
// Recebe uma altura de conteúdo rolável e uma zona-alvo (em % da
// altura do conteúdo) - a pessoa precisa rolar até parar com o topo da
// área visível dentro dessa zona.
//
//   // rolar até o meio, com folga generosa (iniciante)
//   <ScrollAteUmPontoGame reportResult={reportResult}
//     zonaAlvo={{ inicio: 45, fim: 60 }} />
//
//   // mais precisão (fim do mini-módulo / "controlar a velocidade")
//   <ScrollAteUmPontoGame reportResult={reportResult}
//     zonaAlvo={{ inicio: 70, fim: 76 }}
//     alturaConteudoPx={1400} />
//
// COMO FUNCIONA A AVALIAÇÃO
// Diferente de clicar/arrastar (que têm um instante claro de "resposta"),
// scroll é contínuo. Por isso só avaliamos uma "tentativa" quando a
// pessoa PARA de rolar por um tempinho (debounce) - rolar não conta
// como erro em si, só parar fora da zona-alvo conta.
//
// ACESSIBILIDADE: o container é focável (tabIndex=0) e scrollável nativamente,
// então setas/Page Down/Page Up do teclado já funcionam sem código
// extra - o navegador cuida disso sozinho pra qualquer elemento com
// overflow rolável em foco.
//
// Props:
//   reportResult      (função, obrigatória) - vem do GameMoment
//   zonaAlvo           (obrigatório) - { inicio, fim } em % da altura
//     do conteúdo (0-100, mas o alcançável na prática é sempre menor
//     que 100 - veja a nota de acessibilidade/aviso de dev acima).
//     Quanto mais estreito, mais precisão exige.
//   alturaConteudoPx  (number, padrão 1000) - altura total do conteúdo
//     rolável. Quanto maior, mais "caminho" até a zona-alvo.
//   alturaVisivelPx   (number, padrão 220) - altura da janela visível
//     (a "viewport" de scroll em si).
//   debounceMs        (number, padrão 500) - quanto tempo sem rolar até
//     considerar que a pessoa "parou" e avaliar a tentativa.
//   rotuloAlvo        (string, padrão 'Pare aqui') - texto dentro da
//     zona-alvo, pra ela ser reconhecível mesmo antes de "acertar".

import { useRef, useState, useCallback } from 'react';
import styles from './ScrollAteUmPontoGame.module.css';

export function ScrollAteUmPontoGame({
  reportResult,
  zonaAlvo,
  alturaConteudoPx = 1000,
  alturaVisivelPx = 220,
  debounceMs = 500,
  rotuloAlvo = 'Pare aqui',
}) {
  const viewportRef = useRef(null);
  const debounceRef = useRef(null);
  const jaInteragiuRef = useRef(false);

  const [dentroDaZona, setDentroDaZona] = useState(false);
  const [zonaErrada, setZonaErrada] = useState(false);

  // Base única de porcentagem: posição (em px) dentro do CONTEÚDO,
  // não do progresso de scroll. Os dois só coincidiriam se
  // alturaVisivelPx fosse desprezível perto de alturaConteudoPx - como
  // não é, calculamos sempre em cima de alturaConteudoPx, a mesma base
  // usada pra posicionar a zona-alvo visualmente (via `top: X%`).
  const calcularPercentual = (scrollTop) => (scrollTop / alturaConteudoPx) * 100;

  // Como o topo da área visível nunca passa de
  // (alturaConteudoPx - alturaVisivelPx), uma zona-alvo além desse
  // ponto seria impossível de alcançar - avisa em dev pra pegar esse
  // erro de configuração cedo, em vez da pessoa travar num jogo
  // impossível de vencer.
  const percentualMaximoAlcancavel = ((alturaConteudoPx - alturaVisivelPx) / alturaConteudoPx) * 100;
  if (import.meta.env.DEV && zonaAlvo.fim > percentualMaximoAlcancavel) {
    console.warn(
      `ScrollAteUmPontoGame: zonaAlvo.fim (${zonaAlvo.fim}%) está além do que dá pra alcançar ` +
      `com essa alturaConteudoPx/alturaVisivelPx (máximo alcançável: ${percentualMaximoAlcancavel.toFixed(1)}%). ` +
      `Aumente alturaConteudoPx, reduza alturaVisivelPx, ou diminua zonaAlvo.fim.`
    );
  }

  const avaliarPosicaoAtual = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const percentualAtual = calcularPercentual(viewport.scrollTop);
    const acertou = percentualAtual >= zonaAlvo.inicio && percentualAtual <= zonaAlvo.fim;

    if (acertou) {
      reportResult(true, { percentualParado: percentualAtual });
      return;
    }

    setZonaErrada(true);
    reportResult(false, { percentualParado: percentualAtual });
    setTimeout(() => setZonaErrada(false), 400);
  }, [alturaConteudoPx, zonaAlvo, reportResult]);

  const handleScroll = () => {
    jaInteragiuRef.current = true;

    const viewport = viewportRef.current;
    if (viewport) {
      const percentualAtual = calcularPercentual(viewport.scrollTop);
      setDentroDaZona(percentualAtual >= zonaAlvo.inicio && percentualAtual <= zonaAlvo.fim);
    }

    // Reinicia o "temporizador de pausa" a cada evento de scroll - só
    // avalia quando a pessoa realmente parar de rolar.
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (jaInteragiuRef.current) avaliarPosicaoAtual();
    }, debounceMs);
  };

  return (
    <div className={styles.wrapper}>
      <span className={styles.dicaTopo} aria-hidden>↓ role para baixo</span>

      <div
        ref={viewportRef}
        className={styles.viewport}
        data-errado={zonaErrada}
        tabIndex={0}
        role="region"
        aria-label="Área de rolagem - role até a zona marcada"
        onScroll={handleScroll}
      >
        <div className={styles.conteudo} style={{ height: `${alturaConteudoPx}px` }}>
          {/* Linhas de preenchimento, só pra dar "caminho" pra rolar */}
          <div className={styles.trilha} aria-hidden />

          <div
            className={styles.zonaAlvo}
            data-ativa={dentroDaZona}
            style={{
              top: `${zonaAlvo.inicio}%`,
              height: `${zonaAlvo.fim - zonaAlvo.inicio}%`,
            }}
          >
            <span className={styles.zonaAlvoLabel}>🎯 {rotuloAlvo}</span>
          </div>
        </div>
      </div>
    </div>
  );
}