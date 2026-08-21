import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { ProgressContext } from '../context/ProgressContext';
import { AppLayout, PageHeader } from '../components/Layout/AppLayout';
import appStyles from '../components/Layout/AppLayout.module.css';
import { ModuleCard } from '../components/Cards/ModuleCard';
import { UnidadeCard } from '../components/Cards/UnidadeCard';
import { ButtonPrimary } from '../components/Buttons/ButtonPrimary';
import { MODULOS } from '../data/modulos';
import { UNIDADES, UNIDADES_POR_MODULO } from '../data/unidades';
import { getProximaUnidade, getPerfisAluno } from '../services/algorithmService';
import styles from './Dashboard.module.css';

const MOTIVATIONAL = [
  'Você está indo muito bem! Continue assim!',
  'Que tal tentar uma nova aula hoje?',
  'Cada pequeno passo é uma grande vitória!',
  'Você pode fazer isso! Acredito em você!',
];

export default function Dashboard() {
  const { user, initializing }              = useContext(UserContext);
  const { modules, progress, fetchModules } = useContext(ProgressContext);
  const navigate                            = useNavigate();
  const [message]                           = useState(() => MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)]);

  // Trilha adaptativa: antes disso, esta tela só listava
  // UNIDADES_POR_MODULO estático, sem nenhuma noção de progresso ou
  // algoritmo (era literalmente o comentário que tinha aqui). Agora
  // busca a recomendação de verdade (mesma chamada que
  // UnidadeCheckpoint.jsx já usa) e o domínio de todas as Unidades já
  // tentadas, pra pintar a trilha inteira - não só decidir uma única
  // "próxima aula".
  //
  // `recomendacao` começa como `undefined` (ainda não buscou) e não
  // `null`, de propósito - `null` é um resultado válido do algoritmo
  // (currículo inteiro concluído, ver getProximaUnidade), então
  // precisa de um terceiro estado pra "ainda carregando" não ser
  // confundido com "tudo concluído".
  const [recomendacao, setRecomendacao]         = useState(undefined);
  const [dominiosPorUnidade, setDominiosPorUnidade] = useState({});
  const [limiar, setLimiar]                     = useState(0.5);

  useEffect(() => {
    if (user?.id) fetchModules(user.id);
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    let ativo = true;

    Promise.all([getProximaUnidade(user.id), getPerfisAluno(user.id)])
      .then(([proxima, perfis]) => {
        if (!ativo) return;
        setRecomendacao(proxima);
        setDominiosPorUnidade(perfis?.dominiosPorUnidade || {});
        setLimiar(perfis?.limiar ?? 0.5);
      })
      .catch((err) => {
        // Se a trilha adaptativa falhar (rede, servidor fora), a tela
        // não trava - só fica sem destaque/selo de status, do jeito
        // que era antes desta mudança. As outras seções do dashboard
        // (meta diária, módulos, conquistas) não dependem disso.
        console.error('Erro ao buscar recomendação adaptativa:', err);
      });

    return () => { ativo = false; };
  }, [user?.id]);

  // Resolve o id fino que o backend devolve (server/lib/adaptive-bkt/
  // data/unidades.js, miniModulos como array de strings) contra a
  // UNIDADES rica do front (titulo, checkpoint, mini-módulos com
  // etapas) - mesmo ajuste que fiz em UnidadeCheckpoint.jsx, mesmo
  // motivo (ver comentário lá).
  const unidadeRecomendada = recomendacao?.unidade?.id
    ? UNIDADES.find((u) => u.id === recomendacao.unidade.id)
    : null;

  const proximaAulaDestino = unidadeRecomendada?.miniModulos?.[0]?.id
    ? `/mini-modulo/${unidadeRecomendada.miniModulos[0].id}`
    // enquanto a recomendação ainda não voltou (ou se a Unidade
    // recomendada não tiver mini-módulo por algum motivo), cai no
    // mesmo fallback fixo que a tela sempre teve - nunca deixa o
    // botão sem destino nenhum.
    : `/mini-modulo/${MODULOS[0].miniModulos[0].id}`;

  const proximaAulaLabel = recomendacao?.motivo === 'reforco' ? 'Praticar' : 'Próxima aula';

  // Distingue "ainda não buscou" (recomendacao === undefined) de
  // "buscou e o currículo está inteiro concluído" (recomendacao =
  // { unidade: null, motivo: null, mensagem }, um objeto de verdade,
  // não `null` puro - ver GET /api/licao/proxima-unidade/:userId).
  const trilhaCarregada = recomendacao !== undefined;
  const curriculoConcluido = trilhaCarregada && recomendacao.unidade === null;

  // 'atual' pra Unidade recomendada agora, 'concluida'/'pendente' pra
  // quem já foi tentada, e nada (undefined) pra quem ainda não foi -
  // UnidadeCard só mostra o selo quando existe.
  function statusDaUnidade(unidadeId) {
    if (unidadeId === unidadeRecomendada?.id) return 'atual';
    const dominio = dominiosPorUnidade[unidadeId];
    if (dominio === undefined) return undefined;
    return dominio >= limiar ? 'concluida' : 'pendente';
  }

  // Antes, essa checagem era só "if (!user)" - o que prendia a pessoa
  // num "Carregando..." pra sempre quando a sessão não estava mais em
  // memória (voltar pelo navegador, recarregar a página), porque nada
  // aqui tentava de fato buscar a sessão nem saía desse estado.
  // Agora: 'initializing' cobre só o instante em que ainda estamos
  // checando se existe sessão salva - depois disso, se não tem
  // usuário mesmo, manda pro login em vez de travar aqui.
  useEffect(() => {
    if (!initializing && !user) navigate('/', { replace: true });
  }, [initializing, user, navigate]);

  if (initializing || !user) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100svh' }}>
      Carregando...
    </div>
  );

  const dailyPct = Math.min(((progress?.dailyProgress || 0) / 10) * 100, 100);

  return (
    <AppLayout>
        <PageHeader>
          <div className={styles.greeting}>
            <span className={styles.greetingHello}>Bem-vindo(a) de volta</span>
            <span className={styles.greetingName}>{user.nome || 'Aluno(a)'}</span>
          </div>

          <div className={styles.topbarStats}>
            <div className={`${styles.statBadge} ${styles.streak}`}>
              {progress?.streak || 0} dias seguidos
            </div>
            <div className={`${styles.statBadge} ${styles.points}`}>
              {progress?.totalPoints || 0} pontos
            </div>
          </div>
        </PageHeader>

        <div className={`${appStyles.pageContent} ${styles.pageContentDashboard}`}>
          {/* Bloco da Cecília */}
          <div className={styles.welcomeCard}>
            <div className={styles.mascoteSlotSmall} aria-hidden />
            <div className={styles.welcomeText}>
              <h2>Olá, {user.nome || 'Aluno(a)'}!</h2>
              {/* curriculoConcluido é o único momento em que a mensagem
                  motivacional dá lugar ao parabéns - o botão de baixo
                  cai no fallback fixo nesse caso (não tem "próxima" de
                  verdade pra oferecer). */}
              <p className={styles.welcomeMessage}>
                {curriculoConcluido
                  ? (recomendacao.mensagem || 'Você concluiu todo o currículo disponível até agora! 🎉')
                  : message}
              </p>
              <ButtonPrimary
                onClick={() => navigate(proximaAulaDestino)}
                size="small"
              >
                {proximaAulaLabel}
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

          {/* Trilha de aprendizagem: Módulo → Unidade → mini-módulos.
              Ver data/unidades.js pro agrupamento em si. Cada
              UnidadeCard agora recebe o `status` calculado a partir
              da recomendação real do algoritmo adaptativo
              (getProximaUnidade/getPerfisAluno, buscados no topo
              deste componente) - 'atual' destaca a Unidade
              recomendada, 'concluida'/'pendente' vêm do domínio (BKT)
              já registrado, sem status nenhum = ainda não tentada. */}
          <div>
            <div className={styles.sectionHeader}>
              <h2>Trilha de aprendizagem</h2>
            </div>
            <div className={styles.trilhaModulos}>
              {UNIDADES_POR_MODULO.map((grupo) => (
                <div key={grupo.moduloId} className={styles.trilhaModulo}>
                  <div className={styles.trilhaModuloHeader}>
                    <span className={styles.licaoEmoji}>{grupo.moduloEmoji}</span>
                    <h3 className={styles.trilhaModuloTitulo}>{grupo.moduloTitulo}</h3>
                  </div>
                  <div className={styles.licoesGrid}>
                    {grupo.unidades.map((unidade) => (
                      <UnidadeCard key={unidade.id} unidade={unidade} status={statusDaUnidade(unidade.id)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
                  onContinueClick={() => navigate(`/mini-modulo/${mod.id}`)}
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
    </AppLayout>
  );
}