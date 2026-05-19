import styles from './Forms.module.css';

export function TextInput({ 
  label, 
  value, 
  onChange, 
  type = 'text',
  placeholder,
  error,
  hint,
  required = false,
  disabled = false,
  autoComplete,
  ...props 
}) {
  const id = props.id || `input-${Math.random()}`;

  return (
    <div className={styles.formGroup}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`${styles.textInput} ${error ? styles.error : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `error-${id}` : hint ? `hint-${id}` : undefined}
        {...props}
      />
      {error && (
        <span id={`error-${id}`} className={styles.errorMessage}>
          ⚠️ {error}
        </span>
      )}
      {hint && !error && (
        <span id={`hint-${id}`} className={styles.hint}>
          {hint}
        </span>
      )}
    </div>
  );
}