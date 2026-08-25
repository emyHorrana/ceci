import React from 'react';
import { buildKeyboardModel } from '../../utils/keyboardSvg';

export function TecladoSvg({ destaque, maxWidth = '960px', className, style }) {
  const model = buildKeyboardModel(destaque);

  return (
    <svg
      viewBox={model.viewBox}
      className={className}
      style={{
        width: '100%',
        maxWidth,
        height: 'auto',
        display: 'block',
        margin: '0.25rem auto',
        ...style,
      }}
      role="img"
      aria-label="Teclado do computador"
    >
      {/* Quadro externo */}
      <rect
        x="2"
        y="2"
        width="1034"
        height="274"
        rx="10"
        fill={model.bg}
        stroke={model.border}
        strokeWidth="1.5"
      />

      {/* Teclas */}
      {model.keys.map((k, i) => {
        const isSingleLetter = k.label.length === 1 && k.label >= 'A' && k.label <= 'Z';
        const isSingleDigit = k.label.length === 1 && k.label >= '0' && k.label <= '9';
        const isArrow = ['↑', '↓', '←', '→'].includes(k.label);

        const fontSize = isSingleLetter || isSingleDigit || isArrow
          ? '20px'
          : k.label.length > 4
          ? '12px'
          : k.label.length > 2
          ? '13px'
          : '14px';

        const textY = k.y + k.h / 2 + (parseInt(fontSize, 10) >= 20 ? 7 : 5);
        const textX = k.x + k.w / 2;

        return (
          <g key={`${k.code || k.label}-${i}`}>
            {/* Sombra 3D sutil */}
            <rect
              x={k.x}
              y={k.y + 1}
              width={k.w}
              height={k.h}
              rx={model.radius}
              fill="#94a3b8"
              opacity="0.25"
            />
            {/* Tecla */}
            <rect
              x={k.x}
              y={k.y}
              width={k.w}
              height={k.h}
              rx={model.radius}
              fill={k.st.bg}
              stroke={k.st.border}
              strokeWidth={k.st.bold ? 2.8 : 1.2}
            />
            {/* Rótulo */}
            <text
              x={textX}
              y={textY}
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontSize={fontSize}
              fontWeight={k.st.bold ? '700' : '600'}
              fill={k.st.text}
              textAnchor="middle"
            >
              {k.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
