// ButtonSecondary.jsx
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