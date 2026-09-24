// CapturaPuffGame.jsx
// Cena: a Ceci foi "capturada" e precisa ser arrastada até o pufe.
//
// FLUXO DA CENA (é o que a pessoa vê)
//   1) Parada ................ ceci-capturada
//   2) Enquanto a pessoa SEGURA ... ceci-caindo (em qualquer lugar do
//                                  card, não só em cima do pufe)
//   3) Soltou fora do pufe ... volta pro início como ceci-capturada
//   4) Soltou no pufe ........ troca sutil (fade) pra ceci-no-puff, que é
//                              a ilustração final (Ceci já sentada no
//                              pufe - composição única, não dá pra
//                              montar juntando os pedaços separados)
//   Quem decide por quanto tempo a ilustração final fica na tela e quando
//   a cena recomeça é quem usa o jogo (no Laboratório: Laboratorio.jsx,
//   que remonta o jogo com uma `key` nova depois da pausa) - o jogo em si
//   só reporta o acerto via reportResult.
//
// POR QUE AS QUATRO ARTES FICAM SEMPRE NO DOM
// Antes a ilustração final só era criada no instante do acerto, então o
// navegador começava a baixar a imagem (~650 KB) NESSA hora - a cena
// ficava em branco até terminar e, como o Laboratório remonta o jogo
// logo depois, muitas vezes ela nem chegava a aparecer. Agora todas as
// artes são carregadas junto com o jogo e só alternam a opacidade
// (ver CapturaPuffGame.module.css) - a troca é instantânea e permite o
// fade entre caindo → no-puff.
//
// As artes precisam estar recortadas até o conteúdo real (sem a
// margem transparente do canvas original) - ver .../public/ceci-*.png.
// Isso é o que garante que a Ceci não "pule" de posição ao trocar
// entre capturada/caindo durante o arraste.
//
// Props:
//   reportResult (função, obrigatória) - vem do GameMoment / Laboratório
//   limiteRef (ref, opcional) - card em volta do jogo. Com ele a Ceci
//     pode ser arrastada por TODO o card (a arte não é mais cortada no
//     quadrado da cena) sem sair dele. Ver ArrastarNaImagemGame.jsx.

import { ArrastarNaImagemGame } from './ArrastarNaImagemGame';
import styles from './CapturaPuffGame.module.css';

const VIEW_BOX = '0 0 320 430';

const ITEM_INICIAL = { x: 160, y: 95 };

// Larguras escolhidas visualmente - ajuste aqui se o recorte final
// tiver proporção um pouco diferente da atual.
const CAPTURADA_LARGURA = 120;
const CAPTURADA_ALTURA = 176; // proporção ~0.683 (largura/altura)
const CAINDO_LARGURA = 120;
const CAINDO_ALTURA = 129; // proporção ~0.933

// --- Pufe -------------------------------------------------------------
// Só PUFF_LARGURA e PUFF_Y precisam ser mexidos pra redimensionar/mover
// o pufe: o resto (altura, zona de soltar, ilustração final) sai daqui.
const PUFF_LARGURA = 185;
const PUFF_Y = 292; // quanto maior, mais longe da Ceci (que começa no topo)

// Tamanho real (px) das artes, pra manter as proporções.
const PUFF_PX = { largura: 1081, altura: 704 };
const NO_PUFF_PX = { largura: 1120, altura: 909 };

const ESCALA_PUFF = PUFF_LARGURA / PUFF_PX.largura;
const PUFF_ALTURA = PUFF_PX.altura * ESCALA_PUFF;
const PUFF_X = (320 - PUFF_LARGURA) / 2;

// O pufe desenhado dentro de ceci-no-puff.png é o mesmo do ceci-puff.png,
// só que com escala/posição levemente diferentes na arte. Esses três
// números (medidos sobrepondo as duas artes) fazem o pufe da ilustração
// final cair EXATAMENTE em cima do pufe da cena - sem isso, o fade
// mostraria o pufe "andando". Se a arte do pufe ou do no-puff mudar,
// é aqui que reajusta:
const NO_PUFF_ESCALA_RELATIVA = 0.98; // escala do no-puff em relação ao puff
const NO_PUFF_DESLOC_PX = { x: -8, y: -184 }; // em px da arte do puff

const ESCALA_NO_PUFF = ESCALA_PUFF * NO_PUFF_ESCALA_RELATIVA;
const NO_PUFF_LARGURA = NO_PUFF_PX.largura * ESCALA_NO_PUFF;
const NO_PUFF_ALTURA = NO_PUFF_PX.altura * ESCALA_NO_PUFF;
const NO_PUFF_X = PUFF_X + NO_PUFF_DESLOC_PX.x * ESCALA_PUFF;
const NO_PUFF_Y = PUFF_Y + NO_PUFF_DESLOC_PX.y * ESCALA_PUFF;

// Zona de soltar: a parte de cima do pufe (mesmas proporções de antes,
// só que agora relativas ao tamanho do pufe).
const ZONA_PUFF = {
    id: 'puff',
    correta: true,
    shape: 'rect',
    x: PUFF_X + PUFF_LARGURA * 0.16,
    y: PUFF_Y,
    width: PUFF_LARGURA * 0.68,
    height: PUFF_ALTURA * 0.63,
    rx: 16,
};

const ZONAS = [ZONA_PUFF];

// Folga entre o centro da Ceci e a borda do card ao arrastar: metade da
// arte "caindo" (a que aparece enquanto ela está sendo segurada).
const MARGEM_LIMITE = { x: CAINDO_LARGURA / 2, y: CAINDO_ALTURA / 2 };

export function CapturaPuffGame({ reportResult, limiteRef }) {
    return (
        <ArrastarNaImagemGame
            reportResult={reportResult}
            viewBox={VIEW_BOX}
            itemInicial={ITEM_INICIAL}
            zonas={ZONAS}
            limiteRef={limiteRef}
            margemLimite={MARGEM_LIMITE}
            itemDesenho={({ arrastando, concluido }) => {
                // "Segurando" = arrastando (em qualquer lugar). No acerto
                // ela continua na arte caindo enquanto some no fade, pra
                // não piscar a arte parada bem na hora da troca.
                const segurando = arrastando || concluido;
                return (
                    <g className={`${styles.ceci} ${concluido ? styles.ceciSome : ''}`}>
                        <image
                            href="/ceci-capturada.png"
                            className={segurando ? styles.oculta : ''}
                            x={-CAPTURADA_LARGURA / 2}
                            y={-CAPTURADA_ALTURA / 2}
                            width={CAPTURADA_LARGURA}
                            height={CAPTURADA_ALTURA}
                        />
                        <image
                            href="/ceci-caindo.png"
                            className={segurando ? '' : styles.oculta}
                            x={-CAINDO_LARGURA / 2}
                            y={-CAINDO_ALTURA / 2}
                            width={CAINDO_LARGURA}
                            height={CAINDO_ALTURA}
                        />
                    </g>
                );
            }}
        >
            {({ concluido }) => (
                <>
                    <image
                        href="/ceci-puff.png"
                        className={`${styles.puff} ${concluido ? styles.puffSai : ''}`}
                        x={PUFF_X}
                        y={PUFF_Y}
                        width={PUFF_LARGURA}
                        height={PUFF_ALTURA}
                    />
                    <image
                        href="/ceci-no-puff.png"
                        className={`${styles.noPuff} ${concluido ? styles.noPuffEntra : ''}`}
                        x={NO_PUFF_X}
                        y={NO_PUFF_Y}
                        width={NO_PUFF_LARGURA}
                        height={NO_PUFF_ALTURA}
                    />
                </>
            )}
        </ArrastarNaImagemGame>
    );
}
