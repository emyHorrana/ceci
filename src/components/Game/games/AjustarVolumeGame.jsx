// AjustarVolumeGame.jsx
// Mecânica de "aumentar e diminuir o som" - botões físicos − e +, não
// um slider/controle deslizante de software, porque é assim que
// caixas de som (e a maioria dos controles de volume físicos) de fato
// funcionam.
//
// Diferente das outras mecânicas: aqui não existe "clique errado" -
// tanto + quanto − são ações sempre válidas, só mudam o número. O
// objetivo é chegar EXATAMENTE no nível pedido, o que naturalmente
// ensina as duas direções: quem passa do ponto (ex: foi de 4 direto
// pra 7) precisa usar o − pra corrigir - e isso não conta como erro,
// é só ajuste, igual seria numa caixa de som de verdade.
//
// Props:
//   reportResult (função, obrigatória) - vem do GameMoment
//   alvo (número, obrigatório) - nível exato que a pessoa precisa alcançar
//   min (número, padrão 0)
//   max (número, padrão 10)

import { useState } from 'react';
import styles from './AjustarVolumeGame.module.css';

export function AjustarVolumeGame({ reportResult, alvo, min = 0, max = 10 }) {
  const [nivel, setNivel] = useState(min);
  const [chegou, setChegou] = useState(false);

  const mudar = (delta) => {
    if (chegou) return;

    // reportResult (que atualiza o GameMoment pai) precisa ser chamado
    // no handler do clique, não dentro do updater funcional do
    // setNivel - senão o React tenta atualizar dois componentes na
    // mesma fase de render, o que ele não permite.
    const novo = Math.min(max, Math.max(min, nivel + delta));
    setNivel(novo);

    if (novo === alvo) {
      setChegou(true);
      reportResult(true, { nivelFinal: novo });
    }
  };

  const icone = nivel === min ? '🔇' : nivel < (max - min) / 2 ? '🔉' : '🔊';
  const barras = Array.from({ length: max - min }, (_, i) => i + 1);

  return (
    <div className={styles.wrapper}>
      <div className={styles.painel} data-completo={chegou}>
        <span className={styles.icone} aria-hidden>{icone}</span>

        <div className={styles.barras} role="img" aria-label={`Volume no nível ${nivel} de ${max}`}>
          {barras.map((b) => (
            <span
              key={b}
              className={styles.barra}
              data-ativa={b <= nivel}
              style={{ height: `${25 + b * (60 / barras.length)}%` }}
            />
          ))}
        </div>

        <span className={styles.numero}>{nivel}</span>
      </div>

      <div className={styles.controles}>
        <button
          type="button"
          className={styles.botao}
          onClick={() => mudar(-1)}
          disabled={chegou || nivel <= min}
          aria-label="Diminuir volume"
        >
          −
        </button>
        <button
          type="button"
          className={styles.botao}
          onClick={() => mudar(1)}
          disabled={chegou || nivel >= max}
          aria-label="Aumentar volume"
        >
          +
        </button>
      </div>
    </div>
  );
}