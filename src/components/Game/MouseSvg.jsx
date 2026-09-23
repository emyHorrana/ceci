// MouseSvg.jsx
// Desenho ESTÁTICO de um mouse, com o botão esquerdo destacado (pulso
// suave) - mesmo papel do TecladoSvg/Teclado: só mostra, não reage a
// clique de verdade. Usado na coluna lateral fixa do onboarding (ver
// nota "DICAS FIXAS NA LATERAL" em pages/BoasVindas.jsx), a partir da
// fase 'pergunta-mouse' - antes de qualquer pergunta que já exija
// clicar - por isso não pode ser um jogo/demonstração interativa, só
// uma ilustração.
//
// Reaproveita a MESMA geometria (viewBox, paths do corpo/botões/roda)
// do mouse "de verdade" em components/Game/games/MouseDemonstracaoGame.jsx,
// pra manter os dois desenhos consistentes entre si.

import styles from './MouseSvg.module.css';

export function MouseSvg({ maxWidth = '150px', className, style }) {
    return (
        <svg
            viewBox="0 0 200 260"
            className={`${styles.mouseSvg} ${className || ''}`.trim()}
            style={{ maxWidth, ...style }}
            role="img"
            aria-label="Desenho de um mouse, com o botão esquerdo destacado"
        >
            {/* Corpo do mouse */}
            <path
                d="M 100 18 C 46 18, 18 62, 18 132 L 18 200 C 18 230, 46 246, 100 246 C 154 246, 182 230, 182 200 L 182 132 C 182 62, 154 18, 100 18 Z"
                className={styles.corpo}
            />

            {/* Botão esquerdo - o único destacado, com pulso, porque é o único
      que a pessoa precisa saber usar agora. */}
            <path
                d="M 100 18 C 46 18, 18 62, 18 132 L 95 132 L 95 18 Z"
                className={styles.botaoEsquerdo}
            />

            {/* Botão direito - desenhado só pra completar a forma do mouse,
      sem destaque nenhum (não é o assunto deste card). */}
            <path
                d="M 100 18 C 154 18, 182 62, 182 132 L 105 132 L 105 18 Z"
                className={styles.botaoDireito}
            />

            {/* Linha central divisória entre os dois botões */}
            <line x1="100" y1="18" x2="100" y2="132" className={styles.linhaDivisoria} />

            {/* Rodinha (scroll) */}
            <rect x="88" y="36" width="24" height="52" rx="12" className={styles.scroll} />
        </svg>
    );
}