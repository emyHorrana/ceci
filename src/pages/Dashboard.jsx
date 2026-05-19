
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { ProgressContext } from '../context/ProgressContext';
import { ModuleCard} from '../components/Cards/ModuleCard';
import { StatCard } from '../components/Cards/StatCard';
import { ButtonPrimary } from '../components/Buttons/ButtonPrimary';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user, logout } = useContext(UserContext);
  const { modules, progress, fetchModules } = useContext(ProgressContext);
  const navigate = useNavigate();
  const [ceciliaMessage, setCeciliaMessage] = useState('');

  useEffect(() => {
    // Buscar módulos e progresso
    if (user?.id) {
      fetchModules(user.id);
    }

    // Mensagem da Cecília (dinâmica baseado no contexto)
    updateCeciliaMessage();
  }, [user?.id]);

  const updateCeciliaMessage = () => {
    const messages = [
      'Você está indo muito bem! Continue assim! 🎉',
      'Que tal tentar uma nova aula hoje?',
      'Sua sequência está ativa! Não quebre! 🔥',
      'Você pode fazer isso! Acredito em você!',
      'Cada pequeno passo é uma grande vitória!'
    ];
    setCeciliaMessage(messages[Math.floor(Math.random() * messages.length)]);
  };

  const handleModuleClick = (moduleId) => {
    navigate(`/licoes/${moduleId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={styles.dashboard}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.userGreeting}>
          <div className={styles.greetingEmoji}>🎓</div>
          <div className={styles.greetingText}>
            <h2>Olá, {user.nome}!</h2>
            <p>Você está aprendendo bem!</p>
          </div>
        </div>

        <div className={styles.stats}>
          <StatCard
            icon="🔥"
            value={progress?.streak || 0}
            label="dias"
            color="coral"
          />
          <StatCard
            icon="⭐"
            value={progress?.totalPoints || 0}
            label="pontos"
            color="amber"
          />
          <StatCard
            icon="💎"
            value={progress?.coins || 0}
            label="moedas"
            color="teal"
          />
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          Sair
        </button>
      </header>

      {/* DAILY GOAL */}
      <section className={styles.dailyGoal}>
        <h3>Meta diária</h3>
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${(progress?.dailyProgress || 0) * 10}%`
              }}
            />
          </div>
        </div>
        <p>
          {progress?.dailyProgress || 0} de 10 exercícios completos hoje
        </p>
      </section>

      {/* PERSONAGEM CECÍLIA */}
      <section className={styles.personagemSection}>
        <div className={styles.personagemEmoji}>👩‍🏫</div>
        <h3>Olá! Sou a Cecília!</h3>
        <p className={styles.message}>{ceciliaMessage}</p>
        <ButtonPrimary onClick={() => navigate('/licoes/1')}>
          Próxima aula
        </ButtonPrimary>
      </section>

      {/* MODULES */}
      <section className={styles.modulesSection}>
        <h2>Módulos em progresso</h2>
        <div className={styles.modulesGrid}>
          {modules?.map((module) => (
            <ModuleCard
              key={module.id}
              title={module.title}
              emoji={module.emoji}
              progress={module.progress || 0}
              lessonCount={module.lessonCount || 10}
              status={module.status}
              onContinueClick={() => handleModuleClick(module.id)}
            />
          ))}
        </div>
      </section>

      {/* CONQUISTAS */}
      <section className={styles.achievementsSection}>
        <h2>Últimas conquistas</h2>
        <div className={styles.achievementsList}>
          {progress?.achievements?.slice(0, 4).map((achievement) => (
            <div key={achievement.id} className={styles.achievementItem}>
              <div className={styles.achievementEmoji}>{achievement.emoji}</div>
              <p>{achievement.title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}