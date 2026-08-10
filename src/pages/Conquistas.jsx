// Conquistas.jsx
// Todas as conquistas do CECI (desbloqueadas e ainda não), agrupadas por
// tipo (Iniciativa, Grandes Marcos, Exploração). Rota: /conquistas
//
// O catálogo em si (nome, tipo, motivo, emoji) é estático - vem de
// data/conquistas.js. O que é dinâmico é só QUAIS estão desbloqueadas,
// que vem de ProgressContext (progress.achievements, buscado do
// Supabase). Ver a nota em data/conquistas.js sobre como esse
// cruzamento é feito hoje (por título, sem id estável).

import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { ProgressContext } from '../context/ProgressContext';
import { AppLayout, PageHeader } from '../components/Layout/AppLayout';
import appStyles from '../components/Layout/AppLayout.module.css';
import { AchievementCard } from '../components/Cards/AchievementCard';
import { getConquistasComStatus, agruparPorTipo } from '../data/conquistas';
import styles from './Conquistas.module.css';

export default function Conquistas() {
  const { user, initializing } = useContext(UserContext);
  const { progress, fetchProgress } = useContext(ProgressContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) fetchProgress(user.id);
  }, [user?.id]);

  useEffect(() => {
    if (!initializing && !user) navigate('/', { replace: true });
  }, [initializing, user, navigate]);

  if (initializing || !user) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100svh' }}>
      Carregando...
    </div>
  );

  const conquistas = getConquistasComStatus(progress?.achievements);
  const grupos = agruparPorTipo(conquistas);
  const totalDesbloqueadas = conquistas.filter((c) => c.unlocked).length;

  return (
    <AppLayout>
      <PageHeader>
        <div>
          <h1 className={styles.title}>Suas conquistas</h1>
          <p className={styles.subtitle}>
            Cada passo dado na plataforma pode revelar uma conquista nova.
          </p>
        </div>

        <div className={styles.progressBadge}>
          {totalDesbloqueadas} de {conquistas.length} desbloqueadas
        </div>
      </PageHeader>

      <div className={appStyles.pageContent}>
        {grupos.map((grupo) => (
          <div key={grupo.tipo} className={styles.grupo}>
            <div className={styles.grupoHeader}>
              <h2>{grupo.tipo}</h2>
              <span className={styles.grupoChip}>
                {grupo.conquistas.filter((c) => c.unlocked).length} / {grupo.conquistas.length}
              </span>
            </div>
            <div className={styles.grid}>
              {grupo.conquistas.map((c) => (
                <AchievementCard
                  key={c.id}
                  emoji={c.emoji}
                  title={c.titulo}
                  description={c.motivo}
                  unlocked={c.unlocked}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}