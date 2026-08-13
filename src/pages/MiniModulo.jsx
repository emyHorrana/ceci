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
import { responderQuestao } from '../services/algorithmService';
import { getTempoIdealMs } from '../utils/jogoTempoIdeal';
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
import { AjustarVolumeGame } from '../components/Game/games/AjustarVolumeGame';
import { PortaTraseiraGame } from '../components/Game/games/PortaTraseiraGame';
import { IdentificarCaboGame } from '../components/Game/games/IdentificarCaboGame';
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
  volume: AjustarVolumeGame,
  'porta-traseira': PortaTraseiraGame,
  'identificar-cabo': IdentificarCaboGame,
};

export default function MiniModulo() {
  const { miniModuloId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const resultado = getMiniModulo(miniModuloId);
  const etapas = resultado?.miniModulo?.etapas ?? [];

  // Hooks sempre chamados incondicionalmente (regra do React) - o
  // "mini-módulo não encontrado" só é decidido depois, no JSX.
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [resultadoJogo, setResultadoJogo] = useState(null);
  // Recomendação que o AB-BKT devolveu pra última resposta ('Próximo
  // módulo' | 'Questão mais difícil' | 'Mesmo módulo' | 'Revisão') - só
  // 'Revisão' muda alguma coisa na tela hoje (ver nudge mais abaixo); o
  // conteúdo ainda não tem variantes fácil/padrão/difícil pra escalar
  // nas outras recomendações.
  const [recomendacaoAtual, setRecomendacaoAtual] = useState(null);
  // Incrementado quando a pessoa escolhe "praticar mais uma vez" -
  // usado só pra forçar o GameMoment a remontar do zero na mesma etapa.
  const [tentativaExtra, setTentativaExtra] = useState(0);

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
    setRecomendacaoAtual(null);
    setTentativaExtra(0);
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

  const { modulo, miniModulo } = resultado;

  const etapa = etapas[etapaAtual];
  const isFirst = etapaAtual === 0;
  const isLast  = etapaAtual === etapas.length - 1;
  const ehJogo  = etapa.tipo === 'jogo';

  const avancar    = () => { if (!isLast)  setEtapaAtual((n) => n + 1); };
  const retroceder = () => { if (!isFirst) setEtapaAtual((n) => n - 1); };

  const concluir = () => {
    // TODO: marcar mini-módulo como concluído no contexto/backend
    navigate('/dashboard');
  };

  const registrarAbandono = (sinais) => {
    abandonosRef.current.push({
      miniModuloId,
      etapaId: etapa.id ?? etapaAtual,
      ...sinais,
    });
  };

  // Reporta o resultado do jogo pro algoritmo adaptativo (AB-BKT) e só
  // depois libera o "Próxima" (mesmo comportamento de antes, via
  // resultadoJogo) - se o mini-módulo ainda não pertence a nenhuma
  // Unidade (ver data/unidades.js) ou não há sessão, só segue o fluxo
  // local, sem quebrar a experiência.
  const handleGameComplete = async (resultadoJogoAtual) => {
    setResultadoJogo(resultadoJogoAtual);
    setRecomendacaoAtual(null);

    const unidade = getUnidadeByMiniModulo(miniModuloId);
    if (!unidade || !user?.id) return;

    try {
      const resposta = await responderQuestao({
        userId: user.id,
        moduleId: unidade.id,
        etapaId: `${miniModuloId}#${etapa.id ?? etapaAtual}`,
        correto: resultadoJogoAtual.success,
        sinais: resultadoJogoAtual.sinais,
        tempoIdeal: getTempoIdealMs(etapa.jogo),
        tentativas: (resultadoJogoAtual.attempts ?? 0) + 1,
        tentativasAposErro: resultadoJogoAtual.attempts ?? 0,
      });
      setRecomendacaoAtual(resposta.recomendacao);
    } catch (err) {
      console.error('Erro ao reportar resposta pro algoritmo adaptativo:', err);
    }
  };

  // "Revisão" é a única recomendação que muda algo na tela hoje: as
  // outras (Próximo módulo / Questão mais difícil / Mesmo módulo)
  // exigiriam ter variantes de conteúdo (fácil/padrão/difícil) que ainda
  // não existem em data/modulos.js - ver conversa com a Emily.
  const handlePraticarNovamente = () => {
    setResultadoJogo(null);
    setRecomendacaoAtual(null);
    setTentativaExtra((n) => n + 1);
  };

  const handleContinuarMesmoAssim = () => setRecomendacaoAtual(null);

  // Numa etapa de jogo, só libera avançar depois que o GameMoment
  // reportar sucesso OU a pessoa optar por pular.
  const proximaBloqueada = ehJogo && !resultadoJogo;

  const Jogo = ehJogo ? JOGOS[etapa.jogo] : null;

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
          Etapa {etapaAtual + 1} / {etapas.length}
        </div>
      </header>

      {/* BARRA DE PROGRESSO */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${((etapaAtual + 1) / etapas.length) * 100}%` }}
        />
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main className={styles.main} data-modo={ehJogo ? 'jogo' : 'teoria'}>

        {/* Coluna do conteúdo (teoria OU jogo) */}
        <section className={styles.conteudoCol}>
          {ehJogo ? (
            <div key={etapaAtual} className={styles.card}>
              <GameMoment
                key={tentativaExtra}
                title={etapa.titulo}
                instructions={etapa.instructions}
                onComplete={handleGameComplete}
                onAbandon={registrarAbandono}
              >
                {({ reportResult }) => (
                  <Jogo reportResult={reportResult} {...etapa.jogoProps} />
                )}
              </GameMoment>

              {/* Nudge de revisão: o algoritmo adaptativo avaliou que vale
                  a pena repetir essa etapa antes de seguir - a pessoa
                  decide, nunca é forçado. */}
              {recomendacaoAtual === 'Revisão' && (
                <div className={styles.revisaoNudge}>
                  <p className={styles.revisaoTexto}>
                    Que tal praticar essa etapa mais uma vez antes de continuar?
                  </p>
                  <div className={styles.revisaoAcoes}>
                    <ButtonPrimary onClick={handlePraticarNovamente}>
                      Praticar mais uma vez
                    </ButtonPrimary>
                    <ButtonOutline onClick={handleContinuarMesmoAssim}>
                      Continuar mesmo assim
                    </ButtonOutline>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div key={etapaAtual} className={styles.card}>
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
                {etapa.dica || 'Você está indo muito bem! Continue assim! 💪'}
              </p>
            </div>

            {/* dots de navegação */}
            <div className={styles.dots}>
              {etapas.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === etapaAtual ? styles.dotActive : ''} ${i < etapaAtual ? styles.dotDone : ''}`}
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
            Concluir mini-módulo
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