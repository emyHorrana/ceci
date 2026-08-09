// TecladoCompleto.jsx
// Teclado com TODAS as teclas visíveis e rotuladas (letras, números,
// símbolos, especiais) - diferente do Teclado.jsx simplificado, que só
// nomeia teclas especiais e não tem como apontar "onde fica o C".
//
// CONVIVE com o Teclado.jsx simplificado, não o substitui: o
// simplificado continua sendo o certo pra quem está vendo um teclado
// pela primeira vez (menos informação na tela, mais fácil de not se
// perder) - ver EspacoParaAvancar/PressionarTeclaGame. Este aqui entra
// onde é preciso apontar uma tecla específica de letra/número/símbolo,
// como nos atalhos (AtalhoTecladoGame), que precisam mostrar Ctrl E a
// letra ao mesmo tempo.
//
// LAYOUT: segue o padrão ABNT2 (o mais comum no Brasil), incluindo o Ç
// e o layout de acentos próprio (´ ` ~ ^ como teclas mortas). Teclados
// de outros países/padrões (o americano, por exemplo) têm símbolos em
// posições diferentes - isso já apareceu na prática: o @ é Alt Gr+Q no
// ABNT2, mas Shift+2 no americano (ver dica em data/modulos.js, 2-11).
// Se um dia for necessário suportar outro layout, o ideal é trocar a
// constante FILEIRAS por uma variante, mantendo o mesmo formato.
//
// PLACEHOLDER DE ARTE: mesma lógica do Teclado.jsx - são só retângulos
// em CSS, esperando ilustração de verdade da designer.
//
// Props:
//   teclasDestacadas (array de e.code, obrigatório) - quais teclas
//     aparecem destacadas/pulsando agora. É array (não uma string só)
//     porque um atalho precisa destacar duas teclas ao mesmo tempo
//     (ex: Ctrl E a letra C) - e também porque Shift/Ctrl têm duas
//     teclas físicas cada, então "destacar Ctrl" já significa duas.
//
//   <TecladoCompleto teclasDestacadas={['ControlLeft', 'ControlRight', 'KeyC']} />

import styles from './TecladoCompleto.module.css';

// Cada fileira é uma lista de teclas: { code, label, peso }.
// `code` é o mesmo valor de e.code do teclado físico (o que os jogos
// escutam pra saber o que foi apertado). `peso` controla a largura
// relativa da tecla (peso 1 = tecla comum; Backspace/Enter/Shift são
// mais largas; Espaço é a mais larga de todas).
const FILEIRAS = [
  [
    { code: 'Escape', label: 'esc', peso: 1 },
  ],
  [
    { code: 'Backquote', label: "' `", peso: 1 },
    { code: 'Digit1', label: '1', peso: 1 },
    { code: 'Digit2', label: '2', peso: 1 },
    { code: 'Digit3', label: '3', peso: 1 },
    { code: 'Digit4', label: '4', peso: 1 },
    { code: 'Digit5', label: '5', peso: 1 },
    { code: 'Digit6', label: '6', peso: 1 },
    { code: 'Digit7', label: '7', peso: 1 },
    { code: 'Digit8', label: '8', peso: 1 },
    { code: 'Digit9', label: '9', peso: 1 },
    { code: 'Digit0', label: '0', peso: 1 },
    { code: 'Minus', label: '-', peso: 1 },
    { code: 'Equal', label: '=', peso: 1 },
    { code: 'Backspace', label: '⌫', peso: 2 },
  ],
  [
    { code: 'Tab', label: 'tab', peso: 1.5 },
    { code: 'KeyQ', label: 'Q', peso: 1 },
    { code: 'KeyW', label: 'W', peso: 1 },
    { code: 'KeyE', label: 'E', peso: 1 },
    { code: 'KeyR', label: 'R', peso: 1 },
    { code: 'KeyT', label: 'T', peso: 1 },
    { code: 'KeyY', label: 'Y', peso: 1 },
    { code: 'KeyU', label: 'U', peso: 1 },
    { code: 'KeyI', label: 'I', peso: 1 },
    { code: 'KeyO', label: 'O', peso: 1 },
    { code: 'KeyP', label: 'P', peso: 1 },
    { code: 'BracketLeft', label: '´', peso: 1 },
    { code: 'BracketRight', label: '[', peso: 1 },
  ],
  [
    { code: 'CapsLock', label: 'caps', peso: 1.75 },
    { code: 'KeyA', label: 'A', peso: 1 },
    { code: 'KeyS', label: 'S', peso: 1 },
    { code: 'KeyD', label: 'D', peso: 1 },
    { code: 'KeyF', label: 'F', peso: 1 },
    { code: 'KeyG', label: 'G', peso: 1 },
    { code: 'KeyH', label: 'H', peso: 1 },
    { code: 'KeyJ', label: 'J', peso: 1 },
    { code: 'KeyK', label: 'K', peso: 1 },
    { code: 'KeyL', label: 'L', peso: 1 },
    { code: 'Semicolon', label: 'Ç', peso: 1 },
    { code: 'Quote', label: '~ ^', peso: 1 },
    { code: 'Enter', label: '↵', peso: 1.75 },
  ],
  [
    { code: 'ShiftLeft', label: 'shift', peso: 1.75 },
    { code: 'IntlBackslash', label: '\\', peso: 1 },
    { code: 'KeyZ', label: 'Z', peso: 1 },
    { code: 'KeyX', label: 'X', peso: 1 },
    { code: 'KeyC', label: 'C', peso: 1 },
    { code: 'KeyV', label: 'V', peso: 1 },
    { code: 'KeyB', label: 'B', peso: 1 },
    { code: 'KeyN', label: 'N', peso: 1 },
    { code: 'KeyM', label: 'M', peso: 1 },
    { code: 'Comma', label: ',', peso: 1 },
    { code: 'Period', label: '.', peso: 1 },
    { code: 'Slash', label: ';', peso: 1 },
    { code: 'ShiftRight', label: 'shift', peso: 1.75 },
  ],
  [
    { code: 'ControlLeft', label: 'ctrl', peso: 1.25 },
    { code: 'MetaLeft', label: '⊞', peso: 1 },
    { code: 'AltLeft', label: 'alt', peso: 1.1 },
    { code: 'Space', label: 'espaço', peso: 5.5 },
    { code: 'AltRight', label: 'alt gr', peso: 1.1 },
    { code: 'ControlRight', label: 'ctrl', peso: 1.25 },
  ],
];

// Numpad - fica à direita do bloco principal num teclado completo de
// verdade. Simplificado: sem NumLock/operadores/Enter próprio, grid
// simples de 3 colunas em vez do formato real (que tem o 0 ocupando
// duas colunas e o + ocupando duas linhas) - o objetivo é mostrar que
// "tem números dos dois lados", não replicar cada tecla à risca.
const NUMPAD = [
  [
    { code: 'Numpad7', label: '7' },
    { code: 'Numpad8', label: '8' },
    { code: 'Numpad9', label: '9' },
  ],
  [
    { code: 'Numpad4', label: '4' },
    { code: 'Numpad5', label: '5' },
    { code: 'Numpad6', label: '6' },
  ],
  [
    { code: 'Numpad1', label: '1' },
    { code: 'Numpad2', label: '2' },
    { code: 'Numpad3', label: '3' },
  ],
  [
    { code: 'Numpad0', label: '0' },
    { code: 'NumpadDecimal', label: ',' },
  ],
];

export function TecladoCompleto({ teclasDestacadas = [] }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.teclado} aria-hidden>
        {FILEIRAS.map((fileira, i) => (
          <div key={i} className={styles.linha}>
            {fileira.map((tecla) => (
              <span
                key={tecla.code}
                className={`${styles.tecla} ${teclasDestacadas.includes(tecla.code) ? styles.destacada : ''}`}
                style={{ flexGrow: tecla.peso }}
              >
                {tecla.label}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Numpad - números "do outro lado" também, como num teclado
          completo de verdade. Simplificado (sem NumLock/operadores/
          Enter próprio, sem espalhar o 0 por duas colunas) - o
          objetivo aqui é mostrar que existe, não replicar cada tecla. */}
      <div className={styles.numpad} aria-hidden>
        {NUMPAD.map((fileira, i) => (
          <div key={i} className={styles.numpadLinha}>
            {fileira.map((tecla) => (
              <span
                key={tecla.code}
                className={`${styles.tecla} ${teclasDestacadas.includes(tecla.code) ? styles.destacada : ''}`}
              >
                {tecla.label}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}