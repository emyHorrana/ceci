// ButtonPrimary.jsx
// Botão de ação principal do CECI (cor sólida de destaque).
// Usado para ações primárias como "Entrar", "Próxima aula", "Finalizar".
//
// Props:
//   children   - conteúdo do botão
//   onClick    - função chamada ao clicar
//   disabled   - desabilita o botão (padrão: false)
//   ariaLabel  - texto alternativo de acessibilidade (padrão: children)
//   size       - 'small' | 'medium' | 'large' (padrão: 'medium')
//   fullWidth  - ocupa 100% da largura do container (padrão: false)

import styles from './Buttons.module.css';

export function ButtonPrimary({
  children,
  onClick,
  disabled = false,
  ariaLabel,
  size = 'medium',
  fullWidth = false,
  ...props
}) {
  const className = `
    ${styles.buttonPrimary}
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
