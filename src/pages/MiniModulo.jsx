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

// Registro das mecânicas disponíveis pro campo `jogo` de uma etapa em
// data/modulos.js. Pra adicionar uma mecânica nova (ex: atalho de
// teclado), só criar o componente em components/Game/games/ e
// registrar aqui - nenhuma outra mudança nesta página é necessária.
const JOGOS = {
  clicar: ClicarAlvoGame,
  arrastar: ArrastarSoltarGame,
  scroll: ScrollAteUmPontoGame,
  digitar: DigitarTextoGame,
  pressionar: PressionarTeclaGame,
  atalho: AtalhoTecladoGame,
  'gabinete-frente': GabineteFrenteGame,
  mouse: MouseGame,
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

// Quais dificuldades de etapa aparecem pra cada nível que o Classificador
// (BKT, backend) devolve. Uma etapa sem `dificuldade` definida é tratada
// como 'padrao' - é o que a maior parte do conteúdo ainda mais antigo
// tem, então fica visível pra todo mundo por padrão em vez de sumir
// silenciosamente por falta de tag.
const DIFICULDADES_POR_NIVEL = {
  Iniciante: ['demonstracao', 'padrao'],
  'Básico': ['demonstracao', 'padrao'],
  'Intermediário': ['padrao', 'desafio'],
  'Avançado': ['desafio'],
};

// Nível padrão pra quando ainda não sabemos o real (perfil ainda
// carregando, ou Unidade nunca tentada) - bate com o L0 padrão que o
// próprio BKT usa na primeira tentativa (0.30 → 'Básico', ver
// ParametrosAdaptativos.calcularL0 no backend), não é um valor
// arbitrário escolhido só pra esta tela.
const NIVEL_PADRAO = 'Básico';

const DICAS_PADRAO = [
  'Você está indo muito bem! Continue assim! 💪',
  'Cada passo no seu tempo. A prática traz segurança! 💛',
  'Aprender algo novo é um exercício diário. Parabéns pela dedicação! ⭐',
  'Se precisar, volte e releia com calma quantas vezes quiser! 🌻',
];

// Chave do sessionStorage pro "modo revisão" (ver comentário no
// componente) - sessionStorage, não localStorage: intencional, não
// deve sobreviver entre sessões/dispositivos diferentes, só entre
// abas do mesmo teste.
const CHAVE_MODO_REVISAO = 'ceci:modoRevisao';

export default function MiniModulo() {
  const { miniModuloId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { updateProgress } = useContext(ProgressContext) || {};

  const resultado = getMiniModulo(miniModuloId);
  const todasEtapas = resultado?.miniModulo?.etapas ?? [];
  const unidade = getUnidadeByMiniModulo(miniModuloId);

  // Hooks sempre chamados incondicionalmente (regra do React) - o
  // "mini-módulo não encontrado" só é decidido depois, no JSX.
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [resultadoJogo, setResultadoJogo] = useState(null);

  // Nível adaptativo (BKT) da Unidade que este mini-módulo pertence -
  // decide quais etapas de jogo aparecem (ver DIFICULDADES_POR_NIVEL
  // acima). Busca uma vez por Unidade/usuário, não por etapa.
  const [classificacaoPorUnidade, setClassificacaoPorUnidade] = useState({});

  // "Modo revisão": bypass do filtro por nível, mostra TODAS as
  // etapas de jogo independente da dificuldade - pra quem constrói o
  // conteúdo poder ver/testar tudo sem precisar simular sessões de
  // jogo até atingir cada nível. Guardado em sessionStorage pra não
  // resetar a cada mini-módulo aberto durante um mesmo teste (esse
  // era o ponto de não interromper o fluxo de testes), mas também não
  // sobrevive pra sempre nem vaza pra outros dispositivos/pessoas.
  //
  // Isso é deliberadamente informal por enquanto: não existe conceito
  // de admin/role nesta aplicação ainda, então o toggle fica visível
  // pra qualquer um que abrir a tela. Não é um problema hoje (fase de
  // testes, sem usuários reais), mas se um dia a Unidade tiver contas
  // reais, esse toggle deveria estar atrás de uma checagem de role,
  // não solto na página.
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
          // Sem classificação, cai no NIVEL_PADRAO - a tela continua
          // funcionando, só sem adaptar por nível.
          console.error('Erro ao buscar nível adaptativo:', err);
        });
    return () => { ativo = false; };
  }, [user?.id]);

  const nivel = (unidade && classificacaoPorUnidade[unidade.id]) || NIVEL_PADRAO;
  const dificuldades = DIFICULDADES_POR_NIVEL[nivel] || DIFICULDADES_POR_NIVEL[NIVEL_PADRAO] || ['demonstracao', 'padrao'];

  // A filtragem em si: teoria sempre aparece pra todo mundo (a dúvida
  // de "quanto de teoria preparar" não muda por nível - só o jogo
  // muda). Etapa de jogo sem `dificuldade` definida vira 'padrao'.
  const etapas = modoRevisao
      ? todasEtapas
      : todasEtapas.filter(
          (e) => e.tipo !== 'jogo' || dificuldades.includes(e.dificuldade ?? 'padrao')
      );

  // Se o filtro (ou o toggle de modo revisão) mudar o tamanho da lista
  // depois que a pessoa já avançou etapas, evita ficar apontando pra
  // um índice que não existe mais.
  useEffect(() => {
    setEtapaAtual((atual) => Math.min(atual, Math.max(0, etapas.length - 1)));
  }, [etapas.length]);

  // Sinais de abandono (ver comentário sobre onAbandon em
  // GameMoment.jsx) - guardados aqui por enquanto, sem mandar pra
  // lugar nenhum ainda. Quem decide o destino disso (mandar pro
  // algoritmo, virar pendência etc) é trabalho de integração
  // separado, já encarregado - aqui só garante que a captura não se
  // perde no vácuo enquanto isso não existe.
  const abandonosRef = useRef([]);

  // Toda vez que a etapa muda (avançar, retroceder ou clicar num dot),
  // esquece o resultado do jogo anterior - cada etapa de jogo precisa
  // ser resolvida de novo pra liberar "Próxima". Se no futuro isso
  // incomodar (ex: alguém volta só pra reler a teoria e perde o
  // progresso do jogo seguinte), trocar por um Set de etapas já
  // completadas em vez de um valor único.
  useEffect(() => {
    setResultadoJogo(null);
  }, [etapaAtual]);

  // mini-módulo não encontrado
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

  // Situação nova, só possível a partir do filtro por nível: se TODAS
  // as etapas de jogo do mini-módulo forem de uma dificuldade que não
  // aparece pro nível atual (ex: mini-módulo só tem etapa `desafio` e
  // o aluno está em Iniciante), a lista filtrada pode ficar vazia.
  // Antes disso não existia, então não tinha guarda nenhuma pra isso.
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

  const etapa = etapas[indiceSeguro];
  const isFirst = indiceSeguro === 0;
  const isLast  = indiceSeguro === etapas.length - 1;
  const ehJogo  = etapa?.tipo === 'jogo';

  const avancar    = () => { if (!isLast)  setEtapaAtual((n) => n + 1); };
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
    botaoConcluirLabel = 'Ir para o Desafio da Unidade 🏁';
  }

  const concluir = async () => {
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

  // Numa etapa de jogo, só libera avançar depois que o GameMoment
  // reportar sucesso OU a pessoa optar por pular.
  const proximaBloqueada = ehJogo && !resultadoJogo;

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

          {/* Modo revisão - solto na página de propósito por enquanto, sem
            checagem de role: não existe conta admin nesta aplicação ainda.
            Mostra o nível calculado ao lado pra sempre deixar claro o que
            está sendo filtrado, mesmo com o toggle desligado. */}
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

          {/* Coluna do conteúdo (teoria OU jogo) */}
          <section className={styles.conteudoCol}>
            {ehJogo ? (
                <div key={indiceSeguro} className={styles.card}>
                  <GameMoment
                      title={etapa.titulo}
                      instructions={etapa.instructions}
                      onComplete={setResultadoJogo}
                      onAbandon={registrarAbandono}
                  >
                    {({ reportResult }) => (
                        Jogo ? <Jogo reportResult={reportResult} {...etapa.jogoProps} /> : null
                    )}
                  </GameMoment>
                </div>
            ) : (
                <div key={indiceSeguro} className={styles.card}>
                  <h1 className={styles.etapaTitulo}>{etapa.titulo}</h1>

                  <div
                      className={styles.etapaConteudo}
                      /* o conteúdo é HTML controlado definido em modulos.js */
                      dangerouslySetInnerHTML={{ __html: etapa.conteudo }}
                  />
                </div>
            )}
          </section>

          {/* Coluna da Cecília (mascote / dica) - escondida durante o
            jogo, porque o GameMoment já tem o próprio feedback dela */}
          {!ehJogo && (
              <aside className={styles.ceciliaCol}>
                <div className={styles.ceciliaCard}>
                  {/* Slot para arte da personagem-guia - substitua pela <img> quando estiver pronta */}
                  <div className={styles.mascoteSlot} aria-hidden>
                    <img src="/mascote-ceci.png" alt="Mascote Ceci" />
                  </div>
                  <p className={styles.dica}>
                    {etapa.dica || DICAS_PADRAO[indiceSeguro % DICAS_PADRAO.length]}
                  </p>
                </div>

                {/* dots de navegação */}
                <div className={styles.dots}>
                  {etapas.map((_, i) => (
                      <button
                          key={i}
                          className={`${styles.dot} ${i === indiceSeguro ? styles.dotActive : ''} ${i < indiceSeguro ? styles.dotDone : ''}`}
                          onClick={() => setEtapaAtual(i)}
                          aria-label={`Ir para etapa ${i + 1}`}
                      />
                  ))}
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