// AjustarVolumeGame.jsx
// Mecânica de "aumentar e diminuir o som" - botões físicos - e +, não
// um slider/controle deslizante de software, porque é assim que
// caixas de som (e a maioria dos controles de volume físicos) de fato
// funcionam.
//
// Diferente das outras mecânicas: aqui não existe "clique errado" -
// tanto + quanto - são ações sempre válidas, só mudam o número. O
// objetivo é chegar EXATAMENTE no nível pedido, o que naturalmente
// ensina as duas direções: quem passa do ponto (ex: foi de 4 direto
// pra 7) precisa usar o - pra corrigir - e isso não conta como erro,
// é só ajuste, igual seria numa caixa de som de verdade.
//
// SOM DE VERDADE (não é só a animação das barrinhas)
// Um site NÃO tem como controlar o volume "mestre" do sistema
// operacional - isso é bloqueado por segurança do navegador, pra uma
// página não poder mexer no som do computador da pessoa escondido.
// O que dá pra fazer, e é o que este componente faz, é o mais perto
// possível disso: tocar um som de verdade (aqui, um tom suave gerado
// pela própria Web Audio API, sem precisar de nenhum arquivo de
// áudio) e ligar o volume REAL desse som aos botões - e +. A pessoa
// ouve, de verdade, pelas caixas de som ou fone do próprio
// computador, o som ficando mais alto e mais baixo, ao vivo, e não só
// vê um ícone mudando.
//
// O navegador só deixa iniciar áudio depois de uma ação da pessoa
// (clique, toque) - por isso o AudioContext só é criado dentro do
// primeiro clique em - ou +, nunca sozinho ao carregar a página.
//
// Props:
//   reportResult (função, obrigatória) - vem do GameMoment
//   alvo (número, obrigatório) - nível exato que a pessoa precisa alcançar
//   min (número, padrão 0)
//   max (número, padrão 10)

import { useState, useRef, useEffect } from 'react';
import styles from './AjustarVolumeGame.module.css';

// Volume real máximo (0 a 1) que o tom chega a tocar no nível `max` -
// bem abaixo de 1 de propósito, pra não arriscar um som alto demais
// mesmo com quem já estiver com o volume do sistema alto.
const GANHO_MAXIMO = 0.22;

// Um acorde suave (duas notas) em vez de um bipe único de teste de
// som - mais parecido com uma música tocando baixinho, menos com um
// alarme.
const FREQUENCIAS_HZ = [261.63, 329.63]; // Dó e Mi - acorde simples e agradável

export function AjustarVolumeGame({ reportResult, alvo, min = 0, max = 10 }) {
  const [nivel, setNivel] = useState(min);
  const [chegou, setChegou] = useState(false);
  const [tocando, setTocando] = useState(false);

  const audioRef = useRef(null); // { ctx, gainNode, osciladores[] }

  // Garante que o áudio de verdade para e é liberado ao sair da etapa
  // (trocar de mini-tópico, sair da página) - senão o tom continuaria
  // tocando escondido em segundo plano.
  useEffect(() => () => {
    const audio = audioRef.current;
    if (audio) {
      audio.osciladores.forEach((osc) => osc.stop());
      audio.ctx.close();
    }
  }, []);

  const iniciarAudioSeNecessario = () => {
    if (audioRef.current) return audioRef.current;

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const gainNode = ctx.createGain();
    gainNode.gain.value = 0; // começa mudo - o nível inicial é `min`
    gainNode.connect(ctx.destination);

    const osciladores = FREQUENCIAS_HZ.map((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(gainNode);
      osc.start();
      return osc;
    });

    const audio = { ctx, gainNode, osciladores };
    audioRef.current = audio;
    setTocando(true);
    return audio;
  };

  const aplicarGanhoReal = (novoNivel) => {
    const audio = iniciarAudioSeNecessario();
    if (audio.ctx.state === 'suspended') audio.ctx.resume();

    const proporcao = (novoNivel - min) / (max - min);
    const ganhoAlvo = proporcao * GANHO_MAXIMO;

    // setTargetAtTime em vez de trocar o valor seco - faz a transição
    // suave (uns 80ms), igual um controle de volume de verdade, em
    // vez de um "estalo" abrupto no som a cada clique.
    audio.gainNode.gain.setTargetAtTime(ganhoAlvo, audio.ctx.currentTime, 0.04);
  };

  const mudar = (delta) => {
    if (chegou) return;

    // reportResult (que atualiza o GameMoment pai) precisa ser chamado
    // no handler do clique, não dentro do updater funcional do
    // setNivel - senão o React tenta atualizar dois componentes na
    // mesma fase de render, o que ele não permite.
    const novo = Math.min(max, Math.max(min, nivel + delta));
    setNivel(novo);
    aplicarGanhoReal(novo);

    if (novo === alvo) {
      setChegou(true);
      reportResult(true, { nivelFinal: novo });

      // Ao concluir, some com o som aos poucos (fade out) em vez de
      // cortar seco - fica mais agradável no exato momento da
      // comemoração da Cecília.
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.gainNode.gain.setTargetAtTime(0, audioRef.current.ctx.currentTime, 0.6);
        }
      }, 900);
    }
  };

  const icone = nivel === min ? '🔇' : nivel < (max - min) / 2 ? '🔉' : '🔊';
  const barras = Array.from({ length: max - min }, (_, i) => i + 1);

  return (
    <div className={styles.wrapper}>
      {tocando && (
        <p className={styles.avisoSomReal}>
          🔈 Este som está tocando de verdade nas suas caixas de som ou fone agora.
        </p>
      )}

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
          -
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