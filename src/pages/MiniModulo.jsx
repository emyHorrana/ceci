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
import { getPerfisAluno } from '../services/algorithmService';
import { reformularExplicacao } from '../services/aiService';
import { ButtonPrimary } from '../components/Buttons/ButtonPrimary';
import { ButtonOutline } from '../components/Buttons/ButtonOutline';
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

const CHAVE_MODO_REVISAO = 'ceci:modoRevisao';

export default function MiniModulo() {
  const { miniModuloId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { updateProgress } = useContext(ProgressContext) || {};

  const resultado = getMiniModulo(miniModuloId);
  const todasEtapas = resultado?.miniModulo?.etapas ?? [];
  const unidade = getUnidadeByMiniModulo(miniModuloId);

  const CHAVE_ETAPA_SALVA = `ceci_etapa_${miniModuloId}`;

  // Memória de onde parou: inicializa na etapa salva no localStorage
  const [etapaAtual, setEtapaAtual] = useState(() => {
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

  const [modoRevisao, setModoRevisao] = useState(
    () => sessionStorage.getItem(CHAVE_MODO_REVISAO) === '1'
  );

  function alternarModoRevisao() {
    const dificuldades = DIFICULDADES_POR_NIVEL[nivel] || DIFICULDADES_POR_NIVEL[NIVEL_PADRAO] || ['demonstracao', 'padrao'];
    const etapaAtualObj = etapas[Math.min(Math.max(0, etapaAtual), Math.max(0, etapas.length - 1))];
    const novoModo = !modoRevisao;

    sessionStorage.setItem(CHAVE_MODO_REVISAO, novoModo ? '1' : '0');
    setModoRevisao(novoModo);

    const novasEtapas = novoModo
      ? todasEtapas
      : todasEtapas.filter(
          (e) => e.tipo !== 'jogo' || dificuldades.includes(e.dificuldade ?? 'padrao')
        );

    if (novasEtapas.length > 0) {
      const novoIndex = etapaAtualObj ? novasEtapas.indexOf(etapaAtualObj) : -1;
      if (novoIndex !== -1) {
        setEtapaAtual(novoIndex);
      } else {
        setEtapaAtual((atual) => Math.min(atual, Math.max(0, novasEtapas.length - 1)));
      }
    } else {
      setEtapaAtual(0);
    }
  }

  useEffect(() => {
    if (!user?.id) return;
    let ativo = true;
    getPerfisAluno(user.id)
      .then((perfis) => {
        if (ativo) setClassificacaoPorUnidade(perfis?.classificacaoPorUnidade || {});
      })
      .catch((err) => {
        console.error('Erro ao buscar nível adaptativo:', err);
      });
    return () => { ativo = false; };
  }, [user?.id]);

  const nivel = (unidade && classificacaoPorUnidade[unidade.id]) || NIVEL_PADRAO;
  const dificuldades = DIFICULDADES_POR_NIVEL[nivel] || DIFICULDADES_POR_NIVEL[NIVEL_PADRAO] || ['demonstracao', 'padrao'];

  const etapas = modoRevisao
    ? todasEtapas
    : todasEtapas.filter(
        (e) => e.tipo !== 'jogo' || dificuldades.includes(e.dificuldade ?? 'padrao')
      );

  const abandonosRef = useRef([]);

  // Reset completo de estado ao trocar de mini-módulo
  useEffect(() => {
    const salva = localStorage.getItem(`ceci_etapa_${miniModuloId}`);
    const etapaInicial = salva ? parseInt(salva, 10) || 0 : 0;
    setEtapaAtual(etapaInicial);
    setResultadoJogo(null);
    setEtapasCompletas(new Set());
    setExplicacoesIA({});
    setMostrarExplicacaoIA({});
    setCarregandoIA(false);
    setErroIA(null);
  }, [miniModuloId]);

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
        <h2>Nada disponível pra esse nível ainda</h2>
        <p>Este mini-módulo só tem etapas de um nível diferente do seu.</p>
        <ButtonOutline onClick={alternarModoRevisao}>
          Ver todas as etapas mesmo assim
        </ButtonOutline>
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
  useEffect(() => {
    if (indiceSeguro >= 0) {
      localStorage.setItem(CHAVE_ETAPA_SALVA, indiceSeguro.toString());
    }
  }, [indiceSeguro, CHAVE_ETAPA_SALVA]);

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

  const handleGameComplete = (res) => {
    setResultadoJogo(res);
    if (res?.success || res?.skipped) {
      setEtapasCompletas((prev) => {
        const next = new Set(prev);
        next.add(indiceSeguro);
        return next;
      });
    }
  };

  const isEtapaDesbloqueada = (index) => {
    if (modoRevisao) return true;
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

        {/* Modo revisão */}
        <button
          type="button"
          className={styles.modoRevisaoBtn}
          data-ativo={modoRevisao || undefined}
          onClick={alternarModoRevisao}
          title={modoRevisao ? 'Mostrando todas as etapas' : `Nível atual: ${nivel}`}
        >
          {modoRevisao ? '👁️ Vendo tudo' : `Nível: ${nivel}`}
        </button>
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
            <div className={styles.card}>
              <div className={styles.teoriaHeader}>
                <h1 className={styles.etapaTitulo}>{etapa.titulo}</h1>

                {mostrarExplicacaoIA[indiceSeguro] && (
                  <span className={styles.aiBadge}>
                    ✨ Explicação personalizada da Ceci
                  </span>
                )}
              </div>

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
            </div>
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
