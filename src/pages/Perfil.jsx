// Perfil.jsx
// Perfil do usuário - dados básicos (nome/e-mail, editáveis), resumo de
// conquistas/streak, e o domínio (L do BKT) por Unidade já tentada -
// reaproveita GET /api/licao/perfis/:userId, a mesma rota que alimenta
// a trilha do Dashboard e o filtro de dificuldade do MiniModulo.
//
// "Meu perfil" já existia como item de navegação na sidebar
// (AppLayout.jsx, apontando pra /perfil), mas a rota e a página nunca
// tinham sido criadas.
//
// Rota: /perfil

import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { ProgressContext } from '../context/ProgressContext';
import { AppLayout, PageHeader } from '../components/Layout/AppLayout';
import appStyles from '../components/Layout/AppLayout.module.css';
import { TextInput } from '../components/Forms/TextInput';
import { ButtonPrimary } from '../components/Buttons/ButtonPrimary';
import { ButtonOutline } from '../components/Buttons/ButtonOutline';
import { getUsuario, atualizarUsuario } from '../services/usuarioService';
import { getPerfisAluno } from '../services/algorithmService';
import { UNIDADES } from '../data/unidades';
import styles from './Perfil.module.css';

// Ordem "natural" do currículo (a mesma em que as Unidades aparecem em
// data/unidades.js), pra listar o domínio por assunto na sequência que
// a pessoa realmente percorre, não na ordem que o banco devolver.
const ORDEM_UNIDADES = UNIDADES.map((u) => u.id);

export default function Perfil() {
  const { user, initializing } = useContext(UserContext);
  const { progress, fetchProgress } = useContext(ProgressContext);
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const [dominioData, setDominioData] = useState(null);
  const [carregandoDominio, setCarregandoDominio] = useState(true);

  useEffect(() => {
    if (user?.id) fetchProgress(user.id);
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    let ativo = true;
    getUsuario(user.id).then((data) => {
      if (!ativo) return;
      setPerfil(data);
      setCarregandoPerfil(false);
    });
    return () => { ativo = false; };
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    let ativo = true;
    getPerfisAluno(user.id)
      .then((data) => {
        if (ativo) setDominioData(data);
      })
      .catch((err) => {
        console.error('Erro ao buscar domínio por Unidade:', err);
      })
      .finally(() => {
        if (ativo) setCarregandoDominio(false);
      });
    return () => { ativo = false; };
  }, [user?.id]);

  useEffect(() => {
    if (!initializing && !user) navigate('/', { replace: true });
  }, [initializing, user, navigate]);

  if (initializing || !user) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100svh' }}>
      Carregando...
    </div>
  );

  const nomeExibido = perfil?.nome || user?.nome || 'Estudante';
  const emailExibido = perfil?.email || user?.email || '';

  const iniciarEdicao = () => {
    setNome(nomeExibido === 'Estudante' ? '' : nomeExibido);
    setEmail(emailExibido);
    setErro('');
    setSucesso(false);
    setEditando(true);
  };

  const cancelarEdicao = () => {
    setEditando(false);
    setErro('');
  };

  const salvar = async (e) => {
    e.preventDefault();
    if (!nome.trim()) {
      setErro('Por favor, informe seu nome.');
      return;
    }

    setSalvando(true);
    setErro('');

    try {
      const atualizado = await atualizarUsuario(user.id, {
        nome: nome.trim(),
        email: email.trim(),
      });
      setPerfil(atualizado);
      setEditando(false);
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    } catch (err) {
      setErro(err.message || err.error || 'Não foi possível salvar agora. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  const streakCount = progress?.streak || 0;
  const totalConquistas = progress?.achievements?.length || 0;

  // Junta domínio + nível por Unidade, na ordem do currículo -
  // só entram Unidades que a pessoa já tentou pelo menos uma vez
  // (dominiosPorUnidade só tem entrada pra quem já respondeu algo).
  const unidadesComDominio = dominioData?.dominiosPorUnidade
    ? Object.entries(dominioData.dominiosPorUnidade)
        .map(([unidadeId, dominio]) => ({
          id: unidadeId,
          titulo: UNIDADES.find((u) => u.id === unidadeId)?.titulo || unidadeId,
          dominio,
          nivel: dominioData.classificacaoPorUnidade?.[unidadeId] || '—',
        }))
        .sort((a, b) => ORDEM_UNIDADES.indexOf(a.id) - ORDEM_UNIDADES.indexOf(b.id))
    : [];

  return (
    <AppLayout>
      <PageHeader>
        <div>
          <h1 className={styles.title}>Meu perfil</h1>
          <p className={styles.subtitle}>Seus dados e sua jornada até aqui.</p>
        </div>
      </PageHeader>

      <div className={appStyles.pageContent}>
        {/* CARD PRINCIPAL - avatar + dados */}
        <div className={styles.heroCard}>
          <div className={styles.heroBanner} aria-hidden="true" />

          <div className={styles.heroBody}>
            <div className={styles.avatarRing}>
              <div className={styles.avatarSlot} aria-hidden="true">
                {nomeExibido.charAt(0).toUpperCase()}
              </div>
            </div>

            {!editando ? (
              <div className={styles.infoView}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Nome</span>
                  <span className={styles.infoValue}>
                    {carregandoPerfil ? 'Carregando...' : nomeExibido}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>E-mail</span>
                  <span className={styles.infoValue}>
                    {carregandoPerfil ? 'Carregando...' : emailExibido || '—'}
                  </span>
                </div>

                {sucesso && (
                  <p className={styles.sucessoTexto}>✓ Dados atualizados com sucesso!</p>
                )}

                <ButtonOutline onClick={iniciarEdicao} disabled={carregandoPerfil}>
                  Editar dados
                </ButtonOutline>
              </div>
            ) : (
              <form className={styles.form} onSubmit={salvar}>
                <TextInput
                  label="Nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  disabled={salvando}
                  autoFocus
                />
                <TextInput
                  label="E-mail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={salvando}
                  error={erro}
                />

                <div className={styles.formAcoes}>
                  <ButtonOutline type="button" onClick={cancelarEdicao} disabled={salvando}>
                    Cancelar
                  </ButtonOutline>
                  <ButtonPrimary type="submit" disabled={salvando}>
                    {salvando ? 'Salvando...' : 'Salvar'}
                  </ButtonPrimary>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* CARDS DE ESTATÍSTICA */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.statStreak}`}>
            <span className={styles.statIcon} aria-hidden="true">🔥</span>
            <span className={styles.statValue}>{streakCount}</span>
            <span className={styles.statLabel}>
              {streakCount === 1 ? 'dia seguido' : 'dias seguidos'}
            </span>
          </div>
          <div className={`${styles.statCard} ${styles.statXp}`}>
            <span className={styles.statIcon} aria-hidden="true">⭐</span>
            <span className={styles.statValue}>{progress?.totalPoints || 0}</span>
            <span className={styles.statLabel}>pontos</span>
          </div>
          <div className={`${styles.statCard} ${styles.statCoin}`}>
            <span className={styles.statIcon} aria-hidden="true">🏆</span>
            <span className={styles.statValue}>{totalConquistas}</span>
            <span className={styles.statLabel}>
              {totalConquistas === 1 ? 'conquista' : 'conquistas'}
            </span>
          </div>
        </div>

        {/* DOMÍNIO POR UNIDADE (resultado do algoritmo adaptativo) */}
        <div className={styles.dominioSecao}>
          <div className={styles.sectionHeader}>
            <h2>Seu domínio por assunto</h2>
            <span className={styles.sectionHint}></span>
          </div>

          {carregandoDominio ? (
            <p className={styles.estadoVazio}>Carregando...</p>
          ) : unidadesComDominio.length === 0 ? (
            <p className={styles.estadoVazio}>
              Você ainda não respondeu nenhuma questão. Comece um mini-módulo pra ver seu progresso aqui!
            </p>
          ) : (
            <div className={styles.dominioLista}>
              {unidadesComDominio.map((u) => (
                <div key={u.id} className={styles.dominioItem}>
                  <div className={styles.dominioTopo}>
                    <span className={styles.dominioTitulo}>{u.titulo}</span>
                    <span className={styles.nivelBadge} data-nivel={u.nivel}>
                      {u.nivel}
                    </span>
                  </div>
                  <div className={styles.dominioBarraTrilho}>
                    <div
                      className={styles.dominioBarraPreenchida}
                      style={{ width: `${Math.round((u.dominio ?? 0) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ÚLTIMAS CONQUISTAS */}
        {totalConquistas > 0 && (
          <div className={styles.conquistasSecao}>
            <div className={styles.sectionHeader}>
              <h2>Últimas conquistas</h2>
              <ButtonOutline size="small" onClick={() => navigate('/conquistas')}>
                Ver todas
              </ButtonOutline>
            </div>
            <div className={styles.conquistasLista}>
              {progress.achievements.slice(0, 4).map((c) => (
                <div key={c.id} className={styles.conquistaChip}>
                  <span aria-hidden="true">{c.emoji}</span> {c.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
