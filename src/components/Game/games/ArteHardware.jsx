// ArteHardware.jsx
// Peças de desenho (SVG) compartilhadas pelas cenas de hardware:
//   IdentificarCaboGame, PortaTraseiraGame e FoneGame.
//
// Por que existe: as três cenas desenhavam os mesmos objetos (plugue USB,
// plugue de energia, plugue de fone, portas) cada uma do seu jeito, com
// formas simples demais (retângulo, círculo, cápsula) que não lembravam o
// objeto de verdade. Agora o desenho fica num lugar só e as cenas apenas
// posicionam as peças.
//
// Regras de desenho (pra manter as peças coerentes entre si):
//   - metal prateado, plástico roxo-acinzentado e plástico escuro usam os
//     gradientes de <DefsHardware /> (mesma família de cores da paleta do
//     site: roxo #2B2140 / #73658E / #AA9FBE);
//   - contornos finos e claros, como no MouseSvg e no teclado;
//   - contatos dourados (var --color-yellow-dark) só onde existem de verdade;
//   - cada peça usa coordenadas locais (0,0 = ponto de referência descrito
//     no comentário dela) e é posicionada pela prop x/y ou cx/cy.
//
// IMPORTANTE: <DefsHardware /> precisa aparecer UMA vez dentro do <svg> de
// cada cena, antes das outras peças (os gradientes são referenciados por id).

const CONTORNO_METAL = '#A79FBB';
const CONTORNO_ROXO = '#4E4370';
const CONTORNO_ESCURO = '#221A36';

export function DefsHardware() {
  return (
    <defs>
      {/* Metal: luz no alto, sombra embaixo (peças chatas, vistas de frente) */}
      <linearGradient id="hw-metal-v" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="0.55" stopColor="#E4DFEE" />
        <stop offset="1" stopColor="#B7B0C9" />
      </linearGradient>

      {/* Metal: brilho no meio (peças cilíndricas, como pinos e plugue P2) */}
      <linearGradient id="hw-metal-h" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#A9A2BC" />
        <stop offset="0.35" stopColor="#FFFFFF" />
        <stop offset="0.7" stopColor="#DAD5E5" />
        <stop offset="1" stopColor="#9D95B2" />
      </linearGradient>

      {/* Plástico roxo-acinzentado (corpo do plugue USB) */}
      <linearGradient id="hw-roxo" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#6C6090" />
        <stop offset="0.4" stopColor="#8C81AE" />
        <stop offset="1" stopColor="#4E4370" />
      </linearGradient>

      {/* Plástico escuro (plugue de tomada, luvas, entrada de energia) */}
      <linearGradient id="hw-preto" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#2F2648" />
        <stop offset="0.4" stopColor="#50456E" />
        <stop offset="1" stopColor="#241B38" />
      </linearGradient>

      {/* Chassi do computador / notebook */}
      <linearGradient id="hw-chassi" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#F6F0DC" />
      </linearGradient>

      {/* Mouse (corpo) */}
      <linearGradient id="hw-mouse" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#ECE6F6" />
      </linearGradient>
    </defs>
  );
}

// Cabo com "volume": um traço escuro + um fio de luz ao lado.
// `d` é o path do cabo (coordenadas do próprio svg ou do <g> pai).
export function Cabo({ d, espessura = 5, cor = '#4B4068' }) {
  return (
    <>
      <path d={d} fill="none" stroke={cor} strokeWidth={espessura} strokeLinecap="round" />
      <path
        d={d}
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.22"
        strokeWidth={Math.max(espessura / 3, 1)}
        strokeLinecap="round"
        transform={`translate(${-espessura / 5}, 0)`}
      />
    </>
  );
}

/* ---------------------------------------------------------------- */
/* SÍMBOLOS gravados perto das portas (a "pista" que a pessoa lê)   */
/* ---------------------------------------------------------------- */

// Tridente do USB. Centro do desenho ≈ (0,0), ~14 x 20 (antes de escalar).
export function SimboloUsb({ x = 0, y = 0, escala = 1, cor = 'var(--color-text-muted)' }) {
  return (
    <g transform={`translate(${x},${y}) scale(${escala})`} fill={cor} stroke={cor} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 0 8 L 0 -7" fill="none" />
      <path d="M -2.4 -6 L 0 -9.8 L 2.4 -6 Z" />
      <path d="M 0 3 L -5 -0.5 L -5 -3.5" fill="none" />
      <circle cx="-5" cy="-5" r="1.7" stroke="none" />
      <path d="M 0 0 L 5 -3 L 5 -5" fill="none" />
      <rect x="3.4" y="-8" width="3.2" height="3.2" stroke="none" />
      <circle cx="0" cy="9" r="2.5" stroke="none" />
    </g>
  );
}

// Fone de ouvido (símbolo). ~20 x 16.
export function SimboloFone({ x = 0, y = 0, escala = 1, cor = 'var(--color-text-muted)' }) {
  return (
    <g transform={`translate(${x},${y}) scale(${escala})`}>
      <path d="M -8.5 3 L -8.5 0 A 8.5 8.5 0 0 1 8.5 0 L 8.5 3" fill="none" stroke={cor} strokeWidth="2.4" strokeLinecap="round" />
      <rect x="-11" y="1.5" width="5.5" height="9" rx="2.4" fill={cor} />
      <rect x="5.5" y="1.5" width="5.5" height="9" rx="2.4" fill={cor} />
    </g>
  );
}

// Raio (símbolo de energia). ~10 x 20.
export function SimboloEnergia({ x = 0, y = 0, escala = 1, cor = 'var(--color-text-muted)' }) {
  return (
    <g transform={`translate(${x},${y}) scale(${escala})`}>
      <path d="M 3.5 -10 L -5.5 2.5 L -0.5 2.5 L -3.5 11 L 6 -2.5 L 1 -2.5 Z" fill={cor} strokeLinejoin="round" />
    </g>
  );
}

/* ---------------------------------------------------------------- */
/* CONECTORES vistos de lado, apontando pra cima                    */
/* (usados na cena "Reconhecendo cabos")                            */
/* x,y = centro da PONTA do conector. O cabo desce até y + 142.        */
/* ---------------------------------------------------------------- */

// USB-A: cabeça de metal achatada com duas "janelinhas", corpo de
// plástico com o símbolo USB, borracha e cabo.
export function UsbLateral({ x = 0, y = 0 }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <Cabo d="M 0 80 C 0 102, -5 116, -5 142" espessura={6} cor="#4B4068" />
      <path d="M -10 66 L 10 66 L 6.5 84 L -6.5 84 Z" fill="url(#hw-preto)" />
      <rect x="-18" y="32" width="36" height="38" rx="9" fill="url(#hw-roxo)" stroke={CONTORNO_ROXO} strokeWidth="1.5" />
      <rect x="-13" y="37" width="4.5" height="26" rx="2.25" fill="#FFFFFF" opacity="0.2" />
      <SimboloUsb x={2} y={51.5} escala={0.85} cor="#EDE8F5" />
      <rect x="-13" y="0" width="26" height="35" rx="2.5" fill="url(#hw-metal-v)" stroke={CONTORNO_METAL} strokeWidth="1.5" />
      <rect x="-8.5" y="7" width="6" height="4.5" rx="1" fill="#6E6390" />
      <rect x="2.5" y="7" width="6" height="4.5" rx="1" fill="#6E6390" />
    </g>
  );
}

// Plugue de tomada (padrão brasileiro): dois pinos + pino terra central,
// luvas isolantes na base dos pinos, corpo escuro e cabo mais grosso.
export function TomadaLateral({ x = 0, y = 0 }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <Cabo d="M 0 82 C 0 104, 5 118, 5 142" espessura={8} cor="#2B2140" />
      <path d="M -11 66 L 11 66 L 8 84 L -8 84 Z" fill="url(#hw-preto)" />

      {[-13, 8].map((px) => (
        <g key={px}>
          <rect x={px} y="0" width="5" height="32" rx="2.5" fill="url(#hw-metal-h)" stroke={CONTORNO_METAL} strokeWidth="1" />
          <rect x={px - 0.5} y="17" width="6" height="15" rx="1.5" fill="url(#hw-preto)" />
        </g>
      ))}
      <rect x="-2.75" y="6" width="5.5" height="26" rx="2.75" fill="url(#hw-metal-h)" stroke={CONTORNO_METAL} strokeWidth="1" />
      <rect x="-3.25" y="20" width="6.5" height="12" rx="1.5" fill="url(#hw-preto)" />

      <path
        d="M -24 40 Q -24 28 -12 28 L 12 28 Q 24 28 24 40 L 24 60 Q 24 70 14 70 L -14 70 Q -24 70 -24 60 Z"
        fill="url(#hw-preto)"
        stroke={CONTORNO_ESCURO}
        strokeWidth="1.5"
      />
      <rect x="-19" y="32" width="38" height="3" rx="1.5" fill="#FFFFFF" opacity="0.14" />
    </g>
  );
}

// Plugue P2 (fone de ouvido): cilindro prateado com dois anéis pretos
// (ponta, anel, luva), corpo escuro e cabo fino.
// `comCabo={false}` desenha só o plugue (o cabo é desenhado à parte).
export function P2Lateral({ x = 0, y = 0, comCabo = true }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {comCabo && <Cabo d="M 0 82 C 0 106, -4 120, -4 142" espessura={3.5} cor="#4B4068" />}
      <path d="M -3.5 70 L 3.5 70 L 2.2 84 L -2.2 84 Z" fill="url(#hw-preto)" />
      <rect x="-4.2" y="0" width="8.4" height="48" rx="4.2" fill="url(#hw-metal-h)" stroke={CONTORNO_METAL} strokeWidth="1" />
      <rect x="-4.2" y="12" width="8.4" height="3.4" fill="#3A3054" />
      <rect x="-4.2" y="25" width="8.4" height="3.4" fill="#3A3054" />
      <rect x="-7" y="44" width="14" height="28" rx="4" fill="url(#hw-preto)" stroke={CONTORNO_ESCURO} strokeWidth="1.2" />
      <rect x="-7" y="52" width="14" height="1.6" fill="#FFFFFF" opacity="0.14" />
      <rect x="-7" y="58" width="14" height="1.6" fill="#FFFFFF" opacity="0.14" />
    </g>
  );
}

/* ---------------------------------------------------------------- */
/* PLUGUE USB visto de frente + PORTA USB                           */
/* (usados na cena "Pratique a conexão")                            */
/* ---------------------------------------------------------------- */

// Plugue USB de frente, com o cabo saindo pela ESQUERDA.
// (0,0) = centro do plugue. Largura total ≈ 80 (de -40 a +32).
export function PlugueUsbFrontal() {
  return (
    <g>
      {/* área invisível maior, pra ficar fácil de agarrar com o mouse/dedo */}
      <rect x="-46" y="-22" width="88" height="44" fill="transparent" />
      <path d="M -41 -7 L -30 -9.5 L -30 9.5 L -41 7 Z" fill="url(#hw-preto)" />
      <rect x="-32" y="-15" width="64" height="30" rx="9" fill="url(#hw-roxo)" stroke={CONTORNO_ROXO} strokeWidth="1.5" />
      <rect x="-26" y="-10.5" width="52" height="21" rx="3" fill="url(#hw-metal-v)" stroke={CONTORNO_METAL} strokeWidth="1.5" />
      <rect x="-22.5" y="-7" width="45" height="14" rx="1.5" fill="#2B2140" />
      {[-15, -6, 3, 12].map((cx) => (
        <rect key={cx} x={cx} y="-6" width="5" height="3.2" rx="0.6" fill="var(--color-yellow-dark)" />
      ))}
    </g>
  );
}

// Porta USB-A de frente: moldura de metal, abertura escura e a "língua"
// de plástico com os contatos. (cx,cy) = centro. 60 x 28.
export function PortaUsbFrontal({ cx = 0, cy = 0 }) {
  return (
    <g transform={`translate(${cx},${cy})`}>
      <rect x="-30" y="-14" width="60" height="28" rx="4" fill="url(#hw-metal-v)" stroke={CONTORNO_METAL} strokeWidth="1.5" />
      <rect x="-26" y="-10" width="52" height="20" rx="2" fill="#2B2140" />
      <rect x="-22" y="-1" width="44" height="7" rx="1" fill="#C9C3D6" />
      {[-15, -6, 3, 12].map((x) => (
        <rect key={x} x={x} y="0.5" width="5" height="2.6" rx="0.5" fill="var(--color-yellow-dark)" />
      ))}
    </g>
  );
}

// Entrada de energia do gabinete (tipo "C14"): moldura escura com dois
// cantos de baixo cortados e três lâminas de metal dentro.
// (cx,cy) = centro. 60 x 44.
export function EntradaEnergiaPc({ cx = 0, cy = 0 }) {
  return (
    <g transform={`translate(${cx},${cy})`}>
      <path
        d="M -30 -22 L 30 -22 L 30 10 L 19 22 L -19 22 L -30 10 Z"
        fill="url(#hw-preto)"
        stroke={CONTORNO_ESCURO}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M -24 -16.5 L 24 -16.5 L 24 7.5 L 16.5 16.5 L -16.5 16.5 L -24 7.5 Z" fill="#150F24" />
      <rect x="-2.4" y="-12" width="4.8" height="11" rx="1" fill="url(#hw-metal-h)" />
      <rect x="-16.4" y="-4" width="4.8" height="12" rx="1" fill="url(#hw-metal-h)" />
      <rect x="11.6" y="-4" width="4.8" height="12" rx="1" fill="url(#hw-metal-h)" />
    </g>
  );
}

// Parafuso de cabeça redonda (detalhe de chassi). (cx,cy) = centro.
export function Parafuso({ cx = 0, cy = 0 }) {
  return (
    <g transform={`translate(${cx},${cy})`}>
      <circle r="4.5" fill="#F4F2F9" stroke="#CFC8DC" strokeWidth="1.2" />
      <path d="M -2.6 -2.6 L 2.6 2.6 M 2.6 -2.6 L -2.6 2.6" stroke="#B4ADC6" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  );
}

/* ---------------------------------------------------------------- */
/* MOUSE visto de cima (mesma forma do MouseSvg / demonstração)     */
/* ---------------------------------------------------------------- */

// (cx,cy) = centro do mouse; `escala` = tamanho (0.23 ≈ 38 x 52).
// O cabo sai pelo ponto (cx, cy - 114 * escala) - use `pontaCaboMouse`.
export function Mouse({ cx = 0, cy = 0, escala = 0.23 }) {
  return (
    <g transform={`translate(${cx - 100 * escala}, ${cy - 132 * escala}) scale(${escala})`}>
      <path
        d="M 100 18 C 46 18, 18 62, 18 132 L 18 200 C 18 230, 46 246, 100 246 C 154 246, 182 230, 182 200 L 182 132 C 182 62, 154 18, 100 18 Z"
        fill="url(#hw-mouse)"
        stroke="#B4ADC6"
        strokeWidth="9"
      />
      <path d="M 18 132 L 182 132 M 100 18 L 100 132" fill="none" stroke="#C9C3D6" strokeWidth="7" strokeLinecap="round" />
      <rect x="88" y="36" width="24" height="52" rx="12" fill="var(--color-yellow-light)" stroke="var(--color-yellow-deep)" strokeWidth="5" />
    </g>
  );
}

export function pontaCaboMouse(cx, cy, escala = 0.23) {
  return { x: cx, y: cy - 114 * escala };
}

/* ---------------------------------------------------------------- */
/* FONE DE OUVIDO (arco + duas conchas)                             */
/* ---------------------------------------------------------------- */

// (cx,cy) = centro. ~92 x 76. O cabo sai pela lateral de fora da concha
// DIREITA (parte de baixo): use `pontaCaboFone`.
export function Fones({ cx = 0, cy = 0 }) {
  return (
    <g transform={`translate(${cx},${cy})`}>
      <path d="M -36 6 C -36 -46, 36 -46, 36 6" fill="none" stroke="#5E5280" strokeWidth="8" strokeLinecap="round" />
      <path d="M -36 6 C -36 -46, 36 -46, 36 6" fill="none" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="2.5" strokeLinecap="round" transform="translate(0,-1.5)" />
      {[-1, 1].map((lado) => (
        <g key={lado} transform={`scale(${lado},1)`}>
          <rect x="26" y="-2" width="20" height="40" rx="9" fill="url(#hw-roxo)" stroke={CONTORNO_ROXO} strokeWidth="1.5" />
          <rect x="21" y="2" width="8" height="32" rx="4" fill="#F1ECF8" stroke="#B4ADC6" strokeWidth="1.2" />
        </g>
      ))}
    </g>
  );
}

export function pontaCaboFone(cx, cy) {
  return { x: cx + 46, y: cy + 28 };
}
