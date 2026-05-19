import styles from './Cards.module.css';

export function ModuleCard({ 
  title, 
  emoji, 
  progress, 
  lessonCount,
  status = 'inprogress', // 'inprogress' | 'featured' | 'locked'
  onClick,
  onContinueClick
}) {
  const statusClass = styles[`status-${status}`];
  
  return (
    <div className={`${styles.moduleCard} ${statusClass}`}>
      <div className={styles.moduleHeader}>
        <div className={styles.moduleEmoji}>{emoji}</div>
        <h3 className={styles.moduleTitle}>{title}</h3>
        {status === 'locked' && <span className={styles.lockBadge}>🔒</span>}
      </div>

      <div className={styles.moduleBody}>
        {status !== 'locked' && (
          <>
            <div className={styles.progressSection}>
              <div className={styles.progressLabel}>
                <span>Progresso</span>
                <span>{progress} de {lessonCount} aulas</span>
              </div>
              <div className={styles.progressTrack}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${(progress / lessonCount) * 100}%` }}
                />
              </div>
            </div>

            <div className={styles.lessonTags}>
              {Array.from({ length: Math.min(3, lessonCount) }).map((_, i) => (
                <span 
                  key={i} 
                  className={i < progress ? styles.tagCompleted : styles.tagLocked}
                >
                  Aula {i + 1}
                </span>
              ))}
              {lessonCount > 3 && <span className={styles.tagMore}>+{lessonCount - 3}</span>}
            </div>
          </>
        )}

        {status === 'locked' && (
          <p className={styles.lockedMessage}>
            Complete o módulo anterior para desbloquear
          </p>
        )}

        <button
          className={`${styles.continueButton} ${styles[`btn-${status}`]}`}
          onClick={onContinueClick}
          disabled={status === 'locked'}
        >
          {status === 'locked' ? 'Bloqueado 🔒' : 'Continuar'}
        </button>
      </div>
    </div>
  );
}
