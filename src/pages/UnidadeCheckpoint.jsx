/**
 * UnidadeCheckpoint.jsx
 * Desafio de fim de Unidade - um jogo um pouco mais difícil (associação
 * ou quiz, ver data/unidades.js) que dá o veredito de domínio daquela
 * Unidade inteira, não de um mini-módulo isolado.
 *
 * O resultado é reportado pro algoritmo adaptativo (AB-BKT) via
 * services/algorithmService.js (POST /api/licao/responder), que
 * devolve o domínio atualizado; a partir daí busca-se a próxima
 * Unidade recomendada (GET /api/licao/proxima-unidade/:userId, ver
 * FilaDePendencias no backend) pra oferecer o botão "Continuar".
 * O veredito também continua sendo espelhado no localStorage via
 * checkpointService.js, pra a tela nunca ficar travada esperando rede.
 *
 * Rota: /unidade/:unidadeId/checkpoint
 */

import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UNIDADES } from '../data/unidades';
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

// Mesma ideia do registro JOGOS em MiniModulo.jsx - só que restrito
// aos tipos que fazem sentido como desafio de checkpoint.
const JOGOS_CHECKPOINT = {
  associacao: ArrastarSoltarGame,
  quiz: QuizGame,
};

export default function UnidadeCheckpoint() {
  const { unidadeId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [resultado, setResultado] = useState(null);
  // Próxima Unidade recomendada pelo algoritmo (FilaDePendencias), buscada
  // só depois que o checkpoint é reportado - reflete o domínio já atualizado.
  const [proxima, setProxima] = useState(null);

  const unidade = UNIDADES.find((u) => u.id === unidadeId);

  if (!unidade || !unidade.checkpoint) {
    return (
      <div className={styles.notFound}>
        <span className={styles.notFoundEmoji}>🔍</span>
        <h2>Desafio não encontrado</h2>
        <p>Essa Unidade ainda não tem um desafio de fim de Unidade.</p>
        <ButtonOutline onClick={() => navigate('/dashboard')}>
          Voltar ao início
        </ButtonOutline>
      </div>
    );
  }

  const { checkpoint } = unidade;
  const Jogo = JOGOS_CHECKPOINT[checkpoint.tipo];

  const handleComplete = async (res) => {
    const dominou = res.success;
    registrarResultadoCheckpoint(unidade.id, dominou, { attempts: res.attempts, sinais: res.sinais });
    setResultado(dominou ? 'dominou' : 'reforco');

    if (!user?.id) return;

    try {
      await responderQuestao({
        userId: user.id,
        moduleId: unidade.id,
        etapaId: `${unidade.id}#checkpoint`,
        correto: dominou,
        sinais: res.sinais,
        tempoIdeal: getTempoIdealMs(checkpoint.tipo),
        tentativas: (res.attempts ?? 0) + 1,
        tentativasAposErro: res.attempts ?? 0,
      });

      // busca a próxima Unidade só depois do domínio já atualizado
      const recomendacao = await getProximaUnidade(user.id);
      setProxima(recomendacao);
    } catch (err) {
      console.error('Erro ao reportar checkpoint pro algoritmo adaptativo:', err);
    }
  };

  // Pra onde o botão "Continuar" leva: o primeiro mini-módulo da Unidade
  // recomendada, se houver uma - senão cai no fallback (dashboard).
  //
  // CORRIGIDO (21/08): `proxima.unidade` vem do espelho do backend
  // (server/lib/adaptive-bkt/data/unidades.js), onde `miniModulos` é
  // um array de STRINGS (ex: ['1-3', '1-5']) - não dos objetos
  // completos que a `UNIDADES` do front tem. `miniModulos[0].id`
  // sempre dava `undefined` (string não tem `.id`), então esse botão
  // nunca navegava de verdade - sempre caía no fallback. Resolvendo
  // pela `UNIDADES` local (já importada) em vez de confiar no shape
  // do backend pra isso.
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
        <span className={styles.badge}>Desafio de Unidade</span>
      </header>

      <main className={styles.main}>
        {!resultado && (
          <div className={styles.card}>
            <p className={styles.unidadeTitulo}>{unidade.titulo}</p>
            <GameMoment
              title={checkpoint.titulo}
              instructions={checkpoint.instructions}
              onComplete={handleComplete}
            >
              {({ reportResult }) => (
                <Jogo reportResult={reportResult} {...checkpoint.jogoProps} />
              )}
            </GameMoment>
          </div>
        )}

        {resultado === 'dominou' && (
          <div className={styles.desfecho} data-tipo="dominou">
            <span className={styles.desfechoEmoji}>🌟</span>
            <h2>Você mostrou domínio de &quot;{unidade.titulo}&quot;!</h2>
            <p>Isso conta pra sua trilha - pode seguir em frente tranquilo.</p>
            {proximoDestino ? (
              <ButtonPrimary onClick={() => navigate(proximoDestino)}>
                Continuar: {proxima.unidade.titulo}
              </ButtonPrimary>
            ) : (
              <ButtonPrimary onClick={() => navigate('/dashboard')}>
                Voltar ao início
              </ButtonPrimary>
            )}
          </div>
        )}

        {resultado === 'reforco' && (
          <div className={styles.desfecho} data-tipo="reforco">
            <span className={styles.desfechoEmoji}>🌱</span>
            <h2>Sem problemas, vamos praticar mais um pouco!</h2>
            <p>&quot;{unidade.titulo}&quot; vai continuar na sua trilha pra você treinar no seu tempo. Cada repetição ajuda a fixar com segurança! 💪</p>
            {proximoDestino ? (
              <ButtonPrimary onClick={() => navigate(proximoDestino)}>
                Continuar praticando: {proxima.unidade.titulo}
              </ButtonPrimary>
            ) : (
              <ButtonPrimary onClick={() => navigate('/dashboard')}>
                Voltar ao início
              </ButtonPrimary>
            )}
          </div>
        )}
      </main>
    </div>
  );
}