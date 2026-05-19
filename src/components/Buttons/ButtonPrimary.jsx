// ButtonPrimary.jsx
import styles from './Buttons.module.css';

export function ButtonPrimary({ 
  children, 
  onClick, 
  disabled = false,
  ariaLabel,
  size = 'medium', // 'small' | 'medium' | 'large'
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
