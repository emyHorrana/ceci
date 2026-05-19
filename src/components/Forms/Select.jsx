export function Select({ 
  label, 
  value, 
  onChange, 
  options = [],
  error,
  required = false,
  disabled = false,
  ...props 
}) {
  const id = props.id || `select-${Math.random()}`;

  return (
    <div className={styles.formGroup}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${styles.select} ${error ? styles.error : ''}`}
        aria-invalid={!!error}
        {...props}
      >
        <option value="">Selecione uma opção...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span className={styles.errorMessage}>⚠️ {error}</span>
      )}
    </div>
  );
}