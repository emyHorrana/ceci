export function TextArea({ 
  label, 
  value, 
  onChange, 
  placeholder,
  error,
  rows = 4,
  required = false,
  disabled = false,
  ...props 
}) {
  const id = props.id || `textarea-${Math.random()}`;

  return (
    <div className={styles.formGroup}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`${styles.textArea} ${error ? styles.error : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `error-${id}` : undefined}
        {...props}
      />
      {error && (
        <span id={`error-${id}`} className={styles.errorMessage}>
          ⚠️ {error}
        </span>
      )}
    </div>
  );
}