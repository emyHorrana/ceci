/**
 * UnidadeCheckpoint.jsx
 * Desafio de fim de Unidade - um jogo um pouco mais difícil (associação
 * ou quiz, ver data/unidades.js) que dá o veredito de domínio daquela
 * Unidade inteira, não de um mini-módulo isolado.
 *
 * IMPORTANTE (mesmo espírito do resto do projeto até aqui): isso é só
 * o FLUXO. Ainda não está ligado a nenhuma fila de pendências real nem
 * ao algoritmo adaptativo (isso é trabalho de integração à parte, já
 * encarregado). O resultado (domínio / precisa de reforço) por
 * enquanto só fica guardado no localStorage do navegador, pra já dar
 * pra testar o fluxo inteiro sem depender de back-end - trocar por uma
 * fonte real quando a integração existir (ver
 * services/checkpointService.js).
 *
 * Rota: /unidade/:unidadeId/checkpoint
 */

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UNIDADES } from '../data/unidades';
import { GameMoment } from '../components/Game/GameMoment';
import { ArrastarSoltarGame } from '../components/Game/games/ArrastarSoltarGame';
import { QuizGame } from '../components/Game/games/QuizGame';
import { ButtonPrimary } from '../components/Buttons/ButtonPrimary';
import { ButtonOutline } from '../components/Buttons/ButtonOutline';
import { registrarResultadoCheckpoint } from '../services/checkpointService';
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
  const [resultado, setResultado] = useState(null);

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

  const handleComplete = (res) => {
    const dominou = res.success;
    registrarResultadoCheckpoint(unidade.id, dominou, { attempts: res.attempts, sinais: res.sinais });
    setResultado(dominou ? 'dominou' : 'reforco');
  };

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
            <ButtonPrimary onClick={() => navigate('/dashboard')}>
              Voltar ao início
            </ButtonPrimary>
          </div>
        )}

        {resultado === 'reforco' && (
          <div className={styles.desfecho} data-tipo="reforco">
            <span className={styles.desfechoEmoji}>🌱</span>
            <h2>Sem problemas, vamos reforçar isso</h2>
            <p>&quot;{unidade.titulo}&quot; vai ficar marcada pra você revisar - não é o fim, é só mais uma volta.</p>
            <ButtonPrimary onClick={() => navigate('/dashboard')}>
              Voltar ao início
            </ButtonPrimary>
          </div>
        )}
      </main>
    </div>
  );
}