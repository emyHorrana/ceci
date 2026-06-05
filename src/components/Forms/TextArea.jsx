// TextArea.jsx
// Campo de texto multilinha acessível do CECI.
// Suporta label, mensagem de erro e atributos de acessibilidade (aria).
//
// Props:
//   label       - texto do label visível acima do campo
//   value       - valor controlado
//   onChange    - função chamada ao alterar o valor
//   placeholder - texto de placeholder
//   error       - mensagem de erro exibida abaixo do campo
//   rows        - número de linhas visíveis (padrão: 4)
//   required    - exibe asterisco no label
//   disabled    - desabilita o campo (padrão: false)

import styles from './Forms.module.css';

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
  // Gera ID único para associar label e textarea via htmlFor/id
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
      {/* Mensagem de erro com ID para aria-describedby */}
      {error && (
        <span id={`error-${id}`} className={styles.errorMessage}>
          ⚠️ {error}
        </span>
      )}
    </div>
  );
}
