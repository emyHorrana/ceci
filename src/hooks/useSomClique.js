// useSomClique.js
// Hook que devolve handlers de som de clique (onClick / onContextMenu)
// pra espalhar num container específico - ex: a área de um jogo.
//
// Antes esse hook escutava clique em QUALQUER lugar da aplicação (efeito
// sonoro global, ligado uma vez lá no App.jsx). Isso ficou irritante fora
// dos jogos, então agora ele só entrega os handlers prontos: quem usa
// decide ONDE colar. Hoje só dois lugares usam:
//   - GameMoment.jsx  -> cobre todos os jogos das lições
//   - Laboratorio.jsx -> cobre os 5 modos de treino livre
//
// COMO USAR
//   const somHandlers = useSomClique();
//   <div {...somHandlers}> ... jogo aqui dentro ... </div>
//
// Isso cobre os dois botões do mouse:
//   - onClick       -> botão ESQUERDO (o evento 'click' do DOM só
//                      dispara nele; o botão direito nunca gera 'click').
//   - onContextMenu -> botão DIREITO. É o mesmo evento que abriria o
//                      menu de opções do navegador, então já
//                      aproveitamos pra: (1) tocar o som e (2) cancelar
//                      esse menu (preventDefault). Como o handler fica
//                      no CONTAINER do jogo (não só em cima de cada
//                      alvo), o menu do navegador é bloqueado em
//                      qualquer clique direito dentro da área de jogo -
//                      inclusive quando a pessoa mira e erra o alvo.
//
// POR QUE UM SÓ <audio> REAPROVEITADO (em vez de "new Audio()" a cada
// clique)
//   - mais leve: não recria o objeto/decodifica o arquivo de novo a
//     cada clique;
//   - zerar currentTime antes de tocar permite cliques rápidos em
//     sequência sem esperar o som anterior terminar.
//
// SOBRE BLOQUEIO DE AUTOPLAY DO NAVEGADOR
// Alguns navegadores só permitem tocar áudio depois de uma interação do
// usuário. Como isso só toca em resposta a um clique (que já É uma
// interação), isso normalmente não é um problema - mas o .catch() abaixo
// existe pra garantir que, se algum navegador ainda bloquear, o app não
// quebra por isso.

import { useEffect, useMemo, useRef } from 'react';

const CAMINHO_SOM_CLIQUE = '/sons/clique-mouse.mp3';
const VOLUME_CLIQUE = 0.4;

export function useSomClique() {
    const audioRef = useRef(null);

    useEffect(() => {
        const audio = new Audio(CAMINHO_SOM_CLIQUE);
        audio.volume = VOLUME_CLIQUE;
        audioRef.current = audio;
    }, []);

    // useMemo (não useCallback) porque queremos o OBJETO de handlers
    // estável - ele é espalhado direto num JSX com {...somHandlers} -
    // sem isso o objeto seria recriado a cada render à toa.
    const somHandlers = useMemo(() => {
        const tocarClique = () => {
            const audioAtual = audioRef.current;
            if (!audioAtual) return;
            audioAtual.currentTime = 0;
            audioAtual.play().catch(() => {
                // Autoplay bloqueado ou arquivo ainda não carregou - não é
                // crítico pra experiência, então só ignora.
            });
        };

        return {
            onClick: tocarClique,
            onContextMenu: (e) => {
                e.preventDefault();
                tocarClique();
            },
        };
    }, []);

    return somHandlers;
}