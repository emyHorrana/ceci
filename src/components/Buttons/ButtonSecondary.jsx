// ButtonSecondary.jsx
// Botão de ação secundária do CECI (estilo diferenciado do primário).
// Usado para ações alternativas que precisam de menor destaque visual.
//
// Props:
//   children   - conteúdo do botão
//   onClick    - função chamada ao clicar
//   disabled   - desabilita o botão (padrão: false)
//   ariaLabel  - texto alternativo de acessibilidade (padrão: children)
//   size       - 'small' | 'medium' | 'large' (padrão: 'medium')
//   fullWidth  - ocupa 100% da largura do container (padrão: false)

import styles from './Buttons.module.css';

export function ButtonSecondary({
  children,
  onClick,
  disabled = false,
  ariaLabel,
  size = 'medium',
  fullWidth = false,
  ...props
}) {
  const className = `
    ${styles.buttonSecondary}
    ${styles[`size-${size}`]}
    ${fullWidth ? styles.fullWidth : ''}
  `.trim();

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || children}
      {...props}
    >
      {children}
    </button>
  );
}
