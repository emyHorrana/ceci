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
  const className = [
    styles.buttonSecondary,
    styles[`size-${size}`],
    fullWidth ? styles.fullWidth : ''
  ].filter(Boolean).join(' ');

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      {...props}
    >
      {children}
    </button>
  );
}