// FoneGame.jsx
// Cena: lateral de um notebook fechado (tampa em cima, base embaixo) com
// as entradas que existem de verdade - uma porta USB (só de enfeite), a
// entrada de fone (P2) e a entrada de energia (barril). Embaixo, um fone
// de ouvido parado: o cabo acompanha o plugue enquanto ele é arrastado.
//
// De propósito as duas entradas são bem parecidas (ambas redondas, do
// mesmo tamanho), diferente do PortaTraseiraGame - aqui o desafio é
// reparar no detalhe fino (o símbolo de fone de ouvido gravado em cima da
// entrada certa, e o raio em cima da de energia), que é o tipo de atenção
// que ajuda de verdade no notebook real.
//
// O desenho das peças fica em ArteHardware.jsx (compartilhado com as
// outras cenas de hardware); aqui ficam só a montagem e as coordenadas.

import { ArrastarNaImagemGame } from './ArrastarNaImagemGame';
import {
  DefsHardware, Cabo, Fones, pontaCaboFone, P2Lateral,
  SimboloUsb, SimboloFone, SimboloEnergia,
} from './ArteHardware';

const VIEW_BOX = '0 0 320 262';

// Origem do plugue = um pouco abaixo da ponta (a ponta fica em y = -8).
const ITEM_INICIAL = { x: 214, y: 168 };

const USB = { cx: 68, cy: 86 };
const FONE = { cx: 140, cy: 86 };
const ENERGIA = { cx: 220, cy: 86 };
const FONES = { cx: 98, cy: 196 };

const ZONAS = [
  {
    id: 'entrada-fone',
    correta: true,
    shape: 'circle',
    cx: FONE.cx, cy: FONE.cy, r: 20,
  },
  {
    id: 'entrada-energia',
    correta: false,
    shape: 'circle',
    cx: ENERGIA.cx, cy: ENERGIA.cy, r: 20,
  },
];

// Plugue P2: arrastando, aparece "de lado", apontando pra cima; ao
// encaixar, aparece "de frente" (só a ponta redonda dentro da entrada).
function desenhoDoPlugue({ concluido }) {
  if (concluido) {
    return (
      <g>
        <circle r="12.5" fill="url(#hw-metal-v)" stroke="#A79FBB" strokeWidth="1.5" />
        <circle r="8.5" fill="url(#hw-preto)" />
        <circle r="3" fill="#6E6390" />
      </g>
    );
  }
  return (
    <g>
      {/* área invisível maior, pra ficar fácil de agarrar */}
      <rect x="-20" y="-18" width="40" height="92" fill="transparent" />
      <P2Lateral x={0} y={-8} comCabo={false} />
    </g>
  );
}

// Cabo do fone até o plugue: sai pela lateral de fora da concha direita
// (parada), segue pra direita e sobe até a base do plugue (ou, encaixado,
// até a entrada). Sai de lado pra nunca passar por cima do próprio fone.
function caboAteOPlugue(pos, concluido) {
  const de = pontaCaboFone(FONES.cx, FONES.cy);
  const ate = { x: pos.x, y: pos.y + (concluido ? 10 : 66) };
  const folga = Math.min(70, Math.max(30, Math.abs(ate.x - de.x) * 0.5 + Math.abs(ate.y - de.y) * 0.25));
  return `M ${de.x} ${de.y} C ${de.x + folga} ${de.y}, ${ate.x} ${ate.y + folga}, ${ate.x} ${ate.y}`;
}

export function FoneGame({ reportResult }) {
  return (
    <ArrastarNaImagemGame
      reportResult={reportResult}
      viewBox={VIEW_BOX}
      itemInicial={ITEM_INICIAL}
      itemDesenho={desenhoDoPlugue}
      zonas={ZONAS}
    >
      {({ pos, concluido }) => (
        <>
          <DefsHardware />

          {/* Lateral do notebook fechado: base (embaixo) + tampa (em cima) */}
          <rect x="22" y="20" width="276" height="104" rx="16" fill="url(#hw-chassi)" stroke="var(--color-border)" strokeWidth="4" />
          <line x1="30" y1="46" x2="290" y2="46" stroke="#D9D4E4" strokeWidth="2" strokeLinecap="round" />
          <line x1="30" y1="48.5" x2="290" y2="48.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          {/* pezinhos de borracha */}
          <rect x="52" y="123" width="34" height="7" rx="3.5" fill="#B4ADC6" />
          <rect x="234" y="123" width="34" height="7" rx="3.5" fill="#B4ADC6" />

          {/* Porta USB (enfeite) */}
          <SimboloUsb x={USB.cx} y={USB.cy - 24} escala={0.9} />
          <rect x={USB.cx - 20} y={USB.cy - 8} width="40" height="16" rx="3" fill="url(#hw-metal-v)" stroke="#A79FBB" strokeWidth="1.3" />
          <rect x={USB.cx - 17} y={USB.cy - 5} width="34" height="10" rx="1.5" fill="#2B2140" />
          <rect x={USB.cx - 14} y={USB.cy - 0.5} width="28" height="3.5" rx="0.8" fill="#C9C3D6" />

          {/* Entrada de fone: símbolo em cima, furo com contato dentro */}
          <SimboloFone x={FONE.cx} y={FONE.cy - 26} escala={0.95} />
          <circle cx={FONE.cx} cy={FONE.cy} r="13" fill="url(#hw-metal-v)" stroke="#A79FBB" strokeWidth="1.5" />
          <circle cx={FONE.cx} cy={FONE.cy} r="8.5" fill="#2B2140" />
          <circle cx={FONE.cx} cy={FONE.cy} r="3.2" fill="#6E6390" />

          {/* Entrada de energia: símbolo em cima, furo com pino no meio */}
          <SimboloEnergia x={ENERGIA.cx} y={ENERGIA.cy - 26} escala={0.9} />
          <circle cx={ENERGIA.cx} cy={ENERGIA.cy} r="13" fill="url(#hw-preto)" stroke="#221A36" strokeWidth="1.5" />
          <circle cx={ENERGIA.cx} cy={ENERGIA.cy} r="8.5" fill="#150F24" />
          <circle cx={ENERGIA.cx} cy={ENERGIA.cy} r="2.6" fill="url(#hw-metal-h)" />

          {/* Saída de ar (enfeite) */}
          {[262, 272, 282].map((x) => (
            <rect key={x} x={x - 2.5} y={ENERGIA.cy - 14} width="5" height="28" rx="2.5" fill="#E4DFEE" stroke="#CFC8DC" strokeWidth="1" />
          ))}

          {/* Fone (parado) e o cabo que acompanha o plugue */}
          <Cabo d={caboAteOPlugue(pos, concluido)} espessura={3.5} cor="#4B4068" />
          <Fones {...FONES} />
        </>
      )}
    </ArrastarNaImagemGame>
  );
}
