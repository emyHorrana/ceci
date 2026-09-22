// Laboratorio.jsx
// Área de prática livre e infinita - NÃO faz parte da trilha de módulos.
//
// PARA QUE SERVE
// Concluir um módulo não significa que a coordenação motora (mouse/
// teclado) já está automática. O Laboratório existe pra treino livre,
// sem fim, sem "aprovação" - a pessoa entra quando quiser e pratica o
// quanto quiser. Por isso NÃO usa GameMoment (que é feito pra terminar
// num acerto/pulo) nem grava em ProgressContext/progresso oficial - só
// mede um placar local, pra dar sensação de evolução entre visitas.
//
// COMO FUNCIONA
// Reaproveita 100% dos componentes de jogo que já existem
// (AlvoMovelGame, PressionarTeclaGame) - eles não sabem nada sobre
// módulo/lição, só recebem reportResult(sucesso). O truque pra virar
// "infinito" é remontar o jogo com uma `key` nova a cada rodada (força
// o React a resetar o estado interno dele sozinho, sem tocar no
// código do jogo em si).
//
// PLACAR
// Guardado em localStorage (não em Supabase) de propósito - é só um
// número motivacional de treino livre, não faz sentido gastar uma
// tabela/rota nova pra isso agora. Se um dia isso precisar aparecer em
// outro lugar (ex: perfil, conquistas), aí sim vale migrar pro banco.

import { useContext, useState, useCallback, useMemo } from 'react';
import { UserContext } from '../context/UserContext';
import { AppLayout, PageHeader } from '../components/Layout/AppLayout';
import appStyles from '../components/Layout/AppLayout.module.css';
import { AlvoMovelGame } from '../components/Game/games/AlvoMovelGame';
import { PressionarTeclaGame } from '../components/Game/games/PressionarTeclaGame';
import styles from './Laboratorio.module.css';

const TECLAS_TREINO = [
    'espaco', 'enter', 'backspace', 'delete', 'esc', 'tab',
    'seta-cima', 'seta-baixo', 'seta-esquerda', 'seta-direita',
];

const MODOS = {
    mouse: {
        label: 'Mira com o mouse',
        instrucao: 'Clique no alvo assim que conseguir alcançar ele.',
    },
    teclado: {
        label: 'Tecla certa',
        instrucao: 'Aperte a tecla mostrada no teclado abaixo.',
    },
};

function chaveRecorde(userId, modo) {
    return `ceci:laboratorio:${userId || 'convidado'}:${modo}`;
}

function lerRecorde(userId, modo) {
    const bruto = localStorage.getItem(chaveRecorde(userId, modo));
    return bruto ? parseInt(bruto, 10) || 0 : 0;
}

function salvarRecorde(userId, modo, valor) {
    localStorage.setItem(chaveRecorde(userId, modo), String(valor));
}

function sortearTecla(anterior) {
    // Evita repetir a mesma tecla duas vezes seguidas, senão a rodada
    // "infinita" fica repetitiva rápido demais.
    const opcoes = TECLAS_TREINO.filter((t) => t !== anterior);
    return opcoes[Math.floor(Math.random() * opcoes.length)];
}

export default function Laboratorio() {
    const { user } = useContext(UserContext);
    const userId = user?.id;

    const [modo, setModo] = useState('mouse');
    const [rodada, setRodada] = useState(0);
    const [acertosSessao, setAcertosSessao] = useState(0);
    const [teclaAtual, setTeclaAtual] = useState(() => sortearTecla(null));
    const [recorde, setRecorde] = useState(() => lerRecorde(userId, 'mouse'));

    const trocarModo = useCallback((novoModo) => {
        setModo(novoModo);
        setRodada(0);
        setAcertosSessao(0);
        setRecorde(lerRecorde(userId, novoModo));
        if (novoModo === 'teclado') setTeclaAtual(sortearTecla(null));
    }, [userId]);

    const handleResultado = useCallback((sucesso) => {
        if (!sucesso) return; // AlvoMovelGame/PressionarTeclaGame só chamam com true nesse uso

        const novoTotal = acertosSessao + 1;
        setAcertosSessao(novoTotal);
        setRodada((r) => r + 1);

        if (novoTotal > recorde) {
            setRecorde(novoTotal);
            salvarRecorde(userId, modo, novoTotal);
        }

        if (modo === 'teclado') {
            setTeclaAtual((atual) => sortearTecla(atual));
        }
    }, [acertosSessao, recorde, modo, userId]);

    const modoInfo = MODOS[modo];

    // key troca a cada rodada -> força o React a remontar o jogo do zero
    // (posição nova do alvo / tecla nova / estado "capturado" resetado),
    // sem precisar de nenhuma prop de reset nos componentes originais.
    const gameKey = modo === 'mouse' ? `mouse-${rodada}` : `teclado-${teclaAtual}-${rodada}`;

    return (
        <AppLayout>
            <PageHeader>
                <div>
                    <h1 className={styles.title}>Laboratório</h1>
                    <p className={styles.subtitle}>Treino livre de mouse e teclado - sem pressa, sem fim.</p>
                </div>
            </PageHeader>

            <div className={appStyles.pageContent}>
                <div className={styles.tabs}>
                    {Object.entries(MODOS).map(([chave, info]) => (
                        <button
                            key={chave}
                            type="button"
                            className={`${styles.tab} ${modo === chave ? styles.tabActive : ''}`}
                            onClick={() => trocarModo(chave)}
                        >
                            {info.label}
                        </button>
                    ))}
                </div>

                <div className={styles.scoreRow}>
                    <div className={styles.scoreChip}>
                        <span className={styles.scoreLabel}>Nesta sessão</span>
                        <span className={styles.scoreValue}>{acertosSessao}</span>
                    </div>
                    <div className={styles.scoreChip}>
                        <span className={styles.scoreLabel}>Seu recorde</span>
                        <span className={styles.scoreValue}>{recorde}</span>
                    </div>
                </div>

                <div className={styles.arena}>
                    <p className={styles.instrucao}>{modoInfo.instrucao}</p>

                    {modo === 'mouse' && (
                        <AlvoMovelGame key={gameKey} reportResult={handleResultado} />
                    )}

                    {modo === 'teclado' && (
                        <PressionarTeclaGame key={gameKey} reportResult={handleResultado} tecla={teclaAtual} />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}