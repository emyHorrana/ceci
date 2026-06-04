import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { ProgressContext } from '../context/ProgressContext';
import { ModuleCard } from '../components/Cards/ModuleCard';
import { ButtonPrimary } from '../components/Buttons/ButtonPrimary';
import styles from './Dashboard.module.css';

const NAV_ITEMS = [
  { icon: '⌂', label: 'Início',      path: '/dashboard' },
  { icon: '◫', label: 'Módulos',     path: '/modulos' },
  { icon: '★', label: 'Conquistas',  path: '/conquistas' },
  { icon: '◎', label: 'Meu perfil',  path: '/perfil' },
];

const MOTIVATIONAL = [
  'Você está indo muito bem! Continue assim!',
  'Que tal tentar uma nova aula hoje?',
  'Cada pequeno passo é uma grande vitória!',
  'Você pode fazer isso! Acredito em você!',
];

export default function Dashboard() {
  const { user, logout }                 = useContext(UserContext);
  const { modules, progress, fetchModules } = useContext(ProgressContext);
  const navigate                          = useNavigate();
  const [message, setMessage]             = useState('');
  const [activeNav, setActiveNav]         = useState('/dashboard');

  useEffect(() => {
    if (user?.id) fetchModules(user.id);
    setMessage(MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)]);
  }, [user?.id]);

  const handleLogout = () => { logout(); navigate('/'); };

  if (!user) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100svh' }}>
      Carregando...
    </div>
  );

  const dailyPct = Math.min(((progress?.dailyProgress || 0) / 10) * 100, 100);

  return (
    <div className={styles.dashboard}>
      {/* ===== SIDEBAR ===== */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <div className={styles.sidebarLogoIcon} />
          <span className={styles.sidebarLogoText}>CECI</span>
        </div>

        <nav className={styles.sidebarNav}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              className={`${styles.navItem} ${activeNav === item.path ? styles.active : ''}`}
              onClick={() => { setActiveNav(item.path); navigate(item.path); }}
            >
              <span className={styles.navItemIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button className={styles.sidebarLogout} onClick={handleLogout}>
          Sair
        </button>
      </aside>

      {/* ===== CONTEÚDO ===== */}
      <main className={styles.main}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.greeting}>
            <span className={styles.greetingHello}>Bem-vindo(a) de volta</span>
            <span className={styles.greetingName}>{user.nome || 'Aluna'}</span>
          </div>

          <div className={styles.topbarStats}>
            <div className={`${styles.statBadge} ${styles.streak}`}>
              {progress?.streak || 0} dias seguidos
            </div>
            <div className={`${styles.statBadge} ${styles.points}`}>
              {progress?.totalPoints || 0} pontos
            </div>
          </div>
        </header>

        <div className={styles.pageContent}>
          {/* Bloco da Cecília */}
          <div className={styles.welcomeCard}>
            <div className={styles.mascoteSlotSmall} aria-hidden>
              {/* <img src="/mascote-ceci.png" alt="Mascote Ceci" /> */}
            </div>
            <div className={styles.welcomeText}>
              <h2>Olá, {user.nome || 'Aluna'}!</h2>
              <p className={styles.welcomeMessage}>{message}</p>
              <ButtonPrimary onClick={() => navigate('/licoes/1')} size="small">
                Próxima aula
              </ButtonPrimary>
            </div>
          </div>

          {/* Meta diária */}
          <div className={styles.dailyGoalCard}>
            <div className={styles.sectionLabel}>
              <h3>Meta diária</h3>
              <span className={styles.progressChip}>
                {progress?.dailyProgress || 0} / 10 exercícios
              </span>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${dailyPct}%` }} />
            </div>
            <p className={styles.progressHint}>
              {dailyPct >= 100
                ? 'Meta concluída! Incrível!'
                : `Faltam ${10 - (progress?.dailyProgress || 0)} exercícios para completar a meta de hoje.`}
            </p>
          </div>

          {/* Módulos */}
          <div>
            <div className={styles.sectionHeader}>
              <h2>Módulos em progresso</h2>
              <a href="/modulos" className={styles.sectionLink}>Ver todos</a>
            </div>
            <div className={styles.modulesGrid}>
              {modules?.map((mod) => (
                <ModuleCard
                  key={mod.id}
                  title={mod.title}
                  emoji={mod.emoji}
                  progress={mod.progress || 0}
                  lessonCount={mod.lessonCount || 10}
                  status={mod.status}
                  onContinueClick={() => navigate(`/licoes/${mod.id}`)}
                />
              ))}
            </div>
          </div>

          {/* Conquistas */}
          <div className={styles.achievementsCard}>
            <div className={styles.sectionHeader}>
              <h2>Últimas conquistas</h2>
              <a href="/conquistas" className={styles.sectionLink}>Ver todas</a>
            </div>
            <div className={styles.achievementsList}>
              {progress?.achievements?.slice(0, 6).map((a) => (
                <div key={a.id} className={styles.achievementItem}>
                  <span className={styles.achievementIcon}>{a.emoji}</span>
                  <span className={styles.achievementTitle}>{a.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}