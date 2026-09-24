// GameTrilha.jsx
// Mapa da trilha de aprendizagem (Módulo → Unidade → mini-módulos), usado
// no Dashboard. Estilo "mapa de fases": cada Unidade tem um banner com o
// título e, embaixo, uma trilha de nós circulares ligados por uma linha
// pontilhada - um nó por mini-módulo + um nó de checkpoint (troféu) no fim.
//
// Cada MÓDULO é uma RetroWindow (card grande e único da seção - aqui a
// barra de título faz sentido, e o título é o nome real do módulo, sem
// ".exe"). Dentro dela o miolo é só o container das Unidades
// (styles.unidadesContainer).
//
// Props:
//   unidadesPorModulo       - UNIDADES_POR_MODULO (data/unidades.js):
//                             [{ moduloId, moduloEmoji, moduloTitulo, unidades }]
//   unidadeRecomendada      - Unidade que o algoritmo adaptativo recomenda
//                             agora (objeto de UNIDADES) ou null. Ganha o
//                             banner destacado e o nó "ativo" (pulsando),
//                             que recebe id="no-trilha-atual" - o Dashboard
//                             rola até ele no botão "Ver na trilha".
//   dominiosPorUnidade      - { [unidadeId]: 0..1 } domínio (BKT) já registrado
//   origemPorUnidade        - { [unidadeId]: 'licao' | 'onboarding' }.
//                             'onboarding' = a pessoa nunca abriu a Unidade,
//                             só foi confirmada pelo desafio de verificação
//                             da boas-vindas -> NÃO ocupa nó na trilha (o
//                             aviso dela mora em pages/Modulos.jsx).
//   miniModulosComAtividade - ids de mini-módulos já praticados de verdade
//   limiar                  - domínio mínimo pra considerar a Unidade
//                             dominada (padrão 0.5)
//   modoAdmin               - conta ADM: trilha inteira liberada, nada
//                             bloqueado (não grava progresso)
//
// Estados de cada nó:
//   'ativo'      - próximo passo da Unidade recomendada (rosa Ceci, pulsando)
//   'concluido'  - mini-módulo já praticado / Unidade dominada (amarelo)
//   'disponivel' - acessível, ainda não feito (roxo Ceci)
//   'bloqueado'  - pré-requisito da Unidade ainda não dominado (lilás apagado)
//
// Clicar num nó abre um popover com o título e a ação (começar/rever), ou
// com o aviso do que falta pra liberar, se estiver bloqueado.

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RetroWindow } from '../Window/RetroWindow';
import { ButtonPrimary } from '../Buttons/ButtonPrimary';
import { UNIDADES, estaDominada } from '../../data/unidades';
import styles from './GameTrilha.module.css';

// --- Geometria da trilha -------------------------------------------------
// x em % da largura (o SVG usa viewBox 0-100 na horizontal), y em px.
// Zigue-zague suave: nunca muito perto das bordas, pra o popover (250px)
// não ser cortado pela moldura da janela no celular.
const POSICOES_X = [50, 66, 50, 34];
const TOPO_Y = 78;      // centro do 1º nó: ~40px de ar entre o título e o topo do nó (cabe a tag "JOGAR")
const PASSO_Y = 150;    // distância vertical entre nós (nó + rótulo)
const RODAPE_Y = 110;   // do centro do último nó até o fim da Unidade (rótulo + ~35px; o gap entre Unidades soma ~40px)
const EXTRA_POPOVER = 140; // folga extra quando o popover abre no fim do módulo

const ACENTOS_MODULO = ['purple', 'pink', 'yellow'];

const CLASSE_STATUS = {
    ativo: styles.nodeAtivo,
    concluido: styles.nodeConcluido,
    disponivel: styles.nodeDisponivel,
    bloqueado: styles.nodeBloqueado,
};

const TEXTO_STATUS = {
    ativo: 'próximo passo',
    concluido: 'concluído',
    disponivel: 'disponível',
    bloqueado: 'bloqueado',
};

// Ícones SVG (contorno preto, sem cor) que substituem os números dos nós.
// Um por módulo (mouse / teclado / cabo) + troféu no nó de checkpoint.
// `currentColor` -> a cor vem de .iconeSvg no CSS (um lugar só pra trocar).
const ICONES_NO = {
    mouse: (
        <>
            <path d="M12 2.5a6 6 0 0 0-6 6v7a6 6 0 0 0 12 0v-7a6 6 0 0 0-6-6z" />
            <path d="M6 10h12M12 2.5V10" />
        </>
    ),
    teclado: (
        <>
            <rect x="2" y="6" width="20" height="12" rx="2.5" />
            <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 13h.01M12 13h.01M16 13h.01M8 16h8" />
        </>
    ),
    cabo: (
        <>
            <path d="M9 3v5M15 3v5" />
            <path d="M6.5 8h11v3.5a5.5 5.5 0 0 1-11 0z" />
            <path d="M12 17v3a2 2 0 0 0 2 2h4" />
        </>
    ),
    trofeu: (
        <>
            <path d="M7 3.5h10V9a5 5 0 0 1-10 0z" />
            <path d="M7 5.5H4v1.5a3.5 3.5 0 0 0 3.3 3.5M17 5.5h3v1.5a3.5 3.5 0 0 1-3.3 3.5" />
            <path d="M12 14v6M8 20.5h8" />
        </>
    ),
};

// Ícone de cada nó "mini" por módulo (ids de data/modulos.js).
// Módulo sem ícone aqui cai de volta no número do mini-módulo.
const ICONE_POR_MODULO = {
    '1': 'mouse',
    '2': 'teclado',
    '3': 'cabo',
};

function IconeNo({ nome }) {
    return (
        <svg
            className={styles.iconeSvg}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {ICONES_NO[nome]}
        </svg>
    );
}

function tituloDaUnidade(id) {
    return UNIDADES.find((u) => u.id === id)?.titulo ?? id;
}

export function GameTrilha({
                               unidadesPorModulo = [],
                               unidadeRecomendada = null,
                               dominiosPorUnidade = {},
                               origemPorUnidade = {},
                               miniModulosComAtividade = [],
                               limiar = 0.5,
                               modoAdmin = false,
                           }) {
    const navigate = useNavigate();

    // Chave do nó com popover aberto: `${unidadeId}:${noId}` (ou null)
    const [aberto, setAberto] = useState(null);

    // Fecha o popover ao clicar fora de qualquer nó ou apertar Esc
    useEffect(() => {
        if (!aberto) return undefined;

        const aoClicar = (e) => {
            if (!e.target.closest('[data-trilha-no]')) setAberto(null);
        };
        const aoTeclar = (e) => {
            if (e.key === 'Escape') setAberto(null);
        };

        document.addEventListener('mousedown', aoClicar);
        document.addEventListener('keydown', aoTeclar);
        return () => {
            document.removeEventListener('mousedown', aoClicar);
            document.removeEventListener('keydown', aoTeclar);
        };
    }, [aberto]);

    const feitos = new Set(miniModulosComAtividade);
    const recomendadaId = unidadeRecomendada?.id ?? null;

    // Sem nenhum dado do algoritmo (falha de rede/servidor - ver Dashboard)
    // não dá pra saber o que está dominado: em vez de trancar a trilha
    // inteira, não bloqueia nada. Uma pessoa nova NÃO cai aqui, porque
    // sempre tem uma Unidade recomendada (a primeira).
    const semDados = !unidadeRecomendada && Object.keys(dominiosPorUnidade).length === 0;

    const abrirNo = (chave) => setAberto((atual) => (atual === chave ? null : chave));

    const irPara = (unidade, no) => {
        setAberto(null);
        if (no.tipo === 'checkpoint') navigate(`/unidade/${unidade.id}/checkpoint`);
        else navigate(`/mini-modulo/${no.id}`);
    };

    const renderUnidade = (unidade, ehUltimaDoModulo) => {
        const ehRecomendada = unidade.id === recomendadaId;

        const prereqPendentes = (unidade.prerequisitos || []).filter(
            (id) => !estaDominada(id, dominiosPorUnidade, limiar)
        );
        // A Unidade que o algoritmo recomendou nunca fica trancada
        const unidadeBloqueada =
            !modoAdmin && !semDados && !ehRecomendada && prereqPendentes.length > 0;

        const dominada = (dominiosPorUnidade[unidade.id] ?? -1) >= limiar;
        const todosMinisFeitos = unidade.miniModulos.every((mm) => feitos.has(mm.id));
        const proximoMini = unidade.miniModulos.find((mm) => !feitos.has(mm.id));

        // Nós: 1 por mini-módulo + checkpoint (se a Unidade tiver)
        const nos = [
            ...unidade.miniModulos.map((mm, i) => ({
                tipo: 'mini',
                id: mm.id,
                titulo: mm.titulo,
                rotulo: mm.titulo,
                numero: i + 1,
            })),
            ...(unidade.checkpoint
                ? [{
                    tipo: 'checkpoint',
                    id: 'checkpoint',
                    titulo: unidade.checkpoint.titulo || 'Desafio da Unidade',
                    rotulo: 'Desafio',
                }]
                : []),
        ];

        // Qual nó é o "próximo passo" da Unidade recomendada
        let idAtivo = null;
        if (ehRecomendada) {
            if (proximoMini) idAtivo = proximoMini.id;
            else if (unidade.checkpoint) idAtivo = 'checkpoint';
        }

        const statusDe = (no) => {
            if (unidadeBloqueada) return 'bloqueado';
            if (no.id === idAtivo) return 'ativo';
            if (no.tipo === 'mini') return feitos.has(no.id) ? 'concluido' : 'disponivel';
            return dominada && todosMinisFeitos ? 'concluido' : 'disponivel';
        };

        const statusNos = nos.map(statusDe);

        const pontos = nos.map((_, i) => ({
            x: POSICOES_X[i % POSICOES_X.length],
            y: TOPO_Y + i * PASSO_Y,
        }));

        const alturaBase = TOPO_Y + Math.max(nos.length - 1, 0) * PASSO_Y + RODAPE_Y;
        const popoverNestaUnidade = aberto?.startsWith(`${unidade.id}:`);
        const altura = alturaBase + (ehUltimaDoModulo && popoverNestaUnidade ? EXTRA_POPOVER : 0);

        return (
            <section key={unidade.id} className={styles.unidadeSecao}>
                <div className={`${styles.unidadeBanner} ${ehRecomendada ? styles.unidadeBannerAtual : ''}`.trim()}>
                    <h3 className={styles.unidadeTitulo}>{unidade.titulo}</h3>
                </div>

                <div className={styles.unidadeTrilhaFases} style={{ height: altura }}>
                    {/* Linha pontilhada entre os nós (dourada até onde já foi feito) */}
                    <svg
                        className={styles.caminhoTracejadoSvg}
                        viewBox={`0 0 100 ${altura}`}
                        preserveAspectRatio="none"
                        height={altura}
                        aria-hidden="true"
                    >
                        {pontos.slice(1).map((p, i) => {
                            const a = pontos[i];
                            const meio = (a.y + p.y) / 2;
                            const feito = statusNos[i] === 'concluido';
                            return (
                                <path
                                    key={i}
                                    className={styles.linhaTracejadaDelicada}
                                    d={`M ${a.x} ${a.y} C ${a.x} ${meio}, ${p.x} ${meio}, ${p.x} ${p.y}`}
                                    fill="none"
                                    stroke={feito ? 'var(--color-yellow-deep)' : 'var(--color-ceci-lavender)'}
                                    strokeWidth="3.5"
                                    vectorEffect="non-scaling-stroke"
                                />
                            );
                        })}
                    </svg>

                    {nos.map((no, i) => {
                        const status = statusNos[i];
                        const chave = `${unidade.id}:${no.id}`;
                        const popoverAberto = aberto === chave;
                        const ehCheckpoint = no.tipo === 'checkpoint';

                        let icone;
                        if (status === 'bloqueado') icone = '🔒';
                        else if (ehCheckpoint) icone = <IconeNo nome="trofeu" />;
                        else if (status === 'concluido') icone = '✓';
                        else if (status === 'ativo') icone = '▶';
                        else if (ICONE_POR_MODULO[unidade.moduloId]) icone = <IconeNo nome={ICONE_POR_MODULO[unidade.moduloId]} />;
                        else icone = no.numero;

                        return (
                            <div
                                key={chave}
                                id={status === 'ativo' ? 'no-trilha-atual' : undefined}
                                data-trilha-no
                                className={`${styles.nodeWrapper} ${ehCheckpoint ? styles.nodeWrapperCheckpoint : ''}`.trim()}
                                style={{
                                    left: `${pontos[i].x}%`,
                                    top: `${pontos[i].y}px`,
                                    // sobe acima dos nós seguintes enquanto o popover está aberto
                                    zIndex: popoverAberto ? 20 : undefined,
                                }}
                            >
                                {status === 'ativo' && <span className={styles.badgeSuaVez}>JOGAR</span>}

                                {/* A aura fica FORA do botão: ele tem overflow:hidden e cortaria o pulso */}
                                <div style={{ position: 'relative', display: 'flex' }}>
                                    {status === 'ativo' && (
                                        <span
                                            className={styles.auraPulso}
                                            style={ehCheckpoint ? { borderRadius: 30 } : undefined}
                                            aria-hidden="true"
                                        />
                                    )}
                                    <button
                                        type="button"
                                        className={[
                                            styles.nodeButton,
                                            CLASSE_STATUS[status],
                                            ehCheckpoint ? styles.nodeCheckpointButton : '',
                                        ].join(' ').trim()}
                                        onClick={() => abrirNo(chave)}
                                        aria-label={`${no.titulo} - ${TEXTO_STATUS[status]}`}
                                        aria-expanded={popoverAberto}
                                    >
                                        <span className={styles.nodeIcone}>{icone}</span>
                                    </button>
                                </div>

                                <span className={styles.nodeRotulo}>{no.rotulo}</span>

                                {popoverAberto && (
                                    <div className={styles.popoverCard} role="dialog" aria-label={no.titulo}>
                                        <div className={styles.popoverHeader}>
                                            <h4 className={styles.popoverTitulo}>{no.titulo}</h4>
                                            <button
                                                type="button"
                                                className={styles.popoverFechar}
                                                onClick={() => setAberto(null)}
                                                aria-label="Fechar"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        {status === 'bloqueado' ? (
                                            <p className={styles.popoverBloqueadoTexto}>
                                                Para liberar esta etapa, conclua antes:{' '}
                                                {prereqPendentes.map(tituloDaUnidade).join(', ')}.
                                            </p>
                                        ) : (
                                            <div className={styles.popoverAcao}>
                                                <ButtonPrimary size="small" onClick={() => irPara(unidade, no)}>
                                                    {ehCheckpoint
                                                        ? (status === 'concluido' ? 'Refazer o desafio' : 'Fazer o desafio')
                                                        : (status === 'concluido' ? 'Rever aula' : 'Começar aula')}
                                                </ButtonPrimary>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        );
    };

    return (
        <div className={styles.trilhaContainer}>
            {unidadesPorModulo.map((grupo, indiceModulo) => {
                // Unidades só confirmadas no onboarding não ocupam nó (ver Modulos.jsx)
                const visiveis = grupo.unidades.filter(
                    (u) => modoAdmin || origemPorUnidade[u.id] !== 'onboarding'
                );
                if (visiveis.length === 0) return null;

                return (
                    <RetroWindow
                        key={grupo.moduloId}
                        title={grupo.moduloTitulo}
                        icon={grupo.moduloEmoji}
                        accent={ACENTOS_MODULO[indiceModulo % ACENTOS_MODULO.length]}
                        bodyClassName={styles.unidadesContainer}
                    >
                        {visiveis.map((u, i) => renderUnidade(u, i === visiveis.length - 1))}
                    </RetroWindow>
                );
            })}
        </div>
    );
}