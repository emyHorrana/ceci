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
// Reaproveita 100% dos componentes de jogo que já existem (AlvoMovelGame,
// PressionarTeclaGame) mais os dois novos feitos pra cá (TreinoDedosGame,
// DesenhoLivreGame) - nenhum deles sabe nada sobre módulo/lição, só
// recebem reportResult(sucesso, meta). O truque pra virar "infinito" é
// remontar o jogo com uma `key` nova a cada rodada (força o React a
// resetar o estado interno dele sozinho, sem tocar no código do jogo).
//
// PLACAR
// Guardado em localStorage (não em Supabase) de propósito - é só um
// número motivacional de treino livre, não faz sentido gastar uma
// tabela/rota nova pra isso agora. Cada modo tem sua própria métrica de
// "recorde" (ver valorParaRecorde) porque nem todo jogo aqui é do tipo
// "acertos em sequência" - Treino de dedos usa palavras/minuto, Desenho
// usa % de perfeição.
//
// POR QUE DOIS COMPONENTES (Laboratorio + LaboratorioConteudo)
// user.id só fica disponível depois que o UserContext termina de
// restaurar a sessão (assíncrono - mesmo `initializing` que o
// Dashboard.jsx já trata). Se o estado do recorde nascesse direto
// aqui, o primeiro render aconteceria com userId ainda undefined, e a
// leitura inicial do localStorage pegaria a chave de "convidado" em
// vez da chave de verdade - o recorde "sumia" até a próxima troca de
// aba (foi exatamente o bug reportado). Em vez de tentar corrigir isso
// com um useEffect + setState (o eslint do projeto rejeita esse
// padrão - cascata de renders), o jeito idiomático é só montar
// LaboratorioConteudo DEPOIS que a sessão carregou, igual o Dashboard
// já faz com o `if (initializing) return ...`. Assim, quando os hooks
// de LaboratorioConteudo rodam pela primeira vez, userId já é o valor
// final - nunca precisa ser corrigido depois.

import { useContext, useState, useCallback } from 'react';
import { UserContext } from '../context/UserContext';
import { AppLayout, PageHeader } from '../components/Layout/AppLayout';
import appStyles from '../components/Layout/AppLayout.module.css';
import { AlvoMovelGame } from '../components/Game/games/AlvoMovelGame';
import { PressionarTeclaGame } from '../components/Game/games/PressionarTeclaGame';
import { TreinoDedosGame } from '../components/Game/games/TreinoDedosGame';
import { DesenhoLivreGame } from '../components/Game/games/DesenhoLivreGame';
import { FASES_TREINO_DEDOS } from '../data/treinoDedosFases';
import { sortearFigura } from '../utils/figurasCanvas';
import styles from './Laboratorio.module.css';

const TECLAS_TREINO = [
    'espaco', 'enter', 'backspace', 'delete', 'esc', 'tab',
    'seta-cima', 'seta-baixo', 'seta-esquerda', 'seta-direita',
];

// Só esquerdo/direito, nunca duplo clique - o Laboratório é treino
// livre, não devia introduzir uma mecânica mais difícil (duplo clique)
// sem essa pessoa ter escolhido treinar isso especificamente.
const TIPOS_CLIQUE = ['esquerdo', 'direito'];

const MODOS = {
    mouse: {
        label: 'Mira com o mouse',
        instrucaoPara: (tipoClique) => tipoClique === 'direito'
            ? 'Clique com o botão DIREITO no alvo assim que conseguir alcançar ele.'
            : 'Clique com o botão ESQUERDO no alvo assim que conseguir alcançar ele.',
        metricaSessao: 'Nesta sessão',
        metricaRecorde: 'Seu recorde',
    },
    teclado: {
        label: 'Tecla certa',
        instrucaoPara: () => 'Aperte a tecla mostrada no teclado abaixo.',
        metricaSessao: 'Nesta sessão',
        metricaRecorde: 'Seu recorde',
    },
    dedos: {
        label: 'Treino de dedos',
        instrucaoPara: () => 'Digite o texto abaixo. A dica mostra qual dedo usar em cada tecla.',
        metricaSessao: 'Textos concluídos',
        metricaRecorde: 'Melhor palavras/min',
    },
    desenho: {
        label: 'Desenho livre',
        instrucaoPara: () => 'Clique e arraste pra pintar dentro da figura. Use a borracha pra corrigir.',
        metricaSessao: 'Desenhos concluídos',
        metricaRecorde: 'Melhor perfeição',
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

function sortearDaLista(lista, anterior) {
    const opcoes = lista.filter((item) => item !== anterior);
    return opcoes[Math.floor(Math.random() * opcoes.length)];
}

// Pra cada modo, decide qual valor vira "recorde" a partir do
// resultado da rodada - nem sempre é a contagem de acertos (ver
// comentário no topo do arquivo).
function valorParaRecorde(modo, novaContagem, meta) {
    if (modo === 'dedos') return meta?.ppm ?? 0;
    if (modo === 'desenho') return meta?.perfeicao ?? 0;
    return novaContagem;
}

export default function Laboratorio() {
    // initializing: ver comentário grande no topo do arquivo - é o que
    // garante que LaboratorioConteudo só nasce com o userId definitivo.
    const { user, initializing } = useContext(UserContext);

    if (initializing) {
        return (
            <AppLayout>
                <PageHeader>
                    <div>
                        <h1 className={styles.title}>Laboratório</h1>
                        <p className={styles.subtitle}>Treino livre de mouse e teclado - sem pressa, sem fim.</p>
                    </div>
                </PageHeader>
                <div className={appStyles.pageContent}>Carregando...</div>
            </AppLayout>
        );
    }

    return <LaboratorioConteudo userId={user?.id} />;
}

function LaboratorioConteudo({ userId }) {
    const [modo, setModo] = useState('mouse');
    const [rodada, setRodada] = useState(0);
    const [acertosSessao, setAcertosSessao] = useState(0);
    const [teclaAtual, setTeclaAtual] = useState(() => sortearDaLista(TECLAS_TREINO, null));
    const [tipoCliqueAtual, setTipoCliqueAtual] = useState(() => sortearDaLista(TIPOS_CLIQUE, null));
    const [figuraAtual, setFiguraAtual] = useState(() => sortearFigura(null));
    // Seguro ler direto aqui agora - userId já chega definitivo (ver
    // comentário no componente Laboratorio, acima).
    const [recorde, setRecorde] = useState(() => lerRecorde(userId, 'mouse'));

    const trocarModo = useCallback((novoModo) => {
        setModo(novoModo);
        setRodada(0);
        setAcertosSessao(0);
        setRecorde(lerRecorde(userId, novoModo));
        if (novoModo === 'teclado') setTeclaAtual(sortearDaLista(TECLAS_TREINO, null));
        if (novoModo === 'mouse') setTipoCliqueAtual(sortearDaLista(TIPOS_CLIQUE, null));
        if (novoModo === 'desenho') setFiguraAtual(sortearFigura(null));
    }, [userId]);

    const handleResultado = useCallback((sucesso, meta) => {
        if (!sucesso) return; // tentativa errada em "Tecla certa" chama com false - não avança rodada

        const novaContagem = acertosSessao + 1;
        setAcertosSessao(novaContagem);
        setRodada((r) => r + 1);

        const valorRecorde = valorParaRecorde(modo, novaContagem, meta);
        if (valorRecorde > recorde) {
            setRecorde(valorRecorde);
            salvarRecorde(userId, modo, valorRecorde);
        }

        if (modo === 'teclado') setTeclaAtual((atual) => sortearDaLista(TECLAS_TREINO, atual));
        if (modo === 'mouse') setTipoCliqueAtual((atual) => sortearDaLista(TIPOS_CLIQUE, atual));
        if (modo === 'desenho') setFiguraAtual((atual) => sortearFigura(atual));
    }, [acertosSessao, recorde, modo, userId]);

    const modoInfo = MODOS[modo];
    const textoTreinoDedos = FASES_TREINO_DEDOS[rodada % FASES_TREINO_DEDOS.length].texto;

    // key troca a cada rodada -> força o React a remontar o jogo do zero
    // (posição nova do alvo / tecla nova / figura nova / estado interno
    // resetado), sem precisar de nenhuma prop de reset nos jogos em si.
    const gameKey = `${modo}-${rodada}`;

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
                        <span className={styles.scoreLabel}>{modoInfo.metricaSessao}</span>
                        <span className={styles.scoreValue}>{acertosSessao}</span>
                    </div>
                    <div className={styles.scoreChip}>
                        <span className={styles.scoreLabel}>{modoInfo.metricaRecorde}</span>
                        <span className={styles.scoreValue}>{recorde}</span>
                    </div>
                </div>

                <div className={styles.arena}>
                    <p className={styles.instrucao}>
                        {modo === 'mouse' ? modoInfo.instrucaoPara(tipoCliqueAtual) : modoInfo.instrucaoPara()}
                    </p>

                    <div className={styles.gameHost}>
                        {modo === 'mouse' && (
                            <AlvoMovelGame
                                key={gameKey}
                                reportResult={handleResultado}
                                tipoClique={tipoCliqueAtual}
                                duploClique={false}
                            />
                        )}

                        {modo === 'teclado' && (
                            <PressionarTeclaGame key={gameKey} reportResult={handleResultado} tecla={teclaAtual} />
                        )}

                        {modo === 'dedos' && (
                            <TreinoDedosGame key={gameKey} reportResult={handleResultado} texto={textoTreinoDedos} />
                        )}

                        {modo === 'desenho' && (
                            <DesenhoLivreGame key={gameKey} reportResult={handleResultado} figura={figuraAtual} />
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}