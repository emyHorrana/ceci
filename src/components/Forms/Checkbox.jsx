// Checkbox.jsx
// Campo de seleção booleana do CECI.
// Label clicável associada ao input via htmlFor/id para acessibilidade.
//
// Props:
//   label    - texto exibido ao lado do checkbox
//   checked  - estado controlado (true/false)
//   onChange - função chamada ao alternar o valor
//   disabled - desabilita o campo (padrão: false)

import styles from './Forms.module.css';

export function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  ...props
}) {
  // Gera ID único para associar label e input via htmlFor/id
  const id = props.id || `checkbox-${Math.random()}`;

  return (
    <div className={styles.checkboxGroup}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={styles.checkbox}
        {...props}
      />
      {label && (
        <label htmlFor={id} className={styles.checkboxLabel}>
          {label}
        </label>
      )}
    </div>
  );
}
