// PerguntaBinaria.jsx
// Pergunta de BIFURCAÇÃO - as duas opções são válidas, cada uma leva a
// um caminho diferente na trilha (não existe resposta "certa"). Por
// isso este componente NÃO passa pelo GameMoment: não há tentativa,
// "quase lá!" ou "pular" aqui - é só uma escolha.
//
// Pensado pra perguntas tipo "você já usa mouse no dia a dia?", onde
// tratar "ainda não" como um erro a corrigir iria contra o cuidado de
// vocês em não constranger ninguém.
//
// Uso:
//   <PerguntaBinaria
//     pergunta="Você já usa o mouse no dia a dia?"
//     opcaoSim="Sim, já uso"
//     opcaoNao="Ainda não sei bem"
//     onResposta={(resposta) => { ... }} // 'sim' | 'nao'
//   />
//
// Props:
//   pergunta   (string, obrigatório)
//   opcaoSim   (string, opcional, padrão 'Sim')
//   opcaoNao   (string, opcional, padrão 'Ainda não')
//   onResposta (função, obrigatória) - recebe 'sim' ou 'nao'

import { ButtonPrimary } from '../Buttons/ButtonPrimary';
import { ButtonOutline } from '../Buttons/ButtonOutline';
import styles from './PerguntaBinaria.module.css';

export function PerguntaBinaria({
  pergunta,
  opcaoSim = 'Sim',
  opcaoNao = 'Ainda não',
  onResposta,
}) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.pergunta}>{pergunta}</p>
      <div className={styles.opcoes}>
        <ButtonPrimary onClick={() => onResposta('sim')}>
          {opcaoSim}
        </ButtonPrimary>
        <ButtonOutline onClick={() => onResposta('nao')}>
          {opcaoNao}
        </ButtonOutline>
      </div>
    </div>
  );
}