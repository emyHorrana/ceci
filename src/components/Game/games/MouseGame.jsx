// MouseGame.jsx
// Cena: mouse visto de cima, para o reconhecimento de partes (Módulo 1,
// mini-módulo "Reconhecendo o mouse"). Segue o mesmo padrão de
// GabineteFrenteGame.jsx: usa ClicarNaImagemGame por baixo, só troca a
// ilustração e os alvos.
//
// Por que um `alvoCorreto` em vez de 3 componentes separados: cada etapa
// de jogo passa qual parte é a certa (ver data/modulos.js, mini-módulo
// '1-1'), assim o MESMO componente serve pra "clique no botão esquerdo",
// "clique no botão direito" e "clique na roda" - cada um logo depois do
// texto que fala daquela parte específica, em vez de um único jogo no
// fim testando as três de uma vez.
//
// Tamanho reduzido de propósito: viewBox pequeno + max-width no CSS
// (ver MouseGame.module.css), pra que a mensagem de incentivo da Ceci
// (que o GameMoment mostra logo abaixo) caiba na tela sem precisar
// descer a página.
//
// Props:
//   reportResult (função, obrigatória) - vem do GameMoment
//   alvoCorreto ('esquerdo' | 'direito' | 'roda', obrigatório)

import { ClicarNaImagemGame } from './ClicarNaImagemGame';
import styles from './MouseGame.module.css';

const VIEW_BOX = '0 0 200 260';

const ROTULOS = {
  esquerdo: 'Botão esquerdo',
  direito: 'Botão direito',
  roda: 'Roda (scroll)',
};

function construirAlvos(alvoCorreto) {
  return [
    {
      id: 'esquerdo',
      shape: 'rect',
      x: 18, y: 22, width: 66, height: 110, rx: 32,
      rotuloAcessivel: ROTULOS.esquerdo,
      correto: alvoCorreto === 'esquerdo',
    },
    {
      id: 'direito',
      shape: 'rect',
      x: 116, y: 22, width: 66, height: 110, rx: 32,
      rotuloAcessivel: ROTULOS.direito,
      correto: alvoCorreto === 'direito',
    },
    {
      id: 'roda',
      shape: 'rect',
      x: 88, y: 32, width: 24, height: 50, rx: 12,
      rotuloAcessivel: ROTULOS.roda,
      correto: alvoCorreto === 'roda',
    },
  ];
}

export function MouseGame({ reportResult, alvoCorreto }) {
  return (
    <div className={styles.wrapper}>
      <ClicarNaImagemGame
        reportResult={reportResult}
        viewBox={VIEW_BOX}
        alvos={construirAlvos(alvoCorreto)}
      >
        {/* Corpo do mouse */}
        <path
          d="M 100 18 C 46 18, 18 62, 18 132 L 18 200 C 18 230, 46 246, 100 246
             C 154 246, 182 230, 182 200 L 182 132 C 182 62, 154 18, 100 18 Z"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          strokeWidth="4"
        />

        {/* Linha divisória entre os botões esquerdo/direito (decorativa) */}
        <line x1="100" y1="18" x2="100" y2="132" stroke="var(--color-border)" strokeWidth="3" />

        {/* Roda (decorativa - o alvo clicável é o rect transparente por
            cima, desenhado por ClicarNaImagemGame a partir de ALVOS) */}
        <rect x="88" y="32" width="24" height="50" rx="12" fill="var(--color-yellow-light)" />
      </ClicarNaImagemGame>
    </div>
  );
}