// Select.jsx
// Campo de seleção (dropdown) acessível do CECI.
// Renderiza automaticamente uma opção placeholder vazia no topo da lista.
//
// Props:
//   label    - texto do label visível acima do select
//   value    - valor controlado selecionado
//   onChange - função chamada ao selecionar uma opção
//   options  - array de opções: [{ value: string, label: string }]
//   error    - mensagem de erro exibida abaixo do campo
//   required - exibe asterisco no label
//   disabled - desabilita o campo (padrão: false)

import styles from './Forms.module.css';

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
  // Gera ID único para associar label e select via htmlFor/id
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
        {/* Opção padrão vazia (placeholder) */}
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
