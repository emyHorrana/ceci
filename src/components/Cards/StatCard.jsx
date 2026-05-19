import styles from './Cards.module.css';

export function StatCard({ 
  icon, 
  value, 
  label,
  color = 'blue' // 'blue' | 'teal' | 'amber' | 'coral'
}) {
  return (
    <div className={`${styles.statCard} ${styles[`color-${color}`]}`}>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

