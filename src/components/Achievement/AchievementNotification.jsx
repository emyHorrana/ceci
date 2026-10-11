// AchievementNotification.jsx
// Notificação celebratória retro para conquista desbloqueada.
// Exibida sempre que o usuário conquista um novo marco pedagógico.

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AchievementNotification.module.css';

export function AchievementNotification({ conquista, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!conquista) return;

    // Auto-fecha após 7 segundos
    const timer = setTimeout(() => {
      onClose();
    }, 7000);

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [conquista, onClose]);

  if (!conquista) return null;

  const handleAcao = () => {
    onClose();
    if (conquista.destino) {
      navigate(conquista.destino);
    } else {
      navigate('/conquistas');
    }
  };

  return (
    <div
      className={styles.overlay}
      role="status"
      aria-live="polite"
      aria-label={`${conquista.tipo || 'Desbloqueio'}: ${conquista.titulo || conquista.title}`}
    >
      <div className={styles.window}>
        {/* Barra de título estilo Windows retrô do CECI */}
        <div className={styles.titleBar}>
          <div className={styles.titleText}>
            <span className={styles.titleIcon} aria-hidden="true">
              {conquista.barraIcone || '🏆'}
            </span>
            <span>{conquista.barraTitulo || 'Nova Conquista Desbloqueada!'}</span>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Fechar notificação"
          >
            ✕
          </button>
        </div>

        {/* Corpo da notificação */}
        <div className={styles.body}>
          <div className={styles.mascoteSlot}>
            <img
              src="/ceci-acerto.png"
              alt="Ceci celebrando"
              className={styles.mascoteImg}
            />
          </div>

          <div className={styles.content}>
            <div className={styles.emojiBadge}>
              <span className={styles.emoji} aria-hidden="true">
                {conquista.emoji || '⭐'}
              </span>
            </div>

            <div className={styles.info}>
              <span className={styles.tag}>{conquista.tipo || 'Conquista'}</span>
              <h3 className={styles.titulo}>{conquista.titulo || conquista.title}</h3>
              <p className={styles.motivo}>{conquista.motivo || conquista.description}</p>
            </div>
          </div>

          {/* Ações */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={handleAcao}
            >
              {conquista.botaoLabel || (conquista.destino ? 'Ir para o Laboratório' : 'Ver todas as conquistas')}
            </button>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={onClose}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
