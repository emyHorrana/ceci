/**
 * UnidadeCheckpoint.jsx
 * Desafio de fim de Unidade em formato de bateria formativa (3 a 5 questões)
 * que avalia a consolidação dos conceitos ensinados naquela Unidade.
 *
 * O resultado final é reportado para o algoritmo adaptativo (AB-BKT) e
 * salvo no perfil/progresso do aluno para guiar as próximas recomendações.
 *
 * Rota: /unidade/:unidadeId/checkpoint
 */

import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UNIDADES } from '../data/unidades';
import { MODULOS } from '../data/modulos';
import { UserContext } from '../context/UserContext';
import { GameMoment } from '../components/Game/GameMoment';
import { ArrastarSoltarGame } from '../components/Game/games/ArrastarSoltarGame';
import { QuizGame } from '../components/Game/games/QuizGame';
import { ButtonPrimary } from '../components/Buttons/ButtonPrimary';
import { ButtonOutline } from '../components/Buttons/ButtonOutline';
import { registrarResultadoCheckpoint } from '../services/checkpointService';
import { responderQuestao, getProximaUnidade } from '../services/algorithmService';
import { getTempoIdealMs } from '../utils/jogoTempoIdeal';
import styles from './UnidadeCheckpoint.module.css';

const JOGOS_CHECKPOINT = {
  associacao: ArrastarSoltarGame,
  quiz: QuizGame,
};

export default function UnidadeCheckpoint() {
  const { unidadeId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostas, setRespostas] = useState([]);
  const [acertos, setAcertos] = useState(0);
  const [emTransicao, setEmTransicao] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [proxima, setProxima] = useState(null);

  const unidade = UNIDADES.find((u) => u.id === unidadeId);
  const modulo = unidade ? MODULOS.find((m) => m.id === unidade.moduloId) : null;

  if (!unidade || !unidade.checkpoint) {
    return (
      <div className={styles.notFound}>
        <h2>Desafio não encontrado</h2>
        <p>Essa Unidade ainda não tem um desafio de fim de Unidade.</p>
        <ButtonOutline onClick={() => navigate('/dashboard')}>
          Voltar ao início
        </ButtonOutline>
      </div>
    );
  }

  const { checkpoint } = unidade;
  const questoes = checkpoint.questoes && checkpoint.questoes.length > 0
    ? checkpoint.questoes
    : [
        {
          id: `${unidade.id}-q1`,
          tipo: checkpoint.tipo,
          titulo: checkpoint.titulo,
          instructions: checkpoint.instructions,
          jogoProps: checkpoint.jogoProps,
        },
      ];

  const totalQuestoes = questoes.length;
  const questao = questoes[Math.min(questaoAtual, totalQuestoes - 1)];
  const Jogo = JOGOS_CHECKPOINT[questao.tipo] || QuizGame;

  const handleCompleteQuestao = async (res) => {
    const acertou = Boolean(res.success);
    const novaResposta = {
      questaoIndex: questaoAtual,
      acertou,
      attempts: res.attempts ?? 0,
      sinais: res.sinais,
    };
    const novasRespostas = [...respostas, novaResposta];
    const novosAcertos = acertou ? acertos + 1 : acertos;

    setRespostas(novasRespostas);
    setAcertos(novosAcertos);

    if (questaoAtual < totalQuestoes - 1) {
      setEmTransicao(true);
      setTimeout(() => {
        setQuestaoAtual((prev) => prev + 1);
        setEmTransicao(false);
      }, 1300);
    } else {
      await finalizarBateria(novosAcertos, totalQuestoes, novasRespostas);
    }
  };

  const finalizarBateria = async (totalAcertos, totalQ, todasRespostas) => {
    const taxaAcerto = totalAcertos / totalQ;
    const dominou = taxaAcerto >= 0.66;

    registrarResultadoCheckpoint(unidade.id, dominou, {
      acertos: totalAcertos,
      total: totalQ,
      taxa: taxaAcerto,
      respostas: todasRespostas,
    });

    setResultado(dominou ? 'dominou' : 'reforco');

    if (!user?.id) return;

    try {
      const totalAttempts = todasRespostas.reduce((sum, r) => sum + (r.attempts || 0), 0);
      const ultimoSinal = todasRespostas[todasRespostas.length - 1]?.sinais;

      await responderQuestao({
        userId: user.id,
        moduleId: unidade.id,
        etapaId: `${unidade.id}#checkpoint`,
        correto: dominou,
        sinais: ultimoSinal,
        tempoIdeal: getTempoIdealMs(questao.tipo) * totalQ,
        tentativas: totalAttempts + totalQ,
        tentativasAposErro: totalQ - totalAcertos,
      });

      const recomendacao = await getProximaUnidade(user.id);
      setProxima(recomendacao);
    } catch (err) {
      console.error('Erro ao reportar checkpoint pro algoritmo adaptativo:', err);
    }
  };

  const reiniciarDesafio = () => {
    setQuestaoAtual(0);
    setRespostas([]);
    setAcertos(0);
    setEmTransicao(false);
    setResultado(null);
    setProxima(null);
  };

  const unidadeRecomendada = proxima?.unidade?.id
    ? UNIDADES.find((u) => u.id === proxima.unidade.id)
    : null;
  const proximoDestino = unidadeRecomendada?.miniModulos?.[0]?.id
    ? `/mini-modulo/${unidadeRecomendada.miniModulos[0].id}`
    : null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
          Início
        </button>

        <div className={styles.breadcrumb}>
          {modulo && (
            <>
              <span className={styles.breadcrumbModulo}>{modulo.titulo}</span>
              <span className={styles.breadcrumbSep}>›</span>
            </>
          )}
          <span className={styles.breadcrumbMini}>{unidade.titulo}</span>
        </div>

        <div className={styles.etapaInfo}>
          Pergunta {questaoAtual + 1} / {totalQuestoes}
        </div>

        <span className={styles.badge}>Desafio da Unidade</span>
      </header>

      {/* BARRA DE PROGRESSO NO TOPO */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${((questaoAtual + 1) / totalQuestoes) * 100}%` }}
        />
      </div>

      <main className={styles.main}>
        {!resultado && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <p className={styles.unidadeTitulo}>{unidade.titulo}</p>

              {/* Tracker de progresso do desafio */}
              <div className={styles.trackerContainer}>
                <div className={styles.trackerLabels}>
                  <span className={styles.trackerText}>
                    Pergunta <strong>{questaoAtual + 1}</strong> de {totalQuestoes}
                  </span>
                  <span className={styles.trackerScore}>
                    {acertos} {acertos === 1 ? 'acerto' : 'acertos'}
                  </span>
                </div>
              </div>
            </div>

            {/* Renderiza a questão atual com key para resetar o GameMoment limpo */}
            <div className={emTransicao ? styles.questaoTransicao : styles.questaoSlot}>
              <GameMoment
                key={`${unidade.id}-questao-${questaoAtual}`}
                title={questao.titulo}
                instructions={questao.instructions}
                onComplete={handleCompleteQuestao}
              >
                {({ reportResult }) => (
                  <Jogo reportResult={reportResult} {...questao.jogoProps} />
                )}
              </GameMoment>
            </div>
          </div>
        )}

        {/* Desfecho: DOMINOU (Aprovado com maestria) */}
        {resultado === 'dominou' && (
          <div className={styles.desfecho} data-tipo="dominou">
            <h2>Excelente! Você dominou &quot;{unidade.titulo}&quot;!</h2>

            <div className={styles.scoreBadge}>
              Você acertou <strong>{acertos} de {totalQuestoes}</strong> desafios ({Math.round((acertos / totalQuestoes) * 100)}%)
            </div>

            <p>
              Você mostrou muita segurança neste tópico. Seu progresso foi registrado com sucesso na sua trilha!
            </p>

            <div className={styles.desfechoActions}>
              {proximoDestino ? (
                <ButtonPrimary onClick={() => navigate(proximoDestino)}>
                  Continuar: {proxima.unidade.titulo}
                </ButtonPrimary>
              ) : (
                <ButtonPrimary onClick={() => navigate('/dashboard')}>
                  Voltar ao início
                </ButtonPrimary>
              )}
              <ButtonOutline onClick={reiniciarDesafio}>
                Refazer desafio
              </ButtonOutline>
            </div>
          </div>
        )}

        {/* Desfecho: REFORÇO (Acolhimento e encorajamento) */}
        {resultado === 'reforco' && (
          <div className={styles.desfecho} data-tipo="reforco">
            <h2>Sem problemas, vamos no seu ritmo!</h2>

            <div className={styles.scoreBadge}>
              Você acertou <strong>{acertos} de {totalQuestoes}</strong> desafios
            </div>

            <p>
              Cada tentativa é um passo para ganhar mais confiança. Vamos continuar praticando &quot;{unidade.titulo}&quot; para você dominar tudo com tranquilidade!
            </p>

            <div className={styles.desfechoActions}>
              <ButtonPrimary onClick={reiniciarDesafio}>
                Tentar o desafio novamente
              </ButtonPrimary>
              {proximoDestino && (
                <ButtonOutline onClick={() => navigate(proximoDestino)}>
                  Continuar praticando com a Ceci
                </ButtonOutline>
              )}
              <ButtonOutline onClick={() => navigate('/dashboard')}>
                Voltar ao início
              </ButtonOutline>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
