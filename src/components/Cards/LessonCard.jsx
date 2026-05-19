export function LessonCard({ 
  lessonNumber,
  title, 
  type = 'teoria', // 'teoria' | 'pratica' | 'desafio'
  completed = false,
  onClick
}) {
  const typeEmoji = {
    teoria: '📖',
    pratica: '⚡',
    desafio: '🎯'
  };

  return (
    <div 
      className={`${styles.lessonCard} ${completed ? styles.completed : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick?.()}
    >
      <div className={styles.lessonNumber}>{lessonNumber}</div>
      <div className={styles.lessonContent}>
        <div className={styles.lessonType}>{typeEmoji[type]}</div>
        <div className={styles.lessonTitle}>{title}</div>
      </div>
      {completed && <div className={styles.completedBadge}>✓</div>}
    </div>
  );
}