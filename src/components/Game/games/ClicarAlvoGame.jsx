// Mecânica genérica de CLIQUE. Cobre a maior parte do Módulo 1 (Mouse):
// identificar botão esquerdo/direito, clicar no ícone certo, escolher a
// opção certa num menu, duplo clique etc.
//
// Recebe uma lista de "alvos" clicáveis e só um deles é o correto. Você
// não escreve lógica nova - só monta a configuração:
//
//   // esquerdo vs. direito
//   <ClicarAlvoGame reportResult={reportResult} alvos={[
//     { id: 'esquerdo', label: '🖱️ Botão esquerdo', correto: true },
//     { id: 'direito',  label: '🖱️ Botão direito',  correto: false },
//   ]} />
//
//   // reconhecer o ícone certo entre vários
//   <ClicarAlvoGame reportResult={reportResult} alvos={[
//     { id: 'lixeira', label: '🗑️', correto: false },
//     { id: 'pasta',   label: '📁', correto: true },
//     { id: 'arquivo', label: '📄', correto: false },
//   ]} />
//
// Para "duplo clique", passe duploClique={true} - o alvo correto só
// conta se for clicado duas vezes rápido (o navegador já trata isso via
// onDoubleClick).
//
// Props:
//   reportResult (função, obrigatória) - vem do GameMoment
//   alvos (array, obrigatório) - cada item: { id, label, correto }
//     label pode ser texto, emoji, ou qualquer node simples
//   duploClique (bool, padrão false) - exige duplo clique no alvo certo
//   layout ('linha' | 'grade', padrão 'linha')

import { useState } from 'react';
import styles from './ClicarAlvoGame.module.css';

export function ClicarAlvoGame({
  reportResult,
  alvos,
  duploClique = false,
  layout = 'linha',
}) {
  // Guarda o id do último alvo clicado errado, só pra um feedback visual
  // rápido (pisca vermelho) - não impede novas tentativas.
  const [alvoErrado, setAlvoErrado] = useState(null);
  // Mesma ideia, só que pro alvo certo - fica destacado (não volta a
  // null), já que depois de acertar o GameMoment encerra a tentativa.
  const [alvoCerto, setAlvoCerto] = useState(null);

  const handleClique = (alvo) => {
    if (alvo.correto) {
      setAlvoCerto(alvo.id);
      reportResult(true, { alvoEscolhido: alvo.id });
      return;
    }

    setAlvoErrado(alvo.id);
    reportResult(false, { alvoEscolhido: alvo.id });
    setTimeout(() => setAlvoErrado(null), 400);
  };

  const eventoDeClique = duploClique ? 'onDoubleClick' : 'onClick';

  return (
    <div
      className={styles.grupo}
      data-layout={layout}
      role="group"
      aria-label="Escolha uma opção"
    >
      {alvos.map((alvo) => (
        <button
          key={alvo.id}
          type="button"
          className={`${styles.alvo} ${alvoErrado === alvo.id ? styles.erro : ''} ${alvoCerto === alvo.id ? styles.acerto : ''}`}
          {...{ [eventoDeClique]: () => handleClique(alvo) }}
        >
          {alvo.label}
        </button>
      ))}
    </div>
  );
}