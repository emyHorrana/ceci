// LessonCard.jsx
// Card de lição individual dentro de um módulo.
// Exibe número, tipo (teoria/prática/desafio) e status de conclusão.
// Clicável via mouse e teclado (Enter) para acessibilidade.
//
// Props:
//   lessonNumber - número sequencial da lição
//   title        - título da lição
//   type         - 'teoria' | 'pratica' | 'desafio' (padrão: 'teoria')
//   completed    - indica se a lição foi concluída (padrão: false)
//   onClick      - função chamada ao clicar no card

import styles from './Cards.module.css';

// Mapeamento de tipo para emoji representativo
const TYPE_EMOJI = {
  teoria: '📖',
  pratica: '⚡',
  desafio: '🎯',
};

export function LessonCard({
  lessonNumber,
  title,
  type = 'teoria',
  completed = false,
  onClick,
}) {
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
        <div className={styles.lessonType}>{TYPE_EMOJI[type]}</div>
        <div className={styles.lessonTitle}>{title}</div>
      </div>
      {/* Badge de conclusão exibido apenas para lições já feitas */}
      {completed && <div className={styles.completedBadge}>✓</div>}
    </div>
  );
}
