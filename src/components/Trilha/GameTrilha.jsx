// GameTrilha.jsx
// Visualização da trilha de aprendizagem no formato de Level Design / Game Map limpo e focado no aluno.
// - Paleta de cores inspirada na mascote Cecília (Rosa / Roxo / Lavanda) trazendo contraste e vida sobre o fundo amarelo.
// - Voltas circulares (loops de voo ➰) fluidas nos pontos de inflexão do caminho tracejado, eliminando zigue-zagues bruscos.
// - Títulos centralizados de forma harmônica e espaçamento equilibrado no início e fim de cada unidade.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonPrimary } from '../Buttons/ButtonPrimary';
import styles from './GameTrilha.module.css';

// Padrão de oscilação senoidal suave para os nós (posições horizontais em %)
// 50% (centro) -> 70% (direita) -> 50% (centro) -> 30% (esquerda) -> ...
const POSICOES_X = [50, 70, 50, 30];

// Paleta temática da Mascote Cecília (Rosa, Roxo, Lavanda) para dar vida e contraste
const PALETA_CECI = [
  'ceciRosa',     // Rosa vibrante Cecília
  'ceciRoxo',     // Roxo aveludado Cecília
  'ceciLavanda',  // Lavanda radiante Cecília
];

// Ícone SVG de Troféu padronizado em preto/grafite
function TrofeuIcon({ className }) {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="#2B2140"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 5h-2V3H7v2H5C3.9 5 3 5.9 3 7v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V18H8v2h8v-2h-3v-2.1c1.6-.35 2.99-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    </svg>
  );
}

// Gera exclusivamente os 2 padrões de trajeto aprovados:
// 1. Curva suave em "S" ondulado (sem cruzar, como na Imagem 0)
// 2. Voltinha alta em formato de gota vertical / laço em "X" (exatamente como na Imagem 1 e 2)
function gerarTrajetoAprovado(x1, y1, x2, y2, idxTransicao) {
  const dy = y2 - y1;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dir = x2 >= x1 ? 1 : -1;

  if (idxTransicao % 2 === 0) {
    // 1. Curva S suave e fluida com balanço orgânico
    const swing = dir * 55;
    return `M ${x1} ${y1} C ${x1 - swing * 0.7} ${y1 + dy * 0.28}, ${mx + swing * 0.9} ${my - dy * 0.15}, ${mx} ${my} C ${mx - swing * 0.9} ${my + dy * 0.15}, ${x2 + swing * 0.7} ${y2 - dy * 0.28}, ${x2} ${y2}`;
  } else {
    // 2. Voltinha alta ajustada para um laço menor e mais apertado (Imagem 2)
    const ix = mx;
    const iy = my + 5;   // Subiu um pouco o centro do cruzamento (era +10)
    const ay = iy - 28;  // Reduziu drasticamente a altura do topo (era -48)

    return (
        `M ${x1} ${y1} ` +
        // Curva de entrada até o cruzamento (mais fechada: dir * 25)
        `C ${x1 + dir * 25} ${y1 + dy * 0.45}, ${ix - dir * 25} ${iy + 20}, ${ix} ${iy} ` +
        // Subida do laço (mais estreita: dir * 14 e dir * 12)
        `C ${ix + dir * 14} ${iy - 12}, ${mx + dir * 12} ${ay + 8}, ${mx} ${ay} ` +
        // Descida do laço de volta ao cruzamento
        `C ${mx - dir * 12} ${ay + 8}, ${ix - dir * 14} ${iy - 12}, ${ix} ${iy} ` +
        // Curva de saída até o próximo ponto
        `C ${ix + dir * 25} ${iy + 20}, ${x2 - dir * 25} ${y2 - dy * 0.45}, ${x2} ${y2}`
    );
  }
}

export function GameTrilha({
  unidadesPorModulo = [],
  unidadeRecomendada = null,
  dominiosPorUnidade = {},
  limiar = 0.5,
}) {
  const navigate = useNavigate();
  const [noSelecionado, setNoSelecionado] = useState(null);

  // Calcula o status do algoritmo adaptativo para uma Unidade
  function getStatusUnidade(unidadeId) {
    if (unidadeId === unidadeRecomendada?.id) return 'atual';
    const dominio = dominiosPorUnidade[unidadeId];
    if (dominio === undefined) return undefined;
    return dominio >= limiar ? 'concluida' : 'pendente';
  }

  return (
    <div className={styles.trilhaContainer}>
      {unidadesPorModulo.map((grupo) => {
        let globalNodeIndex = 0;
        let globalTransitionIndex = 0;

        return (
          <div key={grupo.moduloId} className={styles.moduloCardGrande}>
            {/* CABEÇALHO DO CARD GRANDE DO MÓDULO (Centralizado) */}
            <div className={styles.moduloHeaderGrande}>
              <span className={styles.moduloHeaderEmoji} aria-hidden="true">
                {grupo.moduloEmoji || '📚'}
              </span>
              <div className={styles.moduloHeaderInfo}>
                <h3 className={styles.moduloHeaderTitulo}>{grupo.moduloTitulo}</h3>
              </div>
            </div>

            {/* LISTA DE UNIDADES DENTRO DO MÓDULO */}
            <div className={styles.unidadesContainer}>
              {grupo.unidades.map((unidade) => {
                const status = getStatusUnidade(unidade.id);

                // Monta a lista linear de nós desta unidade
                const nosDaUnidade = [];
                const NODE_SPACING = 140;
                // Espaço generoso inicial (95px) garantindo equilíbrio com o final
                const TOP_OFFSET = 95;

                unidade.miniModulos.forEach((mm, mmIdx) => {
                  const posX = POSICOES_X[globalNodeIndex % POSICOES_X.length];
                  const posY = mmIdx * NODE_SPACING + TOP_OFFSET;
                  const corTema = PALETA_CECI[globalNodeIndex % PALETA_CECI.length];

                  nosDaUnidade.push({
                    tipo: 'mini-modulo',
                    id: mm.id,
                    unidadeId: unidade.id,
                    titulo: mm.titulo,
                    destino: `/mini-modulo/${mm.id}`,
                    icone: grupo.moduloEmoji || '▶',
                    status,
                    isRecomendado: status === 'atual' && mmIdx === 0,
                    corTema,
                    posX,
                    posY,
                    idxNaUnidade: mmIdx,
                  });

                  globalNodeIndex++;
                });

                if (unidade.checkpoint) {
                  const mmCount = unidade.miniModulos.length;
                  const posX = POSICOES_X[globalNodeIndex % POSICOES_X.length];
                  const posY = mmCount * NODE_SPACING + TOP_OFFSET;

                  nosDaUnidade.push({
                    tipo: 'checkpoint',
                    id: `checkpoint-${unidade.id}`,
                    unidadeId: unidade.id,
                    titulo: unidade.checkpoint.titulo || 'Desafio da Unidade',
                    destino: `/unidade/${unidade.id}/checkpoint`,
                    icone: 'trofeu',
                    status,
                    isRecomendado: status === 'atual' && mmCount === 0,
                    corTema: 'checkpoint',
                    posX,
                    posY,
                    idxNaUnidade: mmCount,
                  });

                  globalNodeIndex++;
                }

                // Altura calculada da trilha para manter margem inferior igual à superior
                const totalFasesHeight = nosDaUnidade.length * NODE_SPACING + 70;

                return (
                  <div key={unidade.id} className={styles.unidadeSecao}>
                    {/* BANNER DE ASSUNTO / TÓPICO (Centralizado) */}
                    <div
                      className={`${styles.unidadeBanner} ${status === 'atual' ? styles.unidadeBannerAtual : ''}`}
                    >
                      <h4 className={styles.unidadeTitulo}>{unidade.titulo}</h4>
                    </div>

                    {/* CAMPO DA TRILHA DE FASES COM NÓS 3D E LINHAS PONTILHADAS COM VOLTAS CIRCULARES DIVERSIFICADAS */}
                    <div className={styles.unidadeTrilhaFases} style={{ height: `${totalFasesHeight}px` }}>
                      {/* SVG DO CAMINHO PONTILHADO COM TRAJETOS DIVERSIFICADOS DE VOO */}
                      <svg
                        className={styles.caminhoTracejadoSvg}
                        style={{ height: `${totalFasesHeight}px` }}
                        viewBox={`0 0 1000 ${totalFasesHeight}`}
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        {nosDaUnidade.map((no, idx) => {
                          if (idx === nosDaUnidade.length - 1) return null;
                          const proxNo = nosDaUnidade[idx + 1];
                          const x1 = no.posX * 10;
                          const y1 = no.posY;
                          const x2 = proxNo.posX * 10;
                          const y2 = proxNo.posY;

                          const pathData = gerarTrajetoAprovado(x1, y1, x2, y2, globalTransitionIndex++);

                          return (
                            <path
                              key={`linha-${no.id}-${proxNo.id}`}
                              d={pathData}
                              fill="none"
                              stroke="#2B2140"
                              strokeWidth="2"
                              strokeDasharray="4 5"
                              strokeLinecap="round"
                              strokeOpacity="0.7"
                              vectorEffect="non-scaling-stroke"
                              className={styles.linhaTracejadaDelicada}
                            />
                          );
                        })}
                      </svg>

                      {/* NÓS CIRCULARES DE FASE (Cores da Mascote Cecília: Rosa, Roxo e Lavanda) */}
                      {nosDaUnidade.map((etapa) => {
                        const isCheckpoint = etapa.tipo === 'checkpoint';
                        const isAtivo = etapa.isRecomendado;
                        const isConcluido = etapa.status === 'concluida';
                        const isPendente = etapa.status === 'pendente';
                        const isSelected = noSelecionado?.id === etapa.id;

                        // Determina a classe de cor com base na paleta da Cecília
                        let nodeStyleClass = styles.nodeCeciRosa;
                        if (isConcluido) {
                          nodeStyleClass = styles.nodeConcluido;
                        } else if (isAtivo) {
                          nodeStyleClass = styles.nodeAtivo;
                        } else if (isPendente) {
                          nodeStyleClass = styles.nodePendente;
                        } else if (isCheckpoint) {
                          nodeStyleClass = styles.nodeCheckpoint;
                        } else {
                          if (etapa.corTema === 'ceciRoxo') nodeStyleClass = styles.nodeCeciRoxo;
                          else if (etapa.corTema === 'ceciLavanda') nodeStyleClass = styles.nodeCeciLavanda;
                          else nodeStyleClass = styles.nodeCeciRosa;
                        }

                        return (
                          <div
                            key={etapa.id}
                            className={styles.nodeWrapper}
                            style={{
                              left: `${etapa.posX}%`,
                              top: `${etapa.posY}px`,
                            }}
                          >
                            {/* AURA DE ENERGIA PULSANTE NO NÓ RECOMENDADO ATUAL */}
                            {isAtivo && (
                              <>
                                <div className={styles.auraPulso} aria-hidden="true" />
                                <div className={styles.badgeSuaVez}>JOGAR</div>
                              </>
                            )}

                            {/* BOTÃO CIRCULAR 3D / GLOSSY COM CORES DA CECÍLIA */}
                            <button
                              type="button"
                              className={`${styles.nodeButton} ${nodeStyleClass} ${isCheckpoint ? styles.nodeCheckpointButton : ''}`}
                              onClick={() => setNoSelecionado(noSelecionado?.id === etapa.id ? null : etapa)}
                              aria-label={etapa.titulo}
                              title={etapa.titulo}
                            >
                              {/* Brilho Glossy / Reflexo Superior */}
                              <span className={styles.nodeGlossy} aria-hidden="true" />

                              {/* Ícone (Troféu SVG preto, estrela ★ ou ícone temático) */}
                              <span className={styles.nodeIcone} aria-hidden="true">
                                {isCheckpoint ? (
                                  <TrofeuIcon className={styles.trofeuSvg} />
                                ) : isConcluido ? (
                                  '★'
                                ) : (
                                  etapa.icone
                                )}
                              </span>
                            </button>

                            {/* RÓTULO DA ETAPA ABAIXO DO NÓ */}
                            <span className={styles.nodeRotulo}>
                              {isCheckpoint ? 'Desafio da Unidade' : etapa.titulo}
                            </span>

                            {/* POPOVER DE DETALHES DA ETAPA AO CLICAR */}
                            {isSelected && (
                              <div className={styles.popoverCard}>
                                <div className={styles.popoverHeader}>
                                  <h5 className={styles.popoverTitulo}>{etapa.titulo}</h5>
                                  <button
                                    type="button"
                                    className={styles.popoverFechar}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setNoSelecionado(null);
                                    }}
                                    aria-label="Fechar detalhes"
                                  >
                                    ✕
                                  </button>
                                </div>

                                <div className={styles.popoverAcao}>
                                  <ButtonPrimary
                                    size="small"
                                    onClick={() => navigate(etapa.destino)}
                                  >
                                    {isConcluido ? 'Revisar aula' : isCheckpoint ? 'Fazer desafio' : 'Começar aula'}
                                  </ButtonPrimary>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
