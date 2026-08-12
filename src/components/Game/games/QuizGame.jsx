// QuizGame.jsx
// Mecânica de múltipla escolha: uma pergunta, N alternativas, uma
// certa. Não existia nenhuma mecânica de quiz de verdade - o
// PerguntaBinaria.jsx é outra coisa (bifurcação sem certo/errado, usa
// pra ramificar o onboarding), não serve pra isso.
//
// Pensada principalmente pro checkpoint de fim de Unidade (ver
// data/unidades.js e pages/UnidadeCheckpoint.jsx), mas é uma mecânica
// comum, então nada impede de virar uma etapa normal de mini-módulo
// no futuro (jogo: 'quiz' no registro de MiniModulo.jsx), se fizer
// sentido pra algum conteúdo.
//
// Props:
//   reportResult (função, obrigatória) - vem do GameMoment
//   pergunta (string, obrigatória)
//   alternativas (array, obrigatório) - cada item: { id, texto, correta }

import { useState } from 'react';
import styles from './QuizGame.module.css';

export function QuizGame({ reportResult, pergunta, alternativas }) {
  const [escolhaErrada, setEscolhaErrada] = useState(null);
  const [escolhaCerta, setEscolhaCerta] = useState(null);

  const escolher = (alternativa) => {
    if (escolhaCerta) return;

    if (alternativa.correta) {
      setEscolhaCerta(alternativa.id);
      reportResult(true, { alternativaEscolhida: alternativa.id });
      return;
    }

    setEscolhaErrada(alternativa.id);
    reportResult(false, { alternativaEscolhida: alternativa.id });
    setTimeout(() => setEscolhaErrada(null), 400);
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.pergunta}>{pergunta}</p>
      <div className={styles.alternativas}>
        {alternativas.map((alt) => (
          <button
            key={alt.id}
            type="button"
            className={`${styles.alternativa} ${escolhaErrada === alt.id ? styles.erro : ''} ${escolhaCerta === alt.id ? styles.acerto : ''}`}
            onClick={() => escolher(alt)}
            disabled={!!escolhaCerta}
          >
            {alt.texto}
          </button>
        ))}
      </div>
    </div>
  );
}