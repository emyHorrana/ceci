/**
 * keyboardSvg.js
 * Utilitário para gerar ilustrações e componentes SVG nítidos, espaçosos e padronizados
 * do teclado completo ABNT2.
 * 
 * Suporta destaques por:
 * - Tipo de grupo: 'letras' | 'numeros' | 'simbolos' | 'fileira-base'
 * - Nome da tecla: 'espaco' | 'enter' | 'backspace' | 'capslock' | 'shift' | 'shift-esquerdo' |
 *                  'shift-direito' | 'esc' | 'tab' | 'windows' | 'ctrl' | 'alt' | 'altgr' |
 *                  'seta-cima' | 'seta-baixo' | 'seta-esquerda' | 'seta-direita' | 'home' | 'end' | etc.
 * - Array de teclas/códigos (ex: ['ControlLeft', 'KeyC'] ou ['ctrl', 'c'])
 */

function escapeXml(unsafe) {
  if (typeof unsafe !== 'string') return String(unsafe ?? '');
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function normalizeKeyIdentifier(k) {
  if (!k) return [];
  const s = String(k).toLowerCase().replace(/[^a-z0-9]/g, '');
  if (s === 'shift') return ['shiftleft', 'shiftright'];
  if (s === 'shiftesquerdo') return ['shiftleft'];
  if (s === 'shiftdireito') return ['shiftright'];
  if (s === 'ctrl' || s === 'control') return ['controlleft', 'controlright'];
  if (s === 'ctrlesquerdo') return ['controlleft'];
  if (s === 'ctrldireito') return ['controlright'];
  if (s === 'alt') return ['altleft'];
  if (s === 'altgr' || s === 'altdireito') return ['altright'];
  if (s === 'windows' || s === 'meta' || s === 'win') return ['metaleft', 'metaright'];
  if (s === 'espaco' || s === 'space') return ['space'];
  if (s === 'enter') return ['enter', 'numpadenter'];
  if (s === 'backspace') return ['backspace'];
  if (s === 'delete' || s === 'del') return ['delete'];
  if (s === 'capslock' || s === 'caps') return ['capslock'];
  if (s === 'esc' || s === 'escape') return ['escape'];
  if (s === 'tab') return ['tab'];
  if (s === 'setacima' || s === 'arrowup' || s === 'cima') return ['arrowup'];
  if (s === 'setabaixo' || s === 'arrowdown' || s === 'baixo') return ['arrowdown'];
  if (s === 'setaesquerda' || s === 'arrowleft' || s === 'esquerda') return ['arrowleft'];
  if (s === 'setadireita' || s === 'arrowright' || s === 'direita') return ['arrowright'];
  if (s === 'home') return ['home'];
  if (s === 'end') return ['end'];
  if (s === 'pageup' || s === 'pgup') return ['pageup'];
  if (s === 'pagedown' || s === 'pgdn') return ['pagedown'];
  if (s === 'insert' || s === 'ins') return ['insert'];
  if (s === 'numlock') return ['numlock'];
  if (s.length === 1 && s >= 'a' && s <= 'z') return [`key${s}`];
  if (s.length === 1 && s >= '0' && s <= '9') return [`digit${s}`, `numpad${s}`];
  return [s];
}

export function buildKeyboardModel(destaque) {
  const K_W = 42;
  const K_H = 42;
  const GAP = 4;
  const RADIUS = 6;

  const C_BG = '#f8f9fa';
  const C_BORDER = '#e2e8f0';
  const C_KEY_BG = '#ffffff';
  const C_KEY_BORDER = '#cbd5e1';
  const C_KEY_TEXT = '#334155';
  
  // Cores de destaque primário (Amarelo sol / dourado)
  const C_HL_BG = '#ffe066';
  const C_HL_BORDER = '#f59f00';
  const C_HL_TEXT = '#1e1e1e';

  // Cores secundárias de destaque (Âmbar para mão direita na fileira base)
  const C_HL2_BG = '#ffc078';
  const C_HL2_BORDER = '#e8590c';
  const C_HL2_TEXT = '#1e1e1e';

  // Constrói conjunto normalizado de códigos destacados
  const targets = new Set();
  let modoGrupo = null;

  if (typeof destaque === 'string') {
    if (['letras', 'numeros', 'simbolos', 'fileira-base'].includes(destaque)) {
      modoGrupo = destaque;
    } else {
      normalizeKeyIdentifier(destaque).forEach((c) => targets.add(c));
    }
  } else if (Array.isArray(destaque)) {
    destaque.forEach((item) => {
      normalizeKeyIdentifier(item).forEach((c) => targets.add(c));
    });
  }

  const rowsMain = [
    // Row 0 - Function
    [
      { label: 'esc', code: 'Escape', w: 46, h: 28, special: true },
      { spacer: 24 },
      { label: 'F1', code: 'F1', w: 42, h: 28 },
      { label: 'F2', code: 'F2', w: 42, h: 28 },
      { label: 'F3', code: 'F3', w: 42, h: 28 },
      { label: 'F4', code: 'F4', w: 42, h: 28 },
      { spacer: 24 },
      { label: 'F5', code: 'F5', w: 42, h: 28 },
      { label: 'F6', code: 'F6', w: 42, h: 28 },
      { label: 'F7', code: 'F7', w: 42, h: 28 },
      { label: 'F8', code: 'F8', w: 42, h: 28 },
      { spacer: 24 },
      { label: 'F9', code: 'F9', w: 42, h: 28 },
      { label: 'F10', code: 'F10', w: 42, h: 28 },
      { label: 'F11', code: 'F11', w: 42, h: 28 },
      { label: 'F12', code: 'F12', w: 42, h: 28 },
    ],
    // Row 1 - Numbers
    [
      { label: "' `", code: 'Backquote', type: 'symbol' },
      { label: '1', sub: '!', code: 'Digit1', type: 'number' },
      { label: '2', sub: '@', code: 'Digit2', type: 'number' },
      { label: '3', sub: '#', code: 'Digit3', type: 'number' },
      { label: '4', sub: '$', code: 'Digit4', type: 'number' },
      { label: '5', sub: '%', code: 'Digit5', type: 'number' },
      { label: '6', sub: '¨', code: 'Digit6', type: 'number' },
      { label: '7', sub: '&', code: 'Digit7', type: 'number' },
      { label: '8', sub: '*', code: 'Digit8', type: 'number' },
      { label: '9', sub: '(', code: 'Digit9', type: 'number' },
      { label: '0', sub: ')', code: 'Digit0', type: 'number' },
      { label: '-', sub: '_', code: 'Minus', type: 'symbol' },
      { label: '=', sub: '+', code: 'Equal', type: 'symbol' },
      { label: '⌫', code: 'Backspace', w: 84, special: true },
    ],
    // Row 2 - QWERTY
    [
      { label: 'tab', code: 'Tab', w: 64, special: true },
      { label: 'Q', code: 'KeyQ', type: 'letter' },
      { label: 'W', code: 'KeyW', type: 'letter' },
      { label: 'E', code: 'KeyE', type: 'letter' },
      { label: 'R', code: 'KeyR', type: 'letter' },
      { label: 'T', code: 'KeyT', type: 'letter' },
      { label: 'Y', code: 'KeyY', type: 'letter' },
      { label: 'U', code: 'KeyU', type: 'letter' },
      { label: 'I', code: 'KeyI', type: 'letter' },
      { label: 'O', code: 'KeyO', type: 'letter' },
      { label: 'P', code: 'KeyP', type: 'letter' },
      { label: '´ `', code: 'BracketLeft', type: 'symbol' },
      { label: '[ {', code: 'BracketRight', type: 'symbol' },
      { label: '↵', code: 'Enter', w: 62, special: true },
    ],
    // Row 3 - ASDF (Home Row)
    [
      { label: 'caps', code: 'CapsLock', w: 74, special: true },
      { label: 'A', code: 'KeyA', type: 'letter', homeLeft: true },
      { label: 'S', code: 'KeyS', type: 'letter', homeLeft: true },
      { label: 'D', code: 'KeyD', type: 'letter', homeLeft: true },
      { label: 'F', code: 'KeyF', type: 'letter', homeLeft: true },
      { label: 'G', code: 'KeyG', type: 'letter' },
      { label: 'H', code: 'KeyH', type: 'letter' },
      { label: 'J', code: 'KeyJ', type: 'letter', homeRight: true },
      { label: 'K', code: 'KeyK', type: 'letter', homeRight: true },
      { label: 'L', code: 'KeyL', type: 'letter', homeRight: true },
      { label: 'Ç', code: 'Semicolon', type: 'letter', homeRight: true },
      { label: '~ ^', code: 'Quote', type: 'symbol' },
      { label: '] }', code: 'Backslash', type: 'symbol' },
      { label: '↵', code: 'Enter', w: 52, special: true },
    ],
    // Row 4 - ZXCV
    [
      { label: 'shift', code: 'ShiftLeft', w: 58, special: true },
      { label: '\\ |', code: 'IntlBackslash', type: 'symbol' },
      { label: 'Z', code: 'KeyZ', type: 'letter' },
      { label: 'X', code: 'KeyX', type: 'letter' },
      { label: 'C', code: 'KeyC', type: 'letter' },
      { label: 'V', code: 'KeyV', type: 'letter' },
      { label: 'B', code: 'KeyB', type: 'letter' },
      { label: 'N', code: 'KeyN', type: 'letter' },
      { label: 'M', code: 'KeyM', type: 'letter' },
      { label: ', <', code: 'Comma', type: 'symbol' },
      { label: '. >', code: 'Period', type: 'symbol' },
      { label: '; :', code: 'Slash', type: 'symbol', homeRight: true },
      { label: '/ ?', code: 'IntlRo', type: 'symbol' },
      { label: 'shift', code: 'ShiftRight', w: 68, special: true },
    ],
    // Row 5 - Modifiers & Space
    [
      { label: 'ctrl', code: 'ControlLeft', w: 56, special: true },
      { label: '⊞', code: 'MetaLeft', w: 46, special: true },
      { label: 'alt', code: 'AltLeft', w: 50, special: true },
      { label: 'espaço', code: 'Space', w: 290, special: true },
      { label: 'alt gr', code: 'AltRight', w: 50, special: true },
      { label: '⊞', code: 'MetaRight', w: 46, special: true },
      { label: 'ctrl', code: 'ControlRight', w: 56, special: true },
    ],
  ];

  // Nav cluster
  const navRows = [
    // Row 0
    [
      { label: 'prt', code: 'PrintScreen', w: 42, h: 28, special: true },
      { label: 'scr', code: 'ScrollLock', w: 42, h: 28, special: true },
      { label: 'pau', code: 'Pause', w: 42, h: 28, special: true },
    ],
    // Row 1 & 2
    [
      { label: 'ins', code: 'Insert', w: 42, h: 42, special: true },
      { label: 'home', code: 'Home', w: 42, h: 42, special: true },
      { label: 'pg↑', code: 'PageUp', w: 42, h: 42, special: true },
    ],
    [
      { label: 'del', code: 'Delete', w: 42, h: 42, special: true },
      { label: 'end', code: 'End', w: 42, h: 42, special: true },
      { label: 'pg↓', code: 'PageDown', w: 42, h: 42, special: true },
    ],
  ];

  const arrows = [
    { label: '↑', code: 'ArrowUp', x: 46, y: 0, w: 42, h: 42, special: true },
    { label: '←', code: 'ArrowLeft', x: 0, y: 46, w: 42, h: 42, special: true },
    { label: '↓', code: 'ArrowDown', x: 46, y: 46, w: 42, h: 42, special: true },
    { label: '→', code: 'ArrowRight', x: 92, y: 46, w: 42, h: 42, special: true },
  ];

  // Numpad
  const numpadRows = [
    [
      { label: 'num', code: 'NumLock', w: 42, h: 42, special: true },
      { label: '/', code: 'NumpadDivide', w: 42, h: 42, type: 'symbol' },
      { label: '*', code: 'NumpadMultiply', w: 42, h: 42, type: 'symbol' },
      { label: '-', code: 'NumpadSubtract', w: 42, h: 42, type: 'symbol' },
    ],
    [
      { label: '7', code: 'Numpad7', x: 0, y: 0, w: 42, h: 42, type: 'number' },
      { label: '8', code: 'Numpad8', x: 46, y: 0, w: 42, h: 42, type: 'number' },
      { label: '9', code: 'Numpad9', x: 92, y: 0, w: 42, h: 42, type: 'number' },
      { label: '+', code: 'NumpadAdd', x: 138, y: 0, w: 42, h: 88, special: true },
      { label: '4', code: 'Numpad4', x: 0, y: 46, w: 42, h: 42, type: 'number' },
      { label: '5', code: 'Numpad5', x: 46, y: 46, w: 42, h: 42, type: 'number' },
      { label: '6', code: 'Numpad6', x: 92, y: 46, w: 42, h: 42, type: 'number' },
      { label: '1', code: 'Numpad1', x: 0, y: 92, w: 42, h: 42, type: 'number' },
      { label: '2', code: 'Numpad2', x: 46, y: 92, w: 42, h: 42, type: 'number' },
      { label: '3', code: 'Numpad3', x: 92, y: 92, w: 42, h: 42, type: 'number' },
      { label: '↵', code: 'NumpadEnter', x: 138, y: 92, w: 42, h: 88, special: true },
      { label: '0', code: 'Numpad0', x: 0, y: 138, w: 88, h: 42, type: 'number' },
      { label: ',', code: 'NumpadDecimal', x: 92, y: 138, w: 42, h: 42, type: 'symbol' },
    ],
  ];

  function isHighlighted(key) {
    if (modoGrupo === 'letras') return key.type === 'letter';
    if (modoGrupo === 'numeros') return key.type === 'number';
    if (modoGrupo === 'simbolos') return key.type === 'symbol';
    if (modoGrupo === 'fileira-base') return key.homeLeft || key.homeRight;
    if (key.code && targets.has(key.code.toLowerCase())) return true;
    return false;
  }

  function getKeyStyle(key) {
    if (modoGrupo === 'fileira-base') {
      if (key.homeLeft) {
        return { bg: C_HL_BG, border: C_HL_BORDER, text: C_HL_TEXT, bold: true };
      }
      if (key.homeRight) {
        return { bg: C_HL2_BG, border: C_HL2_BORDER, text: C_HL2_TEXT, bold: true };
      }
    }

    if (isHighlighted(key)) {
      return { bg: C_HL_BG, border: C_HL_BORDER, text: C_HL_TEXT, bold: true };
    }

    return { bg: C_KEY_BG, border: C_KEY_BORDER, text: C_KEY_TEXT, bold: false };
  }

  // Lista de renderização de teclas
  const keysToRender = [];

  // Main block
  let curY = 6;
  rowsMain.forEach((row, rIdx) => {
    let curX = 6;
    const rowH = rIdx === 0 ? 28 : K_H;

    row.forEach((key) => {
      if (key.spacer) {
        curX += key.spacer;
        return;
      }
      const kw = key.w || K_W;
      const kh = key.h || rowH;
      const st = getKeyStyle(key);

      keysToRender.push({
        x: curX,
        y: curY,
        w: kw,
        h: kh,
        label: key.label,
        sub: key.sub,
        code: key.code,
        st,
      });

      curX += kw + GAP;
    });

    curY += rowH + (rIdx === 0 ? 10 : GAP);
  });

  // Nav cluster
  const navX = 702;
  // Row 0
  navRows[0].forEach((key, idx) => {
    const kx = navX + idx * (42 + GAP);
    const st = getKeyStyle(key);
    keysToRender.push({
      x: kx,
      y: 6,
      w: 42,
      h: 28,
      label: key.label,
      code: key.code,
      st,
    });
  });

  // Rows 1 & 2
  [navRows[1], navRows[2]].forEach((row, rIdx) => {
    row.forEach((key, cIdx) => {
      const kx = navX + cIdx * (42 + GAP);
      const ky = 90 + rIdx * (42 + GAP);
      const st = getKeyStyle(key);
      keysToRender.push({
        x: kx,
        y: ky,
        w: 42,
        h: 42,
        label: key.label,
        code: key.code,
        st,
      });
    });
  });

  // Arrows
  const arrowBaseX = 702;
  const arrowBaseY = 182;
  arrows.forEach((arr) => {
    const ax = arrowBaseX + arr.x;
    const ay = arrowBaseY + arr.y;
    const st = getKeyStyle(arr);
    keysToRender.push({
      x: ax,
      y: ay,
      w: arr.w,
      h: arr.h,
      label: arr.label,
      code: arr.code,
      st,
    });
  });

  // Numpad
  const numX = 850;
  // Row 0
  numpadRows[0].forEach((key, cIdx) => {
    const kx = numX + cIdx * (42 + GAP);
    const st = getKeyStyle(key);
    keysToRender.push({
      x: kx,
      y: 44,
      w: 42,
      h: 42,
      label: key.label,
      code: key.code,
      st,
    });
  });

  // Rows 1-4
  numpadRows[1].forEach((nk) => {
    const kx = numX + nk.x;
    const ky = 90 + nk.y;
    const st = getKeyStyle(nk);
    keysToRender.push({
      x: kx,
      y: ky,
      w: nk.w,
      h: nk.h,
      label: nk.label,
      code: nk.code,
      st,
    });
  });

  return {
    viewBox: '0 0 1038 278',
    bg: C_BG,
    border: C_BORDER,
    radius: RADIUS,
    keys: keysToRender,
  };
}

/**
 * Gera string SVG estática completa para HTML
 */
export function gerarTecladoSvg(tipoDestaque = 'letras') {
  const model = buildKeyboardModel(tipoDestaque);
  const elements = [];

  // Quadro de fundo com acabamento suave
  elements.push(
    `<rect x="2" y="2" width="1034" height="274" rx="10" fill="${model.bg}" stroke="${model.border}" stroke-width="1.5" />`
  );

  model.keys.forEach((k) => {
    // Sombra sutil / 3D keycap
    elements.push(
      `<rect x="${k.x}" y="${k.y + 1}" width="${k.w}" height="${k.h}" rx="${model.radius}" fill="#94a3b8" opacity="0.25" />`
    );
    // Keycap
    elements.push(
      `<rect x="${k.x}" y="${k.y}" width="${k.w}" height="${k.h}" rx="${model.radius}" fill="${k.st.bg}" stroke="${k.st.border}" stroke-width="${k.st.bold ? '2.8' : '1.2'}" />`
    );

    const isSingleLetter = k.label.length === 1 && k.label >= 'A' && k.label <= 'Z';
    const isSingleDigit = k.label.length === 1 && k.label >= '0' && k.label <= '9';
    const isArrow = ['↑', '↓', '←', '→'].includes(k.label);

    const fontSize = isSingleLetter || isSingleDigit || isArrow
      ? '20'
      : k.label.length > 4
      ? '12'
      : k.label.length > 2
      ? '13'
      : '14';

    const textY = k.y + k.h / 2 + (parseInt(fontSize, 10) >= 20 ? 7 : 5);
    const textX = k.x + k.w / 2;

    elements.push(
      `<text x="${textX}" y="${textY}" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${fontSize}" font-weight="${k.st.bold ? '700' : '600'}" fill="${k.st.text}" text-anchor="middle">${escapeXml(k.label)}</text>`
    );
  });

  const ariaLabel =
    tipoDestaque === 'letras'
      ? 'Teclado completo com destaque na área das letras'
      : tipoDestaque === 'numeros'
      ? 'Teclado completo com destaque na fileira superior e bloco numérico'
      : tipoDestaque === 'simbolos'
      ? 'Teclado completo com destaque nas teclas de símbolos'
      : 'Teclado completo com destaque na fileira base das mãos';

  return `<svg viewBox="${model.viewBox}" style="width:100%;max-width:880px;height:auto;display:block;margin:1.25rem auto;" role="img" aria-label="${ariaLabel}">${elements.join('')}</svg>`;
}

/**
 * Diagrama SVG detalhado da fileira base com indicação de dedos
 */
export function gerarFileiraBaseDetalhadaSvg() {
  return `<svg viewBox="0 0 520 110" style="width:100%;max-width:520px;height:auto;display:block;margin:1.25rem auto;" role="img" aria-label="Fileira base do teclado: mão esquerda em amarelo (A, S, D, F) e mão direita em âmbar (J, K, L, Ç)">
  <!-- Mão Esquerda -->
  <g>
    <rect x="10" y="10" width="50" height="54" rx="6" fill="#ffe066" stroke="#f59f00" stroke-width="2.5" />
    <text x="35" y="44" font-family="sans-serif" font-size="22" font-weight="700" fill="#1e1e1e" text-anchor="middle">A</text>
    <text x="35" y="86" font-family="sans-serif" font-size="12" font-weight="600" fill="#4b5563" text-anchor="middle">Mindinho</text>

    <rect x="68" y="10" width="50" height="54" rx="6" fill="#ffe066" stroke="#f59f00" stroke-width="2.5" />
    <text x="93" y="44" font-family="sans-serif" font-size="22" font-weight="700" fill="#1e1e1e" text-anchor="middle">S</text>
    <text x="93" y="86" font-family="sans-serif" font-size="12" font-weight="600" fill="#4b5563" text-anchor="middle">Anelar</text>

    <rect x="126" y="10" width="50" height="54" rx="6" fill="#ffe066" stroke="#f59f00" stroke-width="2.5" />
    <text x="151" y="44" font-family="sans-serif" font-size="22" font-weight="700" fill="#1e1e1e" text-anchor="middle">D</text>
    <text x="151" y="86" font-family="sans-serif" font-size="12" font-weight="600" fill="#4b5563" text-anchor="middle">Médio</text>

    <rect x="184" y="10" width="50" height="54" rx="6" fill="#ffe066" stroke="#f59f00" stroke-width="2.5" />
    <text x="209" y="44" font-family="sans-serif" font-size="22" font-weight="700" fill="#1e1e1e" text-anchor="middle">F</text>
    <text x="209" y="86" font-family="sans-serif" font-size="12" font-weight="600" fill="#4b5563" text-anchor="middle">Indicador</text>
  </g>

  <!-- Divisor central -->
  <line x1="259" y1="12" x2="259" y2="98" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="4 4" />

  <!-- Mão Direita -->
  <g>
    <rect x="284" y="10" width="50" height="54" rx="6" fill="#ffc078" stroke="#e8590c" stroke-width="2.5" />
    <text x="309" y="44" font-family="sans-serif" font-size="22" font-weight="700" fill="#1e1e1e" text-anchor="middle">J</text>
    <text x="309" y="86" font-family="sans-serif" font-size="12" font-weight="600" fill="#4b5563" text-anchor="middle">Indicador</text>

    <rect x="342" y="10" width="50" height="54" rx="6" fill="#ffc078" stroke="#e8590c" stroke-width="2.5" />
    <text x="367" y="44" font-family="sans-serif" font-size="22" font-weight="700" fill="#1e1e1e" text-anchor="middle">K</text>
    <text x="367" y="86" font-family="sans-serif" font-size="12" font-weight="600" fill="#4b5563" text-anchor="middle">Médio</text>

    <rect x="400" y="10" width="50" height="54" rx="6" fill="#ffc078" stroke="#e8590c" stroke-width="2.5" />
    <text x="425" y="44" font-family="sans-serif" font-size="22" font-weight="700" fill="#1e1e1e" text-anchor="middle">L</text>
    <text x="425" y="86" font-family="sans-serif" font-size="12" font-weight="600" fill="#4b5563" text-anchor="middle">Anelar</text>

    <rect x="458" y="10" width="50" height="54" rx="6" fill="#ffc078" stroke="#e8590c" stroke-width="2.5" />
    <text x="483" y="44" font-family="sans-serif" font-size="22" font-weight="700" fill="#1e1e1e" text-anchor="middle">Ç</text>
    <text x="483" y="86" font-family="sans-serif" font-size="12" font-weight="600" fill="#4b5563" text-anchor="middle">Mindinho</text>
  </g>
</svg>`;
}
