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
