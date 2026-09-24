// Mascote.jsx
// Único lugar do projeto que sabe QUAL arte da Ceci usar e COMO ela é
// enquadrada. Antes, cada tela (Login, MiniModulo, BoasVindas, GameMoment)
// tinha seu próprio <img src="/mascote-ceci.png"> + um "remendo" de
// tamanho/recorte (width: 125%, translateX negativo, overflow: hidden) que
// compensava o enquadramento da arte antiga. Quando a arte mudou, cada
// remendo passou a cortar a Ceci de um jeito diferente. Agora:
//
//   - a imagem SEMPRE aparece inteira (object-fit: contain, sem recorte);
//   - quem decide o tamanho é o elemento PAI (o "slot"): o <Mascote>
//     ocupa 100% de largura/altura dele. Pra mudar o tamanho da Ceci
//     numa tela, mexe só no slot daquela tela.
//
// VARIANTES (uma por "estado emocional" da Ceci)
//   padrao  → /mascote-ceci.png  (boas-vindas, login, saudações)
//   duvida  → /ceci-duvida.png   (lendo conteúdo / esperando resposta)
//   acerto  → /ceci-acerto.png   (a pessoa acertou)
//   sorrindo → /ceci-sorrindo.png (corpo inteiro, sorrindo - arte grande
//             de destaque, ex: lateral da tela de Conquistas)
//
// As artes ficam em /public. Se uma arte nova ainda não estiver lá
// (ou falhar ao carregar), cai automaticamente na arte padrão em vez de
// mostrar imagem quebrada.

import styles from './Mascote.module.css';

const MASCOTE_SRC = {
    padrao: '/mascote-ceci.png',
    duvida: '/ceci-duvida.png',
    acerto: '/ceci-acerto.png',
    sorrindo: '/ceci-sorrindo.png',
};

export function Mascote({ variante = 'padrao', alt = '', className = '' }) {
    const src = MASCOTE_SRC[variante] ?? MASCOTE_SRC.padrao;

    return (
        <img
            src={src}
            alt={alt}
            className={`${styles.mascote} ${className}`.trim()}
            draggable={false}
            onError={(e) => {
                const fallback = MASCOTE_SRC.padrao;
                // evita loop infinito caso a própria arte padrão falhe
                if (!e.currentTarget.src.endsWith(fallback)) {
                    e.currentTarget.src = fallback;
                }
            }}
        />
    );
}