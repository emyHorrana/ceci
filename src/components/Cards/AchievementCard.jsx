export function AchievementCard({ 
  emoji, 
  title, 
  description,
  unlocked = false
}) {
  return (
    <div className={`${styles.achievementCard} ${!unlocked ? styles.locked : ''}`}>
      <div className={styles.achievementEmoji}>{emoji}</div>
      <h4 className={styles.achievementTitle}>{title}</h4>
      {description && <p className={styles.achievementDesc}>{description}</p>}
    </div>
  );
}
