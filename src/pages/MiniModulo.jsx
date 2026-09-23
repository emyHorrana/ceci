/**
 * MiniModulo.jsx
 * Página de estudo de um mini-módulo.
 * Exibe as etapas de teoria em sequência, com navegação entre elas.
 * Quando uma etapa tem `tipo: 'jogo'` (ver data/modulos.js), em vez do
 * texto ela mostra um GameMoment com a mecânica de jogo configurada -
 * "Próxima"/"Concluir" fica bloqueado até a pessoa acertar ou pular.
 *
 * Rota: /mini-modulo/:miniModuloId
 */

import { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMiniModulo } from '../data/modulos';
import { getUnidadeByMiniModulo } from '../data/unidades';
import { UserContext } from '../context/UserContext';
import { ProgressContext } from '../context/ProgressContext';
import { getPerfisAluno, responderQuestao } from '../services/algorithmService';
import { getTempoIdealMs } from '../utils/jogoTempoIdeal';
import { reformularExplicacao } from '../services/aiService';
import { isAdmin } from '../utils/roles';
import { ButtonPrimary } from '../components/Buttons/ButtonPrimary';
import { ButtonOutline } from '../components/Buttons/ButtonOutline';
import { RetroWindow } from '../components/Window/RetroWindow';
import { GameMoment } from '../components/Game/GameMoment';
import { ClicarAlvoGame } from '../components/Game/games/ClicarAlvoGame';
import { ArrastarSoltarGame } from '../components/Game/games/ArrastarSoltarGame';
import { ScrollAteUmPontoGame } from '../components/Game/games/ScrollAteUmPontoGame';
import { DigitarTextoGame } from '../components/Game/games/DigitarTextoGame';
import { PressionarTeclaGame } from '../components/Game/games/PressionarTeclaGame';
import { AtalhoTecladoGame } from '../components/Game/games/AtalhoTecladoGame';
import { GabineteFrenteGame } from '../components/Game/games/GabineteFrenteGame';
import { MouseGame } from '../components/Game/games/MouseGame';
import { MouseDemonstracaoGame } from '../components/Game/games/MouseDemonstracaoGame';
import { AjustarVolumeGame } from '../components/Game/games/AjustarVolumeGame';
import { PortaTraseiraGame } from '../components/Game/games/PortaTraseiraGame';
import { IdentificarCaboGame } from '../components/Game/games/IdentificarCaboGame';
import { QuizGame } from '../components/Game/games/QuizGame';
import { AlvoMovelGame } from '../components/Game/games/AlvoMovelGame';
import { SelecionarArrastandoGame } from '../components/Game/games/SelecionarArrastandoGame';
import { PressionarLetraGame } from '../components/Game/games/PressionarLetraGame';
import { MonitorGame } from '../components/Game/games/MonitorGame';
import { FoneGame } from '../components/Game/games/FoneGame';
import { WebcamLuzGame } from '../components/Game/games/WebcamLuzGame';
import { MonitorEGabineteGame } from '../components/Game/games/MonitorEGabineteGame';
import styles from './MiniModulo.module.css';

// Registro das mecânicas disponíveis pro campo `jogo` de uma etapa em data/modulos.js
const JOGOS = {
  clicar: ClicarAlvoGame,
  arrastar: ArrastarSoltarGame,
  scroll: ScrollAteUmPontoGame,
  digitar: DigitarTextoGame,
  pressionar: PressionarTeclaGame,
  atalho: AtalhoTecladoGame,
  'gabinete-frente': GabineteFrenteGame,
  mouse: MouseGame,
  'mouse-demonstracao': MouseDemonstracaoGame,
  volume: AjustarVolumeGame,
  'porta-traseira': PortaTraseiraGame,
  'identificar-cabo': IdentificarCaboGame,
  quiz: QuizGame,
  'alvo-movel': AlvoMovelGame,
  'selecionar-arrastando': SelecionarArrastandoGame,
  'pressionar-letra': PressionarLetraGame,
  monitor: MonitorGame,
  fone: FoneGame,
  'webcam-luz': WebcamLuzGame,
  'monitor-gabinete': MonitorEGabineteGame,
};

const DIFICULDADES_POR_NIVEL = {
  Iniciante: ['demonstracao', 'padrao'],
  'Básico': ['demonstracao', 'padrao'],
  'Intermediário': ['padrao', 'desafio'],
  'Avançado': ['desafio'],
};

const NIVEL_PADRAO = 'Básico';

const DICAS_PADRAO = [
  'Você está indo muito bem! Continue assim! 💪',
  'Cada passo no seu tempo. A prática traz segurança! 💛',
  'Aprender algo novo é um exercício diário. Parabéns pela dedicação! ⭐',
  'Se precisar, volte e releia com calma quantas vezes quiser! 🌻',
];

export default function MiniModulo() {
  const { miniModuloId } = useParams();
  const navigate = useNavigate();
  const { user, initializing } = useContext(UserContext);
  const { updateProgress } = useContext(ProgressContext) || {};

  // Sem esse guard, dava pra acessar a página sem login: ela rodava
  // normalmente, mas `if (!user?.id) return` nos handlers abaixo fazia
  // os sinais de resposta simplesmente não serem enviados pro AB-BKT,
  // sem nenhum aviso - a trilha adaptativa "quebrava" silenciosamente.
  useEffect(() => {
    if (!initializing && !user) navigate('/login', { replace: true });
  }, [initializing, user, navigate]);

  // Conta ADM: vê a trilha completa (todas as etapas/dificuldades,
  // sem bloqueio sequencial) pra revisão de conteúdo, mas nada do que
  // ela faz aqui é persistido - nem posição na aula (localStorage),
  // nem resposta pro algoritmo adaptativo, nem progresso no servidor
  // (ver handleGameComplete/concluir mais abaixo e utils/roles.js).
  const admin = isAdmin(user);

  const resultado = getMiniModulo(miniModuloId);
  const todasEtapas = resultado?.miniModulo?.etapas ?? [];
  const unidade = getUnidadeByMiniModulo(miniModuloId);

  const CHAVE_ETAPA_SALVA = `ceci_etapa_${miniModuloId}`;

  // Memória de onde parou: inicializa na etapa salva no localStorage
  // (contas ADM sempre começam do zero - nada fica salvo pra elas)
  const [etapaAtual, setEtapaAtual] = useState(() => {
    if (admin) return 0;
    const salva = localStorage.getItem(CHAVE_ETAPA_SALVA);
    return salva ? parseInt(salva, 10) || 0 : 0;
  });

  const [resultadoJogo, setResultadoJogo] = useState(null);
  const [etapasCompletas, setEtapasCompletas] = useState(() => new Set());
  const [classificacaoPorUnidade, setClassificacaoPorUnidade] = useState({});

  // Reformulação de explicações com IA (Gemini)
  const [explicacoesIA, setExplicacoesIA] = useState({});
  const [mostrarExplicacaoIA, setMostrarExplicacaoIA] = useState({});
  const [carregandoIA, setCarregandoIA] = useState(false);
  const [erroIA, setErroIA] = useState(null);

  useEffect(() => {
    // Sem sentido buscar nível adaptativo pra quem vê tudo sempre
    if (!user?.id || admin) return;
    let ativo = true;
    getPerfisAluno(user.id)
        .then((perfis) => {
          if (ativo) setClassificacaoPorUnidade(perfis?.classificacaoPorUnidade || {});
        })
        .catch((err) => {
          console.error('Erro ao buscar nível adaptativo:', err);
        });
    return () => { ativo = false; };
  }, [user?.id, admin]);

  const nivel = (unidade && classificacaoPorUnidade[unidade.id]) || NIVEL_PADRAO;
  const dificuldades = DIFICULDADES_POR_NIVEL[nivel] || DIFICULDADES_POR_NIVEL[NIVEL_PADRAO] || ['demonstracao', 'padrao'];

  // ADM sempre vê todas as etapas, em todas as dificuldades. Contas
  // normais ficam limitadas ao que o algoritmo adaptativo indicar pro
  // nível atual - não existe mais alternância manual pra "ver tudo"
  // (quebrava a dinâmica de teste do algoritmo, que precisa medir a
  // pessoa dentro do nível que ele mesmo calculou). Se um mini-módulo
  // não tiver nenhuma etapa registrada pro nível atual (conteúdo
  // ainda não escrito pra essa dificuldade), cai em todasEtapas como
  // fallback automático - isso é lacuna de conteúdo, não escolha da
  // pessoa, então não faz sentido travar a aula por causa disso.
  const etapasDoNivel = todasEtapas.filter(
      (e) => e.tipo !== 'jogo' || dificuldades.includes(e.dificuldade ?? 'padrao')
  );
  const etapas = admin || etapasDoNivel.length === 0 ? todasEtapas : etapasDoNivel;

  const abandonosRef = useRef([]);

  // Reset completo de estado ao trocar de mini-módulo
  useEffect(() => {
    const salva = admin ? null : localStorage.getItem(`ceci_etapa_${miniModuloId}`);
    const etapaInicial = salva ? parseInt(salva, 10) || 0 : 0;
    setEtapaAtual(etapaInicial);
    setResultadoJogo(null);
    setEtapasCompletas(new Set());
    setExplicacoesIA({});
    setMostrarExplicacaoIA({});
    setCarregandoIA(false);
    setErroIA(null);
  }, [miniModuloId, admin]);

  useEffect(() => {
    setResultadoJogo(null);
  }, [etapaAtual]);

  if (!resultado) {
    return (
        <div className={styles.notFound}>
          <span className={styles.notFoundEmoji}>🔍</span>
          <h2>Mini-módulo não encontrado</h2>
          <ButtonOutline onClick={() => navigate('/dashboard')}>
            Voltar ao início
          </ButtonOutline>
        </div>
    );
  }

  if (etapas.length === 0) {
    return (
        <div className={styles.notFound}>
          <span className={styles.notFoundEmoji}>🚧</span>
          <h2>Mini-módulo sem conteúdo ainda</h2>
          <p>Esse mini-módulo ainda não tem nenhuma etapa cadastrada.</p>
          <ButtonOutline onClick={() => navigate('/dashboard')}>
            Voltar ao início
          </ButtonOutline>
        </div>
    );
  }

  const { modulo, miniModulo } = resultado;

  const indiceSeguro = Math.min(Math.max(0, etapaAtual), etapas.length - 1);
  if (etapaAtual !== indiceSeguro) {
    setEtapaAtual(indiceSeguro);
  }

  // Atualiza persistência da etapa atual no localStorage
  // (não pra conta ADM - ver comentário no topo do componente)
  useEffect(() => {
    if (admin) return;
    if (indiceSeguro >= 0) {
      localStorage.setItem(CHAVE_ETAPA_SALVA, indiceSeguro.toString());
    }
  }, [indiceSeguro, CHAVE_ETAPA_SALVA, admin]);

  const etapa = etapas[indiceSeguro];
  const isFirst = indiceSeguro === 0;
  const isLast = indiceSeguro === etapas.length - 1;
  const ehJogo = etapa?.tipo === 'jogo';

  // Se a etapa for de teoria, marca como concluída assim que exibida
  useEffect(() => {
    if (etapa && etapa.tipo !== 'jogo') {
      setEtapasCompletas((prev) => {
        if (prev.has(indiceSeguro)) return prev;
        const next = new Set(prev);
        next.add(indiceSeguro);
        return next;
      });
    }
  }, [indiceSeguro, etapa]);

  const handleGameComplete = async (res) => {
    setResultadoJogo(res);
    if (res?.success || res?.skipped) {
      setEtapasCompletas((prev) => {
        const next = new Set(prev);
        next.add(indiceSeguro);
        return next;
      });
    }

    // ADM só revisa conteúdo - não reporta resposta pro algoritmo
    // adaptativo, pra não distorcer os dados reais dos alunos.
    if (admin || !user?.id || !unidade) return;

    try {
      const resposta = await responderQuestao({
        userId: user.id,
        moduleId: unidade.id,
        etapaId: `${miniModuloId}#${etapa.id ?? indiceSeguro}`,
        correto: res.success,
        sinais: res.sinais,
        tempoIdeal: getTempoIdealMs(etapa.jogo),
        tentativas: (res.attempts ?? 0) + 1,
        tentativasAposErro: res.attempts ?? 0,
      });

      // Se o nível mudou, recalcula o filtro de dificuldade na hora -
      // sem isso, a trilha só se ajustaria na próxima vez que a
      // pessoa entrasse no mini-módulo, não durante a mesma sessão.
      if (resposta?.nivel && resposta.nivel !== nivel) {
        const novasDificuldades =
            DIFICULDADES_POR_NIVEL[resposta.nivel] || DIFICULDADES_POR_NIVEL[NIVEL_PADRAO];
        const etapasFiltradas = todasEtapas.filter(
            (e) => e.tipo !== 'jogo' || novasDificuldades.includes(e.dificuldade ?? 'padrao')
        );
        const novasEtapas = etapasFiltradas.length === 0 ? todasEtapas : etapasFiltradas;

        setClassificacaoPorUnidade((prev) => ({ ...prev, [unidade.id]: resposta.nivel }));

        // Resincroniza o índice pra continuar na mesma etapa (mesmo
        // objeto) dentro da lista recém-filtrada - sem isso, o índice
        // numérico atual passaria a apontar pra uma etapa diferente
        // assim que o filtro mudasse o tamanho/ordem do array.
        const novoIndex = novasEtapas.indexOf(etapa);
        if (novoIndex !== -1) {
          setEtapaAtual(novoIndex);
        }
      }
    } catch (err) {
      console.error('Erro ao reportar resposta pro algoritmo adaptativo:', err);
    }
  };

  const isEtapaDesbloqueada = (index) => {
    if (admin) return true;
    if (index === 0) return true;
    for (let i = 0; i < index; i++) {
      if (!etapasCompletas.has(i)) return false;
    }
    return true;
  };

  const proximaBloqueada = ehJogo && !resultadoJogo;

  const avancar = () => {
    if (!isLast && !proximaBloqueada) {
      const proximo = indiceSeguro + 1;
      setEtapaAtual(proximo);
    }
  };
  const retroceder = () => { if (!isFirst) setEtapaAtual((n) => n - 1); };

  const miniModulosDaUnidade = unidade?.miniModulos || [];
  const indiceMiniModulo = miniModulosDaUnidade.findIndex((mm) => mm.id === miniModuloId);
  const temProximoMiniModulo = indiceMiniModulo !== -1 && indiceMiniModulo < miniModulosDaUnidade.length - 1;
  const proximoMiniModulo = temProximoMiniModulo ? miniModulosDaUnidade[indiceMiniModulo + 1] : null;
  const temCheckpoint = Boolean(unidade?.checkpoint);

  let destinoConclusao = '/dashboard';
  let botaoConcluirLabel = 'Concluir mini-módulo';

  if (proximoMiniModulo) {
    destinoConclusao = `/mini-modulo/${proximoMiniModulo.id}`;
    botaoConcluirLabel = `Próxima aula: ${proximoMiniModulo.titulo}`;
  } else if (unidade && temCheckpoint) {
    destinoConclusao = `/unidade/${unidade.id}/checkpoint`;
    botaoConcluirLabel = 'Ir para o Desafio da Unidade';
  }

  const handlePedirExplicacaoIA = async (forcarNovo = false) => {
    if (!etapa || ehJogo) return;
    if (!forcarNovo && explicacoesIA[indiceSeguro]) {
      setMostrarExplicacaoIA((prev) => ({ ...prev, [indiceSeguro]: true }));
      return;
    }

    setCarregandoIA(true);
    setErroIA(null);

    try {
      const res = await reformularExplicacao({
        contexto: etapa.conteudo,
        titulo: `${modulo?.titulo || ''} - ${etapa?.titulo || ''}`,
        nivel,
        motivo: 'duvida',
      });

      if (res?.explicacao) {
        setExplicacoesIA((prev) => ({ ...prev, [indiceSeguro]: res.explicacao }));
        setMostrarExplicacaoIA((prev) => ({ ...prev, [indiceSeguro]: true }));
      } else {
        throw new Error('Nenhuma explicação gerada');
      }
    } catch (err) {
      console.error('Erro ao solicitar reformulação com IA:', err);
      setErroIA('Não foi possível gerar uma nova explicação no momento. Tente novamente mais tarde.');
    } finally {
      setCarregandoIA(false);
    }
  };

  const handleVerOriginal = () => {
    setMostrarExplicacaoIA((prev) => ({ ...prev, [indiceSeguro]: false }));
  };

  const concluir = async () => {
    localStorage.removeItem(CHAVE_ETAPA_SALVA);

    if (user?.id && updateProgress) {
      try {
        await updateProgress(miniModuloId, user.id, { progress: 100, completed: true });
      } catch (err) {
        console.warn('Não foi possível salvar o progresso no servidor:', err);
      }
    }
    navigate(destinoConclusao);
  };

  const registrarAbandono = (sinais) => {
    abandonosRef.current.push({
      miniModuloId,
      etapaId: etapa?.id ?? indiceSeguro,
      ...sinais,
    });
  };

  const Jogo = ehJogo && etapa?.jogo ? JOGOS[etapa.jogo] : null;

  if (initializing || !user) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100svh' }}>
          Carregando...
        </div>
    );
  }

  return (
      <div className={styles.page}>
        {/* HEADER */}
        <header className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
            Início
          </button>

          {/* breadcrumb */}
          <div className={styles.breadcrumb}>
          <span className={styles.breadcrumbModulo}>
            {modulo.emoji} {modulo.titulo}
          </span>
            <span className={styles.breadcrumbSep}>›</span>
            <span className={styles.breadcrumbMini}>{miniModulo.titulo}</span>
          </div>

          {/* progresso por etapas */}
          <div className={styles.etapaInfo}>
            Etapa {indiceSeguro + 1} / {etapas.length}
          </div>

          {/* Nível atual (ADM não tem nível - vê tudo sempre, ver
            utils/roles.js). Não é mais clicável: alternar nível/nível
            "ver tudo" manualmente quebrava a dinâmica de teste do
            algoritmo adaptativo. */}
          <div className={styles.nivelInfo} title={admin ? 'Conta ADM - trilha completa, sem gravar progresso' : `Nível atual: ${nivel}`}>
            {admin ? '🛠️ Modo ADM' : `Nível: ${nivel}`}
          </div>
        </header>

        {/* BARRA DE PROGRESSO */}
        <div className={styles.progressBar}>
          <div
              className={styles.progressFill}
              style={{ width: `${((indiceSeguro + 1) / etapas.length) * 100}%` }}
          />
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        <main className={styles.main} data-modo={ehJogo ? 'jogo' : 'teoria'}>
          <div className={styles.conteudoCol}>
            {ehJogo ? (
                Jogo ? (
                    <GameMoment
                        key={`etapa-${indiceSeguro}-${etapa.jogo}`}
                        title={etapa.titulo}
                        instructions={etapa.instructions}
                        onComplete={handleGameComplete}
                        onAbandon={registrarAbandono}
                    >
                      {({ reportResult }) => (
                          <Jogo reportResult={reportResult} {...etapa.jogoProps} />
                      )}
                    </GameMoment>
                ) : (
                    <div className={styles.jogoNaoEncontrado}>
                      <p>Mecânica de jogo &quot;{etapa.jogo}&quot; não encontrada.</p>
                    </div>
                )
            ) : (
                <RetroWindow
                    title={etapa.titulo}
                    icon="📖"
                    accent="branco"
                    className={styles.contentFrame}
                    bodyClassName={styles.card}
                >
                  {mostrarExplicacaoIA[indiceSeguro] && (
                      <div className={styles.teoriaHeader}>
                        <span className={styles.aiBadge}>
                    ✨ Explicação personalizada da Ceci
                  </span>
                      </div>
                  )}

                  {mostrarExplicacaoIA[indiceSeguro] ? (
                      <div className={styles.aiCard}>
                        <div
                            className={styles.aiConteudo}
                            dangerouslySetInnerHTML={{ __html: explicacoesIA[indiceSeguro] }}
                        />

                        <div className={styles.aiActions}>
                          <button
                              type="button"
                              className={styles.aiBtnSecondary}
                              onClick={handleVerOriginal}
                          >
                            Voltar ao texto original
                          </button>
                          <button
                              type="button"
                              className={styles.aiBtnOutra}
                              onClick={() => handlePedirExplicacaoIA(true)}
                              disabled={carregandoIA}
                          >
                            {carregandoIA ? 'Pensando em outro exemplo...' : 'Tentar outra analogia'}
                          </button>
                        </div>
                      </div>
                  ) : (
                      <>
                        <div
                            className={styles.etapaConteudo}
                            dangerouslySetInnerHTML={{ __html: etapa.conteudo }}
                        />

                        <div className={styles.aiTriggerContainer}>
                          {carregandoIA && (
                              <div className={styles.aiLoadingBox}>
                                <span className={styles.aiLoadingSpinner}>✨</span>
                                <span>A Ceci está preparando uma explicação com exemplos do seu dia a dia...</span>
                              </div>
                          )}

                          {erroIA && (
                              <p className={styles.aiErroText} role="alert">
                                {erroIA}
                              </p>
                          )}
                          <button
                              type="button"
                              className={styles.aiTriggerBtn}
                              onClick={() => handlePedirExplicacaoIA(false)}
                          >
                            <span className={styles.aiTriggerIcon}>✨</span>
                            <div className={styles.aiTriggerText}>
                              <strong>Ceci, me explica de outro jeito?</strong>
                              <small>Clique para ver uma analogia simples e prática do dia a dia</small>
                            </div>
                          </button>

                          {explicacoesIA[indiceSeguro] && (
                              <button
                                  type="button"
                                  className={styles.aiLinkVerNovamente}
                                  onClick={() => setMostrarExplicacaoIA((prev) => ({ ...prev, [indiceSeguro]: true }))}
                              >
                                Ver a explicação que a Ceci preparou antes ✨
                              </button>
                          )}
                        </div>
                      </>
                  )}
                </RetroWindow>
            )}
          </div>

          {/* Coluna da Cecília (mascote / dica) */}
          {!ehJogo && (
              <aside className={styles.ceciliaCol}>
                <div className={styles.ceciliaCard}>
                  <div className={styles.mascoteSlot} aria-hidden>
                    <img src="/mascote-ceci.png" alt="Mascote Ceci" />
                  </div>
                  <p className={styles.dica}>
                    {etapa.dica || DICAS_PADRAO[indiceSeguro % DICAS_PADRAO.length]}
                  </p>
                </div>

                {/* dots de navegação protegidos contra pulo de etapas não concluídas */}
                <div className={styles.dots}>
                  {etapas.map((_, i) => {
                    const desbloqueada = isEtapaDesbloqueada(i);
                    const concluida = etapasCompletas.has(i);
                    return (
                        <button
                            key={i}
                            className={`${styles.dot} ${i === indiceSeguro ? styles.dotActive : ''} ${concluida ? styles.dotDone : ''}`}
                            onClick={() => desbloqueada && setEtapaAtual(i)}
                            disabled={!desbloqueada}
                            style={{ cursor: desbloqueada ? 'pointer' : 'not-allowed', opacity: desbloqueada ? 1 : 0.4 }}
                            aria-label={`Ir para etapa ${i + 1}`}
                        />
                    );
                  })}
                </div>
              </aside>
          )}
        </main>

        {/* RODAPÉ COM NAVEGAÇÃO */}
        <footer className={styles.footer}>
          <ButtonOutline onClick={retroceder} disabled={isFirst}>
            Anterior
          </ButtonOutline>

          {isLast ? (
              <ButtonPrimary onClick={concluir} disabled={proximaBloqueada}>
                {botaoConcluirLabel}
              </ButtonPrimary>
          ) : (
              <ButtonPrimary onClick={avancar} disabled={proximaBloqueada}>
                Próxima
              </ButtonPrimary>
          )}
        </footer>
      </div>
  );
}