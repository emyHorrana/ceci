// AchievementCard.jsx
// Card de conquista do aluno.
// Exibe emoji, título e descrição opcional da conquista.
// Conquistas bloqueadas recebem estilo visual diferenciado.
//
// Props:
//   emoji       - emoji representativo da conquista
//   title       - nome da conquista
//   description - descrição opcional da conquista
//   unlocked    - indica se a conquista foi desbloqueada (padrão: false)
//                 quando false, o card recebe estilo "bloqueado" e um
//                 pequeno cadeado ao lado do título

import styles from './Cards.module.css';

export function AchievementCard({
  emoji,
  title,
  description,
  unlocked = false,
}) {
  return (
    <div className={`${styles.achievementCard} ${!unlocked ? styles.locked : ''}`}>
      <div className={styles.achievementEmoji}>{emoji}</div>
      <h4 className={styles.achievementTitle}>
        {title}
        {!unlocked && <span className={styles.achievementLock} aria-label="Ainda não desbloqueada">🔒</span>}
      </h4>
      {description && (
        <p className={styles.achievementDesc}>{description}</p>
      )}
    </div>
  );
}
