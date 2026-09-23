// EspacoParaAvancar.jsx
// Ensina a pessoa que, sempre que a tela só tiver texto pra ler (sem
// nenhuma ação pra fazer), dá pra apertar uma tecla do teclado pra
// continuar, em vez de precisar achar e clicar num botão. Por padrão é
// a BARRA DE ESPAÇO, mas também serve pra tela de abertura do app, que
// usa a tecla ENTER (prop `tecla="enter"`) - ver fase 'intro' em
// pages/BoasVindas.jsx.
//
// Pensado especialmente pra quem "não faz a menor ideia" de mouse ou
// teclado ainda - por isso o teclado é desenhado por inteiro (não só a
// tecla solta), pra pessoa primeiro reconhecer o objeto e depois nós
// apontamos qual tecla importa agora. O desenho do teclado em si vive
// em components/Game/Teclado.jsx (compartilhado - por isso dá pra
// reaproveitar pra apontar o Enter aqui também, sem duplicar nada).
//
// NÃO TRAVA NINGUÉM: além de escutar a tecla certa, sempre existe um
// "ou clique aqui" discreto embaixo. Serve pra quem não encontrar a
// tecla, estiver num celular/tablet sem teclado físico, ou simplesmente
// preferir clicar - ninguém fica preso nesta tela.
//
// Props:
//   onAvancar (função, obrigatória) - chamada ao apertar a tecla OU ao
//     clicar no link alternativo
//   tecla ('espaco' | 'enter', opcional, padrão 'espaco') - qual tecla
//     ensinar/escutar nesta tela
//   mensagem (string, opcional) - texto explicativo acima do teclado,
//     substitui a mensagem padrão daquela tecla

import { useEffect } from 'react';
import { Teclado } from './Teclado';
import styles from './EspacoParaAvancar.module.css';

const CONFIG_TECLA = {
    espaco: {
        codes: ['Space'],
        mensagemPadrao:
            'Sempre que a tela tiver só texto pra ler, você pode apertar a barra de espaço (a tecla maior, bem embaixo) para continuar.',
    },
    enter: {
        codes: ['Enter', 'NumpadEnter'],
        mensagemPadrao:
            'Sempre que quiser confirmar e seguir para a próxima tela, você pode apertar a tecla Enter.',
    },
};

export function EspacoParaAvancar({ onAvancar, tecla = 'espaco', mensagem }) {
    const config = CONFIG_TECLA[tecla] ?? CONFIG_TECLA.espaco;

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (config.codes.includes(e.code)) {
                e.preventDefault();
                onAvancar();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onAvancar, config]);

    return (
        <div className={styles.wrapper}>
            <p className={styles.mensagem}>{mensagem || config.mensagemPadrao}</p>

            <Teclado teclaDestacada={tecla} />

            <button type="button" className={styles.fallback} onClick={onAvancar}>
                ou clique aqui para continuar
            </button>
        </div>
    );
}