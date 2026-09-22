// DesenhoLivreGame.jsx
// Mecânica de PINTAR: a pessoa clica e arrasta pra colorir dentro de uma
// figura simples (círculo, quadrado, triângulo, estrela, coração),
// usando uma paleta de cores + borracha. Treina o "clique e arraste" de
// um jeito lúdico, diferente do ArrastarSoltarGame/ArrastarNaImagemGame
// (que são sobre soltar um item num alvo, não sobre desenho livre).
//
// COMO FUNCIONA (duas camadas de canvas, mesmo tamanho, sobrepostas)
//   1) camada-guia: desenhada UMA vez ao montar, só o contorno
//      tracejado da figura (puramente visual, nunca mais tocada)
//   2) camada-tinta: onde a pessoa realmente pinta (clique/arraste),
//      100% transparente no início
// Uma terceira "máscara" (canvas invisível, nunca anexado ao DOM) é
// preenchida por dentro da MESMA figura e serve só pra, no final,
// comparar pixel a pixel com o que foi pintado.
//
// PERFEIÇÃO (ao clicar "Concluir desenho")
//   preenchimento = % da área INTERNA da figura que ficou pintada
//   vazamento     = % da área EXTERNA que foi pintada por engano
//   perfeicao     = preenchimento * (1 - vazamento/2), arredondado
// O /2 no vazamento é de propósito: um pouquinho de tinta fora do
// risco não deveria derrubar a nota tanto quanto deixar de pintar por
// dentro - mantém o retorno acolhedor mesmo pra quem ainda não tem
// pulso firme (público adulto iniciante, ver GameMoment).
//
// Props:
//   reportResult (função, obrigatória) - chamada com (true, { perfeicao })
//     quando a pessoa clica "Concluir desenho". Sempre sucesso - não
//     existe "errar" um desenho, só terminar com uma nota melhor ou pior.
//   figura       ('circulo'|'quadrado'|'triangulo'|'estrela'|'coracao')
//   tamanho      (número, px, padrão 280) - lado do canvas quadrado

import { useEffect, useRef, useState, useCallback } from 'react';
import { tracarFigura } from '../../../utils/figurasCanvas';
import { ButtonPrimary } from '../../Buttons/ButtonPrimary';
import styles from './DesenhoLivreGame.module.css';

const PALETA = [
    { id: 'vermelho', cor: '#EF5350' },
    { id: 'laranja',  cor: '#FFA726' },
    { id: 'amarelo',  cor: '#FFD94D' },
    { id: 'verde',    cor: '#66BB6A' },
    { id: 'azul',     cor: '#42A5F5' },
    { id: 'roxo',     cor: '#AB47BC' },
];

const RAIO_PINCEL = 12;

export function DesenhoLivreGame({ reportResult, figura = 'circulo', tamanho = 280 }) {
    const guiaRef = useRef(null);
    const tintaRef = useRef(null);
    const maskRef = useRef(null); // Uint8Array - true = dentro da figura, nunca vai pro DOM
    const pintandoRef = useRef(false);

    const [corAtual, setCorAtual] = useState(PALETA[0].cor);
    const [modoBorracha, setModoBorracha] = useState(false);
    const [concluido, setConcluido] = useState(false);
    const [resultado, setResultado] = useState(null);

    // Desenha a guia (contorno tracejado) e monta a máscara de acerto -
    // roda só quando a figura muda (troca de rodada), nunca de novo por
    // causa de cor/borracha.
    useEffect(() => {
        const guia = guiaRef.current;
        const tinta = tintaRef.current;
        if (!guia || !tinta) return;

        const ctxGuia = guia.getContext('2d');
        ctxGuia.clearRect(0, 0, tamanho, tamanho);
        ctxGuia.setLineDash([6, 5]);
        ctxGuia.lineWidth = 2.5;
        ctxGuia.strokeStyle = 'rgba(43, 33, 64, 0.35)'; // --color-text-primary com alpha
        tracarFigura(ctxGuia, figura, tamanho);
        ctxGuia.stroke();

        // Máscara: canvas só na memória (nunca vira <canvas> na tela).
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = tamanho;
        maskCanvas.height = tamanho;
        const ctxMask = maskCanvas.getContext('2d');
        tracarFigura(ctxMask, figura, tamanho);
        ctxMask.fillStyle = '#000';
        ctxMask.fill();
        const dados = ctxMask.getImageData(0, 0, tamanho, tamanho).data;
        const dentro = new Uint8Array(tamanho * tamanho);
        for (let i = 0; i < dentro.length; i++) {
            dentro[i] = dados[i * 4 + 3] > 0 ? 1 : 0; // canal alpha
        }
        maskRef.current = dentro;

        // Limpa a camada de tinta (nova rodada = tela em branco)
        const ctxTinta = tinta.getContext('2d');
        ctxTinta.clearRect(0, 0, tamanho, tamanho);

        setConcluido(false);
        setResultado(null);
    }, [figura, tamanho]);

    const posicaoNoCanvas = (e) => {
        const rect = tintaRef.current.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const pintarEm = useCallback((x, y) => {
        const ctx = tintaRef.current.getContext('2d');
        ctx.globalCompositeOperation = modoBorracha ? 'destination-out' : 'source-over';
        ctx.fillStyle = corAtual;
        ctx.beginPath();
        ctx.arc(x, y, RAIO_PINCEL, 0, Math.PI * 2);
        ctx.fill();
    }, [corAtual, modoBorracha]);

    const handlePointerDown = (e) => {
        if (concluido) return;
        pintandoRef.current = true;
        const { x, y } = posicaoNoCanvas(e);
        pintarEm(x, y);
    };

    const handlePointerMove = (e) => {
        if (!pintandoRef.current || concluido) return;
        const { x, y } = posicaoNoCanvas(e);
        pintarEm(x, y);
    };

    const pararDePintar = () => { pintandoRef.current = false; };

    const handleConcluir = () => {
        const dentro = maskRef.current;
        if (!dentro) return;

        const ctx = tintaRef.current.getContext('2d');
        const pintado = ctx.getImageData(0, 0, tamanho, tamanho).data;

        let dentroTotal = 0, dentroPintado = 0, foraTotal = 0, foraPintado = 0;
        for (let i = 0; i < dentro.length; i++) {
            const temTinta = pintado[i * 4 + 3] > 0;
            if (dentro[i]) {
                dentroTotal++;
                if (temTinta) dentroPintado++;
            } else {
                foraTotal++;
                if (temTinta) foraPintado++;
            }
        }

        const preenchimento = dentroTotal > 0 ? dentroPintado / dentroTotal : 0;
        const vazamento = foraTotal > 0 ? foraPintado / foraTotal : 0;
        const perfeicao = Math.round(preenchimento * 100 * (1 - Math.min(vazamento, 1) * 0.5));

        setConcluido(true);
        setResultado(perfeicao);
        reportResult(true, { perfeicao });
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.canvasArea} style={{ width: tamanho, height: tamanho }}>
                <canvas ref={guiaRef} width={tamanho} height={tamanho} className={styles.camada} />
                <canvas
                    ref={tintaRef}
                    width={tamanho}
                    height={tamanho}
                    className={`${styles.camada} ${styles.camadaTinta}`}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={pararDePintar}
                    onPointerLeave={pararDePintar}
                    role="img"
                    aria-label={`Área de pintura em formato de ${figura}`}
                />

                {concluido && (
                    <div className={styles.resultadoOverlay}>
                        <span className={styles.resultadoNumero}>{resultado}%</span>
                        <span className={styles.resultadoLabel}>de perfeição</span>
                    </div>
                )}
            </div>

            <div className={styles.controles}>
                <div className={styles.paleta}>
                    {PALETA.map((p) => (
                        <button
                            key={p.id}
                            type="button"
                            className={`${styles.corBotao} ${!modoBorracha && corAtual === p.cor ? styles.corAtiva : ''}`}
                            style={{ background: p.cor }}
                            aria-label={`Cor ${p.id}`}
                            onClick={() => { setCorAtual(p.cor); setModoBorracha(false); }}
                            disabled={concluido}
                        />
                    ))}
                    <button
                        type="button"
                        className={`${styles.borrachaBotao} ${modoBorracha ? styles.corAtiva : ''}`}
                        onClick={() => setModoBorracha(true)}
                        disabled={concluido}
                        aria-label="Borracha"
                    >
                        🧹
                    </button>
                </div>

                <ButtonPrimary onClick={handleConcluir} disabled={concluido} size="small">
                    Concluir desenho
                </ButtonPrimary>
            </div>
        </div>
    );
}