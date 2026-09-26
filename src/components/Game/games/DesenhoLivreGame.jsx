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
//   preenchimento = % do NÚCLEO da figura que ficou pintada
//   vazamento     = % da área fora da ZONA TOLERADA que foi pintada
//   perfeicao     = max(0, preenchimento - vazamento), em pontos %, arredondado
// Sem amortecimento: cada ponto percentual de área vazada tira um
// ponto percentual de exatidão, direto. Preencher tudo por dentro não
// segura a nota se boa parte também vazou pra fora - pintar a tela
// inteira, por exemplo, zera a perfeição mesmo com preenchimento 100%.
//
// MARGEM DE ERRO (faixa ao redor do contorno guia)
// Em vez de comparar o traço com a figura exata (o que fazia até quem
// pintasse "perfeito" cair pra 99% por causa de 1px de anti-aliasing
// ou de uma ponta que o pincel redondo não alcança), a régua real usa
// duas versões da máscara, geradas UMA vez por rodada a partir da
// mesma figura, "inflando" o contorno em `margem` px pra cada lado
// (ctx.stroke com lineWidth = 2*margem, centrado no traço):
//   - zonaTolerada = interior + uma faixa de tolerância pra FORA do
//     contorno -> só conta como "vazamento" o que escapar dessa faixa
//   - nucleo       = interior encolhido, tirando uma faixa de
//     tolerância de DENTRO do contorno -> só esse núcleo precisa ficar
//     100% pintado pra render "preenchimento" cheio; a beirada (onde
//     ninguém acerta o traço no pixel) não é mais cobrada
// `margem` não é um número fixo de px: é calculada por figura a partir
// da própria área/perímetro (ver FRACAO_MARGEM_ERRO), pra tolerar
// sempre ~2-3% da área interna, nem mais nem menos, mesmo em figuras
// bem diferentes (um círculo largo x uma ponta fina de estrela).
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

const RAIO_PADRAO = 12; // tamanho inicial do pincel/borracha, em px de raio
const RAIO_MIN = 4;
const RAIO_MAX = 30;

// Alvo de tolerância: fração da ÁREA interna da figura que a margem de
// erro pode "perdoar" de cada lado do contorno (underfill por dentro,
// vazamento por fora). 0.025 = 2.5%, no meio do intervalo de 2-3%
// pedido - segue valorizando a exatidão, só não pune 1-2px de imprecisão
// inevitável do mouse/touch.
const FRACAO_MARGEM_ERRO = 0.025;

export function DesenhoLivreGame({ reportResult, figura = 'circulo', tamanho = 280 }) {
    const guiaRef = useRef(null);
    const tintaRef = useRef(null);
    const zonaToleradaRef = useRef(null); // Uint8Array - dentro OU na faixa de tolerância (usada no vazamento)
    const nucleoRef = useRef(null); // Uint8Array - interior encolhido pela margem (usada no preenchimento)
    const pintandoRef = useRef(false);

    const [corAtual, setCorAtual] = useState(PALETA[0].cor);
    const [modoBorracha, setModoBorracha] = useState(false);
    const [raioPincel, setRaioPincel] = useState(RAIO_PADRAO);
    const [concluido, setConcluido] = useState(false);
    const [resultado, setResultado] = useState(null);

    // Desenha a guia (contorno tracejado) e monta as duas máscaras de
    // acerto (zona tolerada + núcleo) - roda só quando a figura muda
    // (troca de rodada), nunca de novo por causa de cor/borracha/pincel.
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

        // 1) Interior "puro" (sem margem), só pra medir área e perímetro
        // da figura e daí calcular quantos px de margem correspondem a
        // FRACAO_MARGEM_ERRO da área - assim a margem vira proporcional
        // à espessura de cada figura (uma ponta fina de estrela ganha
        // uma faixa bem menor que um círculo largo, em vez de uma
        // largura fixa que "come" desproporcionalmente as partes finas).
        const interiorCanvas = document.createElement('canvas');
        interiorCanvas.width = tamanho;
        interiorCanvas.height = tamanho;
        const ctxInterior = interiorCanvas.getContext('2d');
        tracarFigura(ctxInterior, figura, tamanho);
        ctxInterior.fillStyle = '#000';
        ctxInterior.fill();
        const dadosInterior = ctxInterior.getImageData(0, 0, tamanho, tamanho).data;
        const dentro = new Uint8Array(tamanho * tamanho);
        for (let i = 0; i < dentro.length; i++) {
            dentro[i] = dadosInterior[i * 4 + 3] > 0 ? 1 : 0;
        }

        let areaTotal = 0;
        let perimetroEstimado = 0;
        for (let y = 0; y < tamanho; y++) {
            for (let x = 0; x < tamanho; x++) {
                const i = y * tamanho + x;
                if (!dentro[i]) continue;
                areaTotal++;
                const bordaCanvas = x === 0 || y === 0 || x === tamanho - 1 || y === tamanho - 1;
                const vizinhoFora =
                    bordaCanvas ||
                    !dentro[i - 1] || !dentro[i + 1] ||
                    !dentro[i - tamanho] || !dentro[i + tamanho];
                if (vizinhoFora) perimetroEstimado++;
            }
        }

        // margem (px) = (fração-alvo * área) / perímetro, com um piso de
        // 1px (pra sempre existir alguma tolerância) e um teto de 10px
        // (sanidade, evita exagero em figuras muito irregulares).
        const margem = perimetroEstimado > 0
            ? Math.min(10, Math.max(1, (FRACAO_MARGEM_ERRO * areaTotal) / perimetroEstimado))
            : 0;

        // Zona tolerada: interior + faixa de tolerância pra FORA do
        // contorno. Canvas só na memória (nunca vira <canvas> na tela).
        const zonaCanvas = document.createElement('canvas');
        zonaCanvas.width = tamanho;
        zonaCanvas.height = tamanho;
        const ctxZona = zonaCanvas.getContext('2d');
        tracarFigura(ctxZona, figura, tamanho);
        ctxZona.fillStyle = '#000';
        ctxZona.fill();
        tracarFigura(ctxZona, figura, tamanho);
        ctxZona.lineWidth = margem * 2;
        ctxZona.strokeStyle = '#000';
        ctxZona.stroke();
        const dadosZona = ctxZona.getImageData(0, 0, tamanho, tamanho).data;
        const zonaTolerada = new Uint8Array(tamanho * tamanho);
        for (let i = 0; i < zonaTolerada.length; i++) {
            zonaTolerada[i] = dadosZona[i * 4 + 3] > 0 ? 1 : 0; // canal alpha
        }
        zonaToleradaRef.current = zonaTolerada;

        // Núcleo: interior encolhido, tirando uma faixa de tolerância de
        // DENTRO do contorno (fill seguido de "furo" com destination-out
        // usando o mesmo traço grosso, o que produz uma erosão simples).
        const nucleoCanvas = document.createElement('canvas');
        nucleoCanvas.width = tamanho;
        nucleoCanvas.height = tamanho;
        const ctxNucleo = nucleoCanvas.getContext('2d');
        tracarFigura(ctxNucleo, figura, tamanho);
        ctxNucleo.fillStyle = '#000';
        ctxNucleo.fill();
        tracarFigura(ctxNucleo, figura, tamanho);
        ctxNucleo.lineWidth = margem * 2;
        ctxNucleo.strokeStyle = '#000';
        ctxNucleo.globalCompositeOperation = 'destination-out';
        ctxNucleo.stroke();
        const dadosNucleo = ctxNucleo.getImageData(0, 0, tamanho, tamanho).data;
        const nucleo = new Uint8Array(tamanho * tamanho);
        for (let i = 0; i < nucleo.length; i++) {
            nucleo[i] = dadosNucleo[i * 4 + 3] > 0 ? 1 : 0;
        }
        nucleoRef.current = nucleo;

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
        ctx.arc(x, y, raioPincel, 0, Math.PI * 2);
        ctx.fill();
    }, [corAtual, modoBorracha, raioPincel]);

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
        const zonaTolerada = zonaToleradaRef.current;
        const nucleo = nucleoRef.current;
        if (!zonaTolerada || !nucleo) return;

        const ctx = tintaRef.current.getContext('2d');
        const pintado = ctx.getImageData(0, 0, tamanho, tamanho).data;

        let nucleoTotal = 0, nucleoPintado = 0, foraTotal = 0, foraPintado = 0;
        for (let i = 0; i < zonaTolerada.length; i++) {
            const temTinta = pintado[i * 4 + 3] > 0;
            if (nucleo[i]) {
                nucleoTotal++;
                if (temTinta) nucleoPintado++;
            }
            if (!zonaTolerada[i]) {
                foraTotal++;
                if (temTinta) foraPintado++;
            }
        }

        const preenchimento = nucleoTotal > 0 ? nucleoPintado / nucleoTotal : 0;
        const vazamento = foraTotal > 0 ? foraPintado / foraTotal : 0;
        // Vazamento tira pontos de exatidão DIRETO (1 ponto percentual
        // de área vazada = 1 ponto percentual a menos), sem amortecer
        // pela metade como antes - preenchimento sozinho não segura a
        // nota se boa parte da tinta escapou pra fora do contorno.
        // Pintar a tela inteira, por exemplo, agora vai pra 0%.
        const perfeicao = Math.round(Math.max(0, preenchimento * 100 - Math.min(vazamento, 1) * 100));

        setConcluido(true);
        setResultado(perfeicao);
        reportResult(true, { perfeicao });
    };

    return (
        <div className={styles.wrapper}>
            {/* areaPrincipal = canvas de pintura + arte decorativa da Ceci
                do lado. A arte é só ilustrativa (por isso aria-hidden e
                sem alt) - não faz parte da mecânica do jogo, então se a
                imagem não existir/ falhar em algum ambiente, não quebra
                nada, só some. */}
            <div className={styles.areaPrincipal}>
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

                <img
                    src="/ceci-round-6.png"
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    className={styles.arteDecorativa}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
            </div>

            <div className={styles.controles}>
                <div className={styles.grupoPaleta}>
                    <span className={styles.legendaControle}>🎨 Cor</span>
                    <div className={styles.paleta} title="Escolha a cor da tinta">
                        {PALETA.map((p) => (
                            <button
                                key={p.id}
                                type="button"
                                className={`${styles.corBotao} ${!modoBorracha && corAtual === p.cor ? styles.corAtiva : ''}`}
                                style={{ background: p.cor }}
                                aria-label={`Cor ${p.id}`}
                                title={`Pintar de ${p.id}`}
                                onClick={() => { setCorAtual(p.cor); setModoBorracha(false); }}
                                disabled={concluido}
                            />
                        ))}
                        <button
                            type="button"
                            className={`${styles.borrachaBotao} ${modoBorracha ? styles.corAtiva : ''}`}
                            onClick={() => setModoBorracha(true)}
                            disabled={concluido}
                            aria-label="Borracha (apaga o que você pintou)"
                            title="Borracha - apaga o que você pintou"
                        >
                            🧹
                        </button>
                    </div>
                </div>

                <div className={styles.controleTamanho}>
                    <label
                        htmlFor="tamanho-pincel"
                        className={styles.legendaControle}
                        title={`Arraste para ajustar o tamanho do ${modoBorracha ? 'borracha' : 'pincel'}`}
                    >
                        {modoBorracha ? '🧹' : '🖌️'} Tamanho: {raioPincel * 2}px
                    </label>
                    <input
                        id="tamanho-pincel"
                        type="range"
                        min={RAIO_MIN}
                        max={RAIO_MAX}
                        value={raioPincel}
                        onChange={(e) => setRaioPincel(Number(e.target.value))}
                        disabled={concluido}
                        className={styles.controleTamanhoSlider}
                        aria-label={`Tamanho do ${modoBorracha ? 'borracha' : 'pincel'} - ${raioPincel * 2}px, arraste para ajustar`}
                    />
                </div>

                <ButtonPrimary onClick={handleConcluir} disabled={concluido} size="small">
                    Concluir desenho
                </ButtonPrimary>
            </div>
        </div>
    );
}