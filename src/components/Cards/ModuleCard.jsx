// ModuleCard.jsx
// Card de módulo exibido no Dashboard do aluno.
// Mostra o progresso do aluno no módulo, tags das primeiras aulas
// e um botão de continuar (desabilitado se bloqueado).
//
// Props:
//   title          - nome do módulo
//   emoji          - emoji representativo do módulo
//   progress       - número de aulas concluídas
//   lessonCount    - total de aulas do módulo
//   status         - 'inprogress' | 'featured' | 'locked'
//   lockedMessage  - texto exibido quando bloqueado (opcional; padrão
//                    assume que é por causa do módulo anterior)
//   onClick        - função chamada ao clicar no card
//   onContinueClick - função chamada ao clicar em "Continuar"

import styles from './Cards.module.css';

export function ModuleCard({
  title,
  emoji,
  progress,
  lessonCount,
  status = 'inprogress',
  lockedMessage = 'Complete o módulo anterior para desbloquear',
  onClick,
  onContinueClick,
}) {
  // Classe de status para estilização condicional via CSS module
  const statusClass = styles[`status-${status}`];

  return (
    <div
      className={`${styles.moduleCard} ${statusClass}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter') onClick(); } : undefined}
    >

      {/* HEADER: emoji do módulo, título e badge de bloqueio */}
      <div className={styles.moduleHeader}>
        <div className={styles.moduleEmoji}>{emoji}</div>
        <h3 className={styles.moduleTitle}>{title}</h3>
        {status === 'locked' && <span className={styles.lockBadge}>🔒</span>}
      </div>

      <div className={styles.moduleBody}>
        {/* Barra de progresso e tags de aulas (visível apenas se desbloqueado) */}
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

            {/* Tags das 3 primeiras aulas com indicação de concluída/bloqueada */}
            <div className={styles.lessonTags}>
              {Array.from({ length: Math.min(3, lessonCount) }).map((_, i) => (
                <span
                  key={i}
                  className={i < progress ? styles.tagCompleted : styles.tagLocked}
                >
                  Aula {i + 1}
                </span>
              ))}
              {lessonCount > 3 && (
                <span className={styles.tagMore}>+{lessonCount - 3}</span>
              )}
            </div>
          </>
        )}

        {/* Mensagem exibida quando o módulo está bloqueado */}
        {status === 'locked' && (
          <p className={styles.lockedMessage}>
            {lockedMessage}
          </p>
        )}

        <button
          className={`${styles.continueButton} ${styles[`btn-${status}`]}`}
          onClick={(e) => { e.stopPropagation(); onContinueClick?.(); }}
          disabled={status === 'locked'}
        >
          {status === 'locked' ? 'Bloqueado 🔒' : 'Continuar'}
        </button>
      </div>

    </div>
  );
}