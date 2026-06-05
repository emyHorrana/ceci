// ButtonIcon.jsx
// Botão compacto que exibe apenas um ícone (sem texto visível).
// Usado para ações como fechar modal, zoom, alto contraste, etc.
// Requer ariaLabel obrigatório para acessibilidade.
//
// Props:
//   icon       - elemento/emoji a exibir como ícone
//   onClick    - função chamada ao clicar
//   ariaLabel  - descrição da ação para leitores de tela (obrigatório)
//   disabled   - desabilita o botão (padrão: false)

import styles from './Buttons.module.css';

export function ButtonIcon({
  icon,
  onClick,
  ariaLabel,
  disabled = false,
  ...props
}) {
  return (
    <button
      className={styles.buttonIcon}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...props}
    >
      {icon}
    </button>
  );
}