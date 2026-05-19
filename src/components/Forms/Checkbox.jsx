export function Checkbox({ 
  label, 
  checked, 
  onChange,
  disabled = false,
  ...props 
}) {
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
