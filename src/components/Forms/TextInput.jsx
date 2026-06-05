// TextInput.jsx
// Campo de texto acessível do CECI.
// Suporta label, hint, mensagem de erro e atributos de acessibilidade (aria).
//
// Props:
//   label        - texto do label visível acima do campo
//   value        - valor controlado do input
//   onChange     - função chamada ao alterar o valor
//   type         - tipo do input HTML (padrão: 'text')
//   placeholder  - texto de placeholder
//   error        - mensagem de erro (exibida abaixo do campo com ícone ⚠️)
//   hint         - dica informativa (exibida se não houver erro)
//   required     - exibe asterisco no label e atributo required no input
//   disabled     - desabilita o campo
//   autoComplete - valor do atributo autocomplete do navegador

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
  // Gera ID único para associar label e input via htmlFor/id
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
      {/* Mensagem de erro com ID para aria-describedby */}
      {error && (
        <span id={`error-${id}`} className={styles.errorMessage}>
          ⚠️ {error}
        </span>
      )}
      {/* Dica informativa exibida apenas quando não há erro */}
      {hint && !error && (
        <span id={`hint-${id}`} className={styles.hint}>
          {hint}
        </span>
      )}
    </div>
  );
}