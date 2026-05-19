
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LessonContext } from '../context/LessonContext';
import { ButtonPrimary } from '../components/Buttons/ButtonPrimary';
import styles from './Licao.module.css';

export default function Licao() {
  const { lessonId } = useParams();
  const { lesson, fetchLesson, updateProgress } = useContext(LessonContext);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLesson(lessonId).then(() => setLoading(false));
  }, [lessonId, fetchLesson]);

  if (loading) return <div>Carregando aula...</div>;

  const currentStep = lesson?.steps?.[currentStepIndex];
  const totalSteps = lesson?.steps?.length || 0;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Marcar como completo e ir para próxima
      updateProgress(lessonId, { completed: true });
      navigate('/dashboard');
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div className={styles.licaoContainer}>
      {/* HEADER */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
          ← Voltar
        </button>
        <h1 className={styles.title}>{lesson?.title}</h1>
        <div className={styles.progress}>
          Etapa {currentStepIndex + 1} de {totalSteps}
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className={styles.contentArea}>
        <div className={styles.content}>
          {currentStep?.type === 'teoria' && (
            <div className={styles.teoriaContent}>
              <div className={styles.teoriaEmoji}>{currentStep?.emoji}</div>
              <h2>{currentStep?.title}</h2>
              <div 
                className={styles.teoriaText}
                dangerouslySetInnerHTML={{ __html: currentStep?.content }}
              />
            </div>
          )}

          {currentStep?.type === 'pratica' && (
            <div className={styles.praticaContent}>
              <h2>{currentStep?.title}</h2>
              <div className={styles.exerciseContainer}>
                <p className={styles.question}>{currentStep?.question}</p>
                {/* Aqui viria o componente interativo do exercício */}
              </div>
            </div>
          )}
        </div>

        {/* PERSONAGEM CECÍLIA */}
        <aside className={styles.ceciliaArea}>
          <div className={styles.personagem}>👩‍🏫</div>
          <p className={styles.tip}>
            {currentStep?.tip || 'Você está indo bem! Continue assim! 💪'}
          </p>
        </aside>
      </main>

      {/* FOOTER COM NAVEGAÇÃO */}
      <footer className={styles.footer}>
        <ButtonOutline
          onClick={handlePrevious}
          disabled={isFirstStep}
        >
          ← Anterior
        </ButtonOutline>

        <div className={styles.stepIndicator}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`${styles.stepDot} ${i <= currentStepIndex ? styles.active : ''}`}
              onClick={() => setCurrentStepIndex(i)}
              role="button"
              tabIndex={0}
            />
          ))}
        </div>

        <ButtonPrimary onClick={handleNext}>
          {isLastStep ? 'Finalizar aula' : 'Próxima →'}
        </ButtonPrimary>
      </footer>
    </div>
  );
}