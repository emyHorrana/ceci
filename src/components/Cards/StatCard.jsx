// StatCard.jsx
// Card de estatística compacto exibido no header do Dashboard.
// Usado para streak, pontos e moedas do aluno.
//
// Props:
//   icon  - emoji ou ícone representativo
//   value - valor numérico a exibir
//   label - legenda abaixo do valor (ex: 'dias', 'pontos', 'moedas')
//   color - variante de cor: 'blue' | 'teal' | 'amber' | 'coral' (padrão: 'blue')

import styles from './Cards.module.css';

export function StatCard({
  icon,
  value,
  label,
  color = 'blue',
}) {
  return (
    <div className={`${styles.statCard} ${styles[`color-${color}`]}`}>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}
