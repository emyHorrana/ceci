// useSomTecla.js
// Hook irmão do useSomClique: toca um som ao apertar uma tecla,
// variando o som conforme a CATEGORIA da tecla (espaço / especial /
// normal) em vez de ter um arquivo por tecla individual.
//
// DIFERENÇA PRO useSomClique
//   - useSomClique devolve HANDLERS (onClick/onContextMenu) pra
//     espalhar num elemento -> só cobre cliques DENTRO dele.
//   - useSomTecla escuta 'keydown' direto na `window`, dentro de um
//     useEffect -> cobre a tecla apertada em qualquer lugar da
//     página enquanto o hook estiver MONTADO. Teclado não tem
//     "onde clicar", então não faz sentido pedir um container.
//   Por isso: chame useSomTecla() uma vez dentro do GameMoment (que
//   já só existe durante o "momento de jogo") - isso cobre todo jogo
//   de teclado automaticamente, sem tocar em cada jogo individual.

import { useEffect, useRef } from 'react';

const SONS_POR_CATEGORIA = {
    espaco: '/sons/tecla-espaco.mp3',
    especial: '/sons/tecla-especial.mp3',
    normal: '/sons/tecla-normal.mp3',
};

const VOLUME_TECLA = 0.4;

// Teclas que NÃO imprimem caractere (modificadoras, navegação, edição,
// função). Tudo que não é espaço nem está aqui vira "normal" (letras,
// números, pontuação).
const CODES_ESPECIAIS = new Set([
    'Enter', 'Backspace', 'Delete', 'Tab', 'Escape', 'CapsLock',
    'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight',
    'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight',
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
    'Home', 'End', 'PageUp', 'PageDown', 'Insert',
    'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
]);

function categorizarTecla(code) {
    if (code === 'Space') return 'espaco';
    if (CODES_ESPECIAIS.has(code)) return 'especial';
    return 'normal';
}

export function useSomTecla() {
    const audiosRef = useRef({});

    useEffect(() => {
        const audios = {};
        for (const [categoria, caminho] of Object.entries(SONS_POR_CATEGORIA)) {
            const audio = new Audio(caminho);
            audio.volume = VOLUME_TECLA;
            audios[categoria] = audio;
        }
        audiosRef.current = audios;
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const audio = audiosRef.current[categorizarTecla(e.code)];
            if (!audio) return;
            audio.currentTime = 0;
            audio.play().catch(() => {
                // autoplay bloqueado ou arquivo ainda carregando - ignora
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
}