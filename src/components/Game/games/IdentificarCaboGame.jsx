// IdentificarCaboGame.jsx
// Cena: três conectores desenhados como os de verdade, cada um com um
// formato bem diferente - plugue USB (cabeça de metal achatada, corpo com
// o símbolo USB), plugue de tomada (dois pinos + terra, corpo escuro,
// cabo grosso) e plugue de fone P2 (cilindro fino prateado com anéis).
// A pessoa reconhece o cabo pelo formato do conector, não por um rótulo
// de texto.
//
// O desenho fica em ArteHardware.jsx (compartilhado com as outras cenas
// de hardware). Aqui só há o posicionamento e as áreas clicáveis.

import { ClicarNaImagemGame } from './ClicarNaImagemGame';
import { DefsHardware, UsbLateral, TomadaLateral, P2Lateral } from './ArteHardware';

const VIEW_BOX = '0 0 320 170';

// y da ponta de cada conector (o cabo desce até ~ y + 142).
const TOPO = 18;

// Área clicável = conector inteiro (ponta + corpo + começo do cabo), não
// só a ponta - mais fácil de acertar, e o destaque no hover cobre a peça.
const ALVOS = [
  {
    id: 'cabo-usb',
    correto: true,
    shape: 'rect',
    x: 36, y: 10, width: 48, height: 96, rx: 12,
    rotuloAcessivel: 'Cabo USB',
  },
  {
    id: 'cabo-energia',
    correto: false,
    shape: 'rect',
    x: 130, y: 10, width: 60, height: 98, rx: 12,
    rotuloAcessivel: 'Cabo de energia',
  },
  {
    id: 'cabo-fone',
    correto: false,
    shape: 'rect',
    x: 242, y: 10, width: 36, height: 96, rx: 12,
    rotuloAcessivel: 'Cabo de fone de ouvido',
  },
];

export function IdentificarCaboGame({ reportResult }) {
  return (
    <ClicarNaImagemGame reportResult={reportResult} viewBox={VIEW_BOX} alvos={ALVOS}>
      <DefsHardware />
      <UsbLateral x={60} y={TOPO} />
      <TomadaLateral x={160} y={TOPO} />
      <P2Lateral x={260} y={TOPO} />
    </ClicarNaImagemGame>
  );
}
