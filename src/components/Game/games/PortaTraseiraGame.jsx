// PortaTraseiraGame.jsx
// Cena: painel traseiro de um computador de mesa, visto de trás, com uma
// porta USB (moldura de metal com a "língua" de contatos) e a entrada de
// energia (moldura escura com três lâminas). Embaixo, um mouse com fio: o
// mouse fica parado e o cabo acompanha o plugue enquanto ele é arrastado.
//
// De propósito, as duas entradas têm formatos bem diferentes (uma larga e
// baixa, outra mais alta e escura, com três lâminas) e o plugue arrastado
// tem o mesmo formato da porta USB - a pessoa aprende a comparar o plugue
// com a porta, não a decorar "qual das duas é a certa". O símbolo gravado
// embaixo de cada entrada (tridente do USB, raio da energia) é a pista.
//
// O desenho das peças fica em ArteHardware.jsx (compartilhado com as
// outras cenas de hardware); aqui ficam só a montagem e as coordenadas.

import { ArrastarNaImagemGame } from './ArrastarNaImagemGame';
import {
  DefsHardware, Cabo, Mouse, pontaCaboMouse, Parafuso,
  PortaUsbFrontal, EntradaEnergiaPc, PlugueUsbFrontal,
  SimboloUsb, SimboloEnergia,
} from './ArteHardware';

const VIEW_BOX = '0 0 320 250';

const ITEM_INICIAL = { x: 208, y: 206 };

// Onde cada peça está (mesmas coordenadas usadas pelas zonas abaixo).
const USB = { cx: 110, cy: 88 };
const ENERGIA = { cx: 230, cy: 88 };
const MOUSE = { cx: 84, cy: 216, escala: 0.23 };

const ZONAS = [
  {
    id: 'porta-usb',
    correta: true,
    shape: 'rect',
    x: USB.cx - 34, y: USB.cy - 18, width: 68, height: 36, rx: 8,
  },
  {
    id: 'porta-energia',
    correta: false,
    shape: 'rect',
    x: ENERGIA.cx - 34, y: ENERGIA.cy - 26, width: 68, height: 52, rx: 10,
  },
];

// O plugue é desenhado centrado em (0,0); o motor translada.
const ITEM_DESENHO = <PlugueUsbFrontal />;

// Cabo do mouse até o plugue. Sai do alto do mouse (parado) e entra no
// plugue pela esquerda; se recalcula a cada movimento do plugue (`pos`).
function caboAteOPlugue(pos) {
  const de = pontaCaboMouse(MOUSE.cx, MOUSE.cy, MOUSE.escala);
  const ate = { x: pos.x - 41, y: pos.y };
  const folga = Math.max(30, Math.abs(ate.y - de.y) * 0.45);
  return `M ${de.x} ${de.y} C ${de.x} ${de.y - folga}, ${ate.x - folga} ${ate.y}, ${ate.x} ${ate.y}`;
}

export function PortaTraseiraGame({ reportResult }) {
  return (
    <ArrastarNaImagemGame
      reportResult={reportResult}
      viewBox={VIEW_BOX}
      itemInicial={ITEM_INICIAL}
      itemDesenho={ITEM_DESENHO}
      zonas={ZONAS}
    >
      {({ pos }) => (
        <>
          <DefsHardware />

          {/* Painel traseiro */}
          <rect x="20" y="12" width="280" height="150" rx="16" fill="url(#hw-chassi)" stroke="var(--color-border)" strokeWidth="4" />

          {/* Saída de ventilação (mesmo estilo da frente do gabinete) */}
          {[26, 34, 42].map((y) => (
            <line key={y} x1="100" y1={y} x2="220" y2={y} stroke="var(--color-border)" strokeWidth="4" strokeLinecap="round" />
          ))}

          <Parafuso cx={40} cy={30} />
          <Parafuso cx={280} cy={30} />
          <Parafuso cx={40} cy={144} />
          <Parafuso cx={280} cy={144} />

          {/* Porta USB + símbolo */}
          <PortaUsbFrontal cx={USB.cx} cy={USB.cy} />
          <SimboloUsb x={USB.cx} y={USB.cy + 34} escala={1.1} />

          {/* Entrada de energia + símbolo */}
          <EntradaEnergiaPc cx={ENERGIA.cx} cy={ENERGIA.cy} />
          <SimboloEnergia x={ENERGIA.cx} y={ENERGIA.cy + 40} escala={1.05} />

          {/* Mouse (parado) e o cabo que acompanha o plugue */}
          <Cabo d={caboAteOPlugue(pos)} espessura={4} cor="#4B4068" />
          <Mouse {...MOUSE} />
        </>
      )}
    </ArrastarNaImagemGame>
  );
}
